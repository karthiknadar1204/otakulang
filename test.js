const tokenizer = require('./tokenizer');

// Sample input
const input = 'kudasai(123, "hello world")';

// Run tokenizer
const tokens = tokenizer(input);

// Print results
console.log(JSON.stringify(tokens, null, 2)); 