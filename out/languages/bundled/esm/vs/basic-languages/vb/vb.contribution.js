/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.1.0-dev3(5f53c74686d6eed60f9d2fcfdf2a6ad35b446fcf)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/


// src/basic-languages/vb/vb.contribution.ts
import { registerLanguage } from "../_.contribution";
registerLanguage({
  id: "vb",
  extensions: [".vb"],
  aliases: ["Visual Basic", "vb"],
  loader: () => {
    if (false) {
      return new Promise((resolve, reject) => {
        __require(["vs/basic-languages/vb/vb"], resolve, reject);
      });
    } else {
      return import("./vb");
    }
  }
});
