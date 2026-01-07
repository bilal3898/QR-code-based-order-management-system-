import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

const TextCode = ({ code, label = 'Code' }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      // Modern clipboard API
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(code);
      } 
      // Fallback for older browsers
      else {
        const textArea = document.createElement('textarea');
        textArea.value = code;
        textArea.style.position = 'fixed';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (!successful) {
          throw new Error('Copy failed');
        }
      }

      setIsCopied(true);
      toast.success('Code copied to clipboard!');
      
      // Reset copy state after 2 seconds
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy code');
      console.error('Copy error:', err);
    }
  };

  return (
    <div className="flex items-center justify-between bg-gray-100 p-2 rounded shadow-sm">
      <div>
        <span className="text-sm text-gray-600">{label}:</span>
        <div className="font-mono text-md text-gray-800">{code}</div>
      </div>
      <button
        onClick={handleCopy}
        className={`text-sm ${isCopied ? 'text-green-600' : 'text-blue-600 hover:underline'}`}
        disabled={isCopied}
      >
        {isCopied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
};

TextCode.propTypes = {
  code: PropTypes.string.isRequired,
  label: PropTypes.string,
};

export default TextCode;