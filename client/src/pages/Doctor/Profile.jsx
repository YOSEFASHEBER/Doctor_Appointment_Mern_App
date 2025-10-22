import React from "react";
import Layout from "../../components/Layout";
import DoctorForm from "../../components/DoctorForm";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { hideLoading, showLoading } from "../../redux/loaderSlice";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";
import { useEffect } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);

function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [doctor, setDoctor] = useState(null);
  const navigate = useNavigate();
  const params = useParams();
  const onFinish = async (values) => {
    try {
      dispatch(showLoading());

      const formattedTimings = values.timings.map((time) =>
        dayjs.isDayjs(time)
          ? time.format("HH:mm")
          : dayjs(time, "HH:mm").format("HH:mm")
      );
      const response = await axios.post(
        "/api/doctor/update-doctor-profile",
        {
          ...values,
          userId: user._id,
          timings: formattedTimings,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        toast("Successfully updated doctor profile");
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Something went wrong  while updating doctor profile");
    }
  };
  const getDoctor = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/doctor/get-doctor-info-by-user-id",
        { userId: params.userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());

      if (response.data.success) {
        const startTime = response.data.data.timings[0];
        const endTime = response.data.data.timings[1];
        const timings = [
          dayjs.utc(startTime, "HH:mm"),
          dayjs.utc(endTime, "HH:mm"),
        ];

        response.data.data.timings = timings;
        setDoctor(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error(error);
    }
  };
  useEffect(() => {
    getDoctor();
  }, [user]);
  return (
    <Layout>
      <h1 className="page-title"> Doctor Profile</h1> <hr />
      {doctor && <DoctorForm onFinish={onFinish} initialValues={doctor} />}
    </Layout>
  );
}

export default Profile;
