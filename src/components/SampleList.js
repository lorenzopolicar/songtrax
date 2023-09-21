import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link from React Router
import Sample from "./Sample";

const APIKEY = "x090MWGARN";
const URL = `https://comp2140.uqcloud.net/api/sample/?api_key=${APIKEY}`;

async function getSamples() {
  const response = await fetch(URL);
  const json = await response.json();
  return json;
}

const SampleList = () => {
  const [samples, setSamples] = useState([]);

  useEffect(() => {
    async function fetchSamples() {
      const data = await getSamples();
      setSamples(data);
    }

    fetchSamples();
  }, []);

  return (
    <main>
      <h2 className="title">My Songs</h2>

      {samples.map((sample) => (
        <Sample key={sample.id} sample={sample} />
      ))}

      <div className="create-card">
        {/* Link to the CreateSample page */}
        <Link to="/createsample" className="full-button">
          Create Sample
        </Link>
      </div>
    </main>
  );
};

export default SampleList;
