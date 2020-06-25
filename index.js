var fs = require('fs');
const https = require('https');
const { join } = require('path');

const URL = `https://tuna.thesaurus.com/pageData/`;

let phrase = "How are you this fine day?";

wordify(phrase, (newPhrase) => {
    console.log(newPhrase);
});

function replaceWord(word, callback) {
    word = word.replace(/[^A-Za-z]/, '');
    https.get(`${URL}${word}`, (res) => {
        console.log(res.statusCode);
        let data = []
        res.on("data", (chunk) => {
            data.push(chunk);
        });
        res.on("end", () => {
            let json = JSON.parse(Buffer.concat(data));
            if (json.data) {
                let synonyms = json.data.definitionData.definitions.reduce((accumulator, value) => {
                    value.synonyms.forEach(synonym => accumulator.push(synonym.term));
                    return accumulator;
                }, []);
                // callback(synonyms.sort((a, b) => a.length - b.length)[0]);
                callback(synonyms[Math.floor(Math.random() * synonyms.length)]);
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