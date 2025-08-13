/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.1.0-dev1(584153b8cfacf9f26e0b0ffed5942f3277b49869)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/


// src/basic-languages/python/python.contribution.ts
import { registerLanguage } from "../_.contribution";
registerLanguage({
  id: "python",
  extensions: [".py", ".rpy", ".pyw", ".cpy", ".gyp", ".gypi"],
  aliases: ["Python", "py"],
  firstLine: "^#!/.*\\bpython[0-9.-]*\\b",
  loader: () => {
    if (false) {
      return new Promise((resolve, reject) => {
        __require(["vs/basic-languages/python/python"], resolve, reject);
      });
    } else {
      return import("./python");
    }
  }
});
