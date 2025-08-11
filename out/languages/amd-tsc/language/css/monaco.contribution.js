/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "../../fillers/monaco-editor-core"], function (require, exports, monaco_editor_core_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.lessDefaults = exports.scssDefaults = exports.cssDefaults = void 0;
    // --- CSS configuration and defaults ---------
    class LanguageServiceDefaultsImpl {
        constructor(languageId, options, modeConfiguration) {
            this._onDidChange = new monaco_editor_core_1.Emitter();
            this._languageId = languageId;
            this.setOptions(options);
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
            return this.options;
        }
        get options() {
            return this._options;
        }
        setOptions(options) {
            this._options = options || Object.create(null);
            this._onDidChange.fire(this);
        }
        setDiagnosticsOptions(options) {
            this.setOptions(options);
        }
        setModeConfiguration(modeConfiguration) {
            this._modeConfiguration = modeConfiguration || Object.create(null);
            this._onDidChange.fire(this);
        }
    }
    const optionsDefault = {
        validate: true,
        lint: {
            compatibleVendorPrefixes: 'ignore',
            vendorPrefix: 'warning',
            duplicateProperties: 'warning',
            emptyRules: 'warning',
            importStatement: 'ignore',
            boxModel: 'ignore',
            universalSelector: 'ignore',
            zeroUnits: 'ignore',
            fontFaceProperties: 'warning',
            hexColorLength: 'error',
            argumentsInColorFunction: 'error',
            unknownProperties: 'warning',
            ieHack: 'ignore',
            unknownVendorSpecificProperties: 'ignore',
            propertyIgnoredDueToDisplay: 'warning',
            important: 'ignore',
            float: 'ignore',
            idSelector: 'ignore'
        },
        data: { useDefaultDataProvider: true },
        format: {
            newlineBetweenSelectors: true,
            newlineBetweenRules: true,
            spaceAroundSelectorSeparator: false,
            braceStyle: 'collapse',
            maxPreserveNewLines: undefined,
            preserveNewLines: true
        }
    };
    const modeConfigurationDefault = {
        completionItems: true,
        hovers: true,
        documentSymbols: true,
        definitions: true,
        references: true,
        documentHighlights: true,
        rename: true,
        colors: true,
        foldingRanges: true,
        diagnostics: true,
        selectionRanges: true,
        documentFormattingEdits: true,
        documentRangeFormattingEdits: true
    };
    exports.cssDefaults = new LanguageServiceDefaultsImpl('css', optionsDefault, modeConfigurationDefault);
    exports.scssDefaults = new LanguageServiceDefaultsImpl('scss', optionsDefault, modeConfigurationDefault);
    exports.lessDefaults = new LanguageServiceDefaultsImpl('less', optionsDefault, modeConfigurationDefault);
    // export to the global based API
    monaco_editor_core_1.languages.css = { cssDefaults: exports.cssDefaults, lessDefaults: exports.lessDefaults, scssDefaults: exports.scssDefaults };
    function getMode() {
        if (AMD) {
            return new Promise((resolve, reject) => {
                require(['vs/language/css/cssMode'], resolve, reject);
            });
        }
        else {
            return new Promise((resolve_1, reject_1) => { require(['./cssMode'], resolve_1, reject_1); });
        }
    }
    monaco_editor_core_1.languages.onLanguage('less', () => {
        getMode().then((mode) => mode.setupMode(exports.lessDefaults));
    });
    monaco_editor_core_1.languages.onLanguage('scss', () => {
        getMode().then((mode) => mode.setupMode(exports.scssDefaults));
    });
    monaco_editor_core_1.languages.onLanguage('css', () => {
        getMode().then((mode) => mode.setupMode(exports.cssDefaults));
    });
});
//# sourceMappingURL=monaco.contribution.js.map