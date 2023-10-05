import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sample from "./Sample";
import { getSamples } from "../api/api.js";

/**
 * SampleList Component
 *
 * This component renders a list of samples.
 *
 * @returns {JSX.Element} JSX element representing the SampleList component.
 */
const SampleList = () => {
  // Use state to keep track of the sample data
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
