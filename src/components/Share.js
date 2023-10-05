import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  toneObject,
  toneTransport,
  instrumentToTonePart,
} from "../instruments";
import {
  getSample,
  getLocations,
  getSampleToLocationId,
  getInitialLocationStates,
  APIKEY,
  baseURL,
} from "../api/api.js";
import BackArrow from "./BackArrow.js";
import convertDate from "../dateConverter.js";

/**
 * ShareSample Component
 *
 * This component renders a share sample page that allows users to share a sample
 * with locations.
 *
 * @returns {JSX.Element} JSX element representing the ShareSample component.
 */
const ShareSample = () => {
  const { id } = useParams();
  const isEditing = !!id;

  // Use state to keep track of the sample and location data
  const [sample, setSample] = useState(null);
  const [locations, setLocations] = useState([]);

  // Use state to keep track of whether the sample is being previewed
  const [isPreviewing, setIsPreviewing] = useState(false);

  // Use state to keep track of the selected state for each location
  const [locationStates, setLocationStates] = useState({});

  useEffect(() => {
    async function fetchSample() {
      const data = await getSample(id);
      setSample(data);
    }

    async function fetchLocations() {
      const data = await getLocations();
      setLocations(data);
      // Get the initial location states for the sample
      const initialLocationStates = await getInitialLocationStates(
        data,
        parseInt(id)
      );
      setLocationStates(initialLocationStates);
    }

    if (isEditing) {
      fetchSample();
    }

    fetchLocations();
  }, [id, isEditing]);

  /**
   * handles the previewing of a sample.
   *
   * @returns {undefined}
   * @async
   */
  const handlePreview = async () => {
    const sequence = JSON.parse(sample.recording_data) || {};
    const instrument = sample.type;
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

  /**
   * handles the toggling of a location.
   *
   * @param {number} locationId - The ID of the location to toggle.
   * @param {boolean} share - Whether the location should be shared or not.
   * @returns {undefined}
   * @async
   */
  const handleToggleLocation = async (locationId, share) => {
    // Toggle the state for the selected location
    if (
      (share && locationStates[locationId]) ||
      (!share && !locationStates[locationId])
    ) {
      return;
    }
    const updatedLocationStates = { ...locationStates };
    updatedLocationStates[locationId] = !locationStates[locationId];
    setLocationStates(updatedLocationStates);

    if (updatedLocationStates[locationId]) {
      const data = {
        api_key: APIKEY,
        sample_id: id,
        location_id: locationId,
      };
      await fetch(`${baseURL}sampletolocation/?api_key=${APIKEY}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    } else {
      const sampleToLocationId = await getSampleToLocationId(
        parseInt(locationId),
        parseInt(id)
      );
      if (sampleToLocationId) {
        await fetch(
          `${baseURL}sampletolocation/${sampleToLocationId}/?api_key=${APIKEY}`,
          {
            method: "DELETE",
          }
        );
      }
    }
  };

  return (
    <main>
      <BackArrow />
      <h2 className="title">Share This Sample</h2>
      {sample && (
        <div className="card">
          <div className="song-details">
            <h3>{sample.name}</h3>
            <p>{convertDate(sample.datetime)}</p>
          </div>
          <div className="buttons">
            <button className="bright-button" onClick={handlePreview}>
              {isPreviewing ? "Stop Previewing" : "Preview"}
            </button>
          </div>
        </div>
      )}
      {locations.map((location) => (
        <div key={location.id} className="toggle-row-container">
          <div className="location-name-label">
            <h4>{location.name}</h4>
          </div>
          <div className="sequence-row-container">
            <button
              className={
                locationStates[location.id] ? "toggle-selected" : "toggle"
              }
              onClick={() => handleToggleLocation(location.id, true)}
            >
              {"Shared"}
            </button>
            <button
              className={
                !locationStates[location.id] ? "toggle-selected" : "toggle"
              }
              onClick={() => handleToggleLocation(location.id, false)}
            >
              {"Not Shared"}
            </button>
          </div>
        </div>
      ))}
    </main>
  );
};

export default ShareSample;
