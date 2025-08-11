import type { JSONWorker } from './jsonWorker';
import { LanguageServiceDefaults } from './monaco.contribution';
import { Uri, IDisposable } from '../../fillers/monaco-editor-core';
export declare function getWorker(): Promise<(...uris: Uri[]) => Promise<JSONWorker>>;
export declare function setupMode(defaults: LanguageServiceDefaults): IDisposable;
export { WorkerManager } from './workerManager';
export * from '../common/lspLanguageFeatures';
