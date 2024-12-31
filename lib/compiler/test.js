const tokenizer = require('./tokenizer');
const parser = require('./parser');
const traverser = require('./traverser');
const transformer = require('./transformer');
const codeGenerator = require('./codeGenerator');

// Test cases
const testCases = [
  // Variable declaration
  'kudasai x = 42;',
  
  // Function declaration
  'shimasu add(kudasai a, kudasai b) { return a + b; }',
  
  // Function call
  '(add 5 3)',
  
  // More complex example
  `
  shimasu greet(kudasai name) {
    return "Hello, " + name;
  }
  kudasai message = (greet "World");
  `
];

// Create a context for evaluation
const context = {};

// Function to evaluate code and return result
const contextEval = (code) => {
  const contextFunction = new Function('context', `
    with(context) {
      ${code}
      return (function() {
        return {
          x: typeof x !== 'undefined' ? x : undefined,
          add: typeof add !== 'undefined' ? add : undefined,
          message: typeof message !== 'undefined' ? message : undefined,
          greet: typeof greet !== 'undefined' ? greet : undefined
        };
      })();
    }
  `);
  Object.assign(context, contextFunction(context));
  return context;
};

// Test each case
testCases.forEach((input, index) => {
  console.log(`\n=== Test Case ${index + 1}: "${input}" ===\n`);
  
  try {
    // Steps 1-3 remain the same
    console.log('Tokens:');
    const tokens = tokenizer(input);
    console.log(JSON.stringify(tokens, null, 2));
    
    console.log('\nAST:');
    const ast = parser(tokens);
    console.log(JSON.stringify(ast, null, 2));
    
    console.log('\nTransformed AST:');
    const newAst = transformer(ast);
    console.log(JSON.stringify(newAst, null, 2));
    
    // Step 4: Generate Code
    console.log('\nGenerated JavaScript:');
    const output = codeGenerator(newAst);
    console.log(output);
    
    // Step 5: Try running the generated code with context
    console.log('\nExecution Result:');
    try {
      contextEval(output);
      
      // Show relevant results based on the test case
      if (index === 0) {
        console.log('x =', context.x);
      } else if (index === 1) {
        console.log('add function defined:', typeof context.add === 'function');
      } else if (index === 2) {
        console.log('add(5, 3) =', context.add(5, 3));
      } else if (index === 3) {
        console.log('greet("World") =', context.greet("World"));
        console.log('message =', context.message);
      }
    } catch (execError) {
      console.log('Execution error:', execError.message);
    }
    
  } catch (error) {
    console.error('\nCompilation Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(60));
});
