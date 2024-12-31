const tokenizer = require('./tokenizer');
const parser = require('./parser');
const traverser = require('./traverser');

// Test cases
const testCases = [
  // Variable declaration
  'kudasai x = 42;',
  
  // Function declaration
  'shimasu add(kudasai a, kudasai b) { return a + b; }',
  
  // Function call
  '(add 5 3)',
];

// Create a visitor object to track node visits
const visitor = {
  Program: {
    enter(node, parent) {
      console.log('Entering Program node');
    },
    exit(node, parent) {
      console.log('Exiting Program node');
    }
  },
  
  NumberLiteral: {
    enter(node, parent) {
      console.log(`Found number: ${node.value}`);
    }
  },
  
  StringLiteral: {
    enter(node, parent) {
      console.log(`Found string: "${node.value}"`);
    }
  },
  
  VariableDeclaration: {
    enter(node, parent) {
      console.log(`Found variable declaration: ${node.name}`);
    }
  },
  
  FunctionDeclaration: {
    enter(node, parent) {
      console.log(`Found function declaration: ${node.name.name}`);
    }
  },
  
  CallExpression: {
    enter(node, parent) {
      console.log(`Found function call: ${node.callee.name}`);
    }
  }
};

// Test each case
testCases.forEach((input, index) => {
  console.log(`\n=== Test Case ${index + 1}: "${input}" ===\n`);
  
  try {
    // Step 1: Tokenize
    console.log('Tokens:');
    const tokens = tokenizer(input);
    console.log(JSON.stringify(tokens, null, 2));
    
    // Step 2: Parse
    console.log('\nAST:');
    const ast = parser(tokens);
    console.log(JSON.stringify(ast, null, 2));
    
    // Step 3: Traverse
    console.log('\nTraversal:');
    traverser(ast, visitor);
    
  } catch (error) {
    console.error('\nError:', error.message);
  }
  
  console.log('\n' + '='.repeat(60));
});
