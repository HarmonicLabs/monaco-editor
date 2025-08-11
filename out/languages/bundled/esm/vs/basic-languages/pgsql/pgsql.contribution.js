/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.52.1(bc555dccc234a3f3b554fa41656557cd29d3061c)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/


// src/basic-languages/pgsql/pgsql.contribution.ts
import { registerLanguage } from "../_.contribution";
registerLanguage({
  id: "pgsql",
  extensions: [],
  aliases: ["PostgreSQL", "postgres", "pg", "postgre"],
  loader: () => {
    if (false) {
      return new Promise((resolve, reject) => {
        __require(["vs/basic-languages/pgsql/pgsql"], resolve, reject);
      });
    } else {
      return import("./pgsql");
    }
  }
});
