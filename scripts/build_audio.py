#!/usr/bin/env python3
"""Build the Demotion soundtrack from src/timeline.json.

Everything here is synthesized (no samples, no copyrighted audio). Music and
SFX share one beat grid with the animation: every event time is
scene_start_beat + event_beat, converted with the same BPM the video uses.
"""
import json, sys, wave
import numpy as np
from scipy import signal

SR = 44100
root = sys.argv[1] if len(sys.argv) > 1 else "."
tl = json.load(open(f"{root}/src/timeline.json"))
BPM = tl["bpm"]
BEAT_S = 60.0 / BPM

# ---------- timeline -> absolute beats ----------
scenes, cur = {}, 0.0
for sc in tl["scenes"]:
    scenes[sc["id"]] = dict(start=cur, beats=sc["beats"], ev=sc["events"], intro=sc["in"])
    cur += sc["beats"]
TOTAL_BEATS = cur
TAIL = 2.0
N = int((TOTAL_BEATS * BEAT_S + TAIL) * SR)
rng = np.random.default_rng(7)

def T(beat):  # beat -> seconds
    return beat * BEAT_S

def tarr(dur):
    return np.arange(int(dur * SR)) / SR

def env_exp(n, tau):
    return np.exp(-np.arange(n) / (tau * SR))

def place(buf, sig, t0, gain=1.0, pan=0.0):
    """mix a mono signal into stereo buf starting at time t0 (sec)"""
    i = int(round(t0 * SR))
    if i >= N or i + len(sig) <= 0:
        return
    s0 = max(0, -i)
    i0 = max(0, i)
    seg = sig[s0: s0 + (N - i0)]
    l = gain * (1 - max(0, pan)) ; r = gain * (1 + min(0, pan))
    buf[0, i0:i0 + len(seg)] += seg * l
    buf[1, i0:i0 + len(seg)] += seg * r

def lp(x, fc, order=2):
    sos = signal.butter(order, fc / (SR / 2), "low", output="sos")
    return signal.sosfilt(sos, x)

def hp(x, fc, order=2):
    sos = signal.butter(order, fc / (SR / 2), "high", output="sos")
    return signal.sosfilt(sos, x)

def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)

# ---------- sound generators ----------
def svf_sweep(noise, f0, f1, q=0.9):
    """resonant band-pass sweep from f0 to f1 (exponential)"""
    n = len(noise)
    fs = f0 * (f1 / f0) ** (np.arange(n) / n)
    out = np.zeros(n)
    low = band = 0.0
    for i in range(n):
        f = 2 * np.sin(np.pi * min(fs[i], SR * 0.45) / SR)
        low += f * band
        high = noise[i] - low - q * band
        band += f * high
        out[i] = band
    return out

def whoosh(dur=0.75, up=True, tail=0.22):
    """rising noise sweep whose crest lands exactly at `dur`, then a short tail"""
    rise = int(dur * SR); tl_ = int(tail * SR); n = rise + tl_
    noise = rng.standard_normal(n) * 0.5
    f0, f1 = (350, 6500) if up else (6500, 350)
    y = svf_sweep(noise, f0, f1, q=0.75)
    x = np.arange(n) / SR
    amp = np.where(np.arange(n) < rise, (np.arange(n) / rise) ** 2.4,
                   np.exp(-(np.arange(n) - rise) / (0.06 * SR)))
    y = y * amp
    return y / (np.max(np.abs(y)) + 1e-9)

def hit():
    t = tarr(0.7)
    f = 45 + 110 * np.exp(-t * 22)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 6.5)
    click = lp(rng.standard_normal(len(t)), 900) * np.exp(-t * 60) * 0.5
    return body * 0.95 + click

def crack():
    t = tarr(0.09)
    return hp(rng.standard_normal(len(t)), 3500) * np.exp(-t * 55) * 0.6

def tick(freq=3000):
    t = tarr(0.09)
    return np.sin(2 * np.pi * freq * t) * np.exp(-t * 85) * 0.5

def key_click(i):
    t = tarr(0.05)
    f = 1800 + (i * 137 % 900)
    n = hp(rng.standard_normal(len(t)), 3800) * np.exp(-t * 300) * 0.5
    return n + np.sin(2 * np.pi * f * t) * np.exp(-t * 130) * 0.32

