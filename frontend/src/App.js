// frontend/src/App.js
import React, { useState, useEffect } from 'react';

const App = () => {
    const [message, setMessage] = useState('Loading...');
    const [backendUrl, setBackendUrl] = useState('');

    useEffect(() => {
        // Determine the environment
        const isLocal = window.location.hostname === 'localhost';
	    const host = window.location.hostname;

        // Set backend URLs
        const backends = isLocal
            ? ['http://localhost:5000', 'http://localhost:5001'] // Local development URLs
            : [`http://${host}:5000`, `http://${host}:5001`]; //  cloud IPs

        // Pick a backend dynamically
        const randomBackend = backends[Math.floor(Math.random() * backends.length)];
        setBackendUrl(randomBackend);

        // Fetch data from the selected backend
        fetch(randomBackend)
            .then((response) => response.text())
            .then((data) => setMessage(data))
            .catch((error) => setMessage('Error fetching message.'));
    }, []);

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>{message}</h1>
            <p>Fetched from: {backendUrl}</p>
        </div>
    );
};

export default App;
