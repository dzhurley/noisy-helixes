import canvasSketch from 'canvas-sketch';
import random from 'canvas-sketch-util/random';
import math from 'canvas-sketch-util/math';

const colors = [
  '#8e9858',
  '#acb866',
  '#bfd375',
  '#b3d983',
  '#a5df91',
  '#94e59f',
  '#7febad',
  '#63f1ba',
  '#55e7bd',
  '#50d7bb',
];

const brushWidth = 1;
const maxAmp = 64;

const sketch = ({ context, width, height }) => {

  context.fillStyle = '#002b36';
  context.fillRect(0, 0, width, height);

  let lastTime = null;
  let xOffset = width / 2;
  let yOffset = 0;
  let length = 50;
  let color = random.pick(colors);

  return ({ playhead, time }) => {
    if (lastTime === null || lastTime > time) {
      xOffset = random.range(50, width - 50);
      yOffset = random.range(50, height - 50);
      length = random.range(80, 200);
      color = random.pick(colors);
      random.permuteNoise();
    }
    lastTime = time;

    const amp = math.mapRange(playhead, 0, 1, -maxAmp, maxAmp);
    const noiseFactor = (playhead % (1 / colors.length)) * 32;
    const noise = random.noise1D(noiseFactor, 0.5, amp);

    context.beginPath();
    context.ellipse(
      Math.abs(noise) * (playhead < 0.5 ? 1 : -1) + xOffset,
      (Math.floor(length * playhead * colors.length) % length) + yOffset,
      brushWidth,
      brushWidth,
      0,
      0,
      Math.PI * 2,
    );
    context.fillStyle = color;
    context.fill();
  };
};

canvasSketch(sketch, {
  animate: true,
  duration: colors.length * 1.5,
});
