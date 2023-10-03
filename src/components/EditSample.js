import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  toneObject,
  toneTransport,
  instrumentToTonePart,
} from "../instruments";

const APIKEY = "x090MWGARN";
const baseURL = "https://comp2140.uqcloud.net/api/";

async function getSample(sampleId) {
  const url = `${baseURL}sample/${sampleId}/?api_key=${APIKEY}`;
  const response = await fetch(url);
  const json = await response.json();
  return json;
}

const EditSample = () => {
  const { id } = useParams();
  const isEditing = !!id;

  const [sampleName, setSampleName] = useState("");
  const [instrument, setInstrument] = useState("Piano");
  const [sequence, setSequence] = useState({
    B: Array(16).fill(false),
    A: Array(16).fill(false),
    G: Array(16).fill(false),
    F: Array(16).fill(false),
    E: Array(16).fill(false),
    D: Array(16).fill(false),
    C: Array(16).fill(false),
  });
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEditing) {
      async function fetchSample() {
        const data = await getSample(id);
        setSampleName(data.name);
        setInstrument(data.type);
        setSequence(JSON.parse(data.recording_data) || {});
      }
      fetchSample();
    }
  }, [id, isEditing]);

  const handleSampleNameChange = (e) => {
    setSampleName(e.target.value);
  };

  const handleInstrumentChange = (selectedInstrument) => {
    setInstrument(selectedInstrument);
    setSequence({
      B: Array(16).fill(false),
      A: Array(16).fill(false),
      G: Array(16).fill(false),
      F: Array(16).fill(false),
      E: Array(16).fill(false),
      D: Array(16).fill(false),
      C: Array(16).fill(false),
    });
  };

  const handleNoteToggle = (note) => (index) => {
    const updatedSequence = { ...sequence };
    updatedSequence[note][index] = !updatedSequence[note][index];
    setSequence(updatedSequence);
  };

  const handlePreview = async () => {
    toneObject.start();
    toneTransport.stop();

    if (isPreviewing) {
      // Stop the preview
      setIsPreviewing(false);
      // sampler.releaseAll();
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

  const handleSaveSample = async () => {
    setIsSaving(true);

    const data = {
      type: instrument,
      name: sampleName,
      recording_data: JSON.stringify(sequence),
      api_key: APIKEY,
    };

    if (isEditing) {
      await fetch(`${baseURL}sample/${id}/?api_key=${APIKEY}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    } else {
      await fetch(`${baseURL}sample/?api_key=${APIKEY}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    }

    setIsSaving(false);
  };

  return (
    <main>
      <h2 className="title">{isEditing ? "Edit Sample" : "Create Sample"}:</h2>
      <form className="card edit-card">
        <input
          type="text"
          value={sampleName}
          onChange={handleSampleNameChange}
          placeholder="Enter Sample Name"
        ></input>
        <div className="button-group-container">
          <button
            type="button"
            className={isPreviewing ? "bright-button" : "dark-button"}
            onClick={handlePreview}
          >
            {isPreviewing ? "Stop" : "Preview"}
          </button>
          <button
            type="button"
            className="bright-button"
            onClick={handleSaveSample}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>

      <div className="toggle-row-container">
        <div className="row-label">
          <h4>Instrument</h4>
        </div>
        <div className="sequence-row-container">
          {["Piano", "French Horn", "Guitar", "Drums"].map((inst) => (
            <button
              key={inst}
              className={instrument === inst ? "toggle-selected" : "toggle"}
              onClick={() => handleInstrumentChange(inst)}
            >
              {inst}
            </button>
          ))}
        </div>
      </div>

      {["B", "A", "G", "F", "E", "D", "C"].map((note) => (
        <div key={note} className="toggle-row-container">
          <div className="row-label">
            <h4>{note}</h4>
          </div>
          <div className="sequence-row-container">
            {sequence[note].map((toggled, index) => (
              <button
                key={index}
                className={toggled ? "toggle-selected" : "toggle"}
                onClick={() => handleNoteToggle(note)(index)}
              ></button>
            ))}
          </div>
        </div>
      ))}

      <div className="button-group-container">
        <button
          type="button"
          className={isPreviewing ? "bright-button" : "dark-button"}
          onClick={handlePreview}
        >
          {isPreviewing ? "Stop Previewing" : "Preview"}
        </button>
      </div>
    </main>
  );
};

export default EditSample;
