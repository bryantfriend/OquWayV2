export function buildWavePoints(values, options) {
  var safeOptions = options && typeof options === "object" ? options : {};
  var width = readNumber(safeOptions.width, 600);
  var height = readNumber(safeOptions.height, 180);
  var frequency = readNumber(values && values.frequency, 5);
  var amplitude = readNumber(values && values.amplitude, 5);
  var points = [];
  var step = 18;
  var x = 0;

  while (x <= width) {
    points.push(readWavePoint(x, width, height, frequency, amplitude));
    x = x + step;
  }

  points.push(readWavePoint(width, width, height, frequency, amplitude));

  return points.map(function (point) {
    return point.x + "," + point.y;
  }).join(" ");
}

function readWavePoint(x, width, height, frequency, amplitude) {
  var centerY = height / 2;
  var normalizedAmplitude = Math.max(0.08, Math.min(1, amplitude / 10));
  var waveHeight = normalizedAmplitude * (height * 0.38);
  var cycles = Math.max(0.5, frequency / 2.2);
  var radians = (x / width) * Math.PI * 2 * cycles;

  return {
    x: Math.round(x),
    y: Math.round(centerY - Math.sin(radians) * waveHeight)
  };
}

function readNumber(value, fallbackValue) {
  var number = Number(value);

  return Number.isFinite(number) ? number : fallbackValue;
}
