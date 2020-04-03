import { Program } from '@boost/cli';
import Init from './commands/Init';
import Compile from './commands/Compile';

const program = new Program({
  bin: 'aesthetic',
  name: 'Aesthetic Style Suite',
  version: '0.0.0',
});

program
  .register(new Init())
  .register(new Compile())
  .runAndExit(process.argv);
