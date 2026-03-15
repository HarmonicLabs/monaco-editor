/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization('pebble', [
	// Control keywords (purple)
	[
		{
			line: 'if (x > 0) { return x; }',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.pebble' }, // 'if'
				{ startIndex: 2, type: '' }, // whitespace
				{ startIndex: 3, type: 'delimiter.parenthesis.pebble' }, // '('
				{ startIndex: 4, type: 'identifier.pebble' }, // 'x'
				{ startIndex: 5, type: '' }, // whitespace
				{ startIndex: 6, type: 'delimiter.pebble' }, // '>'
				{ startIndex: 7, type: '' }, // whitespace
				{ startIndex: 8, type: 'number.pebble' }, // '0'
				{ startIndex: 9, type: 'delimiter.parenthesis.pebble' }, // ')'
				{ startIndex: 10, type: '' }, // whitespace
				{ startIndex: 11, type: 'delimiter.bracket.pebble' }, // '{'
				{ startIndex: 12, type: '' }, // whitespace
				{ startIndex: 13, type: 'keyword.control.pebble' }, // 'return'
				{ startIndex: 19, type: '' }, // whitespace
				{ startIndex: 20, type: 'identifier.pebble' }, // 'x'
				{ startIndex: 21, type: 'delimiter.pebble' }, // ';'
				{ startIndex: 22, type: '' }, // whitespace
				{ startIndex: 23, type: 'delimiter.bracket.pebble' } // '}'
			]
		}
	],

	// Const declarations — variable gets identifier.constant
	[
		{
			line: 'const n = 10;',
			tokens: [
				{ startIndex: 0, type: 'keyword.pebble' }, // 'const'
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'identifier.constant.pebble' }, // 'n'
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'delimiter.pebble' }, // '='
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'number.pebble' }, // '10'
				{ startIndex: 12, type: 'delimiter.pebble' } // ';'
			]
		}
	],

	// Let declarations — variable gets identifier
	[
		{
			line: 'let result = 0;',
			tokens: [
				{ startIndex: 0, type: 'keyword.pebble' }, // 'let'
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.pebble' }, // 'result'
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'delimiter.pebble' }, // '='
				{ startIndex: 12, type: '' },
				{ startIndex: 13, type: 'number.pebble' }, // '0'
				{ startIndex: 14, type: 'delimiter.pebble' } // ';'
			]
		}
	],

	// Comparison operators
	[
		{
			line: 'i <= n',
			tokens: [
				{ startIndex: 0, type: 'identifier.pebble' }, // 'i'
				{ startIndex: 1, type: '' },
				{ startIndex: 2, type: 'delimiter.pebble' }, // '<='
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'identifier.pebble' } // 'n'
			]
		}
	],

	// Control keyword: trace
	[
		{
			line: 'trace result;',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.pebble' }, // 'trace'
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'identifier.pebble' }, // 'result'
				{ startIndex: 12, type: 'delimiter.pebble' } // ';'
			]
		}
	],

	// Control keyword: for
	[
		{
			line: 'for( let i = 0; i <= n; i++ ) {',
			tokens: [
				{ startIndex: 0, type: 'keyword.control.pebble' }, // 'for'
				{ startIndex: 3, type: 'delimiter.parenthesis.pebble' }, // '('
				{ startIndex: 4, type: '' },
				{ startIndex: 5, type: 'keyword.pebble' }, // 'let'
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'identifier.pebble' }, // 'i'
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'delimiter.pebble' }, // '='
				{ startIndex: 12, type: '' },
				{ startIndex: 13, type: 'number.pebble' }, // '0'
				{ startIndex: 14, type: 'delimiter.pebble' }, // ';'
				{ startIndex: 15, type: '' },
				{ startIndex: 16, type: 'identifier.pebble' }, // 'i'
				{ startIndex: 17, type: '' },
				{ startIndex: 18, type: 'delimiter.pebble' }, // '<='
				{ startIndex: 20, type: '' },
				{ startIndex: 21, type: 'identifier.pebble' }, // 'n'
				{ startIndex: 22, type: 'delimiter.pebble' }, // ';'
				{ startIndex: 23, type: '' },
				{ startIndex: 24, type: 'identifier.pebble' }, // 'i'
				{ startIndex: 25, type: 'delimiter.pebble' }, // '++'
				{ startIndex: 27, type: '' },
				{ startIndex: 28, type: 'delimiter.parenthesis.pebble' }, // ')'
				{ startIndex: 29, type: '' },
				{ startIndex: 30, type: 'delimiter.bracket.pebble' } // '{'
			]
		}
	],

	// Built-in types get type.identifier
	[
		{
			line: 'const x: int = 0;',
			tokens: [
				{ startIndex: 0, type: 'keyword.pebble' }, // 'const'
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'identifier.constant.pebble' }, // 'x'
				{ startIndex: 7, type: 'delimiter.pebble' }, // ':'
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'type.identifier.pebble' }, // 'int'
				{ startIndex: 12, type: '' },
				{ startIndex: 13, type: 'delimiter.pebble' }, // '='
				{ startIndex: 14, type: '' },
				{ startIndex: 15, type: 'number.pebble' }, // '0'
				{ startIndex: 16, type: 'delimiter.pebble' } // ';'
			]
		}
	],

	// Function declarations
	[
		{
			line: 'function fibonacci(n: int): int {',
			tokens: [
				{ startIndex: 0, type: 'keyword.pebble' }, // 'function'
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'entity.name.function.pebble' }, // 'fibonacci'
				{ startIndex: 18, type: 'delimiter.parenthesis.pebble' }, // '('
				{ startIndex: 19, type: 'identifier.pebble' }, // 'n'
				{ startIndex: 20, type: 'delimiter.pebble' }, // ':'
				{ startIndex: 21, type: '' },
				{ startIndex: 22, type: 'type.identifier.pebble' }, // 'int'
				{ startIndex: 25, type: 'delimiter.parenthesis.pebble' }, // ')'
				{ startIndex: 26, type: 'delimiter.pebble' }, // ':'
				{ startIndex: 27, type: '' },
				{ startIndex: 28, type: 'type.identifier.pebble' }, // 'int'
				{ startIndex: 31, type: '' },
				{ startIndex: 32, type: 'delimiter.bracket.pebble' } // '{'
			]
		}
	],

	// Contract method declarations
	[
		{
			line: 'spend ownerAllowsIt(redeemer: MyRedeemer) {',
			tokens: [
				{ startIndex: 0, type: 'keyword.pebble' }, // 'spend'
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'entity.name.function.pebble' }, // 'ownerAllowsIt'
				{ startIndex: 19, type: 'delimiter.parenthesis.pebble' }, // '('
				{ startIndex: 20, type: 'identifier.pebble' }, // 'redeemer'
				{ startIndex: 28, type: 'delimiter.pebble' }, // ':'
				{ startIndex: 29, type: '' },
				{ startIndex: 30, type: 'type.identifier.pebble' }, // 'MyRedeemer'
				{ startIndex: 40, type: 'delimiter.parenthesis.pebble' }, // ')'
				{ startIndex: 41, type: '' },
				{ startIndex: 42, type: 'delimiter.bracket.pebble' } // '{'
			]
		}
	],

	// Comments
	[
		{
			line: '// This is a single-line comment',
			tokens: [{ startIndex: 0, type: 'comment.pebble' }]
		},
		{
			line: '/* This is a multi-line comment */',
			tokens: [{ startIndex: 0, type: 'comment.pebble' }]
		}
	],

	// Strings
	[
		{
			line: 'let str = "Hello, world!";',
			tokens: [
				{ startIndex: 0, type: 'keyword.pebble' }, // 'let'
				{ startIndex: 3, type: '' },
				{ startIndex: 4, type: 'identifier.pebble' }, // 'str'
				{ startIndex: 7, type: '' },
				{ startIndex: 8, type: 'delimiter.pebble' }, // '='
				{ startIndex: 9, type: '' },
				{ startIndex: 10, type: 'string.pebble' }, // '"Hello, world!"'
				{ startIndex: 25, type: 'delimiter.pebble' } // ';'
			]
		}
	],

	// Numbers
	[
		{
			line: 'const pi = 3.14;',
			tokens: [
				{ startIndex: 0, type: 'keyword.pebble' }, // 'const'
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'identifier.constant.pebble' }, // 'pi'
				{ startIndex: 8, type: '' },
				{ startIndex: 9, type: 'delimiter.pebble' }, // '='
				{ startIndex: 10, type: '' },
				{ startIndex: 11, type: 'number.float.pebble' }, // '3.14'
				{ startIndex: 15, type: 'delimiter.pebble' } // ';'
			]
		}
	],

	// Contract param
	[
		{
			line: 'param owner: PubKeyHash;',
			tokens: [
				{ startIndex: 0, type: 'keyword.pebble' }, // 'param'
				{ startIndex: 5, type: '' },
				{ startIndex: 6, type: 'identifier.pebble' }, // 'owner'
				{ startIndex: 11, type: 'delimiter.pebble' }, // ':'
				{ startIndex: 12, type: '' },
				{ startIndex: 13, type: 'type.identifier.pebble' }, // 'PubKeyHash'
				{ startIndex: 23, type: 'delimiter.pebble' } // ';'
			]
		}
	]
]);
