/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.1.1(3a1ae58f11f2fd6a31f57e3092c094f5eee329de)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/


// src/basic-languages/sb/sb.contribution.ts
import { registerLanguage } from "../_.contribution.js";
registerLanguage({
  id: "sb",
  extensions: [".sb"],
  aliases: ["Small Basic", "sb"],
  loader: () => {
    if (false) {
      return new Promise((resolve, reject) => {
        __require(["vs/basic-languages/sb/sb"], resolve, reject);
      });
    } else {
      return import("./sb.js");
    }
  }
});
