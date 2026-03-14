/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.1.0(cb15af7e418c72dc4c483df371d5b618279625c6)
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
