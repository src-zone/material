var shell = require('shelljs');
const git = require('simple-git/promise')();
const bumpVersion = require(`conventional-recommended-bump`);

shell.config.fatal = true;

bumpVersion({preset: `angular`}, (error, recommendation) => {
    checkBranch().then(() => {
        let bump = recommendation.releaseType;
        if (error)
            console.warn('problem extracting bump version: ', error);
        if (!bump) {
            console.log('nothing to release');
            shell.exit(1);
        }
        console.log(`${bump} version bump requested: ${recommendation.reason}`);
        if (bump !== 'minor' && bump !== 'patch')
            // we don't do major releases, we want to stay in 0.x.y:
            bump = 'minor';

        console.log('but this branch is configured as beta branch, so making the next beta release');
        bump = 'prerelease';
        
        prepare('bundle', bump);
        prepare('site', bump);
    });
});

function prepare(name, bump, prereleaseId) {
    console.log(`bumping npm version for: ${name}`);
    shell.cd(name);
    try {
        shell.exec(`npm version ${bump} ${prereleaseId ? ('--preid=' + prereleaseId) : ''} --no-git-tag-version`);
    } finally {
        shell.cd('..');
    }
    const version = require(`../${name}/package.json`).version;

    console.log(`generating changelog for: ${name} v${version}`);
    shell.exec(`conventional-changelog -p angular -i ${name}/CHANGELOG.md -s -k ${name} --commit-path ${name}`);
    shell.mv(`${name}/CHANGELOG.md`, `${name}/CHANGELOG.md.bak`);
    shell.ShellString(`<a name="${version}"></a>\n`).to(`${name}/CHANGELOG.md`);
    shell.cat(`${name}/CHANGELOG.md.bak`).toEnd(`${name}/CHANGELOG.md`);
    shell.rm(`${name}/CHANGELOG.md.bak`);
    
    console.log(`changelog generated for: ${name} v${version}`);
}

async function checkBranch() {
    const status = await git.status();
    if (status.tracking !== 'origin/master')
        console.warn('WARN: you are not on the origin/master branch, so you are not allowed to commit a release here!');
    else if (status.behind > 0)
        console.warn(`WARN: you are ${status.behind} commits behind the master branch, please pull changes before preparing a release`);
    else if (status.modified.length || status.conflicted.length || status.created.length || status.deleted.length || status.renamed.length)
        console.warn('WARN: you are not on a clean branch, please commit your changes before preparing a release');
}
