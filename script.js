const fs = require('fs')
const path = require('path')

let files = ['.eslintrc', '.vscode']

try {
  let copyFile = (src, dest) => {
    if (fs.existsSync(dest)) {
      // Merge
      let srcData = fs.readFileSync(src, 'utf8')
      let destData = fs.readFileSync(dest, 'utf8')

      if (destData === undefined) destData = {}

      let writeData = Object.assign(
        {},
        JSON.parse(destData),
        JSON.parse(srcData)
      )
      fs.writeFileSync(dest, JSON.stringify(writeData), 'utf8')
    } else {
      // Copy
      fs.openSync(dest, 'w')

      let srcData = fs.readFileSync(src, 'utf8')
      fs.writeFileSync(dest, srcData, 'utf8')
    }
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
