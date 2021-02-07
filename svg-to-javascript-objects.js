const fs = require('fs');

const ICONS_PATH = 'icons';

const files = fs.readdirSync(ICONS_PATH);

let lastContent = ``;
const fileNames = [];

files.forEach(file => {
  if (file.toLowerCase().includes('.ds_store')) return;

  const fileContent = fs.readFileSync(`${ICONS_PATH}/${file}`, 'utf-8');
  let iconName = file.toLowerCase().substring(0, file.length - 4).replace(' ', '-');
  console.log(iconName);
  const iconObjectName = iconName.split('-').map(o => o.charAt(0).toUpperCase() + o.substring(1)).reduce((acc, cur) => cur + acc, '');

  fileNames.push({objName: iconName, className: iconObjectName});

  const pattern = `
    export const ${iconObjectName} = \x60 ${fileContent} \x60;
  `

  lastContent += pattern;
})

lastContent += `
  export const allIcons = { ${
    fileNames.map(o => `'${o.objName}': ${o.className}`).join()
  } } as any;
`

fs.writeFileSync('icons.ts', lastContent);