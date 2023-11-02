import { basename } from 'path';

import {makeData, SPECS} from './make-data.js';

function main(argv: string[]) {
  const specs = Object.keys(SPECS);
  if (argv.length !== 1 || !specs.includes(argv[0])) {
    console.error(`usage: ${basename(process.argv[1])} ${specs.join('|')}`);
    process.exit(1);
  }
  console.log(JSON.stringify(makeData(argv[0]), null, 2));
}

main(process.argv.slice(2));
