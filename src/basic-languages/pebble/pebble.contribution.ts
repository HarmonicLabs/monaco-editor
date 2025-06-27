/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerLanguage } from '../_.contribution';

declare var AMD: any;
declare var require: any;

registerLanguage({
	id: 'pebble',
	extensions: ['.pebble'],
	aliases: ['Pebble'],
	loader: (): Promise<any> => {
		if (AMD) {
			return new Promise((resolve, reject) => {
				require(['vs/basic-languages/pebble/pebble'], resolve, reject);
			});
		} else {
			return import('./pebble');
		}
	}
});
