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
define(["require", "exports", "vscode-html-languageservice"], function (require, exports, htmlService) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.create = exports.HTMLWorker = void 0;
    class HTMLWorker {
        constructor(ctx, createData) {
            this._ctx = ctx;
            this._languageSettings = createData.languageSettings;
            this._languageId = createData.languageId;
            const data = this._languageSettings.data;
            const useDefaultDataProvider = data === null || data === void 0 ? void 0 : data.useDefaultDataProvider;
            const customDataProviders = [];
            if (data === null || data === void 0 ? void 0 : data.dataProviders) {
                for (const id in data.dataProviders) {
                    customDataProviders.push(htmlService.newHTMLDataProvider(id, data.dataProviders[id]));
                }
            }
            this._languageService = htmlService.getLanguageService({
                useDefaultDataProvider,
                customDataProviders
            });
        }
        doComplete(uri, position) {
            return __awaiter(this, void 0, void 0, function* () {
                let document = this._getTextDocument(uri);
                if (!document) {
                    return null;
                }
                let htmlDocument = this._languageService.parseHTMLDocument(document);
                return Promise.resolve(this._languageService.doComplete(document, position, htmlDocument, this._languageSettings && this._languageSettings.suggest));
            });
        }
        format(uri, range, options) {
            return __awaiter(this, void 0, void 0, function* () {
                let document = this._getTextDocument(uri);
                if (!document) {
                    return [];
                }
                let formattingOptions = Object.assign(Object.assign({}, this._languageSettings.format), options);
                let textEdits = this._languageService.format(document, range, formattingOptions);
                return Promise.resolve(textEdits);
            });
        }
        doHover(uri, position) {
            return __awaiter(this, void 0, void 0, function* () {
                let document = this._getTextDocument(uri);
                if (!document) {
                    return null;
                }
                let htmlDocument = this._languageService.parseHTMLDocument(document);
                let hover = this._languageService.doHover(document, position, htmlDocument);
                return Promise.resolve(hover);
            });
        }
        findDocumentHighlights(uri, position) {
            return __awaiter(this, void 0, void 0, function* () {
                let document = this._getTextDocument(uri);
                if (!document) {
                    return [];
                }
                let htmlDocument = this._languageService.parseHTMLDocument(document);
                let highlights = this._languageService.findDocumentHighlights(document, position, htmlDocument);
                return Promise.resolve(highlights);
            });
        }
        findDocumentLinks(uri) {
            return __awaiter(this, void 0, void 0, function* () {
                let document = this._getTextDocument(uri);
                if (!document) {
                    return [];
                }
                let links = this._languageService.findDocumentLinks(document, null /*TODO@aeschli*/);
                return Promise.resolve(links);
            });
        }
        findDocumentSymbols(uri) {
            return __awaiter(this, void 0, void 0, function* () {
                let document = this._getTextDocument(uri);
                if (!document) {
                    return [];
                }
                let htmlDocument = this._languageService.parseHTMLDocument(document);
                let symbols = this._languageService.findDocumentSymbols(document, htmlDocument);
                return Promise.resolve(symbols);
            });
        }
        getFoldingRanges(uri, context) {
            return __awaiter(this, void 0, void 0, function* () {
                let document = this._getTextDocument(uri);
                if (!document) {
                    return [];
                }
                let ranges = this._languageService.getFoldingRanges(document, context);
                return Promise.resolve(ranges);
            });
        }
        getSelectionRanges(uri, positions) {
            return __awaiter(this, void 0, void 0, function* () {
                let document = this._getTextDocument(uri);
                if (!document) {
                    return [];
                }
                let ranges = this._languageService.getSelectionRanges(document, positions);
                return Promise.resolve(ranges);
            });
        }
        doRename(uri, position, newName) {
            return __awaiter(this, void 0, void 0, function* () {
                let document = this._getTextDocument(uri);
                if (!document) {
                    return null;
                }
                let htmlDocument = this._languageService.parseHTMLDocument(document);
                let renames = this._languageService.doRename(document, position, newName, htmlDocument);
                return Promise.resolve(renames);
            });
        }
        _getTextDocument(uri) {
            let models = this._ctx.getMirrorModels();
            for (let model of models) {
                if (model.uri.toString() === uri) {
                    return htmlService.TextDocument.create(uri, this._languageId, model.version, model.getValue());
                }
            }
            return null;
        }
    }
    exports.HTMLWorker = HTMLWorker;
    function create(ctx, createData) {
        return new HTMLWorker(ctx, createData);
    }
    exports.create = create;
});
//# sourceMappingURL=htmlWorker.js.map