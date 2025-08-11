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
define(["require", "exports", "./workerManager", "./languageFeatures", "../../fillers/monaco-editor-core", "./workerManager", "./languageFeatures"], function (require, exports, workerManager_1, languageFeatures, monaco_editor_core_1, workerManager_2, languageFeatures_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WorkerManager = exports.getTypeScriptWorker = exports.getJavaScriptWorker = exports.setupJavaScript = exports.setupTypeScript = void 0;
    let javaScriptWorker;
    let typeScriptWorker;
    function setupTypeScript(defaults) {
        typeScriptWorker = setupMode(defaults, 'typescript');
    }
    exports.setupTypeScript = setupTypeScript;
    function setupJavaScript(defaults) {
        javaScriptWorker = setupMode(defaults, 'javascript');
    }
    exports.setupJavaScript = setupJavaScript;
    function getJavaScriptWorker() {
        return new Promise((resolve, reject) => {
            if (!javaScriptWorker) {
                return reject('JavaScript not registered!');
            }
            resolve(javaScriptWorker);
        });
    }
    exports.getJavaScriptWorker = getJavaScriptWorker;
    function getTypeScriptWorker() {
        return new Promise((resolve, reject) => {
            if (!typeScriptWorker) {
                return reject('TypeScript not registered!');
            }
            resolve(typeScriptWorker);
        });
    }
    exports.getTypeScriptWorker = getTypeScriptWorker;
    function setupMode(defaults, modeId) {
        const disposables = [];
        const providers = [];
        const client = new workerManager_1.WorkerManager(modeId, defaults);
        disposables.push(client);
        const worker = (...uris) => {
            return client.getLanguageServiceWorker(...uris);
        };
        const libFiles = new languageFeatures.LibFiles(worker);
        function registerProviders() {
            const { modeConfiguration } = defaults;
            disposeAll(providers);
            if (modeConfiguration.completionItems) {
                providers.push(monaco_editor_core_1.languages.registerCompletionItemProvider(modeId, new languageFeatures.SuggestAdapter(worker)));
            }
            if (modeConfiguration.signatureHelp) {
                providers.push(monaco_editor_core_1.languages.registerSignatureHelpProvider(modeId, new languageFeatures.SignatureHelpAdapter(worker)));
            }
            if (modeConfiguration.hovers) {
                providers.push(monaco_editor_core_1.languages.registerHoverProvider(modeId, new languageFeatures.QuickInfoAdapter(worker)));
            }
            if (modeConfiguration.documentHighlights) {
                providers.push(monaco_editor_core_1.languages.registerDocumentHighlightProvider(modeId, new languageFeatures.DocumentHighlightAdapter(worker)));
            }
            if (modeConfiguration.definitions) {
                providers.push(monaco_editor_core_1.languages.registerDefinitionProvider(modeId, new languageFeatures.DefinitionAdapter(libFiles, worker)));
            }
            if (modeConfiguration.references) {
                providers.push(monaco_editor_core_1.languages.registerReferenceProvider(modeId, new languageFeatures.ReferenceAdapter(libFiles, worker)));
            }
            if (modeConfiguration.documentSymbols) {
                providers.push(monaco_editor_core_1.languages.registerDocumentSymbolProvider(modeId, new languageFeatures.OutlineAdapter(worker)));
            }
            if (modeConfiguration.rename) {
                providers.push(monaco_editor_core_1.languages.registerRenameProvider(modeId, new languageFeatures.RenameAdapter(libFiles, worker)));
            }
            if (modeConfiguration.documentRangeFormattingEdits) {
                providers.push(monaco_editor_core_1.languages.registerDocumentRangeFormattingEditProvider(modeId, new languageFeatures.FormatAdapter(worker)));
            }
            if (modeConfiguration.onTypeFormattingEdits) {
                providers.push(monaco_editor_core_1.languages.registerOnTypeFormattingEditProvider(modeId, new languageFeatures.FormatOnTypeAdapter(worker)));
            }
            if (modeConfiguration.codeActions) {
                providers.push(monaco_editor_core_1.languages.registerCodeActionProvider(modeId, new languageFeatures.CodeActionAdaptor(worker)));
            }
            if (modeConfiguration.inlayHints) {
                providers.push(monaco_editor_core_1.languages.registerInlayHintsProvider(modeId, new languageFeatures.InlayHintsAdapter(worker)));
            }
            if (modeConfiguration.diagnostics) {
                providers.push(new languageFeatures.DiagnosticsAdapter(libFiles, defaults, modeId, worker));
            }
        }
        registerProviders();
        disposables.push(asDisposable(providers));
        //return asDisposable(disposables);
        return worker;
    }
    function asDisposable(disposables) {
        return { dispose: () => disposeAll(disposables) };
    }
    function disposeAll(disposables) {
        while (disposables.length) {
            disposables.pop().dispose();
        }
    }
    Object.defineProperty(exports, "WorkerManager", { enumerable: true, get: function () { return workerManager_2.WorkerManager; } });
    __exportStar(languageFeatures_1, exports);
});
//# sourceMappingURL=tsMode.js.map