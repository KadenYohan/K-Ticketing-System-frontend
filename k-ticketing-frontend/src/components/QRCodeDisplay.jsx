import { QRCodeSVG } from 'qrcode.react';

export default function QRCodeDisplay({ value, size = 200 }) {
  return (
    <div className="qr-code-card" style={{ '--qr-size': `${size}px` }}>
      <QRCodeSVG
        value={value}
        size={size}
        level="H"
        includeMargin={true}
        className="qr-code-svg"
      />
    </div>
  );
}
