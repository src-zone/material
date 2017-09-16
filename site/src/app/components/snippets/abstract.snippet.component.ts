export class AbstractSnippetComponent {
    constructor(public code: {[key: string]: string}) {
        for (let name in code) {
            if (code.hasOwnProperty(name))
                code[name] = this.rewrite(code[name]);
        }
    }

    rewrite(value: string): string {
        return value
            .replace(/\s*\/\/\s*snip\:skip[\s\S]*?\/\/\s*snip:endskip.*/g, '')
            .replace(/\/\*\s*snip\:skip[\s\S]*?snip:endskip\*\//g, '')
            .replace(/.*snippet-skip-line.*/g, '')
            .replace(/^(?:[ \r]*\n)*/, '')  // drop empty lines from start
            .replace(/(?:\r?\n[ \r]*)*$/, '')  // drop empty lines from end
            ;
    }
}
