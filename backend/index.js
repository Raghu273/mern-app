const express = require('express');
const os = require('os');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());

app.get('/', (req, res) => {
    const hostname = os.hostname();
    res.send(`Hi this is from ${hostname}, Raghu!!!`);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
