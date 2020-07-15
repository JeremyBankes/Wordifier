const https = require('https');

const URL = `https://tuna.thesaurus.com/pageData/`;

function replaceWord(word, callback) {
    word = word.replace(/[^A-Za-z]/, '');
    https.get(`${URL}${word}`, (res) => {
        let data = []
        res.on("data", (chunk) => data.push(chunk));
        res.on("end", () => {
            let json = JSON.parse(Buffer.concat(data));
            if (json.data) {
                let synonyms = json.data.definitionData.definitions.reduce((accumulator, value) => {
                    value.synonyms.forEach(synonym => {
                        if (synonym.similarity === '100') accumulator.push(synonym.term)
                    });
                    return accumulator;
                }, []);
                if (synonyms.length == 0) {
                    callback(word);
                } else {
                    callback(synonyms.sort((a, b) => b.length - a.length)[0]);
                }
            } else {
                callback(word);
            }
        });
    });
}

function wordify(phrase, callback) {
    let words = phrase.split(" ");
    let counter = 0;
    let count = words.length;
    for (let i = 0; i < words.length; i++) {
        replaceWord(words[i], (newWord) => {
            words[i] = words[i].replace(/[A-Za-z]+/, newWord);
            counter++;
            if (counter == count) callback(words.join(' '));
        });
    }
}

module.exports = wordify;