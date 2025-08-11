/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "../_.contribution", "assert", "../../fillers/monaco-editor-core", "../monaco.contribution"], function (require, exports, __contribution_1, assert, monaco_editor_core_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.testTokenization = void 0;
    function timeout(ms) {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, ms);
        });
    }
    function testTokenization(_language, tests) {
        let languages;
        if (typeof _language === 'string') {
            languages = [_language];
        }
        else {
            languages = _language;
        }
        let mainLanguage = languages[0];
        test(mainLanguage + ' tokenization', () => __awaiter(this, void 0, void 0, function* () {
            yield Promise.all(languages.map((l) => (0, __contribution_1.loadLanguage)(l)));
            yield timeout(0);
            runTests(mainLanguage, tests);
        }));
    }
    exports.testTokenization = testTokenization;
    function runTests(languageId, tests) {
        tests.forEach((test) => runTest(languageId, test));
    }
    function runTest(languageId, test) {
        let text = test.map((t) => t.line).join('\n');
        let actualTokens = monaco_editor_core_1.editor.tokenize(text, languageId);
        let actual = actualTokens.map((lineTokens, index) => {
            return {
                line: test[index].line,
                tokens: lineTokens.map((t) => {
                    return {
                        startIndex: t.offset,
                        type: t.type
                    };
                })
            };
        });
        assert.deepStrictEqual(actual, test);
    }
});
//# sourceMappingURL=testRunner.js.map