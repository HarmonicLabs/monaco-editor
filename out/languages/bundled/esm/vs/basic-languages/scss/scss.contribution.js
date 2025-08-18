/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.1.0-dev1(5f53c74686d6eed60f9d2fcfdf2a6ad35b446fcf)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/


// src/basic-languages/scss/scss.contribution.ts
import { registerLanguage } from "../_.contribution";
registerLanguage({
  id: "scss",
  extensions: [".scss"],
  aliases: ["Sass", "sass", "scss"],
  mimetypes: ["text/x-scss", "text/scss"],
  loader: () => {
    if (false) {
      return new Promise((resolve, reject) => {
        __require(["vs/basic-languages/scss/scss"], resolve, reject);
      });
    } else {
      return import("./scss");
    }
  }
});
