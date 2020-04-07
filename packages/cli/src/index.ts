import { Program } from '@boost/cli';
import Init from './commands/Init';
import Compile from './commands/Compile';
import Validate from './commands/Validate';

const banner = `  ¸ ¸__ __¸__¸  ¸¸__¸__¸ __
 /\\ |_ (_  | |__||_  | |/
/--\\|__¸_) | |  ||__ | |\\__`;

const program = new Program({
  banner,
  bin: 'aesthetic',
  name: 'Aesthetic Style Framework',
  version: '0.0.0',
});

program
  .register(new Init())
  .register(new Compile())
  .register(new Validate())
  .runAndExit(process.argv);
