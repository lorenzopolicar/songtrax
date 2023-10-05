import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  toneObject,
  toneTransport,
  instrumentToTonePart,
  instrumentToSampler,
} from "../instruments";
import { APIKEY, baseURL, getSample } from "../api/api";
import BackArrow from "./BackArrow";

/**
 * EditSample Component
 *
 * This component renders a create/edit sample page that allows users to create/edit a sample.
 * Users can make a sample by toggling notes on a grid and previewing the sample.
 * Users can also save the sample.
 *
 * @returns {JSX.Element} JSX element representing the EditSample component.
 */
const EditSample = () => {
  const { id } = useParams();

  // checks whether the user is editing or creating a sample
  const isEditing = !!id;

  // Use state to keep track of the sample name, instrument, and sequence
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

  // Use state to keep track of whether the sample is being previewed
  const [isPreviewing, setIsPreviewing] = useState(false);

  // Use state to keep track of whether the sample is being saved
  const [isSaving, setIsSaving] = useState(false);

  // Use state to keep track of whether the sample has been saved
  const [saved, setSaved] = useState(false);

  // Use state to keep track of the sample id for when the sample is saved in create mode
  const [sampleId, setSampleId] = useState(id);

  useEffect(() => {
    // If editing, fetch the sample data
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

  /**
   * handles the change of the sample name.
   * @param {Object} e - The event object.
   * @returns {undefined}
   */
  const handleSampleNameChange = (e) => {
    setSampleName(e.target.value);
  };

  /**
   * handles the change of the instrument.
   * @param {string} selectedInstrument - The instrument to change to.
   * @returns {undefined}
   */
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

  /**
   * handles the toggling of a note at a specific index.
   * @param {string} note - The note to toggle.
   */
  const handleNoteToggle = (note) => (index) => {
    const updatedSequence = { ...sequence };
    updatedSequence[note][index] = !updatedSequence[note][index];
    setSequence(updatedSequence);
    const now = toneObject.now();
    instrumentToSampler[instrument].triggerAttackRelease(
      `${note}3`,
      "16n",
      now
    );
  };

  /**
   * handles the previewing of a sample.
   * @returns {undefined}
   */
  const handlePreview = async () => {
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
   * handles the saving of a sample.
   * @returns {undefined}
   */
  const handleSaveSample = async () => {
    setIsSaving(true);

    const data = {
      type: instrument,
      name: sampleName,
      recording_data: JSON.stringify(sequence),
      api_key: APIKEY,
    };

    // for edit mode or when the sample has been saved in create mode
    if (isEditing || saved) {
      await fetch(`${baseURL}sample/${sampleId}/?api_key=${APIKEY}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      // for create mode when the sample has not been saved
    } else if (!saved) {
      const response = await fetch(`${baseURL}sample/?api_key=${APIKEY}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const json = await response.json();
      setSaved(true);
      setSampleId(json.id);
    }

    setIsSaving(false);
  };

  return (
    <main>
      <BackArrow />
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
    </main>
  );
};

export default EditSample;
