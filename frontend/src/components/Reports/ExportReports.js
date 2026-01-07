// src/components/Reports/ExportReports.js

import React, { useState } from 'react';
import axios from 'axios';

const ExportReports = () => {
  const [exporting, setExporting] = useState(false);
  const [format, setFormat] = useState('csv');

  const handleExport = async () => {
    try {
      setExporting(true);
      const response = await axios.get(`/api/reports/export?format=${format}`, {
        responseType: 'blob', // Important for file download
      });

      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting report:', error);
      alert('Failed to export the report.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="export-reports">
      <h3>Export Reports</h3>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <select value={format} onChange={(e) => setFormat(e.target.value)}>
          <option value="csv">CSV</option>
          <option value="pdf">PDF</option>
          {/* Add more formats as needed */}
        </select>

        <button onClick={handleExport} disabled={exporting}>
          {exporting ? 'Exporting...' : `Export as ${format.toUpperCase()}`}
        </button>
      </div>
    </div>
  );
};

export default ExportReports;
