const fs = require('node:fs')

class BadWords {
    getWords(path) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, 'utf8', (err, data) => {
                if (err) {
                    console.error(err);
                    resolve([]); // Resolving with an empty array in case of an error
                    return;
                }
                const words = data.split('\n');
                resolve(words);
            });
        });
    }
}
module.exports.BadWords = BadWords

