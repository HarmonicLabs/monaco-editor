/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.1.0-dev0(c64ad4967a8a082b0b661da48b2f0c0c94982584)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/


// src/basic-languages/go/go.contribution.ts
import { registerLanguage } from "../_.contribution";
registerLanguage({
  id: "go",
  extensions: [".go"],
  aliases: ["Go"],
  loader: () => {
    if (false) {
      return new Promise((resolve, reject) => {
        __require(["vs/basic-languages/go/go"], resolve, reject);
      });
    } else {
      return import("./go");
    }
  }
});
