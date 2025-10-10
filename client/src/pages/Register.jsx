import React from "react";
import { Button, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/alertReducer";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = async (value) => {
    try {
      dispatch(showLoading());
      const response = await axios.post("/api/user/register", value);
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        toast("Redirect to login page");
        navigate("/login");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="authentication">
      <div className="authentication-form card p-3">
        <h1 className="card-title">Nice To Meet U</h1>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Name" name="name">
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input placeholder="Password" />
          </Form.Item>
          <Button className="primary-button my-3" htmlType="submit">
            Register{" "}
          </Button>
          <Link className="anchor my-2 " to="/login">
            CLICK HERE TO LOGIN
          </Link>
        </Form>
      </div>
    </div>
  );
}

export default Register;

// 3rd video 54min
