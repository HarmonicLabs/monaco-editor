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
define(["require", "exports", "vscode-css-languageservice"], function (require, exports, cssService) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.create = exports.CSSWorker = void 0;
    class CSSWorker {
        constructor(ctx, createData) {
            this._ctx = ctx;
            this._languageSettings = createData.options;
            this._languageId = createData.languageId;
            const data = createData.options.data;
            const useDefaultDataProvider = data === null || data === void 0 ? void 0 : data.useDefaultDataProvider;
            const customDataProviders = [];
            if (data === null || data === void 0 ? void 0 : data.dataProviders) {
                for (const id in data.dataProviders) {
                    customDataProviders.push(cssService.newCSSDataProvider(data.dataProviders[id]));
                }
            }
            const lsOptions = {
                customDataProviders,
                useDefaultDataProvider
            };
            switch (this._languageId) {
                case 'css':
                    this._languageService = cssService.getCSSLanguageService(lsOptions);
                    break;
                case 'less':
                    this._languageService = cssService.getLESSLanguageService(lsOptions);
                    break;
                case 'scss':
                    this._languageService = cssService.getSCSSLanguageService(lsOptions);
                    break;
                default:
                    throw new Error('Invalid language id: ' + this._languageId);
            }
            this._languageService.configure(this._languageSettings);
        }
        // --- language service host ---------------
        doValidation(uri) {
            return __awaiter(this, void 0, void 0, function* () {
                const document = this._getTextDocument(uri);
                if (document) {
                    const stylesheet = this._languageService.parseStylesheet(document);
                    const diagnostics = this._languageService.doValidation(document, stylesheet);
                    return Promise.resolve(diagnostics);
                }
                return Promise.resolve([]);
            });
        }
        doComplete(uri, position) {
            return __awaiter(this, void 0, void 0, function* () {
                const document = this._getTextDocument(uri);
                if (!document) {
                    return null;
                }
                const stylesheet = this._languageService.parseStylesheet(document);
                const completions = this._languageService.doComplete(document, position, stylesheet);
                return Promise.resolve(completions);
            });
        }
        doHover(uri, position) {
            return __awaiter(this, void 0, void 0, function* () {
                const document = this._getTextDocument(uri);
                if (!document) {
                    return null;
                }
                const stylesheet = this._languageService.parseStylesheet(document);
                const hover = this._languageService.doHover(document, position, stylesheet);
                return Promise.resolve(hover);
            });
        }
        findDefinition(uri, position) {
            return __awaiter(this, void 0, void 0, function* () {
                const document = this._getTextDocument(uri);
                if (!document) {
                    return null;
                }
                const stylesheet = this._languageService.parseStylesheet(document);
                const definition = this._languageService.findDefinition(document, position, stylesheet);
                return Promise.resolve(definition);
            });
        }
        findReferences(uri, position) {
            return __awaiter(this, void 0, void 0, function* () {
                const document = this._getTextDocument(uri);
                if (!document) {
                    return [];
                }
                const stylesheet = this._languageService.parseStylesheet(document);
                const references = this._languageService.findReferences(document, position, stylesheet);
                return Promise.resolve(references);
            });
        }
        findDocumentHighlights(uri, position) {
            return __awaiter(this, void 0, void 0, function* () {
                const document = this._getTextDocument(uri);
                if (!document) {
                    return [];
                }
                const stylesheet = this._languageService.parseStylesheet(document);
                const highlights = this._languageService.findDocumentHighlights(document, position, stylesheet);
                return Promise.resolve(highlights);
            });
        }
        findDocumentSymbols(uri) {
            return __awaiter(this, void 0, void 0, function* () {
                const document = this._getTextDocument(uri);
                if (!document) {
                    return [];
                }
                const stylesheet = this._languageService.parseStylesheet(document);
                const symbols = this._languageService.findDocumentSymbols(document, stylesheet);
                return Promise.resolve(symbols);
            });
        }
        doCodeActions(uri, range, context) {
            return __awaiter(this, void 0, void 0, function* () {
                const document = this._getTextDocument(uri);
                if (!document) {
                    return [];
                }
                const stylesheet = this._languageService.parseStylesheet(document);
                const actions = this._languageService.doCodeActions(document, range, context, stylesheet);
                return Promise.resolve(actions);
            });
        }
        findDocumentColors(uri) {
            return __awaiter(this, void 0, void 0, function* () {
                const document = this._getTextDocument(uri);
                if (!document) {
                    return [];
                }
                const stylesheet = this._languageService.parseStylesheet(document);
                const colorSymbols = this._languageService.findDocumentColors(document, stylesheet);
                return Promise.resolve(colorSymbols);
            });
        }
        getColorPresentations(uri, color, range) {
            return __awaiter(this, void 0, void 0, function* () {
                const document = this._getTextDocument(uri);
                if (!document) {
                    return [];
                }
                const stylesheet = this._languageService.parseStylesheet(document);
                const colorPresentations = this._languageService.getColorPresentations(document, stylesheet, color, range);
                return Promise.resolve(colorPresentations);
            });
        }
        getFoldingRanges(uri, context) {
            return __awaiter(this, void 0, void 0, function* () {
                const document = this._getTextDocument(uri);
                if (!document) {
                    return [];
                }
                const ranges = this._languageService.getFoldingRanges(document, context);
                return Promise.resolve(ranges);
            });
        }
        getSelectionRanges(uri, positions) {
            return __awaiter(this, void 0, void 0, function* () {
                const document = this._getTextDocument(uri);
                if (!document) {
                    return [];
                }
                const stylesheet = this._languageService.parseStylesheet(document);
                const ranges = this._languageService.getSelectionRanges(document, positions, stylesheet);
                return Promise.resolve(ranges);
            });
        }
        doRename(uri, position, newName) {
            return __awaiter(this, void 0, void 0, function* () {
                const document = this._getTextDocument(uri);
                if (!document) {
                    return null;
                }
                const stylesheet = this._languageService.parseStylesheet(document);
                const renames = this._languageService.doRename(document, position, newName, stylesheet);
                return Promise.resolve(renames);
            });
        }
        format(uri, range, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const document = this._getTextDocument(uri);
                if (!document) {
                    return [];
                }
                const settings = Object.assign(Object.assign({}, this._languageSettings.format), options);
                const textEdits = this._languageService.format(document, range /* TODO */, settings);
                return Promise.resolve(textEdits);
            });
        }
        _getTextDocument(uri) {
            const models = this._ctx.getMirrorModels();
            for (const model of models) {
                if (model.uri.toString() === uri) {
                    return cssService.TextDocument.create(uri, this._languageId, model.version, model.getValue());
                }
            }
            return null;
        }
    }
    exports.CSSWorker = CSSWorker;
    function create(ctx, createData) {
        return new CSSWorker(ctx, createData);
    }
    exports.create = create;
});
//# sourceMappingURL=cssWorker.js.map