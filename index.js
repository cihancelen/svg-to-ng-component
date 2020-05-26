const fs = require('fs');

let componentString = `import { Component, OnInit } from '@angular/core'; \n`;

function ConvertIconComponentSvgFiles(pathname, fileToWriteName, options = { selectorPrefix: 'icon' }) {
    const files = fs.readdirSync(pathname, 'utf-8');

    files.forEach(file => {
        const fileContent = fs.readFileSync(`${pathname}/${file}`, 'utf-8');

        const spritedName = file.substring(0, file.length - 4);
        const filenameArr = spritedName.split('-');

        let componentName = '';

        filenameArr.forEach(e => componentName += e.charAt(0).toLocaleUpperCase() + e.substring(1));

        componentString += `
                @Component({
                    selector: '${options.selectorPrefix}-${spritedName.toLocaleLowerCase()}',
                    template: \x60
                        ${fileContent.replace('<?xml version="1.0" encoding="UTF-8"?>', '')}
                    \x60
                })
                export class Icon${componentName}Component implements OnInit {
                    
                    constructor() { }
    
                    ngOnInit() { }
    
                }
            `;
    })

    fs.writeFile('component.ts', componentString, (err) => {
        if (err) { console.log(err); return; }
    });
}


ConvertIconComponentSvgFiles('iconsfolder', 'icons.ts', {
    selectorPrefix: 'icon',
})