def pop(freq0=420, freq1=800):
    t = tarr(0.22)
    f = freq0 + (freq1 - freq0) * (1 - np.exp(-t * 40))
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 20)
    y += 0.25 * np.sin(2 * np.pi * np.cumsum(f * 2) / SR) * np.exp(-t * 35)
    return y * 0.7

def mouse_click():
    t = tarr(0.16)
    down = hp(rng.standard_normal(len(t)), 2500) * np.exp(-t * 400) * 0.55
    down += np.sin(2 * np.pi * 1100 * t) * np.exp(-t * 110) * 0.45
    up = np.zeros_like(t)
    k = int(0.075 * SR)
    up[k:] = (hp(rng.standard_normal(len(t) - k), 3500) * np.exp(-t[: len(t) - k] * 500) * 0.25
              + np.sin(2 * np.pi * 1500 * t[: len(t) - k]) * np.exp(-t[: len(t) - k] * 150) * 0.2)
    return down + up

def count_tone(freq):
    t = tarr(0.16)
    return (np.sin(2 * np.pi * freq * t) + 0.3 * np.sin(2 * np.pi * freq * 2 * t)) * np.exp(-t * 26) * 0.45

def bell(freq, dur=1.4, tau=0.45):
    t = tarr(dur)
    y = (np.sin(2 * np.pi * freq * t) + 0.35 * np.sin(2 * np.pi * freq * 2.76 * t)
         + 0.2 * np.sin(2 * np.pi * freq * 5.4 * t)) * np.exp(-t / tau)
    return y * np.minimum(1, t * 400)

def riser(dur):
    n = int(dur * SR)
    noise = rng.standard_normal(n) * 0.5
    y = svf_sweep(noise, 500, 9000, q=0.5)
    x = np.linspace(0, 1, n)
    t = x * dur
    tone = np.sin(2 * np.pi * np.cumsum(300 * (6 ** x)) / SR) * 0.25
    amp = x ** 2.5
    y = (y / (np.max(np.abs(y)) + 1e-9) * 0.8 + tone) * amp
    return y

def swell(dur):
    total = dur + 1.6
    t = tarr(total)
    y = np.zeros_like(t)
    for f in (midi(57), midi(64), midi(69), midi(72)):
        y += np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 1.004 * t)
    att = np.clip(t / dur, 0, 1) ** 2
    rel = np.exp(-np.maximum(0, t - dur) * 2.6)
    y = lp(y, 2400) * att * rel * 0.13
    nz = hp(rng.standard_normal(len(t)), 4000) * att * rel * 0.05
    return y + nz

def shimmer(dur):
    n = int((dur + 1.0) * SR)
    y = np.zeros(n)
    notes = [81, 84, 88, 91, 93, 96]  # A minor pentatonic-ish bells
    k = int(dur * 14)
    for i in range(k):
        t0 = (i / 14) + rng.uniform(0, 0.05)
        f = midi(notes[rng.integers(len(notes))])
        b = bell(f, 0.7, 0.16) * rng.uniform(0.05, 0.13)
        j = int(t0 * SR)
        y[j:j + len(b)] += b[: n - j]
    return y

# ---------- SFX placement ----------
sfx = np.zeros((2, N))
cue_log = []

def log(kind, t):
    cue_log.append({"kind": kind, "t": round(t, 4)})

