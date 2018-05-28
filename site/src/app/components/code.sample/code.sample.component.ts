import { AfterContentInit, Component, ContentChild, ElementRef, Input } from '@angular/core';
import { AbstractSnippetComponent } from '../snippets/abstract.snippet.component';

@Component({
  selector: 'blox-code-sample',
  templateUrl: './code.sample.component.html'
})
export class CodeSampleComponent implements AfterContentInit {
    @ContentChild(AbstractSnippetComponent) snippet;
    snippetNames: string[] = [];
    active: string;
    showCode = false;
    openStackblitz: Function = null;

    constructor(private elm: ElementRef) {
    }

    ngAfterContentInit() {
        if (this.snippet != null) {
            for (let name in this.snippet.code) {
                if (this.active == null)
                    this.active = name;
                if (this.snippet.code.hasOwnProperty(name))
                    this.snippetNames.push(name);
            }
        }
        if (!this.snippet.disableStackblitz)
            this.prepareStackblitz();
    }

    isActive(name: string) {
        return name === this.active || (name == null && !this.active);
    }

    activate(name) {
        this.active = name;
    }

    get stackblitzIcon() {
        if (this.snippet.disableStackblitz)
            return 'error';
        else
            return this.openStackblitz ? 'edit' : 'hourglass_empty'
    }

    stackblitz() {
        if (this.openStackblitz)
            this.openStackblitz();
    }

    prepareStackblitz() {
        // Note: module=esnext would allow to write this like:
        // import('@stackblitz/sdk').then(module => {
        //     ...
        // });
        require.ensure([], (require) => {
            const sdk = require('@stackblitz/sdk').default;
            const packageJson = require('../../../../package.json');
            const bundlePackageJson = require('../../../../../bundle/package.json');
            const mcwPackageJson = require('material-components-web/package.json');
            const angularVersion = packageJson['dependencies']['@angular/core'];
            const materialComponentsVersion = packageJson['dependencies']['material-components-web'];
            const bloxMaterialVersion = bundlePackageJson['version'];
            const files = {
                'angular.json': require('raw-loader!../../../stackblitz.template/angular.json.template'),
                'src/polyfills.ts': require('raw-loader!../../../stackblitz.template/src/polyfills.ts.template'),
                'src/main.ts': require('raw-loader!../../../stackblitz.template/src/main.ts.template'),
                'src/styles.scss': require('raw-loader!../../../stackblitz.template/src/styles.scss.template'),
                'src/index.html': require('raw-loader!../../../stackblitz.template/src/index.html.template'),
                'src/app/app.module.ts': require('raw-loader!../../../stackblitz.template/src/app/app.module.ts.template'),
            };
            const assetLocations = {
                'assets/img/mdc-demos/animal1.svg': require('assets/img/mdc-demos/animal1.svg'),
                'assets/img/mdc-demos/animal2.svg': require('assets/img/mdc-demos/animal2.svg'),
                'assets/img/mdc-demos/16-9.jpg': require('assets/img/mdc-demos/16-9.jpg'),
                'assets/img/mdc-demos/1-1.jpg': require('assets/img/mdc-demos/1-1.jpg'),
                'assets/img/banners/purple-header-design.jpg': require('assets/img/banners/purple-header-design.jpg')
            };
            const appTitle = this.elm.nativeElement.querySelector('h3').textContent;
            const mainSourceName = 'src/app/' + this.snippet.mainImport + '.ts';
            const templateSourceName = 'src/app/' + this.snippet.mainImport + '.html';
            const styleSourceName = 'src/app/' + this.snippet.mainImport + '.scss';
            let assets: string[] = [];
            if (this.snippet.code['html'])
                this.addAssets(this.snippet.code['html'], /\ssrc\s*=\s*\"(assets\/[^"]+)\"/g, assets);
            if (this.snippet.code['scss'])
                this.addAssets(this.snippet.code['scss'], /url\s*\(\s*~(assets\/[^\)]+)\)/g, assets);
        
            for (let file in files) {
                if (files.hasOwnProperty(file))
                    files[file] = files[file]
                        .replace(/\$\{appTitle\}/g, appTitle)
                        .replace(/\$\{mainElement\}/g, this.snippet.mainElement)
                        .replace(/\$\{mainComponent\}/g, this.snippet.mainComponent)
                        .replace(/\$\{mainImport\}/g, this.snippet.mainImport)
            };
            files[mainSourceName] = this.snippet.code['typescript'];
            files[templateSourceName] = this.fixAssets(this.snippet.code['html'], assetLocations, 'html', assets);
            if (this.snippet.code['scss'])
                files[styleSourceName] = this.fixAssets(
                    this.snippet.code['scss'].replace(/\@material/g, '~@material'),
                    assetLocations,
                    'scss',
                    assets).replace(/(\s*)(.*)stackblitz-skip-line(\s*:\s*)?(.*)/g, '$1// skip on stackblitz $2 $4');

            this.openStackblitz = () => {
                sdk.openProject({
                    files: files,
                    title: appTitle,
                    description: 'Blox Material: ' + appTitle,
                    template: 'angular-cli',
                    tags: ['blox-material', 'material-components-web', 'angular'],
                    dependencies: {
                        "@angular/common": angularVersion,
                        "@angular/core": angularVersion,
                        "@angular/forms": angularVersion,
                        "@angular/platform-browser": angularVersion,
                        "@angular/platform-browser-dynamic": angularVersion,
                        "@angular/router": angularVersion,
                        "tslib": packageJson['dependencies']['tslib'],
                        "material-components-web": materialComponentsVersion,
                        "@blox/material": bloxMaterialVersion,
                        ...mcwPackageJson['dependencies']
                    }
                }, {
                    openFile: files[templateSourceName] ? templateSourceName : mainSourceName,
                    newWindow: true,
                    hideDevTools: false
                });
            };
        }, 'ide');
    }

    addAssets(code: string, matcher: RegExp, assets: string[]) {
        let match = matcher.exec(code);
        while (match) {
            let asset = match[1];
            if (assets.indexOf(asset) === -1)
                assets.push(asset);
            match = matcher.exec(code);
        }
    }

    fixAssets(code: string, assetLocations: {[asset: string]: string}, type: 'html' | 'scss', assets: string[]) {
        for (let asset of assets) {
            // find the webpack generated url of the asset, but default to the original asset reference,
            // if we don't have an actual webpack location for the asset:
            let location = assetLocations[asset];
            location = location ? (document.location.origin + location) : asset;
            let origin = type === 'scss' ? ('~' + asset) : asset;
            code = code.split(origin).join(location);
        }
        return code;
    }
}
