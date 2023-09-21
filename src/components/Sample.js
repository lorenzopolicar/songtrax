import React from "react";
import { Link } from "react-router-dom"; // Import Link from React Router

function convertDate(date) {
  // Create a Date object from the input string
  const datetime = new Date(date);

  // Define an array of month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Extract the components (hour, minute, day, month, year) from the Date object
  const hour = datetime.getUTCHours().toString().padStart(2, "0");
  const minute = datetime.getUTCMinutes().toString().padStart(2, "0");
  const day = datetime.getUTCDate().toString();
  const month = monthNames[datetime.getUTCMonth()];
  const year = datetime.getUTCFullYear().toString();

  // Create the formatted string
  const formattedDatetime = `${hour}:${minute} on ${day} ${month} ${year}`;

  return formattedDatetime;
}

const Sample = ({ sample }) => {
  return (
    <section className="sample" key={sample.id}>
      <div className="card">
        <div className="song-details">
          <h3>{sample.name}</h3>
          <p>{convertDate(sample.datetime)}</p>
        </div>
        <div className="button-group-container">
          <Link to={`/sharesample/${sample.id}`} className="bright-button">
            Share
          </Link>
          <Link to={`/editsample/${sample.id}`} className="bright-button">
            Edit
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Sample;
