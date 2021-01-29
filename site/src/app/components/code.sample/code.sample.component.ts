import { AfterContentInit, Component, ContentChild, ElementRef, Input } from '@angular/core';
import { Angulartics2 } from 'angulartics2';
import { AbstractSnippetComponent } from '../snippets/abstract.snippet.component';

@Component({
  selector: 'blox-code-sample',
  templateUrl: './code.sample.component.html'
})
export class CodeSampleComponent implements AfterContentInit {
    @ContentChild(AbstractSnippetComponent) snippet: AbstractSnippetComponent;
    readonly snippetNames: string[] = [];
    active: string;
    hasSource = false;
    private _showCode = false;
    openStackblitz: Function = null;

    constructor(private elm: ElementRef, private angulartics2: Angulartics2) {
    }

    ngAfterContentInit() {
        if (this.snippet != null) {
            this.hasSource = true;
            for (let name in this.snippet.code) {
                if (this.active == null)
                    this.active = name;
                if (this.snippet.code.hasOwnProperty(name))
                    this.snippetNames.push(name);
            }
            if (!this.snippet.disableStackblitz)
                this.prepareStackblitz();
        }
    }

    isActive(name: string) {
        return name === this.active || (name == null && !this.active);
    }

    activate(name) {
        this.active = name;
    }

    get disableStackblitz() {
        return this.snippet == null || this.snippet.disableStackblitz;
    }

    get showCode() {
        return this._showCode;
    }

    set showCode(value: boolean) {
        this._showCode = value;
        if (this._showCode)
            this.trackViewCode('view', this.snippet.mainElement);
    }

    get stackblitzIcon() {
        if (this.disableStackblitz)
            return 'error';
        else
            return this.openStackblitz ? 'edit' : 'hourglass_empty'
    }

    language(source) {
        const extension = source.substring(source.lastIndexOf('.') + 1);
        if (extension === 'ts')
            return 'typescript';
        return extension;
    }

    stackblitz() {
        if (this.openStackblitz)
            this.openStackblitz();
    }

    prepareStackblitz() {
        import(/* webpackChunkName: "ide" */'@stackblitz/sdk').then(mod => {
            const sdk = mod.default;
            const packageJson = require('../../../../package.json');
            const bundlePackageJson = require('../../../../../bundle/package.json');
            const mcwPackageJson = require('material-components-web/package.json');
            const angularVersion = packageJson['dependencies']['@angular/core'];
            const materialComponentsVersion = packageJson['dependencies']['material-components-web'];
            const bloxMaterialVersion = bundlePackageJson['version'];
            const focusTrapVersion = packageJson['dependencies']['focus-trap'];
            const files = {
                'angular.json': require('raw-loader!../../../stackblitz.template/angular.json.template').default,
                'tsconfig.json': require('raw-loader!../../../stackblitz.template/tsconfig.json.template').default,
                'src/polyfills.ts': require('raw-loader!../../../stackblitz.template/src/polyfills.ts.template').default,
                'src/main.ts': require('raw-loader!../../../stackblitz.template/src/main.ts.template').default,
                'src/styles.scss': require('raw-loader!../../../stackblitz.template/src/styles.scss.template').default,
                'src/index.html': require('raw-loader!../../../stackblitz.template/src/index.html.template').default
            };
            if (this.snippet.options.noBodyMargins)
                files['src/styles.scss'] = files['src/styles.scss'].replace('body {', 'body {\n  margin: 0;');

            for (let name in this.snippet.code) {
                if (this.snippet.code.hasOwnProperty(name) && name.indexOf('.') !== -1)
                    files[`src/app/${name}`] = this.snippet.code[name];
            }
            if (!files['src/app/app.module.ts'])
                files['src/app/app.module.ts'] = require('raw-loader!../../../stackblitz.template/src/app/app.module.ts.template').default;
            const appTitle = this.elm.nativeElement.querySelector('h3').textContent;
            const mainSourceName = 'src/app/' + this.snippet.mainImport + '.ts';
            const templateSourceName = 'src/app/' + this.snippet.mainImport + '.html';
            const styleSourceName = 'src/app/' + this.snippet.mainImport + '.scss';
            let assets: string[] = [];
            if (this.snippet.code['html'])
                this.addAssets(this.snippet.code['html'], /\ssrc\s*=\s*\"(\/?assets\/[^"]+)\"/g, assets);
            if (this.snippet.code['scss'])
                // TODO relative path?
                this.addAssets(this.snippet.code['scss'], /url\s*\(\s*([^)]*\/?assets\/[^\)]+)\)/g, assets);
        
