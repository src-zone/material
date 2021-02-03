<a href="https://material.src.zone"><img align="right" src="https://material.src.zone/css/bloxmaterial.4b1fe3a46fecc6299b03.svg" width="100" height="100"/></a>

Blox Material makes it possible to create beautiful Angular apps with modular and customizable UI components,
designed according to the [Material Design Guidelines](https://material.io/design/guidelines-overview/).
It integrates [Material Components for the Web](https://github.com/material-components/material-components-web)
(a Google project) with the Angular framework.

[![Follow Blox Material](https://img.shields.io/twitter/url/https/twitter.com/TheSourceZone.svg?style=social&label=Follow\+Blox\+Material)](https://twitter.com/intent/follow?screen_name=TheSourceZone)

## Quick Links
<a href="https://github.com/src-zone/material/actions"><img align="right" src="https://buildstats.info/github/chart/src-zone/material?branch=master&showStats=false" width="231" height="71"/></a>

[![npm](https://img.shields.io/npm/v/@blox/material.svg)](https://www.npmjs.com/package/@blox/material)
[![License](https://img.shields.io/github/license/src-zone/material.svg)](LICENSE.txt)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/src-zone/material/Build,%20Test,%20Preview)](https://github.com/src-zone/material/actions?query=workflow%3A%22Build%2C+Test%2C+Preview%22)
[![Codecov](https://img.shields.io/codecov/c/github/src-zone/material)](https://codecov.io/gh/src-zone/material)
[![Documentation](https://img.shields.io/badge/demo-website-lightgrey.svg)](https://material.src.zone/)
* [Documention, Demo & Examples](https://material.src.zone/)
* [Old Documention, Demo & Examples (for v0.x)](https://v0.material.src.zone/material)
* [Changelog](https://github.com/src-zone/material/blob/master/bundle/CHANGELOG.md)
* [News (via twitter)](https://twitter.com/TheSourceZone)
* [Guide for upgrading from v0.18.1 to v1.0.0](docs/migration/migration-0-to-1.md)

## Roadmap for 2.0.0

* Upgrade to material-components-web 9.0.0
* Implement new components: `banner`, `circular-progress`, `data-table`, `segmented-button`, `tooltip`,
  and `touch-target`
* Add angular schematics support to help with installation
* Add component alternatives to directives with complex structure
* Add autocomplete input component

## Building from source

If you want to code on the library itself, or build it from source for other reasons, here are
some tips:

* Please run an `npm install` in the root directory first. The root directory contains git hooks
  and scripts for releasing/publishing new versions.
* The library code is in the directory `bundle`. You need to run `npm install` there, before
  e.g. building (`npm run build`) or testing (`npm run test`) the material library.
* The demo and documentation website is in the `site` directory. Before building, the site,
  you must have built the material `bundle` first.
* Check the `package.json` files for other commands that can be used to build, debug, test,
  release, or publish the library.
* Publishing a new bundle is handled by Github Actions. The commands for publishing/releasing a new
  version are in the root `package.json`. These commands create the appropriate tags and changes
  that are picked up by a Github Action build to do an actual publish/deploy/distribution of a new
  version of the library.
* Please use commit messages according to the [Angular Commit Message Guidelines](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-guidelines).
