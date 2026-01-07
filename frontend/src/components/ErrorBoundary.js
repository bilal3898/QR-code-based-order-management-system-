import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
          <h1 style={{ color: '#d32f2f' }}>Something went wrong</h1>
          <p style={{ color: '#666', margin: '10px 0' }}>{this.state.error?.toString()}</p>
          <details style={{ margin: '20px 0', textAlign: 'left', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
            <summary style={{ cursor: 'pointer', color: '#2563eb' }}>Error Details</summary>
            <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px', overflow: 'auto' }}>
              {this.state.error?.stack || this.state.error?.toString()}
            </pre>
          </details>
          <button 
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.href = '/login';
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Go to Login
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

