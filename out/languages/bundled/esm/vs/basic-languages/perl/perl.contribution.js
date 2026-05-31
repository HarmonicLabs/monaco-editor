/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.3.0(99258a6af3cc9bfb468fb888a11f1b9443942772)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/


// src/basic-languages/perl/perl.contribution.ts
import { registerLanguage } from "../_.contribution";
registerLanguage({
  id: "perl",
  extensions: [".pl", ".pm"],
  aliases: ["Perl", "pl"],
  loader: () => {
    if (false) {
      return new Promise((resolve, reject) => {
        __require(["vs/basic-languages/perl/perl"], resolve, reject);
      });
    } else {
      return import("./perl");
    }
  }
});