for sid, sc in scenes.items():
    t0 = T(sc["start"])
    kind = sc["intro"]
    if kind in ("whoosh", "hit", "flashHit"):
        pre = 0.75 if kind == "whoosh" else 0.5
        w = whoosh(pre, up=True)
        place(sfx, w, t0 - pre - 0.015, 0.55, pan=0.0)
        if kind in ("hit", "flashHit"):
            place(sfx, hit(), t0, 0.85)
            log("hit", t0)
        if kind == "flashHit":
            place(sfx, crack(), t0, 0.7)
        log("cut:" + sid, t0)
    counts = 0
    for e in sc["ev"]:
        te = T(sc["start"] + e["beat"])
        s = e.get("sfx")
        if not s:
            continue
        log(f"{s}:{sid}.{e['name']}", te)
        if s == "swell":
            place(sfx, swell(T(e.get("dur", 2))), te, 0.9)
        elif s == "tick":
            n = 4
            for i in range(n):
                place(sfx, tick(2600 + 380 * i), te + i * T(e.get("dur", 2)) / n, 0.5, pan=(-0.3 + 0.2 * i))
        elif s == "typing":
            n = e["chars"]; d = T(e["dur"])
            for i in range(n):
                jitter = ((i * 2654435761) % 1000) / 1000.0 * 0.012
                place(sfx, key_click(i), te + i * d / n + jitter, 0.55, pan=((i % 5) - 2) * 0.08)
        elif s == "rise":
            place(sfx, riser(T(e["dur"])), te, 0.5)
        elif s == "swoosh":
            d = T(e["dur"])
            place(sfx, whoosh(d * 0.9, up=True, tail=0.18), te + d * 0.1 - 0.015, 0.5, pan=0.1)
        elif s == "tileRun":
            steps = e["steps"]; d = T(e["dur"])
            for i in range(steps):
                place(sfx, pop(520 + 55 * i, 900 + 70 * i), te + i * d / steps, 0.5, pan=((i % 4) - 1.5) * 0.18)
        elif s == "pop":
            place(sfx, pop(), te, 0.8)
        elif s == "click":
            place(sfx, mouse_click(), te, 0.85)
        elif s == "count":
            f = [880, 1046.5, 1318.5][counts % 3]
            counts += 1
            place(sfx, count_tone(f), te, 0.7)
        elif s == "countRun":
            steps = e["steps"]; d = T(e["dur"])
            scale = [69, 72, 74, 76, 79, 81, 84, 86, 88, 91]
            for i in range(steps):
                place(sfx, count_tone(midi(scale[i % len(scale)])), te + i * d / steps, 0.55)
        elif s == "shimmer":
            place(sfx, shimmer(T(e["dur"])), te, 0.9)
        elif s == "chime":
            for i, f in enumerate((880, 1318.5, 1760)):
                place(sfx, bell(f), te + i * 0.07, 0.42, pan=(i - 1) * 0.15)

