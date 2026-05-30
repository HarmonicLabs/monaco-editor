/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.3.0(ac52b6cdaca99cc013737a6bc5384d119217cc53)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/


// src/basic-languages/postiats/postiats.contribution.ts
import { registerLanguage } from "../_.contribution.js";
registerLanguage({
  id: "postiats",
  extensions: [".dats", ".sats", ".hats"],
  aliases: ["ATS", "ATS/Postiats"],
  loader: () => {
    if (false) {
      return new Promise((resolve, reject) => {
        __require(["vs/basic-languages/postiats/postiats"], resolve, reject);
      });
    } else {
      return import("./postiats.js");
    }
  }
});
