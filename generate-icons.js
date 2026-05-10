const fs = require('fs');
const path = require('path');

function createMinimalPNG(width, height, r, g, b) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  function crc32(buf) {
    let crc = -1;
    for (let i = 0; i < buf.length; i++) {
      crc ^= buf[i];
      for (let j = 0; j < 8; j++) {
        crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
      }
    }
    return (crc ^ -1) >>> 0;
  }

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const typeData = Buffer.concat([Buffer.from(type), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(typeData));
    return Buffer.concat([len, typeData, crc]);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;

  const rawData = [];
  for (let y = 0; y < height; y++) {
    rawData.push(0);
    for (let x = 0; x < width; x++) {
      rawData.push(r, g, b);
    }
  }

  const idatData = Buffer.from(rawData);
  const { deflateSync } = require('zlib');
  const compressed = deflateSync(idatData);

  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

const assetsDir = path.join(__dirname, 'assets');

const icon = createMinimalPNG(1024, 1024, 255, 107, 53);
fs.writeFileSync(path.join(assetsDir, 'icon.png'), icon);

const adaptive = createMinimalPNG(1024, 1024, 255, 107, 53);
fs.writeFileSync(path.join(assetsDir, 'adaptive-icon.png'), adaptive);

const splash = createMinimalPNG(1284, 2778, 255, 255, 255);
fs.writeFileSync(path.join(assetsDir, 'splash.png'), splash);

const favicon = createMinimalPNG(48, 48, 255, 107, 53);
fs.writeFileSync(path.join(assetsDir, 'favicon.png'), favicon);

console.log('Icons generated successfully!');
