const fs = require('fs')
const fsProm = require('fs/promises')
const path = require('path');


(async function (){
  const readTemplate = await fsProm.readFile(path.join(__dirname, 'template.html'), 'utf-8')
  let str = ''
  str += readTemplate
  const readComponents = await fsProm.readdir(path.join(__dirname, 'components'), {withFileTypes: true})
  for(let file of readComponents){
    
    if(file.isFile() && path.extname(file.name) === '.html'){
      if(str.includes(`{{${file.name.split('.')[0]}}}`)){
        const readHtml = await fsProm.readFile(path.join(__dirname, 'components', file.name), 'utf-8')
        str = str.replace(`{{${file.name.split('.')[0]}}}`, readHtml)
      }
    }
  }
  await fsProm.mkdir(path.join(__dirname, 'project-dist'), {recursive: true})
  const indexWrite = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'))
  indexWrite.write(str)

  const writeCss = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));
  const readStyles = await fsProm.readdir(path.join(__dirname, 'styles'), {withFileTypes: true})
  for(let file of readStyles){
    if(file.isFile() && path.extname(file.name) === '.css'){
      const readCss = fs.createReadStream(path.join(__dirname, 'styles', file.name), 'utf-8');
      readCss.on('data', chunk => {
        writeCss.write(chunk)
      });
    }
  }
})()

const main = path.join(__dirname, 'assets')
const copy = path.join(__dirname, 'project-dist', 'assets')

async function copyAssets(main, copy){
  await fsProm.mkdir(copy, {recursive: true})
  const readCopy = await fsProm.readdir(copy)
  readCopy.forEach(async e => {
    await fsProm.access(path.join(main, e)).catch(() => {
      fs.rm(path.join(copy, e), {recursive: true})
    })
  })
  const readMain = await fsProm.readdir(main, {withFileTypes: true})
  readMain.forEach(async e => {
    if(e.isFile()){
      await fsProm.copyFile(path.join(main, e.name), path.join(copy, e.name))
    }
    if(e.isDirectory()) {
      copyAssets(path.join(main, e.name), path.join(copy, e.name))
    }
  })
}

copyAssets(main, copy)