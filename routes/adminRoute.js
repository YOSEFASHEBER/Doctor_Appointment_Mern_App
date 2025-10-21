import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import Doctors from "../models/doctorModel.js";
import Users from "../models/userModel.js";
const router = express.Router();

router.post("/get-all-doctors", authMiddleware, async (req, res) => {
  try {
    const { isAdmin } = await Users.findOne({ _id: req.body.userId });
    const response = await Doctors.find({}).select("-password");
    if (response && isAdmin) {
      return res.status(200).send({
        success: true,
        message: "all doctors featched!",
        data: response,
      });
    } else {
      console.log("you are not an admin");
      res.send({ message: "you are not admin" });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error fetching doctors", success: false, error });
  }
});
router.post("/get-all-users", authMiddleware, async (req, res) => {
  try {
    const { isAdmin } = await Users.findOne({ _id: req.body.userId });

    const response = await Users.find({}).select("-password");
    if (response && isAdmin) {
      return res.status(200).send({
        success: true,
        message: "all Users featched!",
        data: response,
      });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error fetching doctors", success: false, error });
  }
});

router.post(
  "/change-doctor-account-status",
  authMiddleware,
  async (req, res) => {
    try {
      const { isAdmin } = await Users.findOne({ _id: req.body.userId });
      const { doctor, status } = req.body;
      if (isAdmin) {
        const Doctor = await Doctors.findByIdAndUpdate(
          { _id: doctor },
          { status },
          { new: true }
        );
        const user = await Users.findOne({ _id: Doctor.userId });
        {
          status === "approved"
            ? (user.isDoctor = true)
            : (user.isDoctor = false);
        }
        const unseenNotifications = user.unSeenNotifications;
        unseenNotifications.push({
          type: "new-doctor-request-changed",
          message: `Your doctor account has been ${status}`,
          onClickPath: "/notifications",
        });
        user.unSeenNotifications = unseenNotifications;
        await user.save();
        const response = await Doctors.find({}).select("-password");
        res.status(200).send({
          success: true,
          message: "Doctor status Updated Successfully!",
          data: response,
        });
      }
    } catch (error) {
      res.status(500).send({
        message: "Error updating doctor status",
        success: false,
        error,
      });
    }
  }
);

export default router;
