import * as Tone from "tone";

export const toneObject = Tone;

export const toneTransport = toneObject.Transport;

export const tonePart1 = new toneObject.Part((time, note) => {
  drums.triggerAttackRelease(note, "8n", time);
}, []).start(0);

export const tonePart2 = new toneObject.Part((time, note) => {
  guitar.triggerAttackRelease(note, "8n", time);
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
    F3: "F3.mp3",
    "F#1": "Fs1.mp3",
    "F#2": "Fs2.mp3",
    "F#3": "Fs3.mp3",
    G1: "G1.mp3",
    G2: "G2.mp3",
    G3: "G3.mp3",
    "G#1": "Gs1.mp3",
    "G#2": "Gs2.mp3",
    "G#3": "Gs3.mp3",
    A1: "A1.mp3",
    A2: "A2.mp3",
    A3: "A3.mp3",
    "A#1": "As1.mp3",
    "A#2": "As2.mp3",
    "A#3": "As3.mp3",
    B1: "B1.mp3",
    B2: "B2.mp3",
    B3: "B3.mp3",
    C2: "C2.mp3",
    C3: "C3.mp3",
    C4: "C4.mp3",
    "C#2": "Cs2.mp3",
    "C#3": "Cs3.mp3",
    "C#4": "Cs4.mp3",
    D1: "D1.mp3",
    D2: "D2.mp3",
    D3: "D3.mp3",
    D4: "D4.mp3",
    "D#1": "Ds1.mp3",
    "D#2": "Ds2.mp3",
    "D#3": "Ds3.mp3",
    E1: "E1.mp3",
    E2: "E2.mp3",
    E3: "E3.mp3",
    F1: "F1.mp3",
    F2: "F2.mp3",
  },
  release: 1,
  baseUrl: "samples/guitar-acoustic/",
}).toDestination();

export const instrumentToTonePart = {
  //Piano: piano,
  Guitar: tonePart2,
  //"French Horn": frenchHorn,
  Drums: tonePart1,
};

export const instrumentToSampler = {
  //Piano: piano,
  Guitar: guitar,
  //"French Horn": frenchHorn,
  Drums: drums,
};
