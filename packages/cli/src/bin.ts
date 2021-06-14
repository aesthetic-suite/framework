import { Program } from '@boost/cli';
import Compile from './commands/Compile';
import Init from './commands/Init';
import Validate from './commands/Validate';

const banner = `  ¸ ¸__ __¸__¸  ¸¸__¸__¸ __
 /\\ |_ (_  | |__||_  | |/
/--\\|__¸_) | |  ||__ | |\\__`;

const program = new Program({
	banner,
	bin: 'aesthetic',
	name: 'Aesthetic Framework',
	// eslint-disable-next-line
	version: require('@aesthetic/core/package.json').version,
});

// eslint-disable-next-line @typescript-eslint/no-floating-promises
program
	.register(new Init())
	.register(new Compile())
	.register(new Validate())
	.runAndExit(process.argv);
