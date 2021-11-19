const express = require('express');
const path = require("path");
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3001;

app.use(express.static('./client/dist'));

app.get('/', (_req, res) => {
    const index = fs.readFileSync(path.join(__dirname, '../client/dist/index.html'));
    res.contentType("text/html");
    res.send(index);
});

app.listen(port, () => {
    console.log(`Up at port ${port}`);
});