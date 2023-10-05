import * as Tone from "tone";

export const toneObject = Tone;

export const toneTransport = toneObject.Transport;

export const drumsTonePart = new toneObject.Part((time, note) => {
  drums.triggerAttackRelease(note, "8n", time);
}, []).start(0);

export const guitarTonePart = new toneObject.Part((time, note) => {
  guitar.triggerAttackRelease(note, "8n", time);
}, []).start(0);

export const pianoTonePart = new toneObject.Part((time, note) => {
  piano.triggerAttackRelease(note, "8n", time);
}, []).start(0);

export const frenchHornTonePart = new toneObject.Part((time, note) => {
  frenchHorn.triggerAttackRelease(note, "8n", time);
}, []).start(0);

export const drums = new toneObject.Sampler({
  urls: {
    C3: "drums1.mp3",
    D3: "drums2.mp3",
    E3: "drums3.mp3",
    F3: "drums4.mp3",
    G3: "drums5.mp3",
    A3: "drums6.mp3",
    B3: "drums7.mp3",
  },
  release: 1,
  baseUrl: "drum-samples/",
}).toDestination();

export const guitar = new toneObject.Sampler({
  urls: {
    A3: "A3.mp3",
    B3: "B3.mp3",
    C3: "C3.mp3",
    D3: "D3.mp3",
    E3: "E3.mp3",
    F3: "F3.mp3",
    G3: "G3.mp3",
  },
  release: 1,
  baseUrl: "guitar-samples/",
}).toDestination();

export const piano = new toneObject.Sampler({
  urls: {
    A3: "A3.mp3",
    B3: "B3.mp3",
    C3: "C3.mp3",
    D3: "D3.mp3",
    E3: "E3.mp3",
    F3: "F3.mp3",
    G3: "G3.mp3",
  },
  release: 1,
  baseUrl: "piano-samples/",
}).toDestination();

export const frenchHorn = new toneObject.Sampler({
  urls: {
    A3: "A3.mp3",
    B3: "B3.mp3",
    C3: "C3.mp3",
    D3: "D3.mp3",
    E3: "E3.mp3",
    F3: "F3.mp3",
    G3: "G3.mp3",
  },
  release: 1,
  baseUrl: "french-horn-samples/",
}).toDestination();

export const instrumentToTonePart = {
  Piano: pianoTonePart,
  Guitar: guitarTonePart,
  "French Horn": frenchHornTonePart,
  Drums: drumsTonePart,
};

export const instrumentToSampler = {
  Piano: piano,
  Guitar: guitar,
  "French Horn": frenchHorn,
  Drums: drums,
};
