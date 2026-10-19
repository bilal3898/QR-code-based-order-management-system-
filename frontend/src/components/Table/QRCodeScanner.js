import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QrReader } from "react-qr-reader";
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { Camera, ArrowBack } from '@mui/icons-material';

const QRCodeScanner = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(true);
  const [scannedData, setScannedData] = useState(null);

  const handleScan = (data) => {
    if (data && data.text) {
      setScanning(false);
      setScannedData(data.text);
      console.log("QR Code Scanned:", data.text);

      // Parse the QR code data (expected format: "Table-1" or table ID)
      const tableMatch = data.text.match(/table[-\s]?(\d+)/i);
      if (tableMatch) {
        const tableId = tableMatch[1];
        navigate(`/menu?table=${tableId}`);
      } else {
        // If it's just a table number
        const tableId = data.text.replace(/\D/g, '');
        if (tableId) {
          navigate(`/menu?table=${tableId}`);
        } else {
          setError("Invalid QR code format. Please scan a table QR code.");
          setScanning(true);
        }
      }
    }
  };

  const handleError = (err) => {
    console.error("QR Scan Error:", err);
    setError("Failed to access camera. Please ensure camera permissions are granted.");
  };

  const handleRescan = () => {
    setScanning(true);
    setScannedData(null);
    setError(null);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/login')}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h5" component="h1" sx={{ flexGrow: 1 }}>
            Scan QR Code
          </Typography>
        </Box>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Scan the QR code at your table to view the digital menu and place orders
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {!scanning && scannedData && (
          <Alert severity="success" sx={{ mb: 3 }}>
            QR Code scanned successfully! Redirecting to menu...
          </Alert>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          {scanning ? (
            <Box sx={{ position: 'relative', width: '100%', maxWidth: 400 }}>
              <QrReader
                onResult={(result, error) => {
                  if (result?.text) handleScan(result);
                  if (error) handleError(error);
                }}
                constraints={{ facingMode: "environment" }}
                videoContainerStyle={{ width: '100%' }}
                videoStyle={{ width: '100%', borderRadius: '8px' }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  bgcolor: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  p: 2,
                  borderRadius: 1,
                  textAlign: 'center'
                }}
              >
                <Camera sx={{ fontSize: 48, mb: 1 }} />
                <Typography variant="body2">
                  Position QR code within frame
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress sx={{ mb: 2 }} />
              <Typography variant="body1">
                Processing...
              </Typography>
            </Box>
          )}
        </Box>

        {!scanning && (
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button
              variant="outlined"
              onClick={handleRescan}
              startIcon={<Camera />}
            >
              Scan Again
            </Button>
          </Box>
        )}

        <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Instructions:</strong>
            <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
              <li>Allow camera access when prompted</li>
              <li>Point your camera at the table QR code</li>
              <li>Hold steady until the code is recognized</li>
              <li>You'll be automatically redirected to the menu</li>
            </ul>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default QRCodeScanner;
