const fs = require('fs');
const path = require('path');
const { stdout } = process;

fs.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true}, (err, files) => {
  if (err)
    console.log(err);
  else {
    files.forEach(file => {
      if(file.isFile()){
        let fileName = file.name.split('.')[0]
        let rasshir = path.extname(file.name)
        let size = 0
        fs.stat(path.join(__dirname, 'secret-folder', file.name), (err, stats) => {
          if(err){
            console.log(err)
          }else{
            size += stats.size / 1024
          }
          stdout.write(`${fileName} - ${rasshir} - ${size}kb\n`)
        })
        
      }
    })
  }
})



