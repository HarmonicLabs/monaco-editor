/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.3.0(99258a6af3cc9bfb468fb888a11f1b9443942772)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/


// src/basic-languages/pebble/pebble.contribution.ts
import { registerLanguage } from "../_.contribution.js";
registerLanguage({
  id: "pebble",
  extensions: [".pebble"],
  aliases: ["Pebble"],
  loader: () => {
    if (false) {
      return new Promise((resolve, reject) => {
        __require(["vs/basic-languages/pebble/pebble"], resolve, reject);
      });
    } else {
      return import("./pebble.js");
    }
  }
});
