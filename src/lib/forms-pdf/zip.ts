const encoder = new TextEncoder();

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function header(size: number, writer: (view: DataView) => void): Uint8Array {
  const bytes = new Uint8Array(size);
  writer(new DataView(bytes.buffer));
  return bytes;
}

function concat(chunks: Uint8Array[]): Uint8Array {
  const size = chunks.reduce((total, chunk) => total + chunk.length, 0);
  const out = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { out.set(chunk, offset); offset += chunk.length; }
  return out;
}

/** A small, uncompressed ZIP writer suitable for already compressed PDF files. */
export function makeZip(files: Array<{ name: string; bytes: Uint8Array }>): Uint8Array {
  if (!files.length || files.length > 5) throw new Error('ZIP_FILE_COUNT_LIMIT');
  if (files.reduce((total, file) => total + file.bytes.length, 0) > 9 * 1024 * 1024) throw new Error('ZIP_SIZE_LIMIT');
  const local: Uint8Array[] = [];
  const central: Uint8Array[] = [];
  let offset = 0;
  for (const file of files) {
    if (!/^[a-zA-Z0-9._-]{1,120}\.pdf$/.test(file.name)) throw new Error('ZIP_FILENAME_INVALID');
    const name = encoder.encode(file.name);
    const crc = crc32(file.bytes);
    const localHeader = header(30, (view) => {
      view.setUint32(0, 0x04034b50, true);
      view.setUint16(4, 20, true);
      view.setUint16(6, 0x0800, true);
      view.setUint32(14, crc, true);
      view.setUint32(18, file.bytes.length, true);
      view.setUint32(22, file.bytes.length, true);
      view.setUint16(26, name.length, true);
    });
    local.push(localHeader, name, file.bytes);
    const centralHeader = header(46, (view) => {
      view.setUint32(0, 0x02014b50, true);
      view.setUint16(4, 20, true);
      view.setUint16(6, 20, true);
      view.setUint16(8, 0x0800, true);
      view.setUint32(16, crc, true);
      view.setUint32(20, file.bytes.length, true);
      view.setUint32(24, file.bytes.length, true);
      view.setUint16(28, name.length, true);
      view.setUint32(42, offset, true);
    });
    central.push(centralHeader, name);
    offset += localHeader.length + name.length + file.bytes.length;
  }
  const centralBytes = concat(central);
  const end = header(22, (view) => {
    view.setUint32(0, 0x06054b50, true);
    view.setUint16(8, files.length, true);
    view.setUint16(10, files.length, true);
    view.setUint32(12, centralBytes.length, true);
    view.setUint32(16, offset, true);
  });
  return concat([...local, centralBytes, end]);
}
