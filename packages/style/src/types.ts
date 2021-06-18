import { CacheManager, ClassName, Engine, Rule, SheetManager } from '@aesthetic/types';

export interface StyleEngine extends Engine<Rule, ClassName> {
	cacheManager: CacheManager<ClassName>;
	sheetManager: SheetManager;
}

export interface ServerStyleEngine extends StyleEngine {
	extractStyles: <T>(result?: T) => T;
}
