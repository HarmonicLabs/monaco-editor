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
define(["require", "exports", "./workerManager", "../common/lspLanguageFeatures", "../../fillers/monaco-editor-core", "./workerManager", "../common/lspLanguageFeatures"], function (require, exports, workerManager_1, languageFeatures, monaco_editor_core_1, workerManager_2, lspLanguageFeatures_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WorkerManager = exports.setupMode = exports.setupMode1 = void 0;
    class HTMLCompletionAdapter extends languageFeatures.CompletionAdapter {
        constructor(worker) {
            super(worker, ['.', ':', '<', '"', '=', '/']);
        }
    }
    function setupMode1(defaults) {
        const client = new workerManager_1.WorkerManager(defaults);
        const worker = (...uris) => {
            return client.getLanguageServiceWorker(...uris);
        };
        let languageId = defaults.languageId;
        // all modes
        monaco_editor_core_1.languages.registerCompletionItemProvider(languageId, new HTMLCompletionAdapter(worker));
        monaco_editor_core_1.languages.registerHoverProvider(languageId, new languageFeatures.HoverAdapter(worker));
        monaco_editor_core_1.languages.registerDocumentHighlightProvider(languageId, new languageFeatures.DocumentHighlightAdapter(worker));
        monaco_editor_core_1.languages.registerLinkProvider(languageId, new languageFeatures.DocumentLinkAdapter(worker));
        monaco_editor_core_1.languages.registerFoldingRangeProvider(languageId, new languageFeatures.FoldingRangeAdapter(worker));
        monaco_editor_core_1.languages.registerDocumentSymbolProvider(languageId, new languageFeatures.DocumentSymbolAdapter(worker));
        monaco_editor_core_1.languages.registerSelectionRangeProvider(languageId, new languageFeatures.SelectionRangeAdapter(worker));
        monaco_editor_core_1.languages.registerRenameProvider(languageId, new languageFeatures.RenameAdapter(worker));
        // only html
        if (languageId === 'html') {
            monaco_editor_core_1.languages.registerDocumentFormattingEditProvider(languageId, new languageFeatures.DocumentFormattingEditProvider(worker));
            monaco_editor_core_1.languages.registerDocumentRangeFormattingEditProvider(languageId, new languageFeatures.DocumentRangeFormattingEditProvider(worker));
        }
    }
    exports.setupMode1 = setupMode1;
    function setupMode(defaults) {
        const disposables = [];
        const providers = [];
        const client = new workerManager_1.WorkerManager(defaults);
        disposables.push(client);
        const worker = (...uris) => {
            return client.getLanguageServiceWorker(...uris);
        };
        function registerProviders() {
            const { languageId, modeConfiguration } = defaults;
            disposeAll(providers);
            if (modeConfiguration.completionItems) {
                providers.push(monaco_editor_core_1.languages.registerCompletionItemProvider(languageId, new HTMLCompletionAdapter(worker)));
            }
            if (modeConfiguration.hovers) {
                providers.push(monaco_editor_core_1.languages.registerHoverProvider(languageId, new languageFeatures.HoverAdapter(worker)));
            }
            if (modeConfiguration.documentHighlights) {
                providers.push(monaco_editor_core_1.languages.registerDocumentHighlightProvider(languageId, new languageFeatures.DocumentHighlightAdapter(worker)));
            }
            if (modeConfiguration.links) {
                providers.push(monaco_editor_core_1.languages.registerLinkProvider(languageId, new languageFeatures.DocumentLinkAdapter(worker)));
            }
            if (modeConfiguration.documentSymbols) {
                providers.push(monaco_editor_core_1.languages.registerDocumentSymbolProvider(languageId, new languageFeatures.DocumentSymbolAdapter(worker)));
            }
            if (modeConfiguration.rename) {
                providers.push(monaco_editor_core_1.languages.registerRenameProvider(languageId, new languageFeatures.RenameAdapter(worker)));
            }
            if (modeConfiguration.foldingRanges) {
                providers.push(monaco_editor_core_1.languages.registerFoldingRangeProvider(languageId, new languageFeatures.FoldingRangeAdapter(worker)));
            }
            if (modeConfiguration.selectionRanges) {
                providers.push(monaco_editor_core_1.languages.registerSelectionRangeProvider(languageId, new languageFeatures.SelectionRangeAdapter(worker)));
            }
            if (modeConfiguration.documentFormattingEdits) {
                providers.push(monaco_editor_core_1.languages.registerDocumentFormattingEditProvider(languageId, new languageFeatures.DocumentFormattingEditProvider(worker)));
            }
            if (modeConfiguration.documentRangeFormattingEdits) {
                providers.push(monaco_editor_core_1.languages.registerDocumentRangeFormattingEditProvider(languageId, new languageFeatures.DocumentRangeFormattingEditProvider(worker)));
            }
        }
        registerProviders();
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
    Object.defineProperty(exports, "WorkerManager", { enumerable: true, get: function () { return workerManager_2.WorkerManager; } });
    __exportStar(lspLanguageFeatures_1, exports);
});
//# sourceMappingURL=htmlMode.js.map