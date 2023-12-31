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
    let specialCharacters = ' *#%' // define special character
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
    // console.dir(words, { 'maxArrayLength': null });
    for (w of words) { // Check if each word in the string is a bad word.
        if (wordSet.has(w)) {
            // console.log(w)
            return w
        }
    }
    // No bad words were found; generate a substring to check.
    let substring = generateCombinationsFromArray(words, maxLength * 2, minLength)
    // console.dir(substring, { 'maxArrayLength': null });
    let badWordsInSubstring = substring.filter((str, _i, _arr) => {
        return wordSet.has(removeSpecialCharacter(str, specialCharacters))
    })

    // console.log(badWordsInSubstring)
    // console.log(possibleBadWords)
    if (badWordsInSubstring.length > 0) {
        return badWordsInSubstring[0]
    }
    return ""
}
const testcase = [
    `D o# n*g is a bad word. Pudong s h*it B it#ch not a bad word`,
    `Dingdong bingbong D Do*n g`,
    `you are a b it ch`,
    `pe peee p ee p`,
    `y o u a r e a p i e c e o f s h i#t`
]
async function main() {
    for (test of testcase) {
        let time = new Date()
        let result = await detectBadWord(test)
        let execTime = (new Date()) - time
        console.log(`Result: ${result}, t: ${execTime}ms`)
    }
}
main()
