// src/components/Reports/ReportDashboard.js

import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const ReportDashboard = () => {
  const [salesReport, setSalesReport] = useState(null);
  const [inventoryStatus, setInventoryStatus] = useState(null);
  const [feedbackSummary, setFeedbackSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [salesRes, inventoryRes, feedbackRes] = await Promise.all([
          api.get('/reports/sales'),
          api.get('/reports/inventory'),
          api.get('/reports/feedback'),
        ]);

        setSalesReport(salesRes.data);
        setInventoryStatus(inventoryRes.data);
        setFeedbackSummary(feedbackRes.data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) return <div>Loading report data...</div>;

  return (
    <div className="report-dashboard">
      <h2>Report Dashboard</h2>

      <div className="report-section">
        <h3>Sales Report</h3>
        {salesReport && !salesReport.error ? (
          <ul>
            <li>Total Orders: {salesReport.total_orders || 0}</li>
            <li>Total Revenue: ₹{salesReport.total_revenue?.toFixed(2) || '0.00'}</li>
            {salesReport.start_date && (
              <li>Start Date: {salesReport.start_date}</li>
            )}
            {salesReport.end_date && (
              <li>End Date: {salesReport.end_date}</li>
            )}
          </ul>
        ) : (
          <p>No sales data available.</p>
        )}
      </div>

      <div className="report-section">
        <h3>Inventory Status</h3>
        {inventoryStatus && Array.isArray(inventoryStatus) && inventoryStatus.length > 0 ? (
          <ul>
            {inventoryStatus.map((item, index) => (
              <li key={index}>
                {item.item_name} - {item.quantity} {item.unit} 
                {item.quantity <= item.reorder_level && (
                  <span style={{ color: 'red', marginLeft: '10px' }}>
                    (Low Stock - Reorder Level: {item.reorder_level})
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No inventory data available.</p>
        )}
      </div>

      <div className="report-section">
        <h3>Customer Feedback Summary</h3>
        {feedbackSummary && !feedbackSummary.error ? (
          <ul>
            <li>Total Feedbacks: {feedbackSummary.total_feedbacks || 0}</li>
            <li>Feedbacks with Rating: {feedbackSummary.feedbacks_with_rating || 0}</li>
            <li>Average Rating: {feedbackSummary.average_rating ? feedbackSummary.average_rating.toFixed(2) : 'N/A'}</li>
            {feedbackSummary.rating_distribution && Object.keys(feedbackSummary.rating_distribution).length > 0 && (
              <li>
                Rating Distribution:
                <ul>
                  {Object.entries(feedbackSummary.rating_distribution).map(([rating, count]) => (
                    <li key={rating}>{rating} stars: {count}</li>
                  ))}
                </ul>
              </li>
            )}
          </ul>
        ) : (
          <p>No feedback data available.</p>
        )}
      </div>
    </div>
  );
};

export default ReportDashboard;
