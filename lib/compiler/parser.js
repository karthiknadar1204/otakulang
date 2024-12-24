function parser(tokens) {
    let current = 0;
  
    function walk() {
      let token = tokens[current];
  
      // NumberLiteral
      if (token.type === 'number') {
        current++;
        return { type: 'NumberLiteral', value: token.value };
      }
  
      // StringLiteral
      if (token.type === 'string') {
        current++;
        return { type: 'StringLiteral', value: token.value };
      }
  
      // VariableDeclaration: kudasai name = value;
      if (token.type === 'keyword' && token.value === 'kudasai') {
        current++;
        let nameToken = tokens[current];
        if (nameToken.type !== 'name') throw new TypeError('Expected variable name');
        let name = nameToken.value;
        current++;
  
        let eqToken = tokens[current];
        if (!eqToken || eqToken.type !== 'operator' || eqToken.value !== '=') {
          throw new TypeError('Expected "=" after variable name');
        }
        current++;
  
        let value = walk();
  
        let maybeSemi = tokens[current];
        if (maybeSemi && maybeSemi.type === 'punctuation' && maybeSemi.value === ';') {
          current++;
        }
  
        return { type: 'VariableDeclaration', name, value };
      }
  
      // FunctionDeclaration: shimasu funcName(kudasai a, kudasai b) { ... }
      if (token.type === 'keyword' && token.value === 'shimasu') {
        current++;
        let funcNameToken = tokens[current];
        if (funcNameToken.type !== 'name') {
          throw new TypeError('Expected function name after "shimasu"');
        }
        let funcName = { type: 'Identifier', name: funcNameToken.value };
        current++;
  
        let openParen = tokens[current];
        if (!openParen || openParen.type !== 'paren' || openParen.value !== '(') {
          throw new TypeError('Expected "(" after function name');
        }
        current++;
  
        let params = [];
        let nextToken = tokens[current];
        while (nextToken && !(nextToken.type === 'paren' && nextToken.value === ')')) {
          if (nextToken.type === 'keyword' && nextToken.value === 'kudasai') {
            current++;
            let paramNameToken = tokens[current];
            if (paramNameToken.type !== 'name') throw new TypeError('Expected parameter name');
            params.push({ type: 'Identifier', name: paramNameToken.value });
            current++;
            let commaCheck = tokens[current];
            if (commaCheck && commaCheck.type === 'punctuation' && commaCheck.value === ',') {
              current++;
            }
          } else {
            throw new TypeError('Expected "kudasai" before parameter name');
          }
          nextToken = tokens[current];
        }
        current++; // skip the closing parent ")"
  
        let openBrace = tokens[current];
        if (!openBrace || openBrace.type !== 'paren' || openBrace.value !== '{') {
          throw new TypeError('Expected "{" for function body');
        }
        current++;
  
        let body = [];
        let bodyToken = tokens[current];
        while (bodyToken && !(bodyToken.type === 'paren' && bodyToken.value === '}')) {
          body.push(walk());
          bodyToken = tokens[current];
        }
        current++; // skip closing brace
  
        return {
          type: 'FunctionDeclaration',
          name: funcName,
          params,
          body: {
            type: 'BlockStatement',
            body,
          },
        };
      }
  
      // ReturnStatement: (return expression);
      if (token.type === 'keyword' && token.value === 'return') {
        current++;
        let argument = walk();
        let maybeSemi = tokens[current];
        if (maybeSemi && maybeSemi.type === 'punctuation' && maybeSemi.value === ';') {
          current++;
        }
        return { type: 'ReturnStatement', argument };
      }
  
      // CallExpression: (funcName arg1 arg2)
      if (token.type === 'paren' && token.value === '(') {
        current++;
        let nameToken = tokens[current];
        if (nameToken.type !== 'name') {
          throw new TypeError('Expected function name after "("');
        }
        let callee = { type: 'Identifier', name: nameToken.value };
        current++;
  
        let args = [];
        let nxt = tokens[current];
        while (nxt && !(nxt.type === 'paren' && nxt.value === ')')) {
          args.push(walk());
          nxt = tokens[current];
        }
        current++; // skip closing parent ")"
  
        return { type: 'CallExpression', callee, arguments: args };
      }
  
      // Identifiers, Numbers, Strings might form binary expressions
      if (token.type === 'name' || token.type === 'number' || token.type === 'string') {
        let node;
        if (token.type === 'name') {
          node = { type: 'Identifier', name: token.value };
        } else if (token.type === 'number') {
          node = { type: 'NumberLiteral', value: token.value };
        } else {
          node = { type: 'StringLiteral', value: token.value };
        }
        current++;
  
        // check next token for possible binary operator
        let nextToken = tokens[current];
        if (nextToken && nextToken.type === 'operator') {
          let operator = nextToken.value;
          current++;
          let right = walk();
          return {
            type: 'BinaryExpression',
            operator,
            left: node,
            right,
          };
        }
  
        return node;
      }
  
      throw new TypeError('Unknown token: ' + JSON.stringify(token));
    }
  
    let ast = {
      type: 'Program',
      body: [],
    };
  
    while (current < tokens.length) {
      ast.body.push(walk());
    }
  
    return ast;
  }
  
module.exports = parser;
  