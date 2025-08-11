/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "../_.contribution"], function (require, exports, __contribution_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    (0, __contribution_1.registerLanguage)({
        id: 'csp',
        extensions: ['.csp'],
        aliases: ['CSP', 'csp'],
        loader: () => {
            if (AMD) {
                return new Promise((resolve, reject) => {
                    require(['vs/basic-languages/csp/csp'], resolve, reject);
                });
            }
            else {
                return new Promise((resolve_1, reject_1) => { require(['./csp'], resolve_1, reject_1); });
            }
        }
    });
});
//# sourceMappingURL=csp.contribution.js.map