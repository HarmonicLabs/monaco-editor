/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.1.0-dev3(5f53c74686d6eed60f9d2fcfdf2a6ad35b446fcf)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));

// src/fillers/monaco-editor-core.ts
var monaco_editor_core_exports = {};
__reExport(monaco_editor_core_exports, monaco_editor_core_star);
import * as monaco_editor_core_star from "monaco-editor-core";

// src/basic-languages/pebble/pebble.ts
var conf = {
  wordPattern: /(-?\d*\.\d\w*)|([^\`\@\~\!\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/,
  comments: {
    lineComment: "//",
    blockComment: ["/*", "*/"]
  },
  brackets: [
    ["{", "}"],
    ["${", "}"],
    ["[", "]"],
    ["(", ")"]
  ],
  onEnterRules: [
    {
      // e.g. /** | */
      beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
      afterText: /^\s*\*\/$/,
      action: {
        indentAction: monaco_editor_core_exports.languages.IndentAction.IndentOutdent,
        appendText: " * "
      }
    },
    {
      // e.g. /** ...|
      beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
      action: {
        indentAction: monaco_editor_core_exports.languages.IndentAction.None,
        appendText: " * "
      }
    },
    {
      // e.g.  * ...|
      beforeText: /^(\t|(\ \ ))*\ \*(\ ([^\*]|\*(?!\/))*)?$/,
      previousLineText: /^(?=^(\s*(\/\*\*|\*)).*)(?=(?!(\s*\*\/)))/,
      action: {
        indentAction: monaco_editor_core_exports.languages.IndentAction.None,
        appendText: "* "
      }
    },
    {
      // e.g.  */|
      beforeText: /^(\t|[ ])*[ ]\*\/\s*$/,
      action: {
        indentAction: monaco_editor_core_exports.languages.IndentAction.None,
        removeText: 1
      }
    },
    {
      // e.g.  *-----*/|
      beforeText: /^(\t|[ ])*[ ]\*[^/]*\*\/\s*$/,
      action: {
        indentAction: monaco_editor_core_exports.languages.IndentAction.None,
        removeText: 1
      }
    },
    {
      // e.g.  *-----*/|
      beforeText: /^\s*(\bcase\s.+:|\bdefault:)$/,
      afterText: /^(?!\s*(\bcase\b|\bdefault\b))/,
      action: {
        indentAction: monaco_editor_core_exports.languages.IndentAction.Indent
      }
    },
    {
      // Decrease indentation after single line if/else if/else, for, or while
      previousLineText: /^\s*(((else ?)?if|for|while)\s*\(.*\)\s*|else\s*)$/,
      // But make sure line doesn't have braces or is not another if statement
      beforeText: /^\s+([^{i\s]|i(?!f\b))/,
      action: {
        indentAction: monaco_editor_core_exports.languages.IndentAction.Outdent
      }
    },
    {
      // Indent when pressing enter from inside ()
      beforeText: /^.*\([^)]*$/,
      afterText: /^\s*\).*$/,
      action: {
        indentAction: monaco_editor_core_exports.languages.IndentAction.IndentOutdent,
        appendText: "	"
      }
    },
    {
      // Indent when pressing enter from inside {}
      beforeText: /^.*\{[^}]*$/,
      afterText: /^\s*\}.*$/,
      action: {
        indentAction: monaco_editor_core_exports.languages.IndentAction.IndentOutdent,
        appendText: "	"
      }
    },
    {
      // Indent when pressing enter from inside []
      beforeText: /^.*\[[^\]]*$/,
      afterText: /^\s*\].*$/,
      action: {
        indentAction: monaco_editor_core_exports.languages.IndentAction.IndentOutdent,
        appendText: "	"
      }
    },
    {
      // Add // when pressing enter from inside line comment
      beforeText: /(?<!\\)(?<!\w:)\/\/.*/,
      afterText: /^(?!\s*$).+/,
      action: {
        indentAction: monaco_editor_core_exports.languages.IndentAction.None,
        appendText: "// "
      }
    }
  ],
  autoClosingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: "'", close: "'", notIn: ["string", "comment"] },
    { open: "`", close: "`", notIn: ["string", "comment"] },
    { open: '"', close: '"', notIn: ["string"] },
    { open: "/**", close: " */", notIn: ["string"] }
  ],
  surroundingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: "'", close: "'" },
    { open: '"', close: '"' },
    { open: "`", close: "`" },
    { open: "<", close: "<" }
  ],
  colorizedBracketPairs: [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"],
    ["<", ">"]
  ],
  autoCloseBefore: ";:.,=}])>` \n	",
  folding: {
    markers: {
      start: new RegExp("^\\s*//\\s*#?region\\b"),
      end: new RegExp("^\\s*//\\s*#?endregion\\b")
    }
  },
  indentationRules: {
    decreaseIndentPattern: new RegExp("^\\s*[\\}\\]\\)].*$"),
    increaseIndentPattern: new RegExp("^.*(\\{[^}]*|\\([^)]*|\\[[^\\]]*)$"),
    // e.g.  * ...| or */| or *-----*/|
    unIndentedLinePattern: new RegExp(
      "^(\\t|[ ])*[ ]\\*[^/]*\\*/\\s*$|^(\\t|[ ])*[ ]\\*/\\s*$|^(\\t|[ ])*\\*([ ]([^\\*]|\\*(?!/))*)?$"
    ),
    indentNextLinePattern: new RegExp(
      "^((.*=>\\s*)|((.*[^\\w]+|\\s*)(if|while|for)\\s*\\(.*\\)\\s*))$"
    )
  }
};
var language = {
  // Set defaultToken to invalid to see what you do not tokenize yet
  defaultToken: "invalid",
  tokenPostfix: ".pebble",
  keywords: [
    // common keywords
    "as",
    "assert",
    "break",
    "case",
    "const",
    "continue",
    "data",
    "debugger",
    "else",
    "enum",
    "export",
    "extends",
    "fail",
    "false",
    "finally",
    "for",
    "from",
    "function",
    "if",
    "implements",
    "import",
    "int",
    "interface",
    "is",
    "let",
    "match",
    "of",
    "param",
    "readonly",
    "return",
    "runtime",
    "static",
    "struct",
    "this",
    "true",
    "type",
    "undefined",
    "using",
    "var",
    "void",
    "when",
    "while",
    // contract keywords
    "contract",
    "spend",
    "mint",
    "certify",
    "withdraw",
    "propose",
    "vote",
    "context"
  ],
  operators: [
    "<=",
    ">=",
    "==",
    "!=",
    "===",
    "!==",
    "=>",
    "+",
    "-",
    "**",
    "*",
    "/",
    "%",
    "++",
    "--",
    "<<",
    "</",
    ">>",
    ">>>",
    "&",
    "|",
    "^",
    "!",
    "~",
    "&&",
    "||",
    "??",
    "?",
    ":",
    "=",
    "+=",
    "-=",
    "*=",
    "**=",
    "/=",
    "%=",
    "<<=",
    ">>=",
    ">>>=",
    "&=",
    "|=",
    "^=",
    "@"
  ],
  // we include these common regular expressions
  symbols: /[=><!~?:&|+\-*\/\^%]+/,
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  digits: /\d+(_+\d+)*/,
  octaldigits: /[0-7]+(_+[0-7]+)*/,
  binarydigits: /[0-1]+(_+[0-1]+)*/,
  hexdigits: /[[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,
  regexpctl: /[(){}\[\]\$\^|\-*+?\.]/,
  regexpesc: /\\(?:[bBdDfnrstvwWn0\\\/]|@regexpctl|c[A-Z]|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4})/,
  // The main tokenizer for our languages
  tokenizer: {
    root: [[/[{}]/, "delimiter.bracket"], { include: "common" }],
    common: [
      // identifiers and keywords
      [
        /#?[a-z_$][\w$]*/,
        {
          cases: {
            "@keywords": "keyword",
            "@default": "identifier"
          }
        }
      ],
      [/[A-Z][\w\$]*/, "type.identifier"],
      // to show class names nicely
      // [/[A-Z][\w\$]*/, 'identifier'],
      // whitespace
      { include: "@whitespace" },
      // regular expression: ensure it is terminated before beginning (otherwise it is an opeator)
      [
        /\/(?=([^\\\/]|\\.)+\/([dgimsuy]*)(\s*)(\.|;|,|\)|\]|\}|$))/,
        { token: "regexp", bracket: "@open", next: "@regexp" }
      ],
      // delimiters and operators
      [/[()\[\]]/, "@brackets"],
      [/[<>](?!@symbols)/, "@brackets"],
      [/!(?=([^=]|$))/, "delimiter"],
      [
        /@symbols/,
        {
          cases: {
            "@operators": "delimiter",
            "@default": ""
          }
        }
      ],
      // numbers
      [/(@digits)[eE]([\-+]?(@digits))?/, "number.float"],
      [/(@digits)\.(@digits)([eE][\-+]?(@digits))?/, "number.float"],
      [/0[xX](@hexdigits)n?/, "number.hex"],
      [/0[oO]?(@octaldigits)n?/, "number.octal"],
      [/0[bB](@binarydigits)n?/, "number.binary"],
      [/(@digits)n?/, "number"],
      // delimiter: after number because of .\d floats
      [/[;,.]/, "delimiter"],
      // strings
      [/"([^"\\]|\\.)*$/, "string.invalid"],
      // non-teminated string
      [/'([^'\\]|\\.)*$/, "string.invalid"],
      // non-teminated string
      [/"/, "string", "@string_double"],
      [/'/, "string", "@string_single"],
      [/`/, "string", "@string_backtick"]
    ],
    whitespace: [
      [/[ \t\r\n]+/, ""],
      [/\/\*\*(?!\/)/, "comment.doc", "@jsdoc"],
      [/\/\*/, "comment", "@comment"],
      [/\/\/.*$/, "comment"]
    ],
    comment: [
      [/[^\/*]+/, "comment"],
      [/\*\//, "comment", "@pop"],
      [/[\/*]/, "comment"]
    ],
    jsdoc: [
      [/[^\/*]+/, "comment.doc"],
      [/\*\//, "comment.doc", "@pop"],
      [/[\/*]/, "comment.doc"]
    ],
    // We match regular expression quite precisely
    regexp: [
      [
        /(\{)(\d+(?:,\d*)?)(\})/,
        ["regexp.escape.control", "regexp.escape.control", "regexp.escape.control"]
      ],
      [
        /(\[)(\^?)(?=(?:[^\]\\\/]|\\.)+)/,
        ["regexp.escape.control", { token: "regexp.escape.control", next: "@regexrange" }]
      ],
      [/(\()(\?:|\?=|\?!)/, ["regexp.escape.control", "regexp.escape.control"]],
      [/[()]/, "regexp.escape.control"],
      [/@regexpctl/, "regexp.escape.control"],
      [/[^\\\/]/, "regexp"],
      [/@regexpesc/, "regexp.escape"],
      [/\\\./, "regexp.invalid"],
      [/(\/)([dgimsuy]*)/, [{ token: "regexp", bracket: "@close", next: "@pop" }, "keyword.other"]]
    ],
    regexrange: [
      [/-/, "regexp.escape.control"],
      [/\^/, "regexp.invalid"],
      [/@regexpesc/, "regexp.escape"],
      [/[^\]]/, "regexp"],
      [
        /\]/,
        {
          token: "regexp.escape.control",
          next: "@pop",
          bracket: "@close"
        }
      ]
    ],
    string_double: [
      [/[^\\"]+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/"/, "string", "@pop"]
    ],
    string_single: [
      [/[^\\']+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/'/, "string", "@pop"]
    ],
    string_backtick: [
      [/\$\{/, { token: "delimiter.bracket", next: "@bracketCounting" }],
      [/[^\\`$]+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/`/, "string", "@pop"]
    ],
    bracketCounting: [
      [/\{/, "delimiter.bracket", "@bracketCounting"],
      [/\}/, "delimiter.bracket", "@pop"],
      { include: "common" }
    ]
  }
};
export {
  conf,
  language
};
