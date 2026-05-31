/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.3.0(99258a6af3cc9bfb468fb888a11f1b9443942772)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/


// src/basic-languages/redshift/redshift.contribution.ts
import { registerLanguage } from "../_.contribution.js";
registerLanguage({
  id: "redshift",
  extensions: [],
  aliases: ["Redshift", "redshift"],
  loader: () => {
    if (false) {
      return new Promise((resolve, reject) => {
        __require(["vs/basic-languages/redshift/redshift"], resolve, reject);
      });
    } else {
      return import("./redshift.js");
    }
  }
});
