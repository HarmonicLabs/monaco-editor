import { languages } from '../../fillers/monaco-editor-core';
export declare const conf: languages.LanguageConfiguration;
export declare const language: {
    defaultToken: string;
    tokenPostfix: string;
    keywords: string[];
    typeKeywords: string[];
    operators: string[];
    symbols: RegExp;
    escapes: RegExp;
    digits: RegExp;
    octaldigits: RegExp;
    binarydigits: RegExp;
    hexdigits: RegExp;
    tokenizer: {
        root: ((string | RegExp)[] | {
            include: string;
        })[];
        common: ((string | RegExp)[] | (RegExp | string[])[] | (RegExp | {
            cases: {
                '@typeKeywords': string;
                '@keywords': string;
                '@default': string;
            };
        })[] | {
            include: string;
        } | (RegExp | {
            cases: {
                '@operators': string;
                '@default': string;
            };
        })[])[];
        whitespace: (string | RegExp)[][];
        comment: (string | RegExp)[][];
        jsdoc: (string | RegExp)[][];
        string_double: (string | RegExp)[][];
        string_single: (string | RegExp)[][];
        string_backtick: ((string | RegExp)[] | (RegExp | {
            token: string;
            next: string;
        })[])[];
        bracketCounting: ((string | RegExp)[] | {
            include: string;
        })[];
    };
};
