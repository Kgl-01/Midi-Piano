const audioContext = new AudioContext();

const NOTE_DETAILS = [
  { note: "C", key: "Z", active: false, frequency: 261.626 },
  { note: "Db", key: "S", active: false, frequency: 277.183 },
  { note: "D", key: "X", active: false, frequency: 293.665 },
  { note: "Eb", key: "D", active: false, frequency: 311.127 },
  { note: "E", key: "C", active: false, frequency: 329.628 },
  { note: "F", key: "V", active: false, frequency: 349.228 },
  { note: "Gb", key: "G", active: false, frequency: 369.994 },
  { note: "G", key: "B", active: false, frequency: 391.995 },
  { note: "Ab", key: "H", active: false, frequency: 415.305 },
  { note: "A", key: "N", active: false, frequency: 440 },
  { note: "Bb", key: "J", active: false, frequency: 466.164 },
  { note: "B", key: "M", active: false, frequency: 493.883 },
];

document.addEventListener("keydown", (e) => {
  if (e.repeat) return;
  const keyboardKey = e.code;
  const noteDetail = getNoedDetail(keyboardKey);

  if (noteDetail == null) return;

  console.log(noteDetail);
  console.log(e);
  noteDetail.active = true;
  playNotes();
});

document.addEventListener("keyup", (e) => {
  const keyboardKey = e.code;
  const noteDetail = getNoedDetail(keyboardKey);
  if (noteDetail == null) return;
  console.log("up");
  console.log(e);
  noteDetail.active = false;
  playNotes();
});

function getNoedDetail(keyboardKey) {
  return NOTE_DETAILS.find((n) => `Key${n.key}` === keyboardKey);
}

function playNotes() {
  NOTE_DETAILS.forEach((note) => {
    const keyElement = document.querySelector(`[data-note='${note.note}']`);
    keyElement.classList.toggle("active", note.active);
    if (note.oscillator != null) {
      note.oscillator.stop();
      note.oscillator.disconnect();
    }
  });

  const activeNotes = NOTE_DETAILS.filter((n) => n.active);
  const gain = 1 / activeNotes.length;
  activeNotes.forEach((note) => {
    startNote(note, gain);
  });
}

function startNote(noteDetail, gain) {
  const gainNode = audioContext.createGain();
  gainNode.gain.value = gain;
  const oscillator = audioContext.createOscillator();
  oscillator.frequency.value = noteDetail.frequency;
  oscillator.type = "square";
  oscillator.connect(gainNode).connect(audioContext.destination);
  oscillator.start();
  noteDetail.oscillator = oscillator;
}
