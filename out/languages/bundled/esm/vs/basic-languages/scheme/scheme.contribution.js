/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.1.0-dev0(c64ad4967a8a082b0b661da48b2f0c0c94982584)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/


// src/basic-languages/scheme/scheme.contribution.ts
import { registerLanguage } from "../_.contribution";
registerLanguage({
  id: "scheme",
  extensions: [".scm", ".ss", ".sch", ".rkt"],
  aliases: ["scheme", "Scheme"],
  loader: () => {
    if (false) {
      return new Promise((resolve, reject) => {
        __require(["vs/basic-languages/scheme/scheme"], resolve, reject);
      });
    } else {
      return import("./scheme");
    }
  }
});
