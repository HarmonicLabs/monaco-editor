/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vscode-languageserver-types", "../../fillers/monaco-editor-core"], function (require, exports, lsTypes, monaco_editor_core_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SelectionRangeAdapter = exports.FoldingRangeAdapter = exports.DocumentColorAdapter = exports.DocumentRangeFormattingEditProvider = exports.DocumentFormattingEditProvider = exports.DocumentLinkAdapter = exports.DocumentSymbolAdapter = exports.RenameAdapter = exports.ReferenceAdapter = exports.DefinitionAdapter = exports.DocumentHighlightAdapter = exports.HoverAdapter = exports.toTextEdit = exports.toRange = exports.fromRange = exports.fromPosition = exports.CompletionAdapter = exports.DiagnosticsAdapter = void 0;
    class DiagnosticsAdapter {
        constructor(_languageId, _worker, configChangeEvent) {
            this._languageId = _languageId;
            this._worker = _worker;
            this._disposables = [];
            this._listener = Object.create(null);
            const onModelAdd = (model) => {
                let modeId = model.getLanguageId();
                if (modeId !== this._languageId) {
                    return;
                }
                let handle;
                this._listener[model.uri.toString()] = model.onDidChangeContent(() => {
                    window.clearTimeout(handle);
                    handle = window.setTimeout(() => this._doValidate(model.uri, modeId), 500);
                });
                this._doValidate(model.uri, modeId);
            };
            const onModelRemoved = (model) => {
                monaco_editor_core_1.editor.setModelMarkers(model, this._languageId, []);
                let uriStr = model.uri.toString();
                let listener = this._listener[uriStr];
                if (listener) {
                    listener.dispose();
                    delete this._listener[uriStr];
                }
            };
            this._disposables.push(monaco_editor_core_1.editor.onDidCreateModel(onModelAdd));
            this._disposables.push(monaco_editor_core_1.editor.onWillDisposeModel(onModelRemoved));
            this._disposables.push(monaco_editor_core_1.editor.onDidChangeModelLanguage((event) => {
                onModelRemoved(event.model);
                onModelAdd(event.model);
            }));
            this._disposables.push(configChangeEvent((_) => {
                monaco_editor_core_1.editor.getModels().forEach((model) => {
                    if (model.getLanguageId() === this._languageId) {
                        onModelRemoved(model);
                        onModelAdd(model);
                    }
                });
            }));
            this._disposables.push({
                dispose: () => {
                    monaco_editor_core_1.editor.getModels().forEach(onModelRemoved);
                    for (let key in this._listener) {
                        this._listener[key].dispose();
                    }
                }
            });
            monaco_editor_core_1.editor.getModels().forEach(onModelAdd);
        }
        dispose() {
            this._disposables.forEach((d) => d && d.dispose());
            this._disposables.length = 0;
        }
        _doValidate(resource, languageId) {
            this._worker(resource)
                .then((worker) => {
                return worker.doValidation(resource.toString());
            })
                .then((diagnostics) => {
                const markers = diagnostics.map((d) => toDiagnostics(resource, d));
                let model = monaco_editor_core_1.editor.getModel(resource);
                if (model && model.getLanguageId() === languageId) {
                    monaco_editor_core_1.editor.setModelMarkers(model, languageId, markers);
                }
            })
                .then(undefined, (err) => {
                console.error(err);
            });
        }
    }
    exports.DiagnosticsAdapter = DiagnosticsAdapter;
    function toSeverity(lsSeverity) {
        switch (lsSeverity) {
            case lsTypes.DiagnosticSeverity.Error:
                return monaco_editor_core_1.MarkerSeverity.Error;
            case lsTypes.DiagnosticSeverity.Warning:
                return monaco_editor_core_1.MarkerSeverity.Warning;
            case lsTypes.DiagnosticSeverity.Information:
                return monaco_editor_core_1.MarkerSeverity.Info;
            case lsTypes.DiagnosticSeverity.Hint:
                return monaco_editor_core_1.MarkerSeverity.Hint;
            default:
                return monaco_editor_core_1.MarkerSeverity.Info;
        }
    }
    function toDiagnostics(resource, diag) {
        let code = typeof diag.code === 'number' ? String(diag.code) : diag.code;
        return {
            severity: toSeverity(diag.severity),
            startLineNumber: diag.range.start.line + 1,
            startColumn: diag.range.start.character + 1,
            endLineNumber: diag.range.end.line + 1,
            endColumn: diag.range.end.character + 1,
            message: diag.message,
            code: code,
            source: diag.source
        };
    }
    class CompletionAdapter {
        constructor(_worker, _triggerCharacters) {
            this._worker = _worker;
            this._triggerCharacters = _triggerCharacters;
        }
        get triggerCharacters() {
            return this._triggerCharacters;
        }
        provideCompletionItems(model, position, context, token) {
            const resource = model.uri;
            return this._worker(resource)
                .then((worker) => {
                return worker.doComplete(resource.toString(), fromPosition(position));
            })
                .then((info) => {
                if (!info) {
                    return;
                }
                const wordInfo = model.getWordUntilPosition(position);
                const wordRange = new monaco_editor_core_1.Range(position.lineNumber, wordInfo.startColumn, position.lineNumber, wordInfo.endColumn);
                const items = info.items.map((entry) => {
                    const item = {
                        label: entry.label,
                        insertText: entry.insertText || entry.label,
                        sortText: entry.sortText,
                        filterText: entry.filterText,
                        documentation: entry.documentation,
                        detail: entry.detail,
                        command: toCommand(entry.command),
                        range: wordRange,
                        kind: toCompletionItemKind(entry.kind)
                    };
                    if (entry.textEdit) {
                        if (isInsertReplaceEdit(entry.textEdit)) {
                            item.range = {
                                insert: toRange(entry.textEdit.insert),
                                replace: toRange(entry.textEdit.replace)
                            };
                        }
                        else {
                            item.range = toRange(entry.textEdit.range);
                        }
                        item.insertText = entry.textEdit.newText;
                    }
                    if (entry.additionalTextEdits) {
                        item.additionalTextEdits =
                            entry.additionalTextEdits.map(toTextEdit);
                    }
                    if (entry.insertTextFormat === lsTypes.InsertTextFormat.Snippet) {
                        item.insertTextRules = monaco_editor_core_1.languages.CompletionItemInsertTextRule.InsertAsSnippet;
                    }
                    return item;
                });
                return {
                    isIncomplete: info.isIncomplete,
                    suggestions: items
                };
            });
        }
    }
    exports.CompletionAdapter = CompletionAdapter;
    function fromPosition(position) {
        if (!position) {
            return void 0;
        }
        return { character: position.column - 1, line: position.lineNumber - 1 };
    }
    exports.fromPosition = fromPosition;
    function fromRange(range) {
        if (!range) {
            return void 0;
        }
        return {
            start: {
                line: range.startLineNumber - 1,
                character: range.startColumn - 1
            },
            end: { line: range.endLineNumber - 1, character: range.endColumn - 1 }
        };
    }
    exports.fromRange = fromRange;
    function toRange(range) {
        if (!range) {
            return void 0;
        }
        return new monaco_editor_core_1.Range(range.start.line + 1, range.start.character + 1, range.end.line + 1, range.end.character + 1);
    }
    exports.toRange = toRange;
    function isInsertReplaceEdit(edit) {
        return (typeof edit.insert !== 'undefined' &&
            typeof edit.replace !== 'undefined');
    }
    function toCompletionItemKind(kind) {
        const mItemKind = monaco_editor_core_1.languages.CompletionItemKind;
        switch (kind) {
            case lsTypes.CompletionItemKind.Text:
                return mItemKind.Text;
            case lsTypes.CompletionItemKind.Method:
                return mItemKind.Method;
            case lsTypes.CompletionItemKind.Function:
                return mItemKind.Function;
            case lsTypes.CompletionItemKind.Constructor:
                return mItemKind.Constructor;
            case lsTypes.CompletionItemKind.Field:
                return mItemKind.Field;
            case lsTypes.CompletionItemKind.Variable:
                return mItemKind.Variable;
            case lsTypes.CompletionItemKind.Class:
                return mItemKind.Class;
            case lsTypes.CompletionItemKind.Interface:
                return mItemKind.Interface;
            case lsTypes.CompletionItemKind.Module:
                return mItemKind.Module;
            case lsTypes.CompletionItemKind.Property:
                return mItemKind.Property;
            case lsTypes.CompletionItemKind.Unit:
                return mItemKind.Unit;
            case lsTypes.CompletionItemKind.Value:
                return mItemKind.Value;
            case lsTypes.CompletionItemKind.Enum:
                return mItemKind.Enum;
            case lsTypes.CompletionItemKind.Keyword:
                return mItemKind.Keyword;
            case lsTypes.CompletionItemKind.Snippet:
                return mItemKind.Snippet;
            case lsTypes.CompletionItemKind.Color:
                return mItemKind.Color;
            case lsTypes.CompletionItemKind.File:
                return mItemKind.File;
            case lsTypes.CompletionItemKind.Reference:
                return mItemKind.Reference;
        }
        return mItemKind.Property;
    }
    function fromCompletionItemKind(kind) {
        const mItemKind = monaco_editor_core_1.languages.CompletionItemKind;
        switch (kind) {
            case mItemKind.Text:
                return lsTypes.CompletionItemKind.Text;
            case mItemKind.Method:
                return lsTypes.CompletionItemKind.Method;
            case mItemKind.Function:
                return lsTypes.CompletionItemKind.Function;
            case mItemKind.Constructor:
                return lsTypes.CompletionItemKind.Constructor;
            case mItemKind.Field:
                return lsTypes.CompletionItemKind.Field;
            case mItemKind.Variable:
                return lsTypes.CompletionItemKind.Variable;
            case mItemKind.Class:
                return lsTypes.CompletionItemKind.Class;
            case mItemKind.Interface:
                return lsTypes.CompletionItemKind.Interface;
            case mItemKind.Module:
                return lsTypes.CompletionItemKind.Module;
            case mItemKind.Property:
                return lsTypes.CompletionItemKind.Property;
            case mItemKind.Unit:
                return lsTypes.CompletionItemKind.Unit;
            case mItemKind.Value:
                return lsTypes.CompletionItemKind.Value;
            case mItemKind.Enum:
                return lsTypes.CompletionItemKind.Enum;
            case mItemKind.Keyword:
                return lsTypes.CompletionItemKind.Keyword;
            case mItemKind.Snippet:
                return lsTypes.CompletionItemKind.Snippet;
            case mItemKind.Color:
                return lsTypes.CompletionItemKind.Color;
            case mItemKind.File:
                return lsTypes.CompletionItemKind.File;
            case mItemKind.Reference:
                return lsTypes.CompletionItemKind.Reference;
        }
        return lsTypes.CompletionItemKind.Property;
    }
    function toTextEdit(textEdit) {
        if (!textEdit) {
            return void 0;
        }
        return {
            range: toRange(textEdit.range),
            text: textEdit.newText
        };
    }
    exports.toTextEdit = toTextEdit;
    function toCommand(c) {
        return c && c.command === 'editor.action.triggerSuggest'
            ? { id: c.command, title: c.title, arguments: c.arguments }
            : undefined;
    }
    class HoverAdapter {
        constructor(_worker) {
            this._worker = _worker;
        }
        provideHover(model, position, token) {
            let resource = model.uri;
            return this._worker(resource)
                .then((worker) => {
                return worker.doHover(resource.toString(), fromPosition(position));
            })
                .then((info) => {
                if (!info) {
                    return;
                }
                return {
                    range: toRange(info.range),
                    contents: toMarkedStringArray(info.contents)
                };
            });
        }
    }
    exports.HoverAdapter = HoverAdapter;
    function isMarkupContent(thing) {
        return (thing && typeof thing === 'object' && typeof thing.kind === 'string');
    }
    function toMarkdownString(entry) {
        if (typeof entry === 'string') {
            return {
                value: entry
            };
        }
        if (isMarkupContent(entry)) {
            if (entry.kind === 'plaintext') {
                return {
                    value: entry.value.replace(/[\\`*_{}[\]()#+\-.!]/g, '\\$&')
                };
            }
            return {
                value: entry.value
            };
        }
        return { value: '```' + entry.language + '\n' + entry.value + '\n```\n' };
    }
    function toMarkedStringArray(contents) {
        if (!contents) {
            return void 0;
        }
        if (Array.isArray(contents)) {
            return contents.map(toMarkdownString);
        }
        return [toMarkdownString(contents)];
    }
    class DocumentHighlightAdapter {
        constructor(_worker) {
            this._worker = _worker;
        }
        provideDocumentHighlights(model, position, token) {
            const resource = model.uri;
            return this._worker(resource)
                .then((worker) => worker.findDocumentHighlights(resource.toString(), fromPosition(position)))
                .then((entries) => {
                if (!entries) {
                    return;
                }
                return entries.map((entry) => {
                    return {
                        range: toRange(entry.range),
                        kind: toDocumentHighlightKind(entry.kind)
                    };
                });
            });
        }
    }
    exports.DocumentHighlightAdapter = DocumentHighlightAdapter;
    function toDocumentHighlightKind(kind) {
        switch (kind) {
            case lsTypes.DocumentHighlightKind.Read:
                return monaco_editor_core_1.languages.DocumentHighlightKind.Read;
            case lsTypes.DocumentHighlightKind.Write:
                return monaco_editor_core_1.languages.DocumentHighlightKind.Write;
            case lsTypes.DocumentHighlightKind.Text:
                return monaco_editor_core_1.languages.DocumentHighlightKind.Text;
        }
        return monaco_editor_core_1.languages.DocumentHighlightKind.Text;
    }
    class DefinitionAdapter {
        constructor(_worker) {
            this._worker = _worker;
        }
        provideDefinition(model, position, token) {
            const resource = model.uri;
            return this._worker(resource)
                .then((worker) => {
                return worker.findDefinition(resource.toString(), fromPosition(position));
            })
                .then((definition) => {
                if (!definition) {
                    return;
                }
                return [toLocation(definition)];
            });
        }
    }
    exports.DefinitionAdapter = DefinitionAdapter;
    function toLocation(location) {
        return {
            uri: monaco_editor_core_1.Uri.parse(location.uri),
            range: toRange(location.range)
        };
    }
    class ReferenceAdapter {
        constructor(_worker) {
            this._worker = _worker;
        }
        provideReferences(model, position, context, token) {
            const resource = model.uri;
            return this._worker(resource)
                .then((worker) => {
                return worker.findReferences(resource.toString(), fromPosition(position));
            })
                .then((entries) => {
                if (!entries) {
                    return;
                }
                return entries.map(toLocation);
            });
        }
    }
    exports.ReferenceAdapter = ReferenceAdapter;
    class RenameAdapter {
        constructor(_worker) {
            this._worker = _worker;
        }
        provideRenameEdits(model, position, newName, token) {
            const resource = model.uri;
            return this._worker(resource)
                .then((worker) => {
                return worker.doRename(resource.toString(), fromPosition(position), newName);
            })
                .then((edit) => {
                return toWorkspaceEdit(edit);
            });
        }
    }
    exports.RenameAdapter = RenameAdapter;
    function toWorkspaceEdit(edit) {
        if (!edit || !edit.changes) {
            return void 0;
        }
        let resourceEdits = [];
        for (let uri in edit.changes) {
            const _uri = monaco_editor_core_1.Uri.parse(uri);
            for (let e of edit.changes[uri]) {
                resourceEdits.push({
                    resource: _uri,
                    versionId: undefined,
                    textEdit: {
                        range: toRange(e.range),
                        text: e.newText
                    }
                });
            }
        }
        return {
            edits: resourceEdits
        };
    }
    class DocumentSymbolAdapter {
        constructor(_worker) {
            this._worker = _worker;
        }
        provideDocumentSymbols(model, token) {
            const resource = model.uri;
            return this._worker(resource)
                .then((worker) => worker.findDocumentSymbols(resource.toString()))
                .then((items) => {
                if (!items) {
                    return;
                }
                return items.map((item) => {
                    if (isDocumentSymbol(item)) {
                        return toDocumentSymbol(item);
                    }
                    return {
                        name: item.name,
                        detail: '',
                        containerName: item.containerName,
                        kind: toSymbolKind(item.kind),
                        range: toRange(item.location.range),
                        selectionRange: toRange(item.location.range),
                        tags: []
                    };
                });
            });
        }
    }
    exports.DocumentSymbolAdapter = DocumentSymbolAdapter;
    function isDocumentSymbol(symbol) {
        return 'children' in symbol;
    }
    function toDocumentSymbol(symbol) {
        var _a, _b, _c;
        return {
            name: symbol.name,
            detail: (_a = symbol.detail) !== null && _a !== void 0 ? _a : '',
            kind: toSymbolKind(symbol.kind),
            range: toRange(symbol.range),
            selectionRange: toRange(symbol.selectionRange),
            tags: (_b = symbol.tags) !== null && _b !== void 0 ? _b : [],
            children: ((_c = symbol.children) !== null && _c !== void 0 ? _c : []).map((item) => toDocumentSymbol(item))
        };
    }
    function toSymbolKind(kind) {
        let mKind = monaco_editor_core_1.languages.SymbolKind;
        switch (kind) {
            case lsTypes.SymbolKind.File:
                return mKind.File;
            case lsTypes.SymbolKind.Module:
                return mKind.Module;
            case lsTypes.SymbolKind.Namespace:
                return mKind.Namespace;
            case lsTypes.SymbolKind.Package:
                return mKind.Package;
            case lsTypes.SymbolKind.Class:
                return mKind.Class;
            case lsTypes.SymbolKind.Method:
                return mKind.Method;
            case lsTypes.SymbolKind.Property:
                return mKind.Property;
            case lsTypes.SymbolKind.Field:
                return mKind.Field;
            case lsTypes.SymbolKind.Constructor:
                return mKind.Constructor;
            case lsTypes.SymbolKind.Enum:
                return mKind.Enum;
            case lsTypes.SymbolKind.Interface:
                return mKind.Interface;
            case lsTypes.SymbolKind.Function:
                return mKind.Function;
            case lsTypes.SymbolKind.Variable:
                return mKind.Variable;
            case lsTypes.SymbolKind.Constant:
                return mKind.Constant;
            case lsTypes.SymbolKind.String:
                return mKind.String;
            case lsTypes.SymbolKind.Number:
                return mKind.Number;
            case lsTypes.SymbolKind.Boolean:
                return mKind.Boolean;
            case lsTypes.SymbolKind.Array:
                return mKind.Array;
        }
        return mKind.Function;
    }
    class DocumentLinkAdapter {
        constructor(_worker) {
            this._worker = _worker;
        }
        provideLinks(model, token) {
            const resource = model.uri;
            return this._worker(resource)
                .then((worker) => worker.findDocumentLinks(resource.toString()))
                .then((items) => {
                if (!items) {
                    return;
                }
                return {
                    links: items.map((item) => ({
                        range: toRange(item.range),
                        url: item.target
                    }))
                };
            });
        }
    }
    exports.DocumentLinkAdapter = DocumentLinkAdapter;
    class DocumentFormattingEditProvider {
        constructor(_worker) {
            this._worker = _worker;
        }
        provideDocumentFormattingEdits(model, options, token) {
            const resource = model.uri;
            return this._worker(resource).then((worker) => {
                return worker
                    .format(resource.toString(), null, fromFormattingOptions(options))
                    .then((edits) => {
                    if (!edits || edits.length === 0) {
                        return;
                    }
                    return edits.map(toTextEdit);
                });
            });
        }
    }
    exports.DocumentFormattingEditProvider = DocumentFormattingEditProvider;
    class DocumentRangeFormattingEditProvider {
        constructor(_worker) {
            this._worker = _worker;
            this.canFormatMultipleRanges = false;
        }
        provideDocumentRangeFormattingEdits(model, range, options, token) {
            const resource = model.uri;
            return this._worker(resource).then((worker) => {
                return worker
                    .format(resource.toString(), fromRange(range), fromFormattingOptions(options))
                    .then((edits) => {
                    if (!edits || edits.length === 0) {
                        return;
                    }
                    return edits.map(toTextEdit);
                });
            });
        }
    }
    exports.DocumentRangeFormattingEditProvider = DocumentRangeFormattingEditProvider;
    function fromFormattingOptions(options) {
        return {
            tabSize: options.tabSize,
            insertSpaces: options.insertSpaces
        };
    }
    class DocumentColorAdapter {
        constructor(_worker) {
            this._worker = _worker;
        }
        provideDocumentColors(model, token) {
            const resource = model.uri;
            return this._worker(resource)
                .then((worker) => worker.findDocumentColors(resource.toString()))
                .then((infos) => {
                if (!infos) {
                    return;
                }
                return infos.map((item) => ({
                    color: item.color,
                    range: toRange(item.range)
                }));
            });
        }
        provideColorPresentations(model, info, token) {
            const resource = model.uri;
            return this._worker(resource)
                .then((worker) => worker.getColorPresentations(resource.toString(), info.color, fromRange(info.range)))
                .then((presentations) => {
                if (!presentations) {
                    return;
                }
                return presentations.map((presentation) => {
                    let item = {
                        label: presentation.label
                    };
                    if (presentation.textEdit) {
                        item.textEdit = toTextEdit(presentation.textEdit);
                    }
                    if (presentation.additionalTextEdits) {
                        item.additionalTextEdits =
                            presentation.additionalTextEdits.map(toTextEdit);
                    }
                    return item;
                });
            });
        }
    }
    exports.DocumentColorAdapter = DocumentColorAdapter;
    class FoldingRangeAdapter {
        constructor(_worker) {
            this._worker = _worker;
        }
        provideFoldingRanges(model, context, token) {
            const resource = model.uri;
            return this._worker(resource)
                .then((worker) => worker.getFoldingRanges(resource.toString(), context))
                .then((ranges) => {
                if (!ranges) {
                    return;
                }
                return ranges.map((range) => {
                    const result = {
                        start: range.startLine + 1,
                        end: range.endLine + 1
                    };
                    if (typeof range.kind !== 'undefined') {
                        result.kind = toFoldingRangeKind(range.kind);
                    }
                    return result;
                });
            });
        }
    }
    exports.FoldingRangeAdapter = FoldingRangeAdapter;
    function toFoldingRangeKind(kind) {
        switch (kind) {
            case lsTypes.FoldingRangeKind.Comment:
                return monaco_editor_core_1.languages.FoldingRangeKind.Comment;
            case lsTypes.FoldingRangeKind.Imports:
                return monaco_editor_core_1.languages.FoldingRangeKind.Imports;
            case lsTypes.FoldingRangeKind.Region:
                return monaco_editor_core_1.languages.FoldingRangeKind.Region;
        }
        return void 0;
    }
    class SelectionRangeAdapter {
        constructor(_worker) {
            this._worker = _worker;
        }
        provideSelectionRanges(model, positions, token) {
            const resource = model.uri;
            return this._worker(resource)
                .then((worker) => worker.getSelectionRanges(resource.toString(), positions.map(fromPosition)))
                .then((selectionRanges) => {
                if (!selectionRanges) {
                    return;
                }
                return selectionRanges.map((selectionRange) => {
                    const result = [];
                    while (selectionRange) {
                        result.push({ range: toRange(selectionRange.range) });
                        selectionRange = selectionRange.parent;
                    }
                    return result;
                });
            });
        }
    }
    exports.SelectionRangeAdapter = SelectionRangeAdapter;
});
//#endregion
//# sourceMappingURL=lspLanguageFeatures.js.map