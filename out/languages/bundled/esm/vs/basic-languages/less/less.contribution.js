/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.1.1(3a1ae58f11f2fd6a31f57e3092c094f5eee329de)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/


// src/basic-languages/less/less.contribution.ts
import { registerLanguage } from "../_.contribution";
registerLanguage({
  id: "less",
  extensions: [".less"],
  aliases: ["Less", "less"],
  mimetypes: ["text/x-less", "text/less"],
  loader: () => {
    if (false) {
      return new Promise((resolve, reject) => {
        __require(["vs/basic-languages/less/less"], resolve, reject);
      });
    } else {
      return import("./less");
    }
  }
});
