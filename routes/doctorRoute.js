import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import Doctor from "../models/doctorModel.js";
import Appointment from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";

const router = express.Router();

router.post("/get-doctor-info-by-user-id", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.body;
    const { isDoctor } = await userModel.findOne({ _id: userId });
    if (isDoctor) {
      const doctor = await Doctor.findOne({ userId });
      res.status(200).send({
        success: true,
        message: "Doctor info fetched successfully!",
        data: doctor,
      });
    } else {
      res
        .status(400)
        .send({ message: "you are not a Doctor!", success: false, error });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error geting doctor info!", success: false, error });
  }
});

router.post("/update-doctor-profile", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.body;
    const { isDoctor } = await userModel.findOne({ _id: userId });
    if (isDoctor) {
      const doctor = await Doctor.findOneAndUpdate({ userId }, req.body);
      res.status(200).send({
        success: true,
        message: "Doctor profile updated successfully!",
        data: doctor,
      });
    } else {
      res
        .status(400)
        .send({ message: "you are not a Doctor!", success: false, error });
    }
  } catch (error) {
    res.status(500).send({
      message: "Error updating doctor profile!",
      success: false,
      error,
    });
  }
});

router.post("/get-doctor-info-by-id", authMiddleware, async (req, res) => {
  try {
    const { doctorId } = req.body;
    const doctor = await Doctor.findOne({ _id: doctorId });
    if (doctor)
      res.status(200).send({
        success: true,
        message: "Doctor info fetched successfully!",
        data: doctor,
      });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error geting doctor info!", success: false, error });
  }
});

router.post(
  "/get-appointments-by-doctor-id",
  authMiddleware,
  async (req, res) => {
    try {
      const { userId } = req.body;
      const { isDoctor } = await userModel.findOne({ _id: userId });
      if (isDoctor) {
        const doctor = await Doctor.findOne({ userId });
        const appoinments = await Appointment.find({ doctorId: doctor._id });
        res.status(200).send({
          success: true,
          message: "appointments Fetched successfully",
          data: appoinments,
        });
      } else {
        res
          .status(400)
          .send({ message: "you are not a Doctor!", success: false, error });
      }
    } catch (error) {
      res.status(500).send({
        message: "Error geting appointments !",
        success: false,
        error,
      });
    }
  }
);

router.post("/change-appointment-status", authMiddleware, async (req, res) => {
  try {
    const { appointment, status, user, userId } = req.body;
    const { isDoctor } = await userModel.findOne({ _id: userId });
    if (isDoctor) {
      const resAppointment = await Appointment.findByIdAndUpdate(
        appointment,
        {
          status: status,
        },
        { new: true }
      );
      const User = await userModel.findOne({ _id: user });
      const unseenNotifications = User.unSeenNotifications;
      unseenNotifications.push({
        type: "new-appointment-status-changed",
        message: `Your Appointment with Dr. ${resAppointment.doctorInfo.firstName}  has been ${status}`,
        onClickPath: "/notifications",
      });
      User.unSeenNotifications = unseenNotifications;
      await User.save();

      res.status(200).send({
        success: true,
        message: "Appoointment status Updated Successfully!",
        data: resAppointment,
      });
    } else {
      res
        .status(400)
        .send({ message: "you are not a Doctor!", success: false, error });
    }
  } catch (error) {
    res.status(500).send({
      message: "Error deleting Appointment status",
      success: false,
      error,
    });
  }
});
router.post("/delete-appointment-status", authMiddleware, async (req, res) => {
  try {
    const { appointment, userId } = req.body;
    const { isDoctor } = await userModel.findOne({ _id: userId });
    if (isDoctor) {
      const resAppointment = await Appointment.findByIdAndDelete(appointment);
      res.status(200).send({
        success: true,
        message: "Appoointment status Updated Successfully!",
        data: resAppointment,
      });
    } else {
      res
        .status(400)
        .send({ message: "you are not a Doctor!", success: false, error });
    }
  } catch (error) {
    res.status(500).send({
      message: "Error updating Appointment status",
      success: false,
      error,
    });
  }
});

export default router;
