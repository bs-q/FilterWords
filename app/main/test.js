function generateCombinationsFromArray(stringArray) {
    const combinations = [];

    if (!Array.isArray(stringArray)) {
        console.error("Invalid input parameter. Please provide an array of strings.");
        return combinations;
    }

    for (let i = 0; i < stringArray.length; i++) {
        const currentString = stringArray[i];

        if (typeof currentString !== 'string') {
            console.error("Invalid array element. All elements in the array must be strings.");
            continue;
        }

        for (let j = i + 1; j < stringArray.length; j++) {
            const nextString = stringArray[j];
            const combination = currentString + nextString;
            combinations.push(combination);
        }
    }

    return combinations;
}

// Example usage:
const stringArray = ["Hello", "World", "123"];
const resultCombinations = generateCombinationsFromArray(stringArray);
console.log(resultCombinations);
