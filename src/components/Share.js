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
  const sharedLocations = json.filter((location) => location.sharing);
  return sharedLocations;
}

async function getLocationsToShareIds(sampleId) {
  const url = `${baseURL}location/?api_key=${APIKEY}`;
  const response = await fetch(url);
  const json = await response.json();
  const sharedLocations = json.filter((location) => location.sharing);
  const sharedLocationsIds = sharedLocations.map((location) => location.id);

  const sampleToLocationsUrl = `${baseURL}sampletolocation/?api_key=${APIKEY}`;
  const sampleToLocationsResponse = await fetch(sampleToLocationsUrl);
  const sampleToLocationsJson = await sampleToLocationsResponse.json();

  const locationIdsToShareIds = {};

  sharedLocationsIds.forEach((locationId) => {
    const filtered = sampleToLocationsJson.filter(
      (sampleToLocation) =>
        sampleToLocation.location_id === locationId &&
        sampleToLocation.sample_id === sampleId
    );
    locationIdsToShareIds[locationId] = filtered[0] ? filtered[0].id : null;
  });

  return locationIdsToShareIds;
}

async function getSampleToLocationId(locationId, sampleId) {
  const url = `${baseURL}sampletolocation/?api_key=${APIKEY}`;
  const response = await fetch(url);
  const json = await response.json();
  const filtered = json.filter(
    (sampleToLocation) =>
      sampleToLocation.sample_id === sampleId &&
      sampleToLocation.location_id === locationId
  );
  return filtered[0] ? filtered[0].id : null;
}

async function getInitialLocationStates(sharedLocations, sampleId) {
  const url = `${baseURL}sampletolocation/?api_key=${APIKEY}`;
  const response = await fetch(url);
  const json = await response.json();
  const sharedLocationIds = sharedLocations.map((location) => location.id);
  const filtered = json.filter((sampleToLocation) => {
    return (
      sampleToLocation.sample_id === sampleId &&
      sharedLocationIds.includes(sampleToLocation.location_id)
    );
  });
  const filteredIds = filtered.map(
    (sampleToLocation) => sampleToLocation.location_id
  );
  const initialLocationStates = {};
  sharedLocations.forEach((location) => {
    initialLocationStates[location.id] = filteredIds.includes(location.id);
  });
  return initialLocationStates;
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

  const handlePreview = async () => {
    // Implement your sample preview logic here
  };

  const handleToggleLocation = async (locationId) => {
    // Toggle the state for the selected location
    const updatedLocationStates = { ...locationStates };
    updatedLocationStates[locationId] = !locationStates[locationId];
    setLocationStates(updatedLocationStates);
    // You can add logic to update the API here to reflect the change in sharing status

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
