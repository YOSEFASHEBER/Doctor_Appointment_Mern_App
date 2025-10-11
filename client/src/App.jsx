import { Button, Spin } from "antd";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "../src/index.css";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import { useSelector } from "react-redux";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  const { loading } = useSelector((state) => state.loader);
  return (
    <BrowserRouter>
      {loading && (
        <div className="spinner-overlay">
          <Spin size="large" />
        </div>
      )}
      <Toaster position="bottom-center" reverseOrder={false} />
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              {" "}
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              {" "}
              <Home />{" "}
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
