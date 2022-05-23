const path = require('path');
const fs = require('fs');
const writeStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));
const { stdout, stdin, exit } = require('process');
const theEnd = function () {
  stdout.write('\nGoodbye!');
  exit();
};
stdout.write('Input text (`Ctrl+C` or `exit` - for stop)\n');
stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    theEnd();
  }
  writeStream.write(data);
});
process.on('SIGINT', theEnd);
