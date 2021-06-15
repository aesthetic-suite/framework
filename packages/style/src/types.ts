import { CacheManager, ClassName, Engine, SheetManager } from '@aesthetic/types';

export interface StyleEngine extends Engine<ClassName> {
	cacheManager: CacheManager;
	sheetManager: SheetManager;
}

export interface ServerStyleEngine extends StyleEngine {
	extractStyles: <T>(result?: T) => T;
}
