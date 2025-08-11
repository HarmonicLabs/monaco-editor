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
    exports.WorkerManager = void 0;
    class WorkerManager {
        constructor(_modeId, _defaults) {
            this._modeId = _modeId;
            this._defaults = _defaults;
            this._worker = null;
            this._client = null;
            this._configChangeListener = this._defaults.onDidChange(() => this._stopWorker());
            this._updateExtraLibsToken = 0;
            this._extraLibsChangeListener = this._defaults.onDidExtraLibsChange(() => this._updateExtraLibs());
        }
        dispose() {
            this._configChangeListener.dispose();
            this._extraLibsChangeListener.dispose();
            this._stopWorker();
        }
        _stopWorker() {
            if (this._worker) {
                this._worker.dispose();
                this._worker = null;
            }
            this._client = null;
        }
        _updateExtraLibs() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this._worker) {
                    return;
                }
                const myToken = ++this._updateExtraLibsToken;
                const proxy = yield this._worker.getProxy();
                if (this._updateExtraLibsToken !== myToken) {
                    // avoid multiple calls
                    return;
                }
                proxy.updateExtraLibs(this._defaults.getExtraLibs());
            });
        }
        _getClient() {
            if (!this._client) {
                this._client = (() => __awaiter(this, void 0, void 0, function* () {
                    this._worker = monaco_editor_core_1.editor.createWebWorker({
                        // module that exports the create() method and returns a `TypeScriptWorker` instance
                        moduleId: 'vs/language/typescript/tsWorker',
                        label: this._modeId,
                        keepIdleModels: true,
                        // passed in to the create() method
                        createData: {
                            compilerOptions: this._defaults.getCompilerOptions(),
                            extraLibs: this._defaults.getExtraLibs(),
                            customWorkerPath: this._defaults.workerOptions.customWorkerPath,
                            inlayHintsOptions: this._defaults.inlayHintsOptions
                        }
                    });
                    if (this._defaults.getEagerModelSync()) {
                        return yield this._worker.withSyncedResources(monaco_editor_core_1.editor
                            .getModels()
                            .filter((model) => model.getLanguageId() === this._modeId)
                            .map((model) => model.uri));
                    }
                    return yield this._worker.getProxy();
                }))();
            }
            return this._client;
        }
        getLanguageServiceWorker(...resources) {
            return __awaiter(this, void 0, void 0, function* () {
                const client = yield this._getClient();
                if (this._worker) {
                    yield this._worker.withSyncedResources(resources);
                }
                return client;
            });
        }
    }
    exports.WorkerManager = WorkerManager;
});
//# sourceMappingURL=workerManager.js.map