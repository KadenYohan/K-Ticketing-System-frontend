import * as React from 'react';

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
}

// Deterministic pseudo-QR based on value string
function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function QRCode({ value, size = 200, className = '' }: QRCodeProps) {
  const cells = 21;
  const cellSize = size / cells;
  const hash = hashStr(value);

  const isFixed = (r: number, c: number) => {
    // Top-left finder
    if (r < 8 && c < 8) return true;
    // Top-right finder
    if (r < 8 && c >= cells - 8) return true;
    // Bottom-left finder
    if (r >= cells - 8 && c < 8) return true;
    return false;
  };

  const drawFinderPattern = (ox: number, oy: number, key: string) => (
    <g key={key}>
      <rect x={ox} y={oy} width={cellSize * 7} height={cellSize * 7} fill="#0f172a" rx={2} />
      <rect x={ox + cellSize} y={oy + cellSize} width={cellSize * 5} height={cellSize * 5} fill="white" rx={1} />
      <rect x={ox + cellSize * 2} y={oy + cellSize * 2} width={cellSize * 3} height={cellSize * 3} fill="#0f172a" rx={1} />
    </g>
  );

  const modules: React.JSX.Element[] = [];
  for (let r = 0; r < cells; r++) {
    for (let c = 0; c < cells; c++) {
      if (isFixed(r, c)) continue;
      const bit = (hashStr(`${value}-${r}-${c}`) + hash) % 7;
      if (bit < 4) {
        modules.push(
          <rect
            key={`${r}-${c}`}
            x={c * cellSize}
            y={r * cellSize}
            width={cellSize}
            height={cellSize}
            fill="#0f172a"
          />
        );
      }
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      style={{ background: 'white', borderRadius: 8, padding: 8, boxSizing: 'content-box' }}
    >
      <rect width={size} height={size} fill="white" />
      {modules}
      {drawFinderPattern(0, 0, 'tl')}
      {drawFinderPattern((cells - 7) * cellSize, 0, 'tr')}
      {drawFinderPattern(0, (cells - 7) * cellSize, 'bl')}
    </svg>
  );
}
