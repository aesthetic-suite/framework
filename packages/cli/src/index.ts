import init from './commands/Init';
import compile from './commands/Compile';

const argv = process.argv.slice(2);
let run: (argv: string[]) => Promise<unknown> = () => Promise.resolve();

// Temporary until this lands https://github.com/milesj/boost/pull/72
switch (argv[0]) {
  case 'init':
    run = init;
    break;

  case 'compile':
    run = compile;
    break;

  default:
    console.log('Commands available: init, compile');
    break;
}

run(argv).catch(error => {
  console.log(`ERROR: ${error.message}`);
  process.exitCode = 1;
});
