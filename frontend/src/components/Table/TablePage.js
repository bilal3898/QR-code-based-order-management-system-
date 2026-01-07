// src/components/Table/TablePage.js

import React from "react";
import { useParams } from "react-router-dom";
import QRCodeScanner from "./QRCodeScanner";

const TablePage = () => {
  const { tableId } = useParams();

  return (
    <div>
      <h2>Welcome to Table {tableId}</h2>
      <QRCodeScanner tableId={tableId} />
    </div>
  );
};

export default TablePage;
