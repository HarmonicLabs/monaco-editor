// /*---------------------------------------------------------------------------------------------
//  *  Copyright (c) Microsoft Corporation. All rights reserved.
//  *  Licensed under the MIT License. See License.txt in the project root for license information.
//  *--------------------------------------------------------------------------------------------*/

import { testTokenization } from '../test/testRunner';

testTokenization('pebble', [
	// Keywords
	[
		{
			line: 'if (x > 0) { return x; }',
			tokens: [
				{ startIndex: 0, type: 'keyword.ts' }, // 'if'
				{ startIndex: 2, type: '' }, // whitespace
				{ startIndex: 3, type: 'delimiter.parenthesis.ts' }, // '('
				{ startIndex: 4, type: 'identifier.ts' }, // 'x'
				{ startIndex: 5, type: '' }, // whitespace
				{ startIndex: 6, type: 'delimiter.angle.ts' }, // '>'
				{ startIndex: 7, type: '' }, // whitespace
				{ startIndex: 8, type: 'number.ts' }, // '0'
				{ startIndex: 9, type: 'delimiter.parenthesis.ts' }, // ')'
				{ startIndex: 10, type: '' }, // whitespace
				{ startIndex: 11, type: 'delimiter.bracket.ts' }, // '{'
				{ startIndex: 12, type: '' }, // whitespace
				{ startIndex: 13, type: 'keyword.ts' }, // 'return'
				{ startIndex: 19, type: '' }, // whitespace
				{ startIndex: 20, type: 'identifier.ts' }, // 'x'
				{ startIndex: 21, type: 'delimiter.ts' }, // ';'
				{ startIndex: 22, type: '' }, // whitespace
				{ startIndex: 23, type: 'delimiter.bracket.ts' } // '}'
			]
		}
	],

	// Operators
	[
		{
			line: 'x = y + z - 10 * 2 / 5;',
			tokens: [
				{ startIndex: 0, type: 'identifier.ts' }, // 'x'
				{ startIndex: 1, type: '' }, // whitespace
				{ startIndex: 2, type: 'delimiter.ts' }, // '='
				{ startIndex: 3, type: '' }, // whitespace
				{ startIndex: 4, type: 'identifier.ts' }, // 'y'
				{ startIndex: 5, type: '' }, // whitespace
				{ startIndex: 6, type: 'delimiter.ts' }, // '+'
				{ startIndex: 7, type: '' }, // whitespace
				{ startIndex: 8, type: 'identifier.ts' }, // 'z'
				{ startIndex: 9, type: '' }, // whitespace
				{ startIndex: 10, type: 'delimiter.ts' }, // '-'
				{ startIndex: 11, type: '' }, // whitespace
				{ startIndex: 12, type: 'number.ts' }, // '10'
				{ startIndex: 14, type: '' }, // whitespace
				{ startIndex: 15, type: 'delimiter.ts' }, // '*'
				{ startIndex: 16, type: '' }, // whitespace
				{ startIndex: 17, type: 'number.ts' }, // '2'
				{ startIndex: 18, type: '' }, // whitespace
				{ startIndex: 19, type: 'delimiter.ts' }, // '/'
				{ startIndex: 20, type: '' }, // whitespace
				{ startIndex: 21, type: 'number.ts' }, // '5'
				{ startIndex: 22, type: 'delimiter.ts' } // ';'
			]
		}
	],

	// Delimiters
	[
		{
			line: '{ [ ( ) ] }',
			tokens: [
				{ startIndex: 0, type: 'delimiter.bracket.ts' }, // '{'
				{ startIndex: 1, type: '' }, // whitespace
				{ startIndex: 2, type: 'delimiter.square.ts' }, // '['
				{ startIndex: 3, type: '' }, // whitespace
				{ startIndex: 4, type: 'delimiter.parenthesis.ts' }, // '('
				{ startIndex: 5, type: '' }, // whitespace
				{ startIndex: 6, type: 'delimiter.parenthesis.ts' }, // ')'
				{ startIndex: 7, type: '' }, // whitespace
				{ startIndex: 8, type: 'delimiter.square.ts' }, // ']'
				{ startIndex: 9, type: '' }, // whitespace
				{ startIndex: 10, type: 'delimiter.bracket.ts' } // '}'
			]
		}
	],

	// Comments
	[
		{
			line: '// This is a single-line comment',
			tokens: [
				{ startIndex: 0, type: 'comment.ts' } // Entire line
			]
		},
		{
			line: '/* This is a multi-line comment */',
			tokens: [
				{ startIndex: 0, type: 'comment.ts' } // Entire line
			]
		}
	],

	// Strings
	[
		{
			line: 'let str = "Hello, world!";',
			tokens: [
				{ startIndex: 0, type: 'keyword.ts' }, // 'let'
				{ startIndex: 3, type: '' }, // whitespace
				{ startIndex: 4, type: 'identifier.ts' }, // 'str'
				{ startIndex: 7, type: '' }, // whitespace
				{ startIndex: 8, type: 'delimiter.ts' }, // '='
				{ startIndex: 9, type: '' }, // whitespace
				{ startIndex: 10, type: 'string.ts' }, // '"Hello, world!"'
				{ startIndex: 25, type: 'delimiter.ts' } // ';'
			]
		},
		{
			line: "let str = 'Hello, world!';",
			tokens: [
				{ startIndex: 0, type: 'keyword.ts' }, // 'let'
				{ startIndex: 3, type: '' }, // whitespace
				{ startIndex: 4, type: 'identifier.ts' }, // 'str'
				{ startIndex: 7, type: '' }, // whitespace
				{ startIndex: 8, type: 'delimiter.ts' }, // '='
				{ startIndex: 9, type: '' }, // whitespace
				{ startIndex: 10, type: 'string.ts' }, // "'Hello, world!'"
				{ startIndex: 25, type: 'delimiter.ts' } // ';'
			]
		}
	],

	// Numbers
	[
		{
			line: 'const pi = 3.14;',
			tokens: [
				{ startIndex: 0, type: 'keyword.ts' }, // 'const'
				{ startIndex: 5, type: '' }, // whitespace
				{ startIndex: 6, type: 'identifier.ts' }, // 'pi'
				{ startIndex: 8, type: '' }, // whitespace
				{ startIndex: 9, type: 'delimiter.ts' }, // '='
				{ startIndex: 10, type: '' }, // whitespace
				{ startIndex: 11, type: 'number.float.ts' }, // '3.14'
				{ startIndex: 15, type: 'delimiter.ts' } // ';'
			]
		},
		{
			line: 'let count = 123;',
			tokens: [
				{ startIndex: 0, type: 'keyword.ts' }, // 'let'
				{ startIndex: 3, type: '' }, // whitespace
				{ startIndex: 4, type: 'identifier.ts' }, // 'count'
				{ startIndex: 9, type: '' }, // whitespace
				{ startIndex: 10, type: 'delimiter.ts' }, // '='
				{ startIndex: 11, type: '' }, // whitespace
				{ startIndex: 12, type: 'number.ts' }, // '123'
				{ startIndex: 15, type: 'delimiter.ts' } // ';'
			]
		}
	],

	// Folding Markers
	[
		{
			line: '// #region',
			tokens: [
				{ startIndex: 0, type: 'comment.ts' } // Entire line
			]
		},
		{
			line: '// #endregion',
			tokens: [
				{ startIndex: 0, type: 'comment.ts' } // Entire line
			]
		}
	]
]);
