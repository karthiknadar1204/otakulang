const tokenizer = require('./tokenizer');

const input = 'kudasai(123, "hello world")';

const tokens = tokenizer(input);

console.log(JSON.stringify(tokens, null, 2));
