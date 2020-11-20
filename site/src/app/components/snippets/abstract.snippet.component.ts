export class AbstractSnippetComponent {
    public mainElement: string;
    public mainComponent: string;
    public mainImport: string;
    public disableStackblitz = false;
    public cacheAssets: {[key: string]: string};

    constructor(public code: {[key: string]: string}, cacheAssets: {[key: string]: string} = {}) {
        for (let name in code) {
            if (code.hasOwnProperty(name))
                code[name] = this.rewrite(code[name]);
        }
        this.mainElement = this.extract(code['typescript'], /selector\s*\:\s*['"]([^'"]+)['"]/);
        this.mainComponent = this.extract(code['typescript'], /export\s+class\s+([a-zA-Z0-9_]+Component)/);
        this.mainImport = this.extract(code['typescript'], /templateUrl\s*\:\s*['"]\.\/([^'"]+)\.html['"]/);
        this.cacheAssets = cacheAssets;
    }

    rewrite(value: string | {default}): string {
        if (typeof value === 'string')
            return value
                .replace(/\s*\/\/\s*snip\:skip[\s\S]*?\/\/\s*snip:endskip.*/g, '')
                .replace(/\/\*\s*snip\:skip[\s\S]*?snip:endskip\*\//g, '')
                .replace(/.*snippet-skip-line.*/g, '')
                .replace(/^(?:[ \r]*\n)*/, '')  // drop empty lines from start
                .replace(/(?:\r?\n[ \r]*)*$/, '')  // drop empty lines from end
                ;
        return this.rewrite(value.default);
    }

    extract(code: string, matcher: RegExp) {
        try {
            return code.match(matcher)[1];
        } catch (e) {
            console.log(e);
            return 'error';
        }
    }
}
