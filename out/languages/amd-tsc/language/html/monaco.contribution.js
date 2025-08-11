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
define(["require", "exports", "../../fillers/monaco-editor-core"], function (require, exports, monaco_editor_core_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.registerHTMLLanguageService = exports.razorDefaults = exports.razorLanguageService = exports.handlebarDefaults = exports.handlebarLanguageService = exports.htmlDefaults = exports.htmlLanguageService = void 0;
    // --- HTML configuration and defaults ---------
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
        get options() {
            return this._options;
        }
        get modeConfiguration() {
            return this._modeConfiguration;
        }
        setOptions(options) {
            this._options = options || Object.create(null);
            this._onDidChange.fire(this);
        }
        setModeConfiguration(modeConfiguration) {
            this._modeConfiguration = modeConfiguration || Object.create(null);
            this._onDidChange.fire(this);
        }
    }
    const formatDefaults = {
        tabSize: 4,
        insertSpaces: false,
        wrapLineLength: 120,
        unformatted: 'default": "a, abbr, acronym, b, bdo, big, br, button, cite, code, dfn, em, i, img, input, kbd, label, map, object, q, samp, select, small, span, strong, sub, sup, textarea, tt, var',
        contentUnformatted: 'pre',
        indentInnerHtml: false,
        preserveNewLines: true,
        maxPreserveNewLines: undefined,
        indentHandlebars: false,
        endWithNewline: false,
        extraLiners: 'head, body, /html',
        wrapAttributes: 'auto'
    };
    const optionsDefault = {
        format: formatDefaults,
        suggest: {},
        data: { useDefaultDataProvider: true }
    };
    function getConfigurationDefault(languageId) {
        return {
            completionItems: true,
            hovers: true,
            documentSymbols: true,
            links: true,
            documentHighlights: true,
            rename: true,
            colors: true,
            foldingRanges: true,
            selectionRanges: true,
            diagnostics: languageId === htmlLanguageId, // turned off for Razor and Handlebar
            documentFormattingEdits: languageId === htmlLanguageId, // turned off for Razor and Handlebar
            documentRangeFormattingEdits: languageId === htmlLanguageId // turned off for Razor and Handlebar
        };
    }
    const htmlLanguageId = 'html';
    const handlebarsLanguageId = 'handlebars';
    const razorLanguageId = 'razor';
    exports.htmlLanguageService = registerHTMLLanguageService(htmlLanguageId, optionsDefault, getConfigurationDefault(htmlLanguageId));
    exports.htmlDefaults = exports.htmlLanguageService.defaults;
    exports.handlebarLanguageService = registerHTMLLanguageService(handlebarsLanguageId, optionsDefault, getConfigurationDefault(handlebarsLanguageId));
    exports.handlebarDefaults = exports.handlebarLanguageService.defaults;
    exports.razorLanguageService = registerHTMLLanguageService(razorLanguageId, optionsDefault, getConfigurationDefault(razorLanguageId));
    exports.razorDefaults = exports.razorLanguageService.defaults;
    // export to the global based API
    monaco_editor_core_1.languages.html = {
        htmlDefaults: exports.htmlDefaults,
        razorDefaults: exports.razorDefaults,
        handlebarDefaults: exports.handlebarDefaults,
        htmlLanguageService: exports.htmlLanguageService,
        handlebarLanguageService: exports.handlebarLanguageService,
        razorLanguageService: exports.razorLanguageService,
        registerHTMLLanguageService
    };
    function getMode() {
        if (AMD) {
            return new Promise((resolve, reject) => {
                require(['vs/language/html/htmlMode'], resolve, reject);
            });
        }
        else {
            return new Promise((resolve_1, reject_1) => { require(['./htmlMode'], resolve_1, reject_1); });
        }
    }
    /**
     * Registers a new HTML language service for the languageId.
     * Note: 'html', 'handlebar' and 'razor' are registered by default.
     *
     * Use this method to register additional language ids with a HTML service.
     * The language server has to be registered before an editor model is opened.
     */
    function registerHTMLLanguageService(languageId, options = optionsDefault, modeConfiguration = getConfigurationDefault(languageId)) {
        const defaults = new LanguageServiceDefaultsImpl(languageId, options, modeConfiguration);
        let mode;
        // delay the initalization of the mode until the language is accessed the first time
        const onLanguageListener = monaco_editor_core_1.languages.onLanguage(languageId, () => __awaiter(this, void 0, void 0, function* () {
            mode = (yield getMode()).setupMode(defaults);
        }));
        return {
            defaults,
            dispose() {
                onLanguageListener.dispose();
                mode === null || mode === void 0 ? void 0 : mode.dispose();
                mode = undefined;
            }
        };
    }
    exports.registerHTMLLanguageService = registerHTMLLanguageService;
});
//# sourceMappingURL=monaco.contribution.js.map