import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import React from "react";
import { useNavigate } from "react-router-dom";

dayjs.extend(utc);
dayjs.extend(timezone);

function Doctor({ doctor }) {
  const navigate = useNavigate();
  return (
    <div
      className="card p-2"
      onClick={() => navigate(`book-appointment/${doctor._id}`)}
    >
      <h1 className="card-title">
        Dr. {doctor.firstName?.toUpperCase()} {doctor.lastName?.toUpperCase()}
      </h1>
      <hr />
      <p>
        <b>Phone Number : </b>
        {doctor.phoneNumber}
      </p>
      <p>
        <b>Address : </b>
        {doctor.address}
      </p>
      <p>
        <b>Fee Per Visit : </b>
        {doctor.feePerCunsultation}
      </p>
      <p>
        <b>Timings : </b>
        {doctor?.timings?.length === 2
          ? `${dayjs
              .utc(doctor.timings[0])
              .tz("Africa/Addis_Ababa")
              .format("hh:mm A")} - ${dayjs
              .utc(doctor.timings[1])
              .tz("Africa/Addis_Ababa")
              .format("hh:mm A")}`
          : "Not available"}
      </p>
      <p>
        <b>Specialization : </b>
        {doctor.specialization}
      </p>
    </div>
  );
}

export default Doctor;