# ---------- music ----------
music = np.zeros((2, N))
CHORDS = [  # per bar: (bass midi, chord midis)
    (45, [57, 60, 64]),  # Am
    (41, [53, 57, 60]),  # F
    (48, [55, 60, 64]),  # C
    (43, [55, 59, 62]),  # G
]
n_bars = int(TOTAL_BEATS // 4) + 1

def active(beat, ranges):
    return any(a <= beat < b for a, b in ranges)

KICK_ON = [(20, 41), (42, 73)]
HAT_ON = [(20, 41), (44, 73)]
CLAP_ON = [(28, 41), (46, 73)]
ARP_ON = [(8, 80)]
BASS_ON = [(8, 80)]

def pad_note(freq, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = np.zeros(n)
    for det in (-0.006, 0.0, 0.006):
        y += signal.sawtooth(2 * np.pi * freq * (1 + det) * t)
    y = lp(y, 1400)
    a = np.minimum(1, t / 0.9)
    r = np.minimum(1, (dur - t) / 0.9)
    return y * a * r * 0.09

def pluck(freq):
    t = tarr(0.42)
    y = signal.sawtooth(2 * np.pi * freq * t) * 0.6 + np.sin(2 * np.pi * freq * t) * 0.4
    fc = 300 + 5200 * np.exp(-t * 14)
    # cheap time-varying lowpass via crossfade of two static filters
    a = lp(y, 5500, 1); b = lp(y, 500, 2)
    m = np.exp(-t * 14)
    return (a * m + b * (1 - m)) * np.exp(-t * 7) * 0.32

def bass_note(freq, dur):
    t = tarr(dur)
    y = np.sin(2 * np.pi * freq * t) + 0.25 * np.sin(2 * np.pi * freq * 2 * t)
    return y * np.minimum(1, t * 120) * np.minimum(1, (dur - t) * 60) * 0.32

def kick():
    t = tarr(0.42)
    f = 46 + 130 * np.exp(-t * 30)
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)
    y += lp(rng.standard_normal(len(t)), 1500) * np.exp(-t * 120) * 0.3
    return y * 0.85

def hat(open_=False):
    t = tarr(0.16 if open_ else 0.05)
    return hp(rng.standard_normal(len(t)), 7000) * np.exp(-t * (28 if open_ else 110)) * 0.22

def clap():
    t = tarr(0.22)
    y = np.zeros_like(t)
    for d in (0, 0.011, 0.023):
        k = int(d * SR)
        seg = hp(lp(rng.standard_normal(len(t) - k), 3800), 900) * np.exp(-t[: len(t) - k] * 40)
        y[k:] += seg
    return y * 0.30

kick_times = []
for bar in range(n_bars):
    b0 = bar * 4
    if b0 >= TOTAL_BEATS + 1:
        break
    bass, chord = CHORDS[bar % 4]
    # pad: whole bar (+overlap), level ramps through the piece
    lvl = 0.55 if b0 < 8 else (0.8 if b0 < 20 else 1.0)
    if b0 >= 80:
        lvl *= max(0.0, 1 - (b0 - 80) / 5)
    for m in chord:
        place(music, pad_note(midi(m), 4 * BEAT_S + 1.4), T(b0) - 0.2, lvl * 0.9, pan=(m % 3 - 1) * 0.25)
    for step in range(8):  # eighth notes
        bt = b0 + step * 0.5
        if bt >= 84:
            break
        tt = T(bt)
        if active(bt, ARP_ON):
            idx = [0, 1, 2, 1, 0, 2, 1, 2][step]
            note = chord[idx] + (12 if step % 4 == 3 else 0)
            g = 0.5 if bt < 20 else 0.75
            place(music, pluck(midi(note + 12)), tt, g, pan=0.35 if step % 2 else -0.35)
        if active(bt, BASS_ON) and step in (0, 3, 4, 6):
            place(music, bass_note(midi(bass), 0.32), tt, 0.85 if bt >= 20 else 0.55)
    for beat in range(4):
        bt = b0 + beat
        if bt >= 84:
            break
        tt = T(bt)
        if active(bt, KICK_ON):
            place(music, kick(), tt, 0.9)
            kick_times.append(tt)
        if active(bt, CLAP_ON) and beat in (1, 3):
            place(music, clap(), tt, 0.8)
        if active(bt, HAT_ON):
            place(music, hat(False), tt + T(0.5), 0.9)      # off-beat hat
            place(music, hat(False), tt + T(0.25), 0.45)
            place(music, hat(False), tt + T(0.75), 0.45)

# sidechain duck on the tonal layers (approximate: duck everything but kick by re-mixing)
duck = np.ones(N)
tt = np.arange(int(0.45 * SR)) / SR
shape = 0.42 * np.exp(-tt / 0.11)
for k in kick_times:
    i = int(k * SR)
    seg = min(len(shape), N - i)
    if seg > 0:
        duck[i:i + seg] -= shape[:seg]
duck = np.clip(duck, 0.45, 1)
# apply duck to music only where non-kick energy dominates: cheap global duck at 55% depth
music *= (0.45 + 0.55 * duck)[None, :]

# ---------- reverb send ----------
def reverb_ir(sec=2.2, decay=3.2):
    n = int(sec * SR)
    t = np.arange(n) / SR
    ir = np.stack([rng.standard_normal(n), rng.standard_normal(n)]) * np.exp(-t * decay)
    ir = np.stack([lp(ir[0], 5200), lp(ir[1], 5200)])
    ir[:, : int(0.012 * SR)] *= np.linspace(0, 1, int(0.012 * SR))
    return ir / np.sqrt(np.sum(ir ** 2))

IR = reverb_ir()
def reverb(x, wet):
    out = np.zeros_like(x)
    for c in range(2):
        out[c] = signal.fftconvolve(x[c], IR[c])[: x.shape[1]]
    return x + wet * out * 3.0

music = reverb(music, 0.22)
sfx = reverb(sfx, 0.16)

# ---------- master ----------
mix = music * 0.62 + sfx * 1.0
mix = np.tanh(mix * 1.15)
fade = np.ones(N)
fo = int(1.2 * SR)
fade[-fo:] = np.linspace(1, 0, fo)
mix *= fade[None, :]
mix = mix / (np.max(np.abs(mix)) + 1e-9) * 0.9

pcm = (mix.T * 32767).astype(np.int16)
out = f"{root}/out/audio/soundtrack.wav"
with wave.open(out, "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes(pcm.tobytes())
json.dump(cue_log, open(f"{root}/out/audio/cues.json", "w"), indent=1)
print(f"wrote {out}: {N / SR:.2f}s, {len(cue_log)} cues, {TOTAL_BEATS} beats @ {BPM} BPM")
