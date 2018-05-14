const {readFileSync} = require('fs');
const git = require('simple-git/promise')();
const version = JSON.parse(readFileSync('lerna.json', 'utf8'))['version'];

function checkModified(modifications, file) {
    if (modifications.indexOf(file) === -1)
        throw new Error('the file ' + file + ' is not modified, so what release changes are you actually trying to commit?');
}

function checkNotAllowedModifications(modifications) {
    modifications.every(file => {
        if ([
            'lerna.json',
            'CHANGELOG.md',
            'package.json',
            'package-lock.json',
            'bundle/CHANGELOG.md',
            'bundle/package.json',
            'bundle/package-lock.json',
            'site/CHANGELOG.md',
            'site/package.json',
            'site/package-lock.json'
            ].indexOf(file) === -1)
            throw new Error('the file ' + file + ' is modified, a release commit may not contain modifications for that file');
    });
}

async function tagRelease () {
    const status = await git.status();
    if (status.tracking !== 'origin/master')
        throw new Error('you are not on the origin/master branch, tagging is only allowed when tracking origin/master');
    if (status.behind > 0)
        throw new Error('you are ' + status.behind + ' commits behind the master branch, please pull changes before tagging a release');
    if (status.conflicted.length > 0)
        throw new Error('there are conflicts, a merge commit should not be commited as release');
    if (status.created.length > 0)
        throw new Error('there are staged new files, a release commit should only contain modifications');
    if (status.deleted.length > 0)
        throw new Error('there are deleted files, a release commit should only contain modifications');
    if (status.renamed.length > 0)
        throw new Error('there are renames, a release commit should only contain modifications');
    checkModified(status.modified, 'lerna.json');
    checkModified(status.modified, 'bundle/package.json');
    checkModified(status.modified, 'site/package.json');
    checkNotAllowedModifications(status.modified);
    const tags = await git.tags();
    if (tags.all.indexOf(version) !== -1)
        throw new Error('the version (read from lerna.json) to tag already exists on the git repo: ' + version);
    console.log('commiting release changes for v' + version);
    await git.commit('v' + version, status.modified);
    console.log('tagging version v' + version);
    await git.tag(['-a', 'v' + version, '-m', 'v' + version]);
    await git.push();
}

tagRelease().then(
    () => {
        console.log('tagged version v' + version);
        console.log('please \'git push\' so that CI will build, test, and publish the release to NPM');
    },
    (err) => console.error(err)
);
