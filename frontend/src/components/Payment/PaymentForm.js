// components/Payment/PaymentForm.js

import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Grid,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { Payment as PaymentIcon } from '@mui/icons-material';
import api from '../../services/api';
import { useParams, useNavigate } from 'react-router-dom';

const PaymentForm = () => {
  const { billId } = useParams();
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [transactionId, setTransactionId] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (billId) {
      fetchBill();
    }
  }, [billId]);

  const fetchBill = async () => {
    try {
      const response = await api.get(`/bills/${billId}`);
      setBill(response.data);
    } catch (error) {
      console.error('Error fetching bill:', error);
      const errorMsg = error.response?.data?.description || error.message || 'Failed to fetch bill';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!bill) return;

    setProcessing(true);
    setError(null);

    try {
      if (paymentMethod === 'razorpay') {
        // Create Razorpay order
        const razorpayResponse = await api.post('/payments/create-razorpay-order', {
          amount: bill.final_amount,
          currency: 'INR',
          receipt: `bill_${billId}`
        });

        // In a real implementation, you would open Razorpay checkout here
        // For now, we'll just process the payment directly
        alert('Razorpay integration: Open Razorpay checkout in production');
        
        // After successful Razorpay payment, verify it
        // await api.post('/payments/verify-razorpay', {
        //   payment_id: razorpayPaymentId,
        //   order_id: razorpayOrderId,
        //   signature: razorpaySignature,
        //   bill_id: billId,
        //   amount: bill.final_amount
        // });
      } else if (paymentMethod === 'stripe') {
        // Create Stripe payment intent
        const stripeResponse = await api.post('/payments/create-stripe-intent', {
          amount: bill.final_amount,
          currency: 'usd',
          metadata: { bill_id: billId }
        });

        // In a real implementation, you would use Stripe.js here
        alert('Stripe integration: Open Stripe checkout in production');
      } else {
        // Process cash/card/UPI payment
        const response = await api.post('/payments/process', {
          bill_id: billId,
          order_id: bill.order_id,
          amount: bill.final_amount,
          payment_method: paymentMethod,
          transaction_id: transactionId || undefined
        });

        alert('Payment processed successfully!');
        navigate('/bills');
      }
    } catch (error) {
      console.error('Payment error:', error);
      const errorMsg = error.response?.data?.description || error.message || 'Payment failed';
      setError(errorMsg);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!bill) {
    return (
      <Container>
        <Alert severity="error">Bill not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <PaymentIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          <Typography variant="h4" gutterBottom>
            Payment
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Bill ID: #{billId}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Total Amount
              </Typography>
              <Typography variant="h5" color="primary">
                ₹{bill.final_amount}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label="Payment Method"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <MenuItem value="cash">Cash</MenuItem>
              <MenuItem value="card">Card</MenuItem>
              <MenuItem value="upi">UPI</MenuItem>
              <MenuItem value="razorpay">Razorpay (Online)</MenuItem>
              <MenuItem value="stripe">Stripe (Online)</MenuItem>
            </TextField>
          </Grid>

          {(paymentMethod === 'card' || paymentMethod === 'upi') && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Transaction ID (Optional)"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Enter transaction reference"
              />
            </Grid>
          )}

          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handlePayment}
              disabled={processing}
              sx={{ py: 1.5 }}
            >
              {processing ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Processing...
                </>
              ) : (
                `Pay ₹${bill.final_amount}`
              )}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default PaymentForm;

