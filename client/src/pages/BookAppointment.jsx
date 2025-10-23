import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { hideLoading, showLoading } from "../redux/loaderSlice";
import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Button, Col, DatePicker, Row, TimePicker, message } from "antd";

dayjs.extend(utc);
dayjs.extend(timezone);

function BookAppointment() {
  const { RangePicker } = TimePicker;
  const [isAvailable, setIsAvailable] = useState(false);
  const [date, setDate] = useState(null);
  const [selectedTimings, setSelectedTimings] = useState([]);
  const [doctor, setDoctor] = useState(null);
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();

  const getDoctorData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/doctor/get-doctor-info-by-id",
        { doctorId: params.doctorId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());

      if (response.data.success) {
        const startTime = dayjs(response.data.data.timings[0], "HH:mm");
        const endTime = dayjs(response.data.data.timings[1], "HH:mm");

        response.data.data.timings = [startTime, endTime];
        setDoctor(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error(error);
      message.error("Failed to load doctor data.");
    }
  };

  useEffect(() => {
    getDoctorData();
  }, []);

  const checkAvailability = async () => {
    if (!date || selectedTimings.length !== 2) {
      message.warning("Please select date and time range.");
      return;
    }
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/user/check-booking-availability",
        {
          doctorId: params.doctorId,
          date: date.format("DD-MM-YYYY"),
          time: [
            selectedTimings[0].format("HH:mm"),
            selectedTimings[1].format("HH:mm"),
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());

      if (response.data.success) {
        message.success(response.data.message);
        setIsAvailable(true);
      } else {
        message.error(response.data.message);
        setIsAvailable(false);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error(error);
      message.error("Error checking availability.");
    }
  };

  const bookNow = async () => {
    if (!isAvailable) {
      message.warning("Please check availability first.");
      return;
    }
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/user/book-appointment",
        {
          doctorId: params.doctorId,
          userId: JSON.parse(localStorage.getItem("user"))._id,
          doctorInfo: doctor,
          userInfo: JSON.parse(localStorage.getItem("user")),
          date: date.format("DD-MM-YYYY"),
          time: [
            selectedTimings[0].format("HH:mm"),
            selectedTimings[1].format("HH:mm"),
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());

      if (response.data.success) {
        message.success("Appointment booked successfully!");
        navigate("/appointments");
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error(error);
      message.error("Failed to book appointment.");
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
          <Row>
            <Col span={8} sm={24} xs={24} lg={8}>
              <h1 className="normal-text">
                <b>Available Timings:</b> {doctor.timings[0].format("HH:mm")} -{" "}
                {doctor.timings[1].format("HH:mm")}
              </h1>

              <div className="d-flex flex-column pt-2">
                <DatePicker
                  format="DD-MM-YYYY"
                  className="mt-2"
                  onChange={(value) => setDate(value)}
                />

                <RangePicker
                  format="HH:mm"
                  className="mt-3"
                  use12Hours
                  onChange={(values) => setSelectedTimings(values)}
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
