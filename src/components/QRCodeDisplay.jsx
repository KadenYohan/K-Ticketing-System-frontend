import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function QRCodeDisplay({ value, size = 200 }) {
  return (
    <div style={{ background: '#fff', padding: '16px', display: 'inline-block', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <QRCodeSVG value={value} size={size} level="H" includeMargin={true} />
    </div>
  );
}