<a href="https://blox.src.zone/material"><img align="right" src="https://blox.src.zone/assets/bloxmaterial.03ecfe4fa0147a781487749dc1cc4580.svg" width="100" height="100"/></a>

Blox Material makes it possible to create beautiful Angular apps with modular and customizable UI components,
designed according to the [Material Design Guidelines](https://material.io/design/guidelines-overview/).
It integrates [Material Components for the Web](https://github.com/material-components/material-components-web)
(a Google project) with the Angular framework.

[![Follow Blox Material](https://img.shields.io/twitter/url/https/twitter.com/TheSourceZone.svg?style=social&label=Follow\+Blox\+Material)](https://twitter.com/intent/follow?screen_name=TheSourceZone)

## Quick Links
<a href="https://circleci.com/gh/src-zone/material/tree/master"><img align="right" src="https://buildstats.info/circleci/chart/src-zone/material?branch=master&showStats=false" width="231" height="71"/></a>

[![npm](https://img.shields.io/npm/v/@blox/material.svg)](https://www.npmjs.com/package/@blox/material)
[![npm](https://img.shields.io/npm/v/@blox/material/beta.svg)](https://www.npmjs.com/package/@blox/material)
[![License](https://img.shields.io/github/license/src-zone/material.svg)](LICENSE.txt)
[![CircleCI](https://img.shields.io/circleci/project/github/src-zone/material.svg)](https://circleci.com/gh/src-zone/material/tree/master)
[![Codecov](https://img.shields.io/codecov/c/github/src-zone/material)](https://codecov.io/gh/src-zone/material)
[![Documentation](https://img.shields.io/badge/demo-website-lightgrey.svg)](https://blox.src.zone/material)
* [Documention, Demo & Examples](https://blox.src.zone/material)
* [Documention, Demo & Examples for the beta release channel](https://material.src.zone/)
* [Changelog](https://github.com/src-zone/material/blob/master/bundle/CHANGELOG.md)
* [News (via twitter)](https://twitter.com/TheSourceZone)

## Status

We're currently in the progress of upgrading to the latest version of material-components-web. This
introduces a significant amount of breaking changes. Hence the status of the master branch is beta, and we're
publishing beta releases from that branch.

The [stable_v0 branch](https://github.com/src-zone/material/tree/stable_v0) contains the branch for the latest
non-beta builds.

The documentation site for the beta release is here: [https://material.src.zone](https://material.src.zone)

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
* Publishing a new bundle is handled by circleci. The commands for publishing/releasing a new
  version are in the root `package.json`. These commands create the appropriate tags and changes
  that are picked up by the circleci build to do an actual publish/deploy/distribution of a new
  version of the library.
* Please use commit messages according to the [Angular Commit Message Guidelines](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-guidelines).
