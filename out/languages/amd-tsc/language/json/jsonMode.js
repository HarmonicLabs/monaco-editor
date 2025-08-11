/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
define(["require", "exports", "./workerManager", "../common/lspLanguageFeatures", "./tokenization", "../../fillers/monaco-editor-core", "./workerManager", "../common/lspLanguageFeatures"], function (require, exports, workerManager_1, languageFeatures, tokenization_1, monaco_editor_core_1, workerManager_2, lspLanguageFeatures_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WorkerManager = exports.setupMode = exports.getWorker = void 0;
    let worker;
    function getWorker() {
        return new Promise((resolve, reject) => {
            if (!worker) {
                return reject('JSON not registered!');
            }
            resolve(worker);
        });
    }
    exports.getWorker = getWorker;
    class JSONDiagnosticsAdapter extends languageFeatures.DiagnosticsAdapter {
        constructor(languageId, worker, defaults) {
            super(languageId, worker, defaults.onDidChange);
            this._disposables.push(monaco_editor_core_1.editor.onWillDisposeModel((model) => {
                this._resetSchema(model.uri);
            }));
            this._disposables.push(monaco_editor_core_1.editor.onDidChangeModelLanguage((event) => {
                this._resetSchema(event.model.uri);
            }));
        }
        _resetSchema(resource) {
            this._worker().then((worker) => {
                worker.resetSchema(resource.toString());
            });
        }
    }
    function setupMode(defaults) {
        const disposables = [];
        const providers = [];
        const client = new workerManager_1.WorkerManager(defaults);
        disposables.push(client);
        worker = (...uris) => {
            return client.getLanguageServiceWorker(...uris);
        };
        function registerProviders() {
            const { languageId, modeConfiguration } = defaults;
            disposeAll(providers);
            if (modeConfiguration.documentFormattingEdits) {
                providers.push(monaco_editor_core_1.languages.registerDocumentFormattingEditProvider(languageId, new languageFeatures.DocumentFormattingEditProvider(worker)));
            }
            if (modeConfiguration.documentRangeFormattingEdits) {
                providers.push(monaco_editor_core_1.languages.registerDocumentRangeFormattingEditProvider(languageId, new languageFeatures.DocumentRangeFormattingEditProvider(worker)));
            }
            if (modeConfiguration.completionItems) {
                providers.push(monaco_editor_core_1.languages.registerCompletionItemProvider(languageId, new languageFeatures.CompletionAdapter(worker, [' ', ':', '"'])));
            }
            if (modeConfiguration.hovers) {
                providers.push(monaco_editor_core_1.languages.registerHoverProvider(languageId, new languageFeatures.HoverAdapter(worker)));
            }
            if (modeConfiguration.documentSymbols) {
                providers.push(monaco_editor_core_1.languages.registerDocumentSymbolProvider(languageId, new languageFeatures.DocumentSymbolAdapter(worker)));
            }
            if (modeConfiguration.tokens) {
                providers.push(monaco_editor_core_1.languages.setTokensProvider(languageId, (0, tokenization_1.createTokenizationSupport)(true)));
            }
            if (modeConfiguration.colors) {
                providers.push(monaco_editor_core_1.languages.registerColorProvider(languageId, new languageFeatures.DocumentColorAdapter(worker)));
            }
            if (modeConfiguration.foldingRanges) {
                providers.push(monaco_editor_core_1.languages.registerFoldingRangeProvider(languageId, new languageFeatures.FoldingRangeAdapter(worker)));
            }
            if (modeConfiguration.diagnostics) {
                providers.push(new JSONDiagnosticsAdapter(languageId, worker, defaults));
            }
            if (modeConfiguration.selectionRanges) {
                providers.push(monaco_editor_core_1.languages.registerSelectionRangeProvider(languageId, new languageFeatures.SelectionRangeAdapter(worker)));
            }
        }
        registerProviders();
        disposables.push(monaco_editor_core_1.languages.setLanguageConfiguration(defaults.languageId, richEditConfiguration));
        let modeConfiguration = defaults.modeConfiguration;
        defaults.onDidChange((newDefaults) => {
            if (newDefaults.modeConfiguration !== modeConfiguration) {
                modeConfiguration = newDefaults.modeConfiguration;
                registerProviders();
            }
        });
        disposables.push(asDisposable(providers));
        return asDisposable(disposables);
    }
    exports.setupMode = setupMode;
    function asDisposable(disposables) {
        return { dispose: () => disposeAll(disposables) };
    }
    function disposeAll(disposables) {
        while (disposables.length) {
            disposables.pop().dispose();
        }
    }
    const richEditConfiguration = {
        wordPattern: /(-?\d*\.\d\w*)|([^\[\{\]\}\:\"\,\s]+)/g,
        comments: {
            lineComment: '//',
            blockComment: ['/*', '*/']
        },
        brackets: [
            ['{', '}'],
            ['[', ']']
        ],
        autoClosingPairs: [
            { open: '{', close: '}', notIn: ['string'] },
            { open: '[', close: ']', notIn: ['string'] },
            { open: '"', close: '"', notIn: ['string'] }
        ]
    };
    Object.defineProperty(exports, "WorkerManager", { enumerable: true, get: function () { return workerManager_2.WorkerManager; } });
    __exportStar(lspLanguageFeatures_1, exports);
});
//# sourceMappingURL=jsonMode.js.map