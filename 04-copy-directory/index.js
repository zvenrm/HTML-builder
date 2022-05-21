const fs = require('fs/promises');
const path = require('path');
const main = path.join(__dirname, 'files')
const copy = path.join(__dirname, 'files-copy')

async function copyDir(main, copy){
  await fs.mkdir(copy, {recursive: true})
  const readCopy = await fs.readdir(copy)
  readCopy.forEach(async e => {
    fs.access(path.join(main, e)).catch(() => {
      fs.rm(path.join(copy, e), {recursive: true})
    })
    
  })
  const readMain = await fs.readdir(main, {withFileTypes: true})
  readMain.forEach(async e => {
    if(e.isFile()){
      fs.copyFile(path.join(main, e.name), path.join(copy, e.name))
    }
    if(e.isDirectory()) {
      copyDir(path.join(main, e.name), path.join(copy, e.name))
    }
  })
}

copyDir(main, copy)