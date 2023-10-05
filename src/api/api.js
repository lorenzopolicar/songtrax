/** @constant {string} APIKEY - The API key for the API. */
export const APIKEY = "x090MWGARN";
/** @constant {string} baseURL - The base URL for the API. */
export const baseURL = "https://comp2140.uqcloud.net/api/";

/**
 * Gets all samples from the API.
 * @returns {Promise} A promise that resolves to an array of samples.
 * @async
 */
export async function getSamples() {
  const url = `${baseURL}sample/?api_key=${APIKEY}`;
  const response = await fetch(url);
  const json = await response.json();
  return json;
}

/**
 * Gets a sample from the API.
 * @param {number} sampleId - The ID of the sample to get.
 * @returns {Promise} A promise that resolves to a sample.
 * @async
 */
export async function getSample(sampleId) {
  const url = `${baseURL}sample/${sampleId}/?api_key=${APIKEY}`;
  const response = await fetch(url);
  const json = await response.json();
  return json;
}

/**
 * Gets all locations from the API.
 * @returns {Promise} A promise that resolves to an array of locations.
 * @async
 */
export async function getLocations() {
  const url = `${baseURL}location/?api_key=${APIKEY}`;
  const response = await fetch(url);
  const json = await response.json();
  const sharedLocations = json.filter((location) => location.sharing);
  return sharedLocations;
}

/**
 * Gets the ID of the sample to location mapping for a sample in a location.
 * @param {number} locationId - The ID of the location to get the sample to location mapping for.
 * @param {number} sampleId - The ID of the sample to get the sample to location mapping for.
 * @returns {Promise} A promise that resolves to the ID of the sample to location mapping.
 * @async
 */
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

/**
 * Gets the initial location states for a sample.
 * @param {Array} sharedLocations - An array of locations that the sample is shared in.
 * @param {number} sampleId - The ID of the sample to get the initial location states for.
 * @returns {Promise} A promise that resolves to an object containing the initial location states.
 * @async
 */
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
