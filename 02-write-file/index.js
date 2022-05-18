const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;
const output = fs.createWriteStream(path.join(__dirname, 'file.txt'));

stdout.write('Привет, введи текст\n')
stdin.on('data', data => {
  if(data.toString().trim() !== 'exit'){
    output.write(data.toString())
  }
  else {
    stdout.write('До встречи!')
    process.exit()
  }
});

process.on('SIGINT', () => {
  stdout.write('До встречи!')
  process.exit();
});