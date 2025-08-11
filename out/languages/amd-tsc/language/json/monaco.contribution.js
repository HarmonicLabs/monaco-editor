/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "../../fillers/monaco-editor-core"], function (require, exports, monaco_editor_core_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getWorker = exports.jsonDefaults = void 0;
    class LanguageServiceDefaultsImpl {
        constructor(languageId, diagnosticsOptions, modeConfiguration) {
            this._onDidChange = new monaco_editor_core_1.Emitter();
            this._languageId = languageId;
            this.setDiagnosticsOptions(diagnosticsOptions);
            this.setModeConfiguration(modeConfiguration);
        }
        get onDidChange() {
            return this._onDidChange.event;
        }
        get languageId() {
            return this._languageId;
        }
        get modeConfiguration() {
            return this._modeConfiguration;
        }
        get diagnosticsOptions() {
            return this._diagnosticsOptions;
        }
        setDiagnosticsOptions(options) {
            this._diagnosticsOptions = options || Object.create(null);
            this._onDidChange.fire(this);
        }
        setModeConfiguration(modeConfiguration) {
            this._modeConfiguration = modeConfiguration || Object.create(null);
            this._onDidChange.fire(this);
        }
    }
    const diagnosticDefault = {
        validate: true,
        allowComments: true,
        schemas: [],
        enableSchemaRequest: false,
        schemaRequest: 'warning',
        schemaValidation: 'warning',
        comments: 'error',
        trailingCommas: 'error'
    };
    const modeConfigurationDefault = {
        documentFormattingEdits: true,
        documentRangeFormattingEdits: true,
        completionItems: true,
        hovers: true,
        documentSymbols: true,
        tokens: true,
        colors: true,
        foldingRanges: true,
        diagnostics: true,
        selectionRanges: true
    };
    exports.jsonDefaults = new LanguageServiceDefaultsImpl('json', diagnosticDefault, modeConfigurationDefault);
    const getWorker = () => getMode().then((mode) => mode.getWorker());
    exports.getWorker = getWorker;
    // export to the global based API
    monaco_editor_core_1.languages.json = { jsonDefaults: exports.jsonDefaults, getWorker: exports.getWorker };
    function getMode() {
        if (AMD) {
            return new Promise((resolve, reject) => {
                require(['vs/language/json/jsonMode'], resolve, reject);
            });
        }
        else {
            return new Promise((resolve_1, reject_1) => { require(['./jsonMode'], resolve_1, reject_1); });
        }
    }
    monaco_editor_core_1.languages.register({
        id: 'json',
        extensions: ['.json', '.bowerrc', '.jshintrc', '.jscsrc', '.eslintrc', '.babelrc', '.har'],
        aliases: ['JSON', 'json'],
        mimetypes: ['application/json']
    });
    monaco_editor_core_1.languages.onLanguage('json', () => {
        getMode().then((mode) => mode.setupMode(exports.jsonDefaults));
    });
});
//# sourceMappingURL=monaco.contribution.js.map