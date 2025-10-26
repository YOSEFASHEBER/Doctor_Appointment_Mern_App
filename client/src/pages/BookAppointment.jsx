import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { hideLoading, showLoading } from "../redux/loaderSlice";
import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Button, Col, DatePicker, Row, TimePicker } from "antd";
import toast from "react-hot-toast";

// Extend dayjs with UTC and timezone plugins
dayjs.extend(utc);
dayjs.extend(timezone);

function BookAppointment() {
  const { user } = useSelector((state) => state.user);
  const [isAvailable, setIsAvailable] = useState(false);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [doctor, setDoctor] = useState(null);

  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();

  // Fetch doctor info
  const getDoctorData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/doctor/get-doctor-info-by-id",
        { doctorId: params.doctorId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      dispatch(hideLoading());

      if (response.data.success) {
        const startTime = dayjs.utc(response.data.data.timings[0]);
        const endTime = dayjs.utc(response.data.data.timings[1]);
        response.data.data.timings = [startTime, endTime];
        setDoctor(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Failed to load doctor data.");
      console.error(error);
    }
  };

  useEffect(() => {
    getDoctorData();
  }, []);

  // Helper function to get combined ISO datetimes
  const getIsoValues = () => {
    if (!date || !time) return null;

    const combined = dayjs.tz(
      `${date.format("YYYY-MM-DD")} ${time.format("HH:mm")}`,
      "YYYY-MM-DD HH:mm",
      "Africa/Addis_Ababa"
    );

    return {
      appointmentIso: combined.utc().toISOString(), // Full ISO UTC datetime
      dateIso: combined.utc().startOf("day").toISOString(), // Start-of-day ISO UTC
    };
  };

  // Check availability
  const checkAvailability = async () => {
    if (!date || !time) {
      toast.warning("Please select both date and time.");
      return;
    }

    const isoValues = getIsoValues();
    if (!isoValues) return;

    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/user/checkBookingAvailability",
        {
          doctorId: params.doctorId,
          date: isoValues.dateIso,
          time: isoValues.appointmentIso,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      dispatch(hideLoading());

      if (response.data.success) {
        toast.success(response.data.message);
        setIsAvailable(true);
      } else {
        toast.error(response.data.message);
        setIsAvailable(false);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Error checking availability.");
      console.error(error);
    }
  };

  // Book appointment
  const bookNow = async () => {
    if (!date || !time) {
      toast.error("Please select date and time first.");
      return;
    }

    const isoValues = getIsoValues();
    if (!isoValues) return;

    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/user/book-appointment",
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctor,
          userInfo: user,
          date: isoValues.dateIso,
          time: isoValues.appointmentIso,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      dispatch(hideLoading());

      if (response.data.success) {
        toast.success("Appointment booked successfully!");
        setIsAvailable(false);
        // navigate("/appointments");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Failed to book appointment.");
      console.error(error);
    }
  };

  return (
    <Layout>
      {doctor && (
        <div>
          <h1 className="page-title">
            Dr. {doctor.firstName?.toUpperCase()}{" "}
            {doctor.lastName?.toUpperCase()}
          </h1>
          <hr />

          <Row gutter={[16, 16]}>
            <Col span={8} sm={24} xs={24} lg={8}>
              <h1 className="normal-text">
                <b>Available Timings:</b>{" "}
                {doctor?.timings?.length === 2
                  ? `${doctor.timings[0]
                      .tz("Africa/Addis_Ababa")
                      .format("hh:mm A")} - 
                     ${doctor.timings[1]
                       .tz("Africa/Addis_Ababa")
                       .format("hh:mm A")}`
                  : "Not available"}
              </h1>

              <div className="d-flex flex-column pt-2">
                <DatePicker
                  format="DD-MM-YYYY"
                  className="mt-2"
                  onChange={(value) => {
                    setDate(value);
                    setIsAvailable(false);
                  }}
                />

                <TimePicker
                  format="hh:mm A"
                  use12Hours
                  className="mt-3"
                  onChange={(value) => {
                    setTime(value);
                    setIsAvailable(false);
                  }}
                />

                <Button
                  className="primary-button mt-3"
                  onClick={checkAvailability}
                >
                  Check Availability
                </Button>

                <Button
                  className="primary-button mt-3"
                  onClick={bookNow}
                  disabled={!isAvailable}
                >
                  Book Now
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      )}
    </Layout>
  );
}

export default BookAppointment;
