import React from "react";
import { Link } from "react-router-dom"; // Import Link from React Router
import {
  toneObject,
  toneTransport,
  instrumentToTonePart,
} from "../instruments";
import { useState, useEffect } from "react";
import { getSample } from "../api/api";

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
  const [isPreviewing, setIsPreviewing] = useState(false);

  const sequence = JSON.parse(sample.recording_data) || {};
  const instrument = sample.type;

  const handlePreview = async () => {
    toneObject.start();
    toneTransport.stop();

    if (isPreviewing) {
      // Stop the preview
      setIsPreviewing(false);
    } else {
      // Start the preview
      setIsPreviewing(true);
      instrumentToTonePart[instrument].clear();
      toneTransport.cancel();

      for (const note in sequence) {
        sequence[note].forEach((toggled, index) => {
          if (toggled) {
            instrumentToTonePart[instrument].add(index / 4, `${note}3`);
          }
        });
      }

      toneTransport.schedule((time) => {
        setIsPreviewing(false);
        console.log("Preview stopped automatically.");
      }, 16 / 4);

      toneTransport.start();
    }
  };

  return (
    <section className="sample" key={sample.id}>
      <div className="card">
        <div className="song-details">
          <h3>{sample.name}</h3>
          <p>{convertDate(sample.datetime)}</p>
        </div>
        <div className="button-group-container">
          <button
            type="button"
            className={isPreviewing ? "bright-button" : "dark-button"}
            onClick={handlePreview}
          >
            {isPreviewing ? "Stop" : "Preview"}
          </button>
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
