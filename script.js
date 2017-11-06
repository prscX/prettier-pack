const fs = require('fs')
const path = require('path')

let files = ['.eslintrc', '.vscode']

try {
  let copyFile = (src, dest) => {
    if (!fs.existsSync(dest)) fs.closeSync(fs.openSync(dest, 'w'))

    let data = fs.readFileSync(src, 'utf8')
    fs.writeFileSync(dest, data, 'utf8')
  }

  files.forEach(file => {
    let srcPath = `${__dirname}/${file}`
    let destPath = path.normalize(`${__dirname}/../../${file}`)
    let stat = fs.statSync(srcPath)

    if (stat.isDirectory()) {
      let items = fs.readdirSync(srcPath).filter(item => item !== '.DS_Store')
      if (!fs.existsSync(destPath)) fs.mkdirSync(destPath)

      items.forEach(item => {
        let itemStat = fs.statSync(`${srcPath}/${item}`)

        if (itemStat.isFile()) {
          copyFile(`${srcPath}/${item}`, `${destPath}/${item}`)
        }
      })
    }

    if (stat.isFile()) {
      copyFile(srcPath, destPath)
    }
  })
} catch (e) {
  console.log('Prettier Pack Error : ', e)
}
