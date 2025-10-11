import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/loaderSlice";
import Layout from "../components/Layout";

function Home() {
  const dispatch = useDispatch();
  const getData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/user/get-user-info-by-id",
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
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
      <h1>Home</h1>
    </Layout>
  );
}

export default Home;
