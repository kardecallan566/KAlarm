const fs = require('node:fs');
const path = require('node:path');

const RATE = 44100;
const SOUNDS = {
  bell: [880, 660, 880],
  chime: [659.25, 783.99, 987.77],
  pulse: [523.25, 523.25, 659.25, 523.25],
};

function writeTone(fileName, notes) {
  const segment = 0.28;
  const tail = 0.22;
  const frames = Math.ceil((notes.length * segment + tail) * RATE);
  const data = Buffer.alloc(44 + frames * 2);
  data.write('RIFF', 0); data.writeUInt32LE(data.length - 8, 4);
  data.write('WAVE', 8); data.write('fmt ', 12); data.writeUInt32LE(16, 16);
  data.writeUInt16LE(1, 20); data.writeUInt16LE(1, 22);
  data.writeUInt32LE(RATE, 24); data.writeUInt32LE(RATE * 2, 28);
  data.writeUInt16LE(2, 32); data.writeUInt16LE(16, 34);
  data.write('data', 36); data.writeUInt32LE(frames * 2, 40);
  for (let i = 0; i < frames; i++) {
    const time = i / RATE;
    const index = Math.floor(time / segment);
    const local = time - index * segment;
    const frequency = notes[Math.min(index, notes.length - 1)];
    const release = index >= notes.length ? Math.max(0, 1 - (time - notes.length * segment) / tail) : 1;
    const envelope = Math.min(1, local / 0.018, Math.max(0, (segment - local) / 0.055) * release;
    const wave = Math.sin(2 * Math.PI * frequency * time) + 0.24 * Math.sin(4 * Math.PI * frequency * time);
    const sample = Math.max(-1, Math.min(1, wave * envelope * 0.34));
    data.writeInt16LE(Math.round(sample * 32767), 44 + i * 2);
  }
  fs.writeFileSync(path.join(__dirname, '..', 'assets', 'sounds', fileName), data);
}

function generateNotificationSounds() {
  const directory = path.join(__dirname, '..', 'assets', 'sounds');
  fs.mkdirSync(directory, { recursive: true });
  for (const [name, notes] of Object.entries(SOUNDS)) writeTone(name + '.wav', notes);
}
module.exports = generateNotificationSounds;
if (require.main === module) generateNotificationSounds();
