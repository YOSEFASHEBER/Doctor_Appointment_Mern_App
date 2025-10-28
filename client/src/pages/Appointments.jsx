import Layout from "../components/Layout.jsx";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { Table } from "antd";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/loaderSlice.js";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const dispatch = useDispatch();

  const getAppointments = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/user/get-appointments-by-user-id",
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      dispatch(hideLoading());
      console.log(response.data.data);
      setAppointments(response.data.data);
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };
  const columns = [
    { title: "Id", dataIndex: "_id" },
    {
      title: "Doctor",
      dataIndex: "name",
      render: (text, record) => (
        <span>
          {record.doctorInfo.firstName} {record.doctorInfo.lastName}
        </span>
      ),
    },
    {
      title: "phone",
      dataIndex: "phoneNumber",
      render: (text, record) => <span>{record.doctorInfo.phoneNumber}</span>,
    },
    {
      title: "Date & Time",
      dataIndex: "time",
      render: (text, record) => (
        <span>
          {/* {dayjs(record.date, "DD-MM-YYYY")} {dayjs(record.time, "HH:mm")} */}
          {new Date(text).toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
  ];
  useEffect(() => {
    getAppointments();
  }, []);
  return (
    <Layout>
      <div>Appointments</div>{" "}
      <Table columns={columns} dataSource={appointments} rowKey="_id" />
    </Layout>
  );
}

export default Appointments;
