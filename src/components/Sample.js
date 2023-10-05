import React from "react";
import { Link } from "react-router-dom"; // Import Link from React Router
import {
  toneObject,
  toneTransport,
  instrumentToTonePart,
} from "../instruments";
import { useState } from "react";
import convertDate from "../dateConverter";

/**
 * Sample Component
 *
 * This component renders a sample card that displays the name and date
 * of a sample and allows users to preview, share, and edit the sample.
 *
 * @param {Object} sample - The sample object to render.
 * @returns {JSX.Element} JSX element representing the Sample component.
 */
const Sample = ({ sample }) => {
  // Use state to keep track of whether the sample is being previewed
  const [isPreviewing, setIsPreviewing] = useState(false);

  // for previewing
  const sequence = JSON.parse(sample.recording_data) || {};
  const instrument = sample.type;

  /**
   * handles the previewing of a sample.
   *
   * @returns {undefined}
   * @async
   */
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
            className={isPreviewing ? "dark-button" : "bright-button"}
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
