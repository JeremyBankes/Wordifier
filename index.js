const express = require('express');
const wordify = require('./wordifier.js');

const PORT = 80;

const app = express();

app.use(express.json());
app.use(express.static('public'));

app.post('/wordify', (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const message = req.body.message;
    if (message.split(' ').length > 20) {
        wordify(message, (result) => {
            res.json({ content: 'Please keep your messages shorter than 20 words as to not work the Thesaurus API too hard.' });
        });
    } else {
        wordify(message, (result) => {
            console.log(`Translated "${message}" to "${result}" for ${ip}`);
            res.json({ content: result });
        });
    }
});

app.listen(PORT, () => console.log(`Server now listening on port ${PORT}`));