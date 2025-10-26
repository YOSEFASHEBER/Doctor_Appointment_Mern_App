import express, { response } from "express";
import jwt from "jsonwebtoken";
import authMiddleware from "../middlewares/authMiddleware.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import Doctor from "../models/doctorModel.js";
import Appointment from "../models/appointmentModel.js";

dayjs.extend(utc);
dayjs.extend(timezone);
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res
        .status(200)
        .send({ message: "User already exists ", success: false });
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);
    req.body.password = hashedPassword;
    const newUser = new User(req.body);
    await newUser.save();
    res
      .status(200)
      .send({ message: "User created successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error Creating User", success: false });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "user doesn't exist", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Password is incorrect", success: false });
    } else {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      return res
        .status(200)
        .send({ message: "Login Successful", success: true, data: token });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error Logging in", success: false, error });
  }
});

router.post("/get-user-info-by-id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res
        .status(200)
        .send({ message: "user does not exist", success: false });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error getting user info", success: false, error });
  }
});

router.post("/apply-doctor-account", authMiddleware, async (req, res) => {
  try {
    const newDoctor = new Doctor({ ...req.body, status: "pending" });
    await newDoctor.save();
    const adminUser = await User.findOne({ isAdmin: true });
    const unSeenNotifications = adminUser.unSeenNotifications;
    unSeenNotifications.push({
      type: "new-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a doctor account `,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
      },
      onClickPath: "/doctors",
    });
    await User.findByIdAndUpdate(
      adminUser._id,
      {
        unSeenNotifications,
      },
      { new: true, runValidators: true }
    );
    res.status(200).send({
      success: true,
      message: "Doctor account applied Successfully",
    });
  } catch (error) {
    res.status(500).send({
      message: "Error applying doctor account ",
      success: false,
      error,
    });
  }
});

router.post("/mark-all-as-seen", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    user?.unSeenNotifications?.map((notification) => {
      user?.seenNotifications?.push(notification);
    });
    user.unSeenNotifications = [];
    await user.save();
    user.password = undefined;
    const updatedUser = user;
    res.status(200).send({
      message: "notifications set to seen",
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error setting notification to seen",
      success: false,
      error,
    });
  }
});

router.post("/Delete-all-notifications", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    if (user?.seenNotifications?.length === 0) {
      user.password = undefined;
      const updatedUser = user;
      return res.status(200).send({
        message: "seen notifications is empty",
        success: true,
        data: updatedUser,
      });
    }
    user.seenNotifications = [];
    await user.save();
    user.password = undefined;
    const updatedUser = user;
    res.status(200).send({
      message: "Seen notifications are deleted! ",
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error deleting notifications ",
      success: false,
      error,
    });
  }
});

router.post("/get-all-approved-doctors", authMiddleware, async (req, res) => {
  try {
    const response = await Doctor.find({ status: "approved" }).select(
      "-password"
    );
    response &&
      res.status(200).send({
        success: true,
        message: "all approved doctors are featched!",
        data: response,
      });
  } catch (error) {
    res.status(500).send({
      message: "Error fetching approved doctors",
      success: false,
      error,
    });
  }
});
router.post("/book-appointment", authMiddleware, async (req, res) => {
  try {
    const { doctorId, userId, doctorInfo, userInfo, date, time } = req.body;
    const appointmentDateTimeIso = dayjs(time).utc().toISOString();
    const dateIso = dayjs(appointmentDateTimeIso)
      .utc()
      .startOf("day")
      .toISOString();
    const startWindow = dayjs(appointmentDateTimeIso)
      .subtract(29, "minute")
      .toDate();
    const endWindow = dayjs(appointmentDateTimeIso).add(29, "minute").toDate();

    const existing = await Appointment.findOne({
      doctorId,
      date: dateIso,
      time: { $gte: startWindow, $lte: endWindow },
      status: "approved",
    });

    if (existing) {
      return res.status(200).send({
        success: false,
        message: "This time slot is already booked.",
      });
    }

    const newAppointment = new Appointment({
      doctorId,
      userId,
      doctorInfo,
      userInfo,
      date: dateIso,
      time: appointmentDateTimeIso,
      status: "pending",
    });

    await newAppointment.save();

    // notify doctor
    const doctor = await Doctor.findById(doctorId);
    const doctorUser = doctor ? await User.findById(doctor.userId) : null;
    if (doctorUser) {
      doctorUser.unSeenNotifications.push({
        type: "new-appointment-request",
        message: `New appointment request from ${userInfo.name} on ${dayjs(
          appointmentDateTimeIso
        )
          .tz("Africa/Addis_Ababa")
          .format("DD-MM-YYYY [at] hh:mm A")}`,
        onClickPath: "/doctor/appointments",
      });
      await doctorUser.save();
    }

    return res.status(200).send({
      success: true,
      message: "Appointment booked successfully!",
    });
  } catch (error) {
    console.error("Error booking appointment:", error);
    return res.status(500).send({
      success: false,
      message: "Error booking appointment!",
      error: error.message,
    });
  }
});

router.post("/checkBookingAvailability", authMiddleware, async (req, res) => {
  try {
    const { doctorId, date, time } = req.body;
    const selectedTime = new Date(time);

    // If frontend sent date separately, we ignore it for window calculation and derive dateIso from time.
    const requestedTimeIso = dayjs(time).utc().toISOString();
    const dateIso = dayjs(requestedTimeIso).utc().startOf("day").toISOString();

    const startWindow = dayjs(requestedTimeIso).subtract(29, "minute").toDate();
    const endWindow = dayjs(requestedTimeIso).add(29, "minute").toDate();
    const doctor = await Doctor.findOne({ _id: doctorId });
    // doctor working hours
    const [start, end] = doctor.timings;
    const doctorStartWindow = new Date(date);
    const doctorEndWindow = new Date(date);
    doctorStartWindow.setHours(
      new Date(start).getHours(),
      new Date(start).getMinutes(),
      0
    );
    doctorEndWindow.setHours(
      new Date(end).getHours(),
      new Date(end).getMinutes(),
      0
    );
    if (selectedTime < doctorStartWindow || selectedTime > doctorEndWindow) {
      return res.status(200).send({
        success: false,
        message: "Selected time is outside of doctor's working hours.",
      });
    }

    const overlappingAppointment = await Appointment.findOne({
      doctorId,
      date: dateIso,
      time: { $gte: startWindow, $lte: endWindow },
      status: "approved",
    });

    if (overlappingAppointment) {
      return res.status(200).send({
        success: false,
        message: "This time slot is already booked.",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Time slot is available.",
    });
  } catch (error) {
    console.error("Error checking availability:", error);
    return res.status(500).send({
      success: false,
      message: "Error checking availability.",
      error: error.message,
    });
  }
});

export default router;
