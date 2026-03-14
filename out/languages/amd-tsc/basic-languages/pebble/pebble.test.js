/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "../test/testRunner"], function (require, exports, testRunner_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    (0, testRunner_1.testTokenization)('pebble', [
        // Keywords
        [
            {
                line: 'if (x > 0) { return x; }',
                tokens: [
                    { startIndex: 0, type: 'keyword.pebble' }, // 'if'
                    { startIndex: 2, type: '' }, // whitespace
                    { startIndex: 3, type: 'delimiter.parenthesis.pebble' }, // '('
                    { startIndex: 4, type: 'identifier.pebble' }, // 'x'
                    { startIndex: 5, type: '' }, // whitespace
                    { startIndex: 6, type: 'delimiter.angle.pebble' }, // '>'
                    { startIndex: 7, type: '' }, // whitespace
                    { startIndex: 8, type: 'number.pebble' }, // '0'
                    { startIndex: 9, type: 'delimiter.parenthesis.pebble' }, // ')'
                    { startIndex: 10, type: '' }, // whitespace
                    { startIndex: 11, type: 'delimiter.bracket.pebble' }, // '{'
                    { startIndex: 12, type: '' }, // whitespace
                    { startIndex: 13, type: 'keyword.pebble' }, // 'return'
                    { startIndex: 19, type: '' }, // whitespace
                    { startIndex: 20, type: 'identifier.pebble' }, // 'x'
                    { startIndex: 21, type: 'delimiter.pebble' }, // ';'
                    { startIndex: 22, type: '' }, // whitespace
                    { startIndex: 23, type: 'delimiter.bracket.pebble' } // '}'
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
                    { startIndex: 6, type: 'identifier.pebble' }, // 'x'
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
        // Uppercase identifiers as types
        [
            {
                line: 'let x: PubKeyHash = owner;',
                tokens: [
                    { startIndex: 0, type: 'keyword.pebble' }, // 'let'
                    { startIndex: 3, type: '' },
                    { startIndex: 4, type: 'identifier.pebble' }, // 'x'
                    { startIndex: 5, type: 'delimiter.pebble' }, // ':'
                    { startIndex: 6, type: '' },
                    { startIndex: 7, type: 'type.identifier.pebble' }, // 'PubKeyHash'
                    { startIndex: 17, type: '' },
                    { startIndex: 18, type: 'delimiter.pebble' }, // '='
                    { startIndex: 19, type: '' },
                    { startIndex: 20, type: 'identifier.pebble' }, // 'owner'
                    { startIndex: 25, type: 'delimiter.pebble' } // ';'
                ]
            }
        ],
        // Operators
        [
            {
                line: 'x = y + z - 10 * 2 / 5;',
                tokens: [
                    { startIndex: 0, type: 'identifier.pebble' }, // 'x'
                    { startIndex: 1, type: '' }, // whitespace
                    { startIndex: 2, type: 'delimiter.pebble' }, // '='
                    { startIndex: 3, type: '' }, // whitespace
                    { startIndex: 4, type: 'identifier.pebble' }, // 'y'
                    { startIndex: 5, type: '' }, // whitespace
                    { startIndex: 6, type: 'delimiter.pebble' }, // '+'
                    { startIndex: 7, type: '' }, // whitespace
                    { startIndex: 8, type: 'identifier.pebble' }, // 'z'
                    { startIndex: 9, type: '' }, // whitespace
                    { startIndex: 10, type: 'delimiter.pebble' }, // '-'
                    { startIndex: 11, type: '' }, // whitespace
                    { startIndex: 12, type: 'number.pebble' }, // '10'
                    { startIndex: 14, type: '' }, // whitespace
                    { startIndex: 15, type: 'delimiter.pebble' }, // '*'
                    { startIndex: 16, type: '' }, // whitespace
                    { startIndex: 17, type: 'number.pebble' }, // '2'
                    { startIndex: 18, type: '' }, // whitespace
                    { startIndex: 19, type: 'delimiter.pebble' }, // '/'
                    { startIndex: 20, type: '' }, // whitespace
                    { startIndex: 21, type: 'number.pebble' }, // '5'
                    { startIndex: 22, type: 'delimiter.pebble' } // ';'
                ]
            }
        ],
        // Delimiters
        [
            {
                line: '{ [ ( ) ] }',
                tokens: [
                    { startIndex: 0, type: 'delimiter.bracket.pebble' }, // '{'
                    { startIndex: 1, type: '' }, // whitespace
                    { startIndex: 2, type: 'delimiter.square.pebble' }, // '['
                    { startIndex: 3, type: '' }, // whitespace
                    { startIndex: 4, type: 'delimiter.parenthesis.pebble' }, // '('
                    { startIndex: 5, type: '' }, // whitespace
                    { startIndex: 6, type: 'delimiter.parenthesis.pebble' }, // ')'
                    { startIndex: 7, type: '' }, // whitespace
                    { startIndex: 8, type: 'delimiter.square.pebble' }, // ']'
                    { startIndex: 9, type: '' }, // whitespace
                    { startIndex: 10, type: 'delimiter.bracket.pebble' } // '}'
                ]
            }
        ],
        // Comments
        [
            {
                line: '// This is a single-line comment',
                tokens: [
                    { startIndex: 0, type: 'comment.pebble' } // Entire line
                ]
            },
            {
                line: '/* This is a multi-line comment */',
                tokens: [
                    { startIndex: 0, type: 'comment.pebble' } // Entire line
                ]
            }
        ],
        // Strings
        [
            {
                line: 'let str = "Hello, world!";',
                tokens: [
                    { startIndex: 0, type: 'keyword.pebble' }, // 'let'
                    { startIndex: 3, type: '' }, // whitespace
                    { startIndex: 4, type: 'identifier.pebble' }, // 'str'
                    { startIndex: 7, type: '' }, // whitespace
                    { startIndex: 8, type: 'delimiter.pebble' }, // '='
                    { startIndex: 9, type: '' }, // whitespace
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
                    { startIndex: 5, type: '' }, // whitespace
                    { startIndex: 6, type: 'identifier.pebble' }, // 'pi'
                    { startIndex: 8, type: '' }, // whitespace
                    { startIndex: 9, type: 'delimiter.pebble' }, // '='
                    { startIndex: 10, type: '' }, // whitespace
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
        ],
        // Built-in type keywords
        [
            {
                line: 'let a: bool = true;',
                tokens: [
                    { startIndex: 0, type: 'keyword.pebble' }, // 'let'
                    { startIndex: 3, type: '' },
                    { startIndex: 4, type: 'identifier.pebble' }, // 'a'
                    { startIndex: 5, type: 'delimiter.pebble' }, // ':'
                    { startIndex: 6, type: '' },
                    { startIndex: 7, type: 'type.identifier.pebble' }, // 'bool'
                    { startIndex: 11, type: '' },
                    { startIndex: 12, type: 'delimiter.pebble' }, // '='
                    { startIndex: 13, type: '' },
                    { startIndex: 14, type: 'keyword.pebble' }, // 'true'
                    { startIndex: 18, type: 'delimiter.pebble' } // ';'
                ]
            }
        ]
    ]);
});
//# sourceMappingURL=pebble.test.js.map