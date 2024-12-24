const tokenizer = require('./tokenizer');
const parser = require('./parser');

// Test cases
const testCases = [
  // Variable declaration
  'kudasai x = 42;',
  
  // Function declaration
  'shimasu add(kudasai a, kudasai b) { return a + b; }',
  
  // Function call
  '(add 5 3)',
  
  // String and number literals
  'kudasai greeting = "Hello World";',
  'kudasai number = 123;'
];

// Test each case
testCases.forEach((input, index) => {
  console.log(`\nTest Case ${index + 1}: "${input}"`);
  
  try {
    // First tokenize
    const tokens = tokenizer(input);
    console.log('\nTokens:');
    console.log(JSON.stringify(tokens, null, 2));
    
    // Then parse
    const ast = parser(tokens);
    console.log('\nAST:');
    console.log(JSON.stringify(ast, null, 2));
  } catch (error) {
    console.error('\nError:', error.message);
  }
  
  console.log('\n' + '-'.repeat(50));
});
