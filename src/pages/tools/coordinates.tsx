import React, { useState } from 'react';
import Layout from '@theme/Layout';

export default function CoordinatesPage() {
    const [coordinates, setCoordinates] = useState<string>('');
    const [verificationResult, setVerificationResult] = useState<string | null>(null);

    const verifyCoordinates = () => {
        const url = `https://www.geocaching.com/api/proxy/web/v1/geography/VerifyCoordinateString?input=${encodeURIComponent(coordinates)}`;
        window.open(url, '_blank');
    };

    return (
        <Layout title="Coordinates Verification Tool">
            <div className="container">
                <h1>Coordinates Verification Tool</h1>
                <div>
                    <input
                        type="text"
                        value={coordinates}
                        onChange={(e) => setCoordinates(e.target.value)}
                        placeholder="Enter coordinates (e.g., 36.009400, 129.323933)"
                        className="form-input"
                    />
                    <button onClick={verifyCoordinates} className="button button--primary">
                        Verify
                    </button>
                </div>
                <p className="margin-top--md">
                    Click Verify to see the result in a new tab.
                </p>
            </div>
        </Layout>
    );
} 