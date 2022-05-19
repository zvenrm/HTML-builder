const fs = require('fs');
const path = require('path');
const main = path.join(__dirname, 'files')
const copy = path.join(__dirname, 'files-copy')

const copyDir = (main, copy) => {
  fs.mkdir(copy, { recursive: true }, (err) => {
    if (err) {
      console.error(err);
    }
    console.log('Directory created successfully!');
  });

  fs.readdir(copy, (err, files) => {
    if (err)
      console.log(err);
    else {
      files.forEach(file => {
        fs.access(path.join(main, file), (err) => {
          if (err) {
            fs.rm(path.join(copy, file), { recursive: true, force: true}, (err)   => {
              if (err) throw err;
            });
          }
        });
      })
    }
  })

  fs.readdir(main, {withFileTypes: true}, (err, files) => {
    if (err)
      console.log(err);
    else {
      files.forEach(file => {
        if(file.isFile()){
          fs.copyFile(path.join(main, file.name), path.join(copy, file.name), (err) => {
            if (err) throw err;
          })
        }
        if(file.isDirectory()) {
          copyDir(path.join(main, file.name), path.join(copy, file.name))
        }
      })
    }
  })
}

copyDir(main, copy)