/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.52.1(bc555dccc234a3f3b554fa41656557cd29d3061c)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/


// src/basic-languages/qsharp/qsharp.contribution.ts
import { registerLanguage } from "../_.contribution.js";
registerLanguage({
  id: "qsharp",
  extensions: [".qs"],
  aliases: ["Q#", "qsharp"],
  loader: () => {
    if (false) {
      return new Promise((resolve, reject) => {
        __require(["vs/basic-languages/qsharp/qsharp"], resolve, reject);
      });
    } else {
      return import("./qsharp.js");
    }
  }
});
