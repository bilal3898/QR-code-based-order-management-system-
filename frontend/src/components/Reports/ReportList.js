import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReportList = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/reports`);
      setReports(response.data);
    } catch (err) {
      setError('Failed to load reports.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) return <p>Loading reports...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Report List</h2>
      {reports.length === 0 ? (
        <p>No reports found.</p>
      ) : (
        <ul className="space-y-2">
          {reports.map((report) => (
            <li key={report.id} className="p-3 border rounded hover:bg-gray-50 transition">
              <p><strong>Type:</strong> {report.type}</p>
              <p><strong>Generated On:</strong> {new Date(report.generatedAt).toLocaleString()}</p>
              <p><strong>Status:</strong> {report.status}</p>
              {/* Optional: Add download or detail view */}
              {report.downloadUrl && (
                <a
                  href={report.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Download
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReportList;
