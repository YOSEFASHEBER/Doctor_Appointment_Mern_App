import Layout from "../../components/Layout.jsx";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { Table } from "antd";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/loaderSlice.js";

function Userslist() {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();

  const getAllUsers = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/admin/get-all-Users",
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      dispatch(hideLoading());
      setUsers(response.data.data);
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };
  useEffect(() => {
    getAllUsers();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (text, action) => (
        <h1 className="normal-text">
          {new Date(text).toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </h1>
      ),
    },
    {
      title: "Id",
      dataIndex: "_id",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          <h1 className="anchor">Block</h1>
        </div>
      ),
    },
  ];
  return (
    <Layout>
      <h1 className="page-header">UsersList</h1>
      <Table columns={columns} dataSource={users} />
    </Layout>
  );
}

export default Userslist;
