import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
//import Tone from "tone";

const APIKEY = "x090MWGARN";
const baseURL = "https://comp2140.uqcloud.net/api/";

async function getSample(sampleId) {
  const url = `${baseURL}sample/${sampleId}/?api_key=${APIKEY}`;
  const response = await fetch(url);
  const json = await response.json();
  return json;
}

async function getLocations() {
  const url = `${baseURL}location/?api_key=${APIKEY}`;
  const response = await fetch(url);
  const json = await response.json();
  return json;
}

const ShareSample = () => {
  const { id } = useParams();
  const isEditing = !!id;

  const [sample, setSample] = useState(null);
  const [locations, setLocations] = useState([]);
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

      // Initialize location states based on whether sample is shared at each location
      const initialLocationStates = {};
      data.forEach((location) => {
        initialLocationStates[location.id] = location.sharing;
      });
      setLocationStates(initialLocationStates);
    }

    if (isEditing) {
      fetchSample();
    }

    fetchLocations();
  }, [id, isEditing]);

  const handlePreview = async () => {
    // Implement your sample preview logic here
  };

  const handleToggleLocation = (locationId) => {
    // Toggle the state for the selected location
    const updatedLocationStates = { ...locationStates };
    updatedLocationStates[locationId] = !locationStates[locationId];
    setLocationStates(updatedLocationStates);

    // You can add logic to update the API here to reflect the change in sharing status
  };

  return (
    <main>
      <h2 className="title">Share This Sample</h2>
      {sample && (
        <div className="card">
          <div className="song-details">
            <h3>{sample.name}</h3>
            <p>Date Created</p>
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
              onClick={() => handleToggleLocation(location.id)}
            >
              {locationStates[location.id] ? "Shared" : "Not Shared"}
            </button>
          </div>
        </div>
      ))}
    </main>
  );
};

export default ShareSample;
