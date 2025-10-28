import Layout from "../../components/Layout.jsx";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { Table } from "antd";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/loaderSlice.js";
import toast from "react-hot-toast";

function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const dispatch = useDispatch();

  const getAppointments = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/doctor/get-appointments-by-doctor-id",
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      dispatch(hideLoading());
      setAppointments(response.data.data);
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };
  const changeAppointmentStatus = async (record, status) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/doctor/change-appointment-status",
        { appointment: record._id, user: record.userId, status: status },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      dispatch(hideLoading());
      toast.success(`Appoinment status ${status}!`);
      {
        response.data.success && getAppointments(response.data.data);
      }
    } catch (error) {
      toast.error("something went wrong!");
      dispatch(hideLoading());
      console.log(error);
    }
  };
  const deleteAppointment = async (record) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/doctor/delete-appointment-status",
        { appointment: record._id, doctorId: record.doctorId },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      dispatch(hideLoading());
      toast.success(`Appoinment Deleted`);
      {
        response.data.success && getAppointments(response.data.data);
      }
    } catch (error) {
      toast.error("something went wrong!");
      dispatch(hideLoading());
      console.log(error);
    }
  };
  const columns = [
    { title: "Id", dataIndex: "_id" },
    {
      title: "patient",
      dataIndex: "name",
      render: (text, record) => <span>{record.userInfo.name}</span>,
    },
    {
      title: "Date & Time",
      dataIndex: "time",
      render: (text, record) => (
        <span>
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
    {
      title: "Actions",
      dataIndex: "actions",
      key: "Actions",
      render: (text, record) => (
        <div className="d-flex">
          {record.status == "pending" ? (
            <>
              {" "}
              <h1
                className="anchor"
                onClick={() => changeAppointmentStatus(record, "approved")}
              >
                Approve
              </h1>
              <h1
                className="anchor ms-3"
                onClick={() => changeAppointmentStatus(record, "rejected")}
              >
                Rejected
              </h1>
            </>
          ) : (
            <h1 className="anchor" onClick={() => deleteAppointment(record)}>
              Delete
            </h1>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    getAppointments();
  }, []);
  return (
    <Layout>
      <h1 className="page-header">Appointments</h1>
      <Table columns={columns} dataSource={appointments} rowKey="_id" />
    </Layout>
  );
}

export default DoctorAppointments;
