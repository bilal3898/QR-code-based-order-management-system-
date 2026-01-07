// frontend/src/components/Table/QRCodeGenerator.js

import React from "react";
import { QRCodeCanvas } from 'qrcode.react';

const QRCodeGenerator = ({ tableId, size = 128 }) => {
  const qrValue = `${window.location.origin}/table/${tableId}`;

  return (
    <div className="flex flex-col items-center">
      <QRCodeCanvas value={qrValue} size={size} />
      <p className="mt-2 text-sm text-gray-600">Scan to access Table {tableId}</p>
    </div>
  );
};

export default QRCodeGenerator;
