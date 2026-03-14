/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.1.1(3a1ae58f11f2fd6a31f57e3092c094f5eee329de)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/


// src/basic-languages/pebble/pebble.contribution.ts
import { registerLanguage } from "../_.contribution";
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
      return import("./pebble");
    }
  }
});
