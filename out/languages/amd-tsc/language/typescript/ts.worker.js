/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "monaco-editor-core/esm/vs/editor/editor.worker", "./lib/typescriptServices", "./tsWorker", "./lib/lib"], function (require, exports, editor_worker_1, ts, tsWorker_1, lib_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ts = exports.libFileMap = exports.initialize = exports.create = exports.TypeScriptWorker = void 0;
    Object.defineProperty(exports, "initialize", { enumerable: true, get: function () { return editor_worker_1.initialize; } });
    exports.ts = ts;
    Object.defineProperty(exports, "TypeScriptWorker", { enumerable: true, get: function () { return tsWorker_1.TypeScriptWorker; } });
    Object.defineProperty(exports, "create", { enumerable: true, get: function () { return tsWorker_1.create; } });
    Object.defineProperty(exports, "libFileMap", { enumerable: true, get: function () { return lib_1.libFileMap; } });
    self.onmessage = () => {
        // ignore the first message
        (0, editor_worker_1.initialize)((ctx, createData) => {
            return (0, tsWorker_1.create)(ctx, createData);
        });
    };
});
//# sourceMappingURL=ts.worker.js.map