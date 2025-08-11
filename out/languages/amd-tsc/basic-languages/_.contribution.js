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
define(["require", "exports", "../fillers/monaco-editor-core"], function (require, exports, monaco_editor_core_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.registerLanguage = exports.loadLanguage = void 0;
    const languageDefinitions = {};
    const lazyLanguageLoaders = {};
    class LazyLanguageLoader {
        static getOrCreate(languageId) {
            if (!lazyLanguageLoaders[languageId]) {
                lazyLanguageLoaders[languageId] = new LazyLanguageLoader(languageId);
            }
            return lazyLanguageLoaders[languageId];
        }
        constructor(languageId) {
            this._languageId = languageId;
            this._loadingTriggered = false;
            this._lazyLoadPromise = new Promise((resolve, reject) => {
                this._lazyLoadPromiseResolve = resolve;
                this._lazyLoadPromiseReject = reject;
            });
        }
        load() {
            if (!this._loadingTriggered) {
                this._loadingTriggered = true;
                languageDefinitions[this._languageId].loader().then((mod) => this._lazyLoadPromiseResolve(mod), (err) => this._lazyLoadPromiseReject(err));
            }
            return this._lazyLoadPromise;
        }
    }
    function loadLanguage(languageId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield LazyLanguageLoader.getOrCreate(languageId).load();
            // trigger tokenizer creation by instantiating a model
            const model = monaco_editor_core_1.editor.createModel('', languageId);
            model.dispose();
        });
    }
    exports.loadLanguage = loadLanguage;
    function registerLanguage(def) {
        const languageId = def.id;
        languageDefinitions[languageId] = def;
        monaco_editor_core_1.languages.register(def);
        const lazyLanguageLoader = LazyLanguageLoader.getOrCreate(languageId);
        monaco_editor_core_1.languages.registerTokensProviderFactory(languageId, {
            create: () => __awaiter(this, void 0, void 0, function* () {
                const mod = yield lazyLanguageLoader.load();
                return mod.language;
            })
        });
        monaco_editor_core_1.languages.onLanguageEncountered(languageId, () => __awaiter(this, void 0, void 0, function* () {
            const mod = yield lazyLanguageLoader.load();
            monaco_editor_core_1.languages.setLanguageConfiguration(languageId, mod.conf);
        }));
    }
    exports.registerLanguage = registerLanguage;
});
//# sourceMappingURL=_.contribution.js.map