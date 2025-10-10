import React from "react";
import { Button, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import userModel from "../../../models/userModel";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/alertReducer";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = async (value) => {
    try {
      dispatch(showLoading());
      const response = await axios.post("/api/user/login", value);
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        toast("Redirect to Home page");
        localStorage.setItem("token", response.data.data);
        navigate("/");
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
          <Form.Item label="Email" name="email">
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input placeholder="Password" />
          </Form.Item>
          <Button className="primary-button my-3" htmlType="submit">
            Login{" "}
          </Button>
          <Link className="anchor my-2 " to="/register">
            CLICK HERE TO REGISTER
          </Link>
        </Form>
      </div>
    </div>
  );
}

export default Register;

// 3rd video 54min
