const APIKEY = "x090MWGARN";
const baseURL = "https://comp2140.uqcloud.net/api/";

export async function getSamples() {
  const url = `${baseURL}sample/?api_key=${APIKEY}`;
  const response = await fetch(url);
  const json = await response.json();
  return json;
}

export async function getSample(sampleId) {
  const url = `${baseURL}sample/${sampleId}/?api_key=${APIKEY}`;
  const response = await fetch(url);
  const json = await response.json();
  return json;
}

export async function getLocations() {
  const url = `${baseURL}location/?api_key=${APIKEY}`;
  const response = await fetch(url);
  const json = await response.json();
  const sharedLocations = json.filter((location) => location.sharing);
  return sharedLocations;
}

export async function getLocationsToShareIds(sampleId) {
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

export async function getSampleToLocationId(locationId, sampleId) {
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

export async function getInitialLocationStates(sharedLocations, sampleId) {
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
