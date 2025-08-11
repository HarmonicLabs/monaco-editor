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
define(["require", "exports", "./lib/typescriptServices", "./lib/lib"], function (require, exports, ts, lib_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.create = exports.TypeScriptWorker = void 0;
    /**
     * Loading a default lib as a source file will mess up TS completely.
     * So our strategy is to hide such a text model from TS.
     * See https://github.com/microsoft/monaco-editor/issues/2182
     */
    function fileNameIsLib(resource) {
        if (typeof resource === 'string') {
            if (/^file:\/\/\//.test(resource)) {
                return !!lib_1.libFileMap[resource.substr(8)];
            }
            return false;
        }
        if (resource.path.indexOf('/lib.') === 0) {
            return !!lib_1.libFileMap[resource.path.slice(1)];
        }
        return false;
    }
    class TypeScriptWorker {
        constructor(ctx, createData) {
            this._extraLibs = Object.create(null);
            this._languageService = ts.createLanguageService(this);
            this._ctx = ctx;
            this._compilerOptions = createData.compilerOptions;
            this._extraLibs = createData.extraLibs;
            this._inlayHintsOptions = createData.inlayHintsOptions;
        }
        // --- language service host ---------------
        getCompilationSettings() {
            return this._compilerOptions;
        }
        getLanguageService() {
            return this._languageService;
        }
        getExtraLibs() {
            return this._extraLibs;
        }
        getScriptFileNames() {
            const allModels = this._ctx.getMirrorModels().map((model) => model.uri);
            const models = allModels.filter((uri) => !fileNameIsLib(uri)).map((uri) => uri.toString());
            return models.concat(Object.keys(this._extraLibs));
        }
        _getModel(fileName) {
            let models = this._ctx.getMirrorModels();
            for (let i = 0; i < models.length; i++) {
                const uri = models[i].uri;
                if (uri.toString() === fileName || uri.toString(true) === fileName) {
                    return models[i];
                }
            }
            return null;
        }
        getScriptVersion(fileName) {
            let model = this._getModel(fileName);
            if (model) {
                return model.version.toString();
            }
            else if (this.isDefaultLibFileName(fileName)) {
                // default lib is static
                return '1';
            }
            else if (fileName in this._extraLibs) {
                return String(this._extraLibs[fileName].version);
            }
            return '';
        }
        getScriptText(fileName) {
            return __awaiter(this, void 0, void 0, function* () {
                return this._getScriptText(fileName);
            });
        }
        _getScriptText(fileName) {
            let text;
            let model = this._getModel(fileName);
            const libizedFileName = 'lib.' + fileName + '.d.ts';
            if (model) {
                // a true editor model
                text = model.getValue();
            }
            else if (fileName in lib_1.libFileMap) {
                text = lib_1.libFileMap[fileName];
            }
            else if (libizedFileName in lib_1.libFileMap) {
                text = lib_1.libFileMap[libizedFileName];
            }
            else if (fileName in this._extraLibs) {
                // extra lib
                text = this._extraLibs[fileName].content;
            }
            else {
                return;
            }
            return text;
        }
        getScriptSnapshot(fileName) {
            const text = this._getScriptText(fileName);
            if (text === undefined) {
                return;
            }
            return {
                getText: (start, end) => text.substring(start, end),
                getLength: () => text.length,
                getChangeRange: () => undefined
            };
        }
        getScriptKind(fileName) {
            const suffix = fileName.substr(fileName.lastIndexOf('.') + 1);
            switch (suffix) {
                case 'ts':
                    return ts.ScriptKind.TS;
                case 'tsx':
                    return ts.ScriptKind.TSX;
                case 'js':
                    return ts.ScriptKind.JS;
                case 'jsx':
                    return ts.ScriptKind.JSX;
                default:
                    return this.getCompilationSettings().allowJs ? ts.ScriptKind.JS : ts.ScriptKind.TS;
            }
        }
        getCurrentDirectory() {
            return '';
        }
        getDefaultLibFileName(options) {
            switch (options.target) {
                case 99 /* ESNext */:
                    const esnext = 'lib.esnext.full.d.ts';
                    if (esnext in lib_1.libFileMap || esnext in this._extraLibs)
                        return esnext;
                case 7 /* ES2020 */:
                case 6 /* ES2019 */:
                case 5 /* ES2018 */:
                case 4 /* ES2017 */:
                case 3 /* ES2016 */:
                case 2 /* ES2015 */:
                default:
                    // Support a dynamic lookup for the ES20XX version based on the target
                    // which is safe unless TC39 changes their numbering system
                    const eslib = `lib.es${2013 + (options.target || 99)}.full.d.ts`;
                    // Note: This also looks in _extraLibs, If you want
                    // to add support for additional target options, you will need to
                    // add the extra dts files to _extraLibs via the API.
                    if (eslib in lib_1.libFileMap || eslib in this._extraLibs) {
                        return eslib;
                    }
                    return 'lib.es6.d.ts'; // We don't use lib.es2015.full.d.ts due to breaking change.
                case 1:
                case 0:
                    return 'lib.d.ts';
            }
        }
        isDefaultLibFileName(fileName) {
            return fileName === this.getDefaultLibFileName(this._compilerOptions);
        }
        readFile(path) {
            return this._getScriptText(path);
        }
        fileExists(path) {
            return this._getScriptText(path) !== undefined;
        }
        getLibFiles() {
            return __awaiter(this, void 0, void 0, function* () {
                return lib_1.libFileMap;
            });
        }
        // --- language features
        static clearFiles(tsDiagnostics) {
            // Clear the `file` field, which cannot be JSON'yfied because it
            // contains cyclic data structures, except for the `fileName`
            // property.
            // Do a deep clone so we don't mutate the ts.Diagnostic object (see https://github.com/microsoft/monaco-editor/issues/2392)
            const diagnostics = [];
            for (const tsDiagnostic of tsDiagnostics) {
                const diagnostic = Object.assign({}, tsDiagnostic);
                diagnostic.file = diagnostic.file ? { fileName: diagnostic.file.fileName } : undefined;
                if (tsDiagnostic.relatedInformation) {
                    diagnostic.relatedInformation = [];
                    for (const tsRelatedDiagnostic of tsDiagnostic.relatedInformation) {
                        const relatedDiagnostic = Object.assign({}, tsRelatedDiagnostic);
                        relatedDiagnostic.file = relatedDiagnostic.file
                            ? { fileName: relatedDiagnostic.file.fileName }
                            : undefined;
                        diagnostic.relatedInformation.push(relatedDiagnostic);
                    }
                }
                diagnostics.push(diagnostic);
            }
            return diagnostics;
        }
        getSyntacticDiagnostics(fileName) {
            return __awaiter(this, void 0, void 0, function* () {
                if (fileNameIsLib(fileName)) {
                    return [];
                }
                const diagnostics = this._languageService.getSyntacticDiagnostics(fileName);
                return TypeScriptWorker.clearFiles(diagnostics);
            });
        }
        getSemanticDiagnostics(fileName) {
            return __awaiter(this, void 0, void 0, function* () {
                if (fileNameIsLib(fileName)) {
                    return [];
                }
                const diagnostics = this._languageService.getSemanticDiagnostics(fileName);
                return TypeScriptWorker.clearFiles(diagnostics);
            });
        }
        getSuggestionDiagnostics(fileName) {
            return __awaiter(this, void 0, void 0, function* () {
                if (fileNameIsLib(fileName)) {
                    return [];
                }
                const diagnostics = this._languageService.getSuggestionDiagnostics(fileName);
                return TypeScriptWorker.clearFiles(diagnostics);
            });
        }
        getCompilerOptionsDiagnostics(fileName) {
            return __awaiter(this, void 0, void 0, function* () {
                if (fileNameIsLib(fileName)) {
                    return [];
                }
                const diagnostics = this._languageService.getCompilerOptionsDiagnostics();
                return TypeScriptWorker.clearFiles(diagnostics);
            });
        }
        getCompletionsAtPosition(fileName, position) {
            return __awaiter(this, void 0, void 0, function* () {
                if (fileNameIsLib(fileName)) {
                    return undefined;
                }
                return this._languageService.getCompletionsAtPosition(fileName, position, undefined);
            });
        }
        getCompletionEntryDetails(fileName, position, entry) {
            return __awaiter(this, void 0, void 0, function* () {
                return this._languageService.getCompletionEntryDetails(fileName, position, entry, undefined, undefined, undefined, undefined);
            });
        }
        getSignatureHelpItems(fileName, position, options) {
            return __awaiter(this, void 0, void 0, function* () {
                if (fileNameIsLib(fileName)) {
                    return undefined;
                }
                return this._languageService.getSignatureHelpItems(fileName, position, options);
            });
        }
        getQuickInfoAtPosition(fileName, position) {
            return __awaiter(this, void 0, void 0, function* () {
                if (fileNameIsLib(fileName)) {
                    return undefined;
                }
                return this._languageService.getQuickInfoAtPosition(fileName, position);
            });
        }
        getDocumentHighlights(fileName, position, filesToSearch) {
            return __awaiter(this, void 0, void 0, function* () {
                if (fileNameIsLib(fileName)) {
                    return undefined;
                }
                return this._languageService.getDocumentHighlights(fileName, position, filesToSearch);
            });
        }
        getDefinitionAtPosition(fileName, position) {
            return __awaiter(this, void 0, void 0, function* () {
                if (fileNameIsLib(fileName)) {
                    return undefined;
                }
                return this._languageService.getDefinitionAtPosition(fileName, position);
            });
        }
        getReferencesAtPosition(fileName, position) {
            return __awaiter(this, void 0, void 0, function* () {
                if (fileNameIsLib(fileName)) {
                    return undefined;
                }
                return this._languageService.getReferencesAtPosition(fileName, position);
            });
        }
        getNavigationTree(fileName) {
            return __awaiter(this, void 0, void 0, function* () {
                if (fileNameIsLib(fileName)) {
                    return undefined;
                }
                return this._languageService.getNavigationTree(fileName);
            });
        }
        getFormattingEditsForDocument(fileName, options) {
            return __awaiter(this, void 0, void 0, function* () {
                if (fileNameIsLib(fileName)) {
                    return [];
                }
                return this._languageService.getFormattingEditsForDocument(fileName, options);
            });
        }
        getFormattingEditsForRange(fileName, start, end, options) {
            return __awaiter(this, void 0, void 0, function* () {
                if (fileNameIsLib(fileName)) {
                    return [];
                }
                return this._languageService.getFormattingEditsForRange(fileName, start, end, options);
            });
        }
        getFormattingEditsAfterKeystroke(fileName, postion, ch, options) {
            return __awaiter(this, void 0, void 0, function* () {
                if (fileNameIsLib(fileName)) {
                    return [];
                }
                return this._languageService.getFormattingEditsAfterKeystroke(fileName, postion, ch, options);
            });
        }
        findRenameLocations(fileName, position, findInStrings, findInComments, providePrefixAndSuffixTextForRename) {
            return __awaiter(this, void 0, void 0, function* () {
                if (fileNameIsLib(fileName)) {
                    return undefined;
                }
                return this._languageService.findRenameLocations(fileName, position, findInStrings, findInComments, providePrefixAndSuffixTextForRename);
            });
        }
        getRenameInfo(fileName, position, options) {
            return __awaiter(this, void 0, void 0, function* () {
                if (fileNameIsLib(fileName)) {
                    return { canRename: false, localizedErrorMessage: 'Cannot rename in lib file' };
                }
                return this._languageService.getRenameInfo(fileName, position, options);
            });
        }
        getEmitOutput(fileName, emitOnlyDtsFiles, forceDtsEmit) {
            return __awaiter(this, void 0, void 0, function* () {
                if (fileNameIsLib(fileName)) {
                    return { outputFiles: [], emitSkipped: true };
                }
                // The diagnostics property is internal, returning it without clearing breaks message serialization.
                const emitOutput = this._languageService.getEmitOutput(fileName, emitOnlyDtsFiles, forceDtsEmit);
                const diagnostics = emitOutput.diagnostics
                    ? TypeScriptWorker.clearFiles(emitOutput.diagnostics)
                    : undefined;
                return Object.assign(Object.assign({}, emitOutput), { diagnostics });
            });
        }
        getCodeFixesAtPosition(fileName, start, end, errorCodes, formatOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                if (fileNameIsLib(fileName)) {
                    return [];
                }
                const preferences = {};
                try {
                    return this._languageService.getCodeFixesAtPosition(fileName, start, end, errorCodes, formatOptions, preferences);
                }
                catch (_a) {
                    return [];
                }
            });
        }
        updateExtraLibs(extraLibs) {
            return __awaiter(this, void 0, void 0, function* () {
                this._extraLibs = extraLibs;
            });
        }
        provideInlayHints(fileName, start, end) {
            return __awaiter(this, void 0, void 0, function* () {
                var _a;
                if (fileNameIsLib(fileName)) {
                    return [];
                }
                const preferences = (_a = this._inlayHintsOptions) !== null && _a !== void 0 ? _a : {};
                const span = {
                    start,
                    length: end - start
                };
                try {
                    return this._languageService.provideInlayHints(fileName, span, preferences);
                }
                catch (_b) {
                    return [];
                }
            });
        }
    }
    exports.TypeScriptWorker = TypeScriptWorker;
    function create(ctx, createData) {
        let TSWorkerClass = TypeScriptWorker;
        if (createData.customWorkerPath) {
            if (typeof importScripts === 'undefined') {
                console.warn('Monaco is not using webworkers for background tasks, and that is needed to support the customWorkerPath flag');
            }
            else {
                self.importScripts(createData.customWorkerPath);
                const workerFactoryFunc = self.customTSWorkerFactory;
                if (!workerFactoryFunc) {
                    throw new Error(`The script at ${createData.customWorkerPath} does not add customTSWorkerFactory to self`);
                }
                TSWorkerClass = workerFactoryFunc(TypeScriptWorker, ts, lib_1.libFileMap);
            }
        }
        return new TSWorkerClass(ctx, createData);
    }
    exports.create = create;
    /** Allows for clients to have access to the same version of TypeScript that the worker uses */
    // @ts-ignore
    globalThis.ts = ts.typescript;
});
//# sourceMappingURL=tsWorker.js.map