const { BadWords } = require('../data/BadWords')

function generateCombinationsFromArray(stringArray, maxLength, minLength) {
    const combinations = [];

    if (!Array.isArray(stringArray)) {
        console.error("Invalid input parameter. Please provide an array of strings.");
        return combinations;
    }

    aLoop: for (let i = 0; i < stringArray.length; i++) {
        let combination = stringArray[i]
        for (let j = i + 1; j < stringArray.length; j++) {
            const nextString = stringArray[j];
            combination += ' ' + nextString;
            if (combination.length > maxLength || combination.length < minLength) {
                continue aLoop
            }
            combinations.push(combination);
        }
    }

    return combinations;
}

function generateSubstrings(inputString, maxLength, minLength) {
    const substrings = [];

    if (typeof inputString !== 'string' || typeof maxLength !== 'number' || typeof minLength !== 'number') {
        console.error("Invalid input parameters");
        return substrings;
    }

    if (inputString.length < 2) {
        console.error("Input string must have a length of 2 or greater");
        return substrings;
    }

    if (maxLength < minLength) {
        console.error("Max length must be greater than or equal to min length");
        return substrings;
    }

    for (let j = 0; j <= inputString.length - minLength; j++) {
        for (let i = minLength; i <= maxLength; i++) {
            const substring = inputString.substring(j, j + i);

            // Check if the first or last character is a space
            if (substring[0] !== ' ' && substring[i - 1] !== ' ') {
                substrings.push(substring);
            }
        }
    }

    return substrings;
}
function removeSpecialCharacter(input, condition) {
    // Create a regular expression pattern using the condition string
    const pattern = new RegExp(`[${condition}]`, 'g');

    // Use the replace method to remove characters based on the pattern
    const result = input.replace(pattern, '');

    return result;
}
async function detectBadWord(str) {
    let data = new BadWords()
    let badWords = await data.getWords('./app/data/bad-words.csv')
    let maxLength = 0
    let minLength = Number.MAX_SAFE_INTEGER
    let wordSet = new Set(badWords)
    let specialCharacters = ' *#'
    for (w of badWords) {
        if (w.length > maxLength) {
            maxLength = w.length
        }
        if (w.length < minLength) {
            minLength = w.length
        }
    }
    const inputString = str.toLowerCase();
    const words = inputString.split(' ')
    // console.log(words);
    for (w of words) { // Check if each word in the string is a bad word.
        if (wordSet.has(removeSpecialCharacter(w, specialCharacters))) {
            // console.log(w)
            return w
        }
    }
    // No bad words were found; generate a substring to check.
    // let substring = generateSubstrings(inputString, maxLength, minLength)
    let substring = generateCombinationsFromArray(words, maxLength, minLength)
    console.dir(substring, { 'maxArrayLength': null });
    let badWordsInSubstring = substring.filter((str, _i, _arr) => {
        return wordSet.has(removeSpecialCharacter(str, specialCharacters))
    })
    let possibleBadWords = []
    aLoop: for (badWord of badWordsInSubstring) {// Remove any potential bad words created by normal words.
        for (word of words) {
            if (word.includes(badWord)) {
                continue aLoop
            }
        }
        possibleBadWords.push(badWord)
    }
    console.log(possibleBadWords)
    if (possibleBadWords.length > 0) {
        return possibleBadWords[0]
    }
    return ""
}

async function main() {
    let result = await detectBadWord(`you are a b i **tch`)
    console.log(result)
}
main()
