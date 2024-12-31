const tokenizer = require('./tokenizer');
const parser = require('./parser');
const transformer = require('./transformer');
const codeGenerator = require('./codeGenerator');

function compiler(input) {
  const tokens = tokenizer(input);
  const ast = parser(tokens);
  const newAst = transformer(ast);
  const output = codeGenerator(newAst);
  return output;
}

module.exports = compiler;
