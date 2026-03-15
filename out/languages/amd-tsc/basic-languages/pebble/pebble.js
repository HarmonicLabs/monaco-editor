/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "../../fillers/monaco-editor-core"], function (require, exports, monaco_editor_core_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.language = exports.conf = void 0;
    exports.conf = {
        wordPattern: /(-?\d*\.\d\w*)|([^\`\@\~\!\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/,
        comments: {
            lineComment: '//',
            blockComment: ['/*', '*/']
        },
        brackets: [
            ['{', '}'],
            ['${', '}'],
            ['[', ']'],
            ['(', ')']
        ],
        onEnterRules: [
            {
                // e.g. /** | */
                beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
                afterText: /^\s*\*\/$/,
                action: {
                    indentAction: monaco_editor_core_1.languages.IndentAction.IndentOutdent,
                    appendText: ' * '
                }
            },
            {
                // e.g. /** ...|
                beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
                action: {
                    indentAction: monaco_editor_core_1.languages.IndentAction.None,
                    appendText: ' * '
                }
            },
            {
                // e.g.  * ...|
                beforeText: /^(\t|(\ \ ))*\ \*(\ ([^\*]|\*(?!\/))*)?$/,
                previousLineText: /^(?=^(\s*(\/\*\*|\*)).*)(?=(?!(\s*\*\/)))/,
                action: {
                    indentAction: monaco_editor_core_1.languages.IndentAction.None,
                    appendText: '* '
                }
            },
            {
                // e.g.  */|
                beforeText: /^(\t|[ ])*[ ]\*\/\s*$/,
                action: {
                    indentAction: monaco_editor_core_1.languages.IndentAction.None,
                    removeText: 1
                }
            },
            {
                // e.g.  *-----*/|
                beforeText: /^(\t|[ ])*[ ]\*[^/]*\*\/\s*$/,
                action: {
                    indentAction: monaco_editor_core_1.languages.IndentAction.None,
                    removeText: 1
                }
            },
            {
                // e.g.  *-----*/|
                beforeText: /^\s*(\bcase\s.+:|\bdefault:)$/,
                afterText: /^(?!\s*(\bcase\b|\bdefault\b))/,
                action: {
                    indentAction: monaco_editor_core_1.languages.IndentAction.Indent
                }
            },
            {
                // Decrease indentation after single line if/else if/else, for, or while
                previousLineText: /^\s*(((else ?)?if|for|while)\s*\(.*\)\s*|else\s*)$/,
                // But make sure line doesn't have braces or is not another if statement
                beforeText: /^\s+([^{i\s]|i(?!f\b))/,
                action: {
                    indentAction: monaco_editor_core_1.languages.IndentAction.Outdent
                }
            },
            {
                // Indent when pressing enter from inside ()
                beforeText: /^.*\([^)]*$/,
                afterText: /^\s*\).*$/,
                action: {
                    indentAction: monaco_editor_core_1.languages.IndentAction.IndentOutdent,
                    appendText: '\t'
                }
            },
            {
                // Indent when pressing enter from inside {}
                beforeText: /^.*\{[^}]*$/,
                afterText: /^\s*\}.*$/,
                action: {
                    indentAction: monaco_editor_core_1.languages.IndentAction.IndentOutdent,
                    appendText: '\t'
                }
            },
            {
                // Indent when pressing enter from inside []
                beforeText: /^.*\[[^\]]*$/,
                afterText: /^\s*\].*$/,
                action: {
                    indentAction: monaco_editor_core_1.languages.IndentAction.IndentOutdent,
                    appendText: '\t'
                }
            },
            {
                // Add // when pressing enter from inside line comment
                beforeText: /(?<!\\)(?<!\w:)\/\/.*/,
                afterText: /^(?!\s*$).+/,
                action: {
                    indentAction: monaco_editor_core_1.languages.IndentAction.None,
                    appendText: '// '
                }
            }
        ],
        autoClosingPairs: [
            { open: '{', close: '}' },
            { open: '[', close: ']' },
            { open: '(', close: ')' },
            { open: "'", close: "'", notIn: ['string', 'comment'] },
            { open: '`', close: '`', notIn: ['string', 'comment'] },
            { open: '"', close: '"', notIn: ['string'] },
            { open: '/**', close: ' */', notIn: ['string'] }
        ],
        surroundingPairs: [
            { open: '{', close: '}' },
            { open: '[', close: ']' },
            { open: '(', close: ')' },
            { open: "'", close: "'" },
            { open: '"', close: '"' },
            { open: '`', close: '`' }
        ],
        colorizedBracketPairs: [
            ['{', '}'],
            ['[', ']'],
            ['(', ')']
        ],
        autoCloseBefore: ';:.,=}])>` \n\t',
        folding: {
            markers: {
                start: new RegExp('^\\s*//\\s*#?region\\b'),
                end: new RegExp('^\\s*//\\s*#?endregion\\b')
            }
        },
        indentationRules: {
            decreaseIndentPattern: new RegExp('^\\s*[\\}\\]\\)].*$'),
            increaseIndentPattern: new RegExp('^.*(\\{[^}]*|\\([^)]*|\\[[^\\]]*)$'),
            // e.g.  * ...| or */| or *-----*/|
            unIndentedLinePattern: new RegExp('^(\\t|[ ])*[ ]\\*[^/]*\\*/\\s*$|^(\\t|[ ])*[ ]\\*/\\s*$|^(\\t|[ ])*\\*([ ]([^\\*]|\\*(?!/))*)?$'),
            indentNextLinePattern: new RegExp('^((.*=>\\s*)|((.*[^\\w]+|\\s*)(if|while|for)\\s*\\(.*\\)\\s*))$')
        }
    };
    exports.language = {
        // Set defaultToken to invalid to see what you do not tokenize yet
        defaultToken: 'invalid',
        tokenPostfix: '.pebble',
        controlKeywords: [
            'if', 'else', 'for', 'while', 'break', 'continue',
            'return', 'match', 'trace', 'fail', 'assert', 'as'
        ],
        keywords: [
            'const', 'let', 'var', 'function', 'struct', 'type', 'enum',
            'import', 'export', 'from', 'extends', 'true', 'false',
            'param', 'contract', 'spend', 'mint', 'certify', 'withdraw',
            'propose', 'vote', 'context'
        ],
        typeKeywords: ['int', 'bool', 'boolean', 'bytes', 'string', 'void', 'data'],
        operators: [
            '<=',
            '>=',
            '==',
            '!=',
            '===',
            '!==',
            '=>',
            '+',
            '-',
            '**',
            '*',
            '/',
            '%',
            '++',
            '--',
            '<<',
            '</',
            '>>',
            '>>>',
            '&',
            '|',
            '^',
            '!',
            '~',
            '&&',
            '||',
            '??',
            '?',
            ':',
            '=',
            '+=',
            '-=',
            '*=',
            '**=',
            '/=',
            '%=',
            '<<=',
            '>>=',
            '>>>=',
            '&=',
            '|=',
            '^=',
            '@',
            '<',
            '>'
        ],
        // we include these common regular expressions
        symbols: /[=><!~?:&|+\-*\/\^%]+/,
        escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
        digits: /\d+(_+\d+)*/,
        octaldigits: /[0-7]+(_+[0-7]+)*/,
        binarydigits: /[0-1]+(_+[0-1]+)*/,
        hexdigits: /[[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,
        // The main tokenizer for our languages
        tokenizer: {
            root: [[/[{}]/, 'delimiter.bracket'], { include: 'common' }],
            common: [
                // function declarations: function name(...)
                [/(function)(\s+)([a-z_$][\w$]*)/, ['keyword', '', 'entity.name.function']],
                // contract method declarations: spend methodName(...)
                [
                    /(spend|mint|certify|withdraw|propose|vote)(\s+)([a-z_$][\w$]*)/,
                    ['keyword', '', 'entity.name.function']
                ],
                // contract param declarations: param name
                [/(param)(\s+)([a-z_$][\w$]*)/, ['keyword', '', 'identifier']],
                // const declarations: const name — gets constant identifier token
                [/(const)(\s+)([a-z_$][\w$]*)/, ['keyword', '', 'identifier.constant']],
                // let/var declarations: let name
                [/(let|var)(\s+)([a-z_$][\w$]*)/, ['keyword', '', 'identifier']],
                // identifiers and keywords
                [
                    /#?[a-z_$][\w$]*/,
                    {
                        cases: {
                            '@typeKeywords': 'type.identifier',
                            '@controlKeywords': 'keyword.control',
                            '@keywords': 'keyword',
                            '@default': 'identifier'
                        }
                    }
                ],
                [/[A-Z][\w\$]*/, 'type.identifier'],
                // whitespace
                { include: '@whitespace' },
                // delimiters and operators
                [/[()\[\]]/, '@brackets'],
                [/!(?=([^=]|$))/, 'delimiter'],
                [
                    /@symbols/,
                    {
                        cases: {
                            '@operators': 'delimiter',
                            '@default': ''
                        }
                    }
                ],
                // numbers
                [/(@digits)[eE]([\-+]?(@digits))?/, 'number.float'],
                [/(@digits)\.(@digits)([eE][\-+]?(@digits))?/, 'number.float'],
                [/0[xX](@hexdigits)n?/, 'number.hex'],
                [/0[oO]?(@octaldigits)n?/, 'number.octal'],
                [/0[bB](@binarydigits)n?/, 'number.binary'],
                [/(@digits)n?/, 'number'],
                // delimiter: after number because of .\d floats
                [/[;,.]/, 'delimiter'],
                // strings
                [/"([^"\\]|\\.)*$/, 'string.invalid'], // non-teminated string
                [/'([^'\\]|\\.)*$/, 'string.invalid'], // non-teminated string
                [/"/, 'string', '@string_double'],
                [/'/, 'string', '@string_single'],
                [/`/, 'string', '@string_backtick']
            ],
            whitespace: [
                [/[ \t\r\n]+/, ''],
                [/\/\*\*(?!\/)/, 'comment.doc', '@jsdoc'],
                [/\/\*/, 'comment', '@comment'],
                [/\/\/.*$/, 'comment']
            ],
            comment: [
                [/[^\/*]+/, 'comment'],
                [/\*\//, 'comment', '@pop'],
                [/[\/*]/, 'comment']
            ],
            jsdoc: [
                [/[^\/*]+/, 'comment.doc'],
                [/\*\//, 'comment.doc', '@pop'],
                [/[\/*]/, 'comment.doc']
            ],
            string_double: [
                [/[^\\"]+/, 'string'],
                [/@escapes/, 'string.escape'],
                [/\\./, 'string.escape.invalid'],
                [/"/, 'string', '@pop']
            ],
            string_single: [
                [/[^\\']+/, 'string'],
                [/@escapes/, 'string.escape'],
                [/\\./, 'string.escape.invalid'],
                [/'/, 'string', '@pop']
            ],
            string_backtick: [
                [/\$\{/, { token: 'delimiter.bracket', next: '@bracketCounting' }],
                [/[^\\`$]+/, 'string'],
                [/@escapes/, 'string.escape'],
                [/\\./, 'string.escape.invalid'],
                [/`/, 'string', '@pop']
            ],
            bracketCounting: [
                [/\{/, 'delimiter.bracket', '@bracketCounting'],
                [/\}/, 'delimiter.bracket', '@pop'],
                { include: 'common' }
            ]
        }
    };
});
//# sourceMappingURL=pebble.js.map