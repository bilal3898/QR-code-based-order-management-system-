import React, { useState } from "react";
import { QrReader } from "react-qr-reader";

const QRCodeScanner = ({ onScanSuccess, tableId }) => {
  const [error, setError] = useState(null);

  console.log("Current table ID:", tableId); // Access tableId here

  const handleScan = (data) => {
    if (data) {
      onScanSuccess(data, tableId); // You can also pass tableId with scanned data
    }
  };

  const handleError = (err) => {
    console.error("QR Scan Error:", err);
    setError("Failed to scan the QR code. Please try again.");
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Scan QR Code</h3>
      <div className="w-full max-w-sm">
        <QrReader
          onResult={(result, error) => {
            if (result?.text) handleScan(result.text);
            if (error) handleError(error);
          }}
          constraints={{ facingMode: "environment" }}
          style={{ width: "100%" }}
        />
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default QRCodeScanner;
