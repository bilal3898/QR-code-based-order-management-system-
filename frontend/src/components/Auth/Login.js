import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(formData);
      if (response.token) {
        localStorage.setItem('token', response.token);
        navigate('/dashboard');
      } else {
        setError('Login failed: No token received');
      }
    } catch (err) {
      console.error(err);
      setError(err.error || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '80px auto', padding: '24px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', backgroundColor: 'white' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', textAlign: 'center' }}>Login</h2>
      {error && (
        <div style={{ marginBottom: '16px', color: 'red' }}>
          {typeof error === 'string' ? error : JSON.stringify(error)}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', marginTop: '4px' }}
            required
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', marginTop: '4px' }}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', backgroundColor: '#2563eb', color: 'white', padding: '8px', borderRadius: '4px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1 }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <a href="/register" style={{ color: '#2563eb', textDecoration: 'underline' }}>
            Don't have an account? Register
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;
