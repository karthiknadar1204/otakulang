const traverser = require('./traverser');

function transformer(ast) {
  let newAst = {
    type: 'Program',
    body: []
  };

  // Visitor pattern for transforming nodes
  const visitor = {
    Program: {
      enter(node, parent) {
        // Program node already has context
      }
    },
    BlockStatement: {
      enter(node, parent) {
        return {
          type: 'BlockStatement',
          body: node.body.map(transformNode)
        };
      }
    },
    FunctionDeclaration: {
      enter(node, parent) {
        const declaration = {
          type: 'FunctionDeclaration',
          id: transformNode(node.name),
          params: node.params.map(transformNode),
          body: transformNode(node.body)
        };
        newAst.body.push(declaration);
      }
    },
    ReturnStatement: {
      enter(node, parent) {
        return {
          type: 'ReturnStatement',
          argument: transformNode(node.argument)
        };
      }
    },
    VariableDeclaration: {
      enter(node, parent) {
        const declaration = {
          type: 'VariableDeclaration',
          declarations: [{
            type: 'VariableDeclarator',
            id: { type: 'Identifier', name: node.name },
            init: transformNode(node.value)
          }],
          kind: 'let'
        };
        newAst.body.push(declaration);
      }
    },
    CallExpression: {
      enter(node, parent) {
        const expression = {
          type: 'CallExpression',
          callee: transformNode(node.callee),
          arguments: node.arguments.map(transformNode)
        };

        if (parent.type === 'Program') {
          newAst.body.push({
            type: 'ExpressionStatement',
            expression
          });
        }
        return expression;
      }
    }
  };

  traverser(ast, visitor);
  return newAst;
}

function transformNode(node) {
  if (!node) return null;

  switch (node.type) {
    case 'NumberLiteral':
      return {
        type: 'NumericLiteral',
        value: node.value
      };
    case 'StringLiteral':
      return {
        type: 'StringLiteral',
        value: node.value
      };
    case 'Identifier':
      return {
        type: 'Identifier',
        name: node.name
      };
    case 'BinaryExpression':
      return {
        type: 'BinaryExpression',
        operator: node.operator,
        left: transformNode(node.left),
        right: transformNode(node.right)
      };
    case 'BlockStatement':
      return {
        type: 'BlockStatement',
        body: node.body.map(transformNode)
      };
    default:
      return node;
  }
}

module.exports = transformer;
