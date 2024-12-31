function traverser(ast, visitor) {
    function traverseArray(array, parent) {
      for (const child of array) {
        traverseNode(child, parent);
      }
    }
  
    function traverseNode(node, parent) {
      let methods = visitor[node.type];
  
      methods?.enter?.(node, parent);
  
      switch (node.type) {
        case 'Program':
          traverseArray(node.body, node);
          break;
        case 'FunctionDeclaration':
          traverseArray(node.params, node);
          traverseNode(node.body, node);
          break;
        case 'BlockStatement':
          traverseArray(node.body, node);
          break;
        case 'VariableDeclaration':
          traverseNode(node.value, node);
          break;
        case 'ReturnStatement':
          traverseNode(node.argument, node);
          break;
        case 'CallExpression':
          traverseNode(node.callee, node);
          for (const arg of node.arguments) {
            traverseNode(arg, node);
          }
          break;
        case 'BinaryExpression':
          traverseNode(node.left, node);
          traverseNode(node.right, node);
          break;
        case 'Identifier':
        case 'NumberLiteral':
        case 'StringLiteral':
          // no children
          break;
        default:
          throw new TypeError(node.type);
      }
  
      methods?.exit?.(node, parent);
    }
  
    traverseNode(ast, null);
  }
  
  module.exports = traverser;
  