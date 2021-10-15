require('colors');
const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const SVGSpriter = require('svg-sprite');

const MARKDOWN_TABLE_COLUMNS = 5;

const resolveApp = (relativePath) => path.resolve(__dirname, '../', relativePath);

const readMeTemplate = fs.readFileSync(resolveApp('src/README.template.md')).toString();

// Ensure output dirs are present
fs.mkdirpSync(resolveApp('dist'), { recursive :true });
fs.outputFileSync(resolveApp('dist/ifind-icons-sprite.svg'), '');

// Allows for delay to ensure compiler generates the SVG sprite before we access it
// For some reason, spriter.compile runs late in the process
let compilerTimeAllowance = 0;

// Create spriter instance (see below for `config` examples)
var spriter = new SVGSpriter({
    svg: {
        xmlDeclaration: false,
        doctypeDeclaration: false,
        transform: [
            /**
             * Strip out all <style> elements
             *
             * @param {String} svg                  Sprite SVG
             * @return {String}                     Processed SVG
             */
            (svg) => {
                return svg.replace(/<style>.*?<\/style>/gi, '');
            }
        ]
    },
    mode: {
        css: false, // Create a «css» sprite
        view: false, // Create a «view» sprite
        defs: false, // Create a «defs» sprite
        symbol: true, // Create a «symbol» sprite
        stack: false // Create a «stack» sprite
    }
});

const iconFiles = glob.sync(resolveApp('src/icons/*.svg'));
const iconsList = [];

// Add SVG source files — the manual way ...
iconFiles.forEach(iconFile => {
    spriter.add(iconFile, null, fs.readFileSync(iconFile, {encoding: 'utf-8'}));
    iconsList.push(iconFile.split(/[\\\/]/g).pop().replace(/\..+$/, ''));
    compilerTimeAllowance += 25;
});

// Compile the sprite
spriter.compile((error, result) => {
    if ( error ) {
        console.error(error);
        process.exit(2);
    }
    for (let mode in result) {
        fs.outputFileSync(resolveApp('dist/ifind-icons-sprite.svg'), result.symbol.sprite.contents.toString());
    }
});

setTimeout(() => {
    const componentsStubContents = fs.readFileSync(resolveApp('src/components.stub')).toString();
    const spriteContents = fs.readFileSync(resolveApp('dist/ifind-icons-sprite.svg')).toString();
    const iconsListString = iconsList.map(iconName => `'${iconName}'`).join(',');
    const iconsTableMd = (
        Array.from({ length: MARKDOWN_TABLE_COLUMNS }).fill('').concat(
            Array.from({ length: MARKDOWN_TABLE_COLUMNS }).fill('---')
        )
    ).concat(iconsList).reduce((chunks, icon, index) => {
        const group = Math.floor(index / 5);
            chunks[group] = chunks[group] || [];
            chunks[group].push(icon || '');
            return chunks;
    }, []).map(row => `| ${row.join(' | ')} |`).join('  \n');

    const componentsContent = componentsStubContents
                                .replace(/%sprite_contents%/, spriteContents)
                                .replace(/%icons_list%/, iconsListString);

    Promise.all([
        (() => fs.outputFileSync(resolveApp('index.js'), componentsContent))(),
        (() => fs.outputFileSync(resolveApp('dist/icons.md'), iconsTableMd))(),
        (() => fs.outputFileSync(resolveApp('README.md'), (
            readMeTemplate.replace('{iconsTable}', iconsTableMd)
        )))(),
    ]).then(() => {
        console.log('Generated icons:'.green.bold);
        console.log(iconsList.slice(1).join(', ').green);
    });

}, compilerTimeAllowance);