            for (let file in files) {
                if (files.hasOwnProperty(file))
                    files[file] = files[file]
                        .replace(/\$\{appTitle\}/g, appTitle)
                        .replace(/\$\{mainElement\}/g, this.snippet.mainElement)
                        .replace(/\$\{mainComponent\}/g, this.snippet.mainComponent)
                        .replace(/\$\{mainImport\}/g, this.snippet.mainImport)
            };
            files[mainSourceName] = this.fixAssetsInTs(this.snippet.code['typescript'], this.snippet.cacheAssets);
            files[templateSourceName] = this.fixAssets(this.snippet.code['html'], assets, this.snippet.cacheAssets);
            if (this.snippet.code['scss'])
                files[styleSourceName] = this.fixAssets(
                    this.snippet.code['scss'].replace(/\@material/g, '~@material'),
                    assets,
                    this.snippet.cacheAssets).replace(/(\s*)(.*)stackblitz-skip-line(\s*:\s*)?(.*)/g, '$1// skip on stackblitz $2 $4');

            this.openStackblitz = () => {
                this.trackViewCode('stackblitz', this.snippet.mainElement);
                sdk.openProject({
                    files: files,
                    title: appTitle,
                    description: 'Blox Material: ' + appTitle,
                    template: 'angular-cli',
                    tags: ['blox-material', 'material-components-web', 'angular'],
                    dependencies: {
                        "@angular/animations": angularVersion,
                        "@angular/common": angularVersion,
                        "@angular/compiler": angularVersion,
                        "@angular/core": angularVersion,
                        "@angular/forms": angularVersion,
                        "@angular/platform-browser": angularVersion,
                        "@angular/platform-browser-dynamic": angularVersion,
                        "@angular/router": angularVersion,
                        "tslib": packageJson['dependencies']['tslib'],
                        "material-components-web": materialComponentsVersion,
                        "@blox/material": bloxMaterialVersion,
                        ...mcwPackageJson['dependencies'],
                        "focus-trap": focusTrapVersion
                    }
                }, {
                    openFile: files[templateSourceName] ? templateSourceName : mainSourceName,
                    newWindow: true,
                    hideDevTools: false
                });
            };
        });
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

    fixAssetsInTs(code: string, cacheAssets: {[key: string]: string}) {
        for (let asset of Object.keys(cacheAssets)) {
            const requireAsset = `require('!file-loader!${asset}').default`;
            const location = `"${document.location.origin}/${cacheAssets[asset]}"`;
            code = code.split(requireAsset).join(location);
        }
        return code;
    }

    fixAssets(code: string, assets: string[], cacheAssets: {[key: string]: string}) {
        for (let asset of assets) {
            if (cacheAssets[asset]) {
                const location = `${document.location.origin}/${cacheAssets[asset]}`;
                code = code.split(asset).join(location);
            } else {
                const path = asset.startsWith('/') ? asset : `/${asset}`;
                const location = `${document.location.origin}${path}`;
                code = code.split(asset).join(location);
            }
        }
        return code;
    }

    trackViewCode(action: string, label: string) {
        this.angulartics2.eventTrack.next({
            action: action,
            properties: {
                category: 'sourcecode',
                label: label
            }
        });
    }
}
