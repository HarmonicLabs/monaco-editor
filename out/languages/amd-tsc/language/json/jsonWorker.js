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
define(["require", "exports", "vscode-json-languageservice", "vscode-uri"], function (require, exports, jsonService, vscode_uri_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.create = exports.JSONWorker = void 0;
    let defaultSchemaRequestService;
    if (typeof fetch !== 'undefined') {
        defaultSchemaRequestService = function (url) {
            return fetch(url).then((response) => response.text());
        };
    }
    class JSONWorker {
        constructor(ctx, createData) {
            this._ctx = ctx;
            this._languageSettings = createData.languageSettings;
            this._languageId = createData.languageId;
            this._languageService = jsonService.getLanguageService({
                workspaceContext: {
                    resolveRelativePath: (relativePath, resource) => {
                        const base = resource.substr(0, resource.lastIndexOf('/') + 1);
                        return resolvePath(base, relativePath);
                    }
                },
                schemaRequestService: createData.enableSchemaRequest
                    ? defaultSchemaRequestService
                    : undefined,
                clientCapabilities: jsonService.ClientCapabilities.LATEST
            });
            this._languageService.configure(this._languageSettings);
        }
        doValidation(uri) {
            return __awaiter(this, void 0, void 0, function* () {
                let document = this._getTextDocument(uri);
                if (document) {
                    let jsonDocument = this._languageService.parseJSONDocument(document);
                    return this._languageService.doValidation(document, jsonDocument, this._languageSettings);
                }
                return Promise.resolve([]);
            });
        }
        doComplete(uri, position) {
            return __awaiter(this, void 0, void 0, function* () {
                let document = this._getTextDocument(uri);
                if (!document) {
                    return null;
                }
                let jsonDocument = this._languageService.parseJSONDocument(document);
                return this._languageService.doComplete(document, position, jsonDocument);
            });
        }
        doResolve(item) {
            return __awaiter(this, void 0, void 0, function* () {
                return this._languageService.doResolve(item);
            });
        }
        doHover(uri, position) {
            return __awaiter(this, void 0, void 0, function* () {
                let document = this._getTextDocument(uri);
                if (!document) {
                    return null;
                }
                let jsonDocument = this._languageService.parseJSONDocument(document);
                return this._languageService.doHover(document, position, jsonDocument);
            });
        }
        format(uri, range, options) {
            return __awaiter(this, void 0, void 0, function* () {
                let document = this._getTextDocument(uri);
                if (!document) {
                    return [];
                }
                let textEdits = this._languageService.format(document, range /* TODO */, options);
                return Promise.resolve(textEdits);
            });
        }
        resetSchema(uri) {
            return __awaiter(this, void 0, void 0, function* () {
                return Promise.resolve(this._languageService.resetSchema(uri));
            });
        }
        findDocumentSymbols(uri) {
            return __awaiter(this, void 0, void 0, function* () {
                let document = this._getTextDocument(uri);
                if (!document) {
                    return [];
                }
                let jsonDocument = this._languageService.parseJSONDocument(document);
                let symbols = this._languageService.findDocumentSymbols2(document, jsonDocument);
                return Promise.resolve(symbols);
            });
        }
        findDocumentColors(uri) {
            return __awaiter(this, void 0, void 0, function* () {
                let document = this._getTextDocument(uri);
                if (!document) {
                    return [];
                }
                let jsonDocument = this._languageService.parseJSONDocument(document);
                let colorSymbols = this._languageService.findDocumentColors(document, jsonDocument);
                return Promise.resolve(colorSymbols);
            });
        }
        getColorPresentations(uri, color, range) {
            return __awaiter(this, void 0, void 0, function* () {
                let document = this._getTextDocument(uri);
                if (!document) {
                    return [];
                }
                let jsonDocument = this._languageService.parseJSONDocument(document);
                let colorPresentations = this._languageService.getColorPresentations(document, jsonDocument, color, range);
                return Promise.resolve(colorPresentations);
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
                let jsonDocument = this._languageService.parseJSONDocument(document);
                let ranges = this._languageService.getSelectionRanges(document, positions, jsonDocument);
                return Promise.resolve(ranges);
            });
        }
        parseJSONDocument(uri) {
            return __awaiter(this, void 0, void 0, function* () {
                let document = this._getTextDocument(uri);
                if (!document) {
                    return null;
                }
                let jsonDocument = this._languageService.parseJSONDocument(document);
                return Promise.resolve(jsonDocument);
            });
        }
        getMatchingSchemas(uri) {
            return __awaiter(this, void 0, void 0, function* () {
                let document = this._getTextDocument(uri);
                if (!document) {
                    return [];
                }
                let jsonDocument = this._languageService.parseJSONDocument(document);
                return Promise.resolve(this._languageService.getMatchingSchemas(document, jsonDocument));
            });
        }
        _getTextDocument(uri) {
            let models = this._ctx.getMirrorModels();
            for (let model of models) {
                if (model.uri.toString() === uri) {
                    return jsonService.TextDocument.create(uri, this._languageId, model.version, model.getValue());
                }
            }
            return null;
        }
    }
    exports.JSONWorker = JSONWorker;
    // URI path utilities, will (hopefully) move to vscode-uri
    const Slash = '/'.charCodeAt(0);
    const Dot = '.'.charCodeAt(0);
    function isAbsolutePath(path) {
        return path.charCodeAt(0) === Slash;
    }
    function resolvePath(uriString, path) {
        if (isAbsolutePath(path)) {
            const uri = vscode_uri_1.URI.parse(uriString);
            const parts = path.split('/');
            return uri.with({ path: normalizePath(parts) }).toString();
        }
        return joinPath(uriString, path);
    }
    function normalizePath(parts) {
        const newParts = [];
        for (const part of parts) {
            if (part.length === 0 || (part.length === 1 && part.charCodeAt(0) === Dot)) {
                // ignore
            }
            else if (part.length === 2 && part.charCodeAt(0) === Dot && part.charCodeAt(1) === Dot) {
                newParts.pop();
            }
            else {
                newParts.push(part);
            }
        }
        if (parts.length > 1 && parts[parts.length - 1].length === 0) {
            newParts.push('');
        }
        let res = newParts.join('/');
        if (parts[0].length === 0) {
            res = '/' + res;
        }
        return res;
    }
    function joinPath(uriString, ...paths) {
        const uri = vscode_uri_1.URI.parse(uriString);
        const parts = uri.path.split('/');
        for (let path of paths) {
            parts.push(...path.split('/'));
        }
        return uri.with({ path: normalizePath(parts) }).toString();
    }
    function create(ctx, createData) {
        return new JSONWorker(ctx, createData);
    }
    exports.create = create;
});
//# sourceMappingURL=jsonWorker.js.map