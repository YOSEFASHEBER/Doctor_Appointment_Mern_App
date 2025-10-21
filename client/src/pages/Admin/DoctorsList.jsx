import React from "react";
import Layout from "../../components/Layout.jsx";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { Table } from "antd";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/loaderSlice.js";
import toast from "react-hot-toast";

function DoctorsList() {
  const [doctors, setDoctors] = useState([]);
  const dispatch = useDispatch();

  const getAllDoctors = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/admin/get-all-doctors",
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      dispatch(hideLoading());
      console.log(response.data.data);
      if (response.data.success) {
        setDoctors(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };
  const changeDoctorStatus = async (record, status) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/admin/change-doctor-account-status",
        { doctor: record._id, userId: record.userId, status: status },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      dispatch(hideLoading());
      toast.success(`Doctor account ${status}!`);
      {
        response.data.success &&
          setDoctors(response.data.data) &&
          console.log("response: ", response.data.data);
      }
    } catch (error) {
      toast.error("something went wrong!");
      dispatch(hideLoading());
      console.log(error);
    }
  };
  useEffect(() => {
    getAllDoctors();
  }, []);
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <h1 className="normal-text">
          {record.firstName} {record.lastName}
        </h1>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "Phone",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "Created At",
      render: (text, record) => (
        <h1 className="normal-text">
          {new Date(text).toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </h1>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "Status",
    },

    {
      title: "Actions",
      dataIndex: "actions",
      key: "Actions",
      render: (text, record) => (
        <div className="d-flex">
          {record.status == "pending" && (
            <h1
              className="anchor"
              onClick={() => changeDoctorStatus(record, "approved")}
            >
              Approve
            </h1>
          )}
          {record.status === "approved" && (
            <h1
              className="anchor"
              onClick={() => changeDoctorStatus(record, "blocked")}
            >
              Block
            </h1>
          )}
        </div>
      ),
    },
  ];
  return (
    <Layout>
      <h1 className="page-header">DoctorsList</h1>
      <Table
        columns={columns}
        dataSource={Array.isArray(doctors) ? doctors : [doctors]}
        rowKey="_id"
      />
    </Layout>
  );
}

export default DoctorsList;
