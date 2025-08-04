/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import cp = require('child_process');
import path = require('path');
import fs = require('fs');

function huskyInstall() {
	const huskyBin = path.join(__dirname, '../node_modules/husky/lib/bin.js');

	if (!fs.existsSync(huskyBin)) {
		console.warn('⚠️ Husky not found. Skipping husky install.');
		return;
	}

	console.log('Installing husky hooks...');
	console.log('$ husky install');

	const result = cp.spawnSync(process.execPath, [huskyBin, 'install'], { stdio: 'inherit' });

	if (result.error || result.status !== 0) {
		console.error('❌ Husky install failed.');
		process.exit(1);
	}
}

huskyInstall();
