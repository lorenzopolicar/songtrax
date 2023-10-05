import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link from React Router
import Sample from "./Sample";
import { getSamples } from "../api/api.js";

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
      <div className="create-card">
        <Link to="/createsample" className="full-button">
          Create Sample
        </Link>
      </div>

      {samples.map((sample) => (
        <Sample key={sample.id} sample={sample} />
      ))}

      <div className="create-card">
        <Link to="/createsample" className="full-button">
          Create Sample
        </Link>
      </div>
    </main>
  );
};

export default SampleList;
