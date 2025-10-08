import { Button, Form, Input } from "antd";
import { Link } from "react-router-dom";

function Login() {
  const onFinish = (value) => {
    console.log("The value recived from the form: ", value);
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

export default Login;

// 3rd video 26min
