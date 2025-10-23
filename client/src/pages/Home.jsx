import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/loaderSlice";
import Layout from "../components/Layout";
import { useState } from "react";
import Doctor from "../components/Doctor";
import { Col, Row } from "antd";

function Home() {
  const dispatch = useDispatch();
  const [doctors, setDoctors] = useState([]);
  const getData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/user/get-all-approved-doctors",
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      dispatch(hideLoading());
      response && setDoctors(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(showLoading());
        await getData();
      } finally {
        dispatch(hideLoading());
      }
    };
    fetchData();
  }, []);
  return (
    <Layout>
      <Row gutter={20}>
        {doctors?.map((doctor) => (
          <Col span={8} xs={24} sm={24} lg={8}>
            <Doctor doctor={doctor} />
          </Col>
        ))}
      </Row>
    </Layout>
  );
}

export default Home;
