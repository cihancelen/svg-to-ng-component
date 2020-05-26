const fs = require('fs');

let componentString = `import { Component, OnInit } from '@angular/core'; \n`;
const componentsNames = [];

/**
 * 
 * @param {String} pathname Svg Files Directory
 * @param {*} fileOptions 
 * @param {*} options 
 */
function ConvertIconComponentSvgFiles(pathname, fileOptions = { componentFileToWriteName, moduleFileToWriteName }, options = { selectorPrefix: 'icon' }) {
    const files = fs.readdirSync(pathname, 'utf-8');

    files.forEach(file => {
        const fileContent = fs.readFileSync(`${pathname}/${file}`, 'utf-8');

        const spritedName = file.substring(0, file.length - 4);
        const filenameArr = spritedName.split('-');

        let componentName = '';

        filenameArr.forEach(e => componentName += e.charAt(0).toLocaleUpperCase() + e.substring(1));

        componentsNames.push(componentName);

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

    fs.writeFile(fileOptions.componentFileToWriteName, componentString, (err) => {
        if (err) { console.log(err); return; }
    });

    const moduleString = `
        import { NgModule } from '@angular/core';
        import { CommonModule } from '@angular/common';
        
        import { ${componentsNames.map(name => `Icon${name}Component`)} } from './${fileOptions.componentFileToWriteName}';
        
        @NgModule({
            imports: [
                CommonModule
            ],
            exports: [
                ${componentsNames.map(name => `Icon${name}Component`)}
            ],
            declarations: [
                ${componentsNames.map(name => `Icon${name}Component`)}
            ],
            providers: [],
        })
        export class IconsModule { }
    `;

    fs.writeFile(fileOptions.moduleFileToWriteName, moduleString, (err) => {
        if (err) { console.log(err); return; }
    });
}


ConvertIconComponentSvgFiles('iconsfolder', {
    componentFileToWriteName: 'icons.component.ts',
    moduleFileToWriteName: 'icons.module.ts'
}, {
    selectorPrefix: 'icon',
})
