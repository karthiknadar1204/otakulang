function codeGenerator(node) {
    switch (node.type) {
      case 'Program':
        return node.body.map(codeGenerator).join('\n');
  
      case 'ExpressionStatement':
        return codeGenerator(node.expression) + ';';
  
      case 'CallExpression':
        return codeGenerator(node.callee) +
          '(' +
          node.arguments.map(codeGenerator).join(', ') +
          ')';
  
      case 'VariableDeclaration':
        return node.kind + ' ' +
          node.declarations.map(codeGenerator).join(', ') + ';';
  
      case 'VariableDeclarator':
        return codeGenerator(node.id) + ' = ' + codeGenerator(node.init);
  
      case 'FunctionDeclaration':
        return 'function ' + codeGenerator(node.id) + '(' +
          node.params.map(codeGenerator).join(', ') + ') ' +
          codeGenerator(node.body);
  
      case 'BlockStatement':
        return '{\n' + node.body.map(codeGenerator).join('\n') + '\n}';
  
      case 'ReturnStatement':
        return 'return ' + codeGenerator(node.argument) + ';';
  
      case 'Identifier':
        return node.name;
  
      case 'NumericLiteral':
        return node.value;
  
      case 'StringLiteral':
        return '"' + node.value + '"';
  
      case 'BinaryExpression':
        return codeGenerator(node.left) + ' ' + node.operator + ' ' + codeGenerator(node.right);
  
      default:
        throw new TypeError('Unknown node type: ' + node.type);
    }
  }
  
  module.exports = codeGenerator;
  