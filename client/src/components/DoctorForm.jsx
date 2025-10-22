import { Button, Col, Form, Input, Row, TimePicker } from "antd";
import dayjs from "dayjs";

function DoctorForm({ onFinish, initialValues }) {
  const { RangePicker } = TimePicker;
  const formattedInitialValues = {
    ...initialValues,
    timings: initialValues?.timings
      ? [
          dayjs(initialValues.timings[0], "HH:mm"),
          dayjs(initialValues.timings[1], "HH:mm"),
        ]
      : [],
  };
  const handleFinish = (values) => {
    const formattedValues = {
      ...values,
      timings: values.timings.map((t) => t.format("HH:mm")),
    };
    console.log("Form Submitted:", formattedValues);
    onFinish(formattedValues);
  };

  return (
    <Form
      layout="vertical"
      onFinish={handleFinish}
      initialValues={formattedInitialValues}
    >
      <h1 className="card-title mt-3">Personal Information</h1>
      <Row gutter={20}>
        <Col span={8}>
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[{ required: true }]}
          >
            <Input placeholder="First Name" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[{ required: true }]}
          >
            <Input placeholder="Last Name" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[{ required: true }]}
          >
            <Input placeholder="Phone Number" />
          </Form.Item>
        </Col>
      </Row>

      <hr />
      <h1 className="card-title mt-3">Professional Information</h1>
      <Row gutter={20}>
        <Col span={8}>
          <Form.Item
            label="Specialization"
            name="specialization"
            rules={[{ required: true }]}
          >
            <Input placeholder="Specialization" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Experience"
            name="experience"
            rules={[{ required: true }]}
          >
            <Input placeholder="Experience" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Fee Per Consultation"
            name="feePerCunsultation"
            rules={[{ required: true }]}
          >
            <Input placeholder="Fee Per Consultation" />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            label="Timings"
            name="timings"
            rules={[{ required: true }]}
          >
            <RangePicker format="HH:mm" use12Hours />
          </Form.Item>
        </Col>
      </Row>

      <div className="d-flex justify-content-end">
        <Button className="primary-button bottom-left" htmlType="submit">
          SUBMIT
        </Button>
      </div>
    </Form>
  );
}

export default DoctorForm;
