function tokenizer(input) {
    let current = 0;
    let tokens = [];
  
    while (current < input.length) {
      let char = input[current];
  
      // Whitespace
      let WHITESPACE = /\s/;
      if (WHITESPACE.test(char)) {
        current++;
        continue;
      }
  
      // Parentheses and braces
      if (char === '(' || char === ')' || char === '{' || char === '}') {
        tokens.push({ type: 'paren', value: char });
        current++;
        continue;
      }
  
      // Numbers
      let NUMBERS = /[0-9]/;
      if (NUMBERS.test(char)) {
        let value = '';
        while (NUMBERS.test(char)) {
          value += char;
          char = input[++current];
        }
        tokens.push({ type: 'number', value });
        continue;
      }
  
      // Strings
      if (char === '"') {
        let value = '';
        char = input[++current];
        while (char !== '"') {
          value += char;
          char = input[++current];
        }
        current++; // skip the closing quote
        tokens.push({ type: 'string', value });
        continue;
      }
  
      // Identifiers and keywords
      let LETTERS = /[a-zA-Z_]/;
      if (LETTERS.test(char)) {
        let value = '';
        while (LETTERS.test(char)) {
          value += char;
          char = input[++current];
        }
        if (value === 'kudasai' || value === 'shimasu' || value === 'return') {
          tokens.push({ type: 'keyword', value });
        } else {
          tokens.push({ type: 'name', value });
        }
        continue;
      }
  
      // Operators
      let OPERATORS = /[=+\-*/><!]/;
      if (OPERATORS.test(char)) {
        let value = char;
        current++;
        // handle == or !=
        if ((value === '=' || value === '!') && input[current] === '=') {
          value += input[current++];
        }
        tokens.push({ type: 'operator', value });
        continue;
      }
  
      // Punctuation
      if (char === ';' || char === ',') {
        tokens.push({ type: 'punctuation', value: char });
        current++;
        continue;
      }
  
      throw new TypeError(`Unknown character: ${char}`);
    }
  
    return tokens;
  }
  
  module.exports = tokenizer;
  