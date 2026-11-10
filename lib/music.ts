export type SongId = "birthday" | "musicbox" | "lullaby";

type Ev = {
  freq: number;
  t: number;
  dur: number;
  vel: number;
  pad?: boolean;
};

const midi = (note: number) => 440 * 2 ** ((note - 69) / 12);

function notes(
  unit: number,
  sequence: Array<[number, number, number]>,
  vel = 1,
): Ev[] {
  return sequence.map(([note, step, len]) => ({
    freq: midi(note),
    t: step * unit,
    dur: Math.max(0.18, len * unit * 0.96),
    vel,
  }));
}

function drone(events: Ev[], seconds: number) {
  for (const note of [48, 55, 60]) {
    events.push({
      freq: midi(note),
      t: 0,
      dur: seconds,
      vel: 0.55,
      pad: true,
    });
  }
}

function song(events: Ev[]) {
  const end = events.reduce((max, event) => Math.max(max, event.t + event.dur), 0);
  return { events, duration: end + 0.85 };
}

const birthdayMelody: Array<[number, number, number]> = [
  [67, 0, 1],
  [67, 1, 1],
  [69, 2, 2],
  [67, 4, 2],
  [72, 6, 2],
  [71, 8, 4],
  [67, 12, 1],
  [67, 13, 1],
  [69, 14, 2],
  [67, 16, 2],
  [74, 18, 2],
  [72, 20, 4],
  [67, 24, 1],
  [67, 25, 1],
  [79, 26, 2],
  [76, 28, 2],
  [72, 30, 2],
  [71, 32, 2],
  [69, 34, 4],
  [77, 38, 1],
  [77, 39, 1],
  [76, 40, 2],
  [72, 42, 2],
  [74, 44, 2],
  [72, 46, 4],
];

const boxMelody: Array<[number, number, number]> = [
  [72, 0, 1],
  [76, 1, 1],
  [79, 2, 1],
  [81, 3, 1],
  [79, 4, 1],
  [76, 5, 1],
  [74, 6, 1],
  [72, 7, 2],
  [69, 9, 1],
  [72, 10, 1],
  [76, 11, 1],
  [79, 12, 2],
  [76, 14, 1],
  [74, 15, 1],
  [72, 16, 2],
  [74, 18, 1],
  [76, 19, 1],
  [79, 20, 1],
  [81, 21, 2],
  [79, 23, 1],
  [76, 24, 1],
  [74, 25, 2],
  [72, 27, 1],
  [76, 28, 1],
  [74, 29, 1],
  [72, 30, 3],
];

const nightMelody: Array<[number, number, number]> = [
  [76, 0, 2],
  [79, 2, 2],
  [81, 4, 2],
  [79, 6, 3],
  [76, 9, 2],
  [74, 11, 2],
  [72, 13, 3],
  [69, 16, 2],
  [72, 18, 2],
  [76, 20, 3],
  [74, 23, 2],
  [72, 25, 4],
];

function buildSong(id: SongId) {
  if (id === "birthday") {
    const events = notes(0.23, birthdayMelody);
    drone(events, 50 * 0.23);
    return song(events);
  }
  if (id === "musicbox") {
    const events = notes(0.34, boxMelody);
    drone(events, 33 * 0.34);
    return song(events);
  }
  const events = notes(0.5, nightMelody, 0.85);
  drone(events, 29 * 0.5);
  return song(events);
}

function voice(
  ctx: AudioContext,
  dest: AudioNode,
  event: Ev,
  when: number,
  bag: OscillatorNode[],
) {
  const partials = event.pad
    ? [{ type: "triangle" as const, ratio: 1, gain: 0.02 * event.vel, attack: 0.12 }]
    : [
        { type: "sine" as const, ratio: 1, gain: 0.15 * event.vel, attack: 0.012 },
        { type: "sine" as const, ratio: 2.003, gain: 0.045 * event.vel, attack: 0.012 },
        { type: "sine" as const, ratio: 4.01, gain: 0.012 * event.vel, attack: 0.01 },
      ];

  for (const partial of partials) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = partial.type;
    osc.frequency.setValueAtTime(event.freq * partial.ratio, when);
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, partial.gain), when + partial.attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + event.dur);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(when);
    osc.stop(when + event.dur + 0.06);
    osc.onended = () => {
      const index = bag.indexOf(osc);
      if (index >= 0) bag.splice(index, 1);
    };
    bag.push(osc);
  }
}

export function playWhoosh(ctx: AudioContext) {
  const duration = 0.42;
  const length = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / length);
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(900, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + duration);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.22, ctx.currentTime + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start();
}

export function startLoop(ctx: AudioContext, songId: SongId) {
  const master = ctx.createGain();
  master.gain.value = 0.9;
  const compressor = ctx.createDynamicsCompressor();
  compressor.threshold.value = -16;
  compressor.knee.value = 12;
  compressor.ratio.value = 3;
  compressor.attack.value = 0.01;
  compressor.release.value = 0.25;
  const delay = ctx.createDelay();
  delay.delayTime.value = 0.2;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.16;
  const wet = ctx.createGain();
  wet.gain.value = 0.16;

  master.connect(compressor);
  compressor.connect(ctx.destination);
  master.connect(delay);
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(wet);
  wet.connect(compressor);

  const bag: OscillatorNode[] = [];
  let stopped = false;
  let timer = 0;
  const { events, duration } = buildSong(songId);

  const schedule = (start: number) => {
    for (const event of events) voice(ctx, master, event, start + event.t, bag);
    timer = window.setTimeout(() => {
      if (!stopped) schedule(ctx.currentTime + 0.08);
    }, duration * 1000);
  };

  schedule(ctx.currentTime + 0.06);

  return () => {
    stopped = true;
    window.clearTimeout(timer);
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(Math.max(0.0001, master.gain.value), now);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
    for (const osc of bag) {
      try {
        osc.stop(now + 0.1);
      } catch {
        /* already stopped */
      }
    }
  };
}

export function createAudioContext() {
  const Ctx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  return new Ctx();
}
