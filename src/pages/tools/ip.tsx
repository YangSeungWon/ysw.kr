import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';

export default function IPPage() {
  const [ipAddress, setIpAddress] = useState<string | null>(null);

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => setIpAddress(data.ip))
      .catch(error => console.error('Error fetching IP:', error));
  }, []);

  return (
    <Layout title="IP Address Tool">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1>IP Address Tool</h1>
        {ipAddress ? (
          <p>Your public IP address is: <b>{ipAddress}</b></p>
        ) : (
          <p>Loading IP address...</p>
        )}
      </div>
    </Layout>
  );
}