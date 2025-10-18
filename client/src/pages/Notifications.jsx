import Layout from "../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { Tabs } from "antd";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { showLoading, hideLoading } from "../redux/loaderSlice";
import { setUser } from "../redux/userSlice";
import Item from "antd/es/list/Item";
function Notifications() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const markAllAsSeen = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/user/mark-all-as-seen",
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      dispatch(hideLoading());
      toast.success(response.data.message);
      dispatch(setUser(response.data.data));
    } catch (error) {
      dispatch(hideLoading());
      toast.error("error setting Notification to seen ");
      console.log(error);
    }
  };
  const deleteAll = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/user/Delete-all-notifications",
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      dispatch(hideLoading());
      toast.success(response.data.message);
      dispatch(setUser(response.data.data));
    } catch (error) {
      dispatch(hideLoading());
      toast.error("error deleting Notification to seen ");
      console.log(error);
    }
  };
  const items = [
    {
      key: "0",
      label: "Unseen",
      children: (
        <>
          <div className="d-flex justify-content-end">
            <h1 className="anchor" onClick={markAllAsSeen}>
              Mark all as seen
            </h1>
          </div>
          {user?.unSeenNotifications?.map((notification) => (
            <div
              className="card p-2"
              onClick={() => navigate(notification.onClickPath)}
              key={notification._id || notification.data?.doctorId}
            >
              <div className="card-text">{notification.message}</div>
            </div>
          ))}
        </>
      ),
    },
    {
      key: "1",
      label: "Seen",
      children: (
        <>
          <div className="d-flex justify-content-end">
            <h1 className="anchor" onClick={deleteAll}>
              Delete all
            </h1>
          </div>
          {user?.seenNotifications?.map((notification) => (
            <div
              className="card p-2"
              onClick={() => navigate(notification.onClickPath)}
              key={notification._id || notification.data?.doctorId}
            >
              <div className="card-text">{notification.message}</div>
            </div>
          ))}
        </>
      ),
    },
  ];

  return (
    <Layout>
      <h1 className="page-title">Notifications</h1>
      <Tabs items={items} />
    </Layout>
  );
}

export default Notifications;
