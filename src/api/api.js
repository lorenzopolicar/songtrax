import fetch from "node-fetch";

const APIKEY = "x090MWGARN";

const baseURL = "https://comp2140.uqcloud.net/api/";

async function getSamples() {
  const url = `${baseURL}sample/?api_key=${APIKEY}`;
  const response = await fetch(url);
  const json = await response.json();
  return json;
}

async function getSample(id) {
  const url = `${baseURL}sample/${id}/?api_key=${APIKEY}`;
  const response = await fetch(url);
  const json = await response.json();
  return json;
}

async function CreateSample() {
  const url = `${baseURL}sample/?api_key=${APIKEY}`;

  const recording_data = [];
  const data = {
    type: "piano",
    name: "Best Pop Song",
    recording_data: JSON.stringify(recording_data),
    api_key: APIKEY,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const json = await response.json();
  return json;
}

async function main() {
  const all_samples = await getSamples();
  const single_sample = await getSample(4);
  const created_sample = await CreateSample();

  console.log("Results from Calling getSamples()", all_samples);

  console.log("Result from Calling getSample(4)", single_sample);

  console.log("Result from Calling CreateSample()", created_sample);
}

main();
