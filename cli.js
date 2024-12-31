#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const compiler = require('./lib/compiler/compiler');

// Capture CLI arguments, e.g.: `otk-run file.otk`
const args = process.argv.slice(2);

if (args.length < 1) {
  console.error('Usage: otk-run <yourFile.otk>');
  process.exit(1);
}

const inputFile = args[0];
if (!fs.existsSync(inputFile)) {
  console.error(`File not found: ${inputFile}`);
  process.exit(1);
}

// Read the .otk file
const inputCode = fs.readFileSync(inputFile, 'utf8');

// Compile the code
let compiledCode;
try {
  compiledCode = compiler(inputCode);
} catch (error) {
  console.error('Compilation Error:', error.message);
  process.exit(1);
}

// Execute the compiled JavaScript code
// (in a controlled environment, you might do something more secure)
try {
  // We'll inject a "result" variable if the user sets it
  // Then return it at the end
  const func = new Function(compiledCode + '\nreturn typeof result !== "undefined"? result : "No result defined";');
  const result = func();
  console.log('Program Output:', result);
} catch (runErr) {
  console.error('Runtime Error:', runErr.message);
  process.exit(1);
}
