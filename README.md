<a href="https://blox.src.zone/material"><img align="right" src="https://blox.src.zone/assets/bloxmaterial.03ecfe4fa0147a781487749dc1cc4580.svg" width="100" height="100"/></a>

Blox Material makes it possible to create beautiful Angular apps with modular and customizable UI components,
designed according to the [Material Design Guidelines](https://material.io/design/guidelines-overview/).
It integrates [Material Components for the Web](https://github.com/material-components/material-components-web)
(a Google project) with the Angular framework.

[![Follow Blox Material](https://img.shields.io/twitter/url/https/twitter.com/TheSourceZone.svg?style=social&label=Follow\+Blox\+Material)](https://twitter.com/intent/follow?screen_name=TheSourceZone)

## Quick Links
<a href="https://circleci.com/gh/src-zone/material/tree/master"><img align="right" src="https://buildstats.info/circleci/chart/src-zone/material?branch=master&showStats=false" width="231" height="71"/></a>

[![npm](https://img.shields.io/npm/v/@blox/material.svg)](https://www.npmjs.com/package/@blox/material)
[![License](https://img.shields.io/github/license/src-zone/material.svg)](LICENSE.txt)
[![CircleCI](https://img.shields.io/circleci/project/github/src-zone/material.svg)](https://circleci.com/gh/src-zone/material/tree/master)
[![Documentation](https://img.shields.io/badge/demo-website-lightgrey.svg)](https://blox.src.zone/material)
* [Documention, Demo & Examples](https://blox.src.zone/material)
* [Changelog](https://github.com/src-zone/material/blob/master/bundle/CHANGELOG.md)
* [News (via twitter)](https://twitter.com/TheSourceZone)

## Status

Component            | Documentation |
-------------------- | --------- |
button               | [docs &amp; demo](https://blox.src.zone/material/components/button) |
card                 | [docs &amp; demo](https://blox.src.zone/material/components/card) |
checkbox             | [docs &amp; demo](https://blox.src.zone/material/components/checkbox) |
chips                | [docs &amp; demo](https://blox.src.zone/material/components/chips) |
dialog               | [docs &amp; demo](https://blox.src.zone/material/components/dialog) |
drawer               | [docs &amp; demo](https://blox.src.zone/material/components/drawer) |
elevation            | [docs &amp; demo](https://blox.src.zone/material/components/elevation) |
fab                  | [docs &amp; demo](https://blox.src.zone/material/components/fab) |
form-field           | see docs &amp; demo for e.g. [radio](https://blox.src.zone/material/components/radio), and [checkbox](https://blox.src.zone/material/components/checkbox) |
~~grid-list~~        | deprecated by the Material Components Web team |
icon-button          | [docs &amp; demo](https://blox.src.zone/material/components/icon-button) |
icon-toggle          | [docs &amp; demo](https://blox.src.zone/material/components/icon-toggle) |
linear-progress      | [docs &amp; demo](https://blox.src.zone/material/components/linear-progress) |
list                 | [docs &amp; demo](https://blox.src.zone/material/components/list) |
menu                 | [docs &amp; demo](https://blox.src.zone/material/components/menu) |
radio                | [docs &amp; demo](https://blox.src.zone/material/components/radio) |
ripple               | [docs &amp; demo](https://blox.src.zone/material/components/ripple) |
select               | [docs &amp; demo](https://blox.src.zone/material/components/select) |
slider               | [docs &amp; demo](https://blox.src.zone/material/components/slider) |
snackbar             | [docs &amp; demo](https://blox.src.zone/material/components/snackbar) |
switch               | [docs &amp; demo](https://blox.src.zone/material/components/switch) |
tabs                 | [docs &amp; demo](https://blox.src.zone/material/components/tab) |
text-field           | [docs &amp; demo](https://blox.src.zone/material/components/text-field) |
toolbar              | [docs &amp; demo](https://blox.src.zone/material/components/toolbar) |
top-app-bar          | [docs &amp; demo](https://blox.src.zone/material/components/top-app-bar) |

The following material-components-web packages provide styling (scss, css) only. As such they
can be consumed directly from your Angular app, and we see no reason to wrap their functionality
in Angular components or directives. Just use the styles and sass mixins as documented by the
material-components-web team:

Package              | Documentation |
---------------------| --------- |
image-list           | [image-list documentation](https://github.com/material-components/material-components-web/blob/master/packages/mdc-image-list/README.md) |
layout-grid          | [layout-grid documentation](https://github.com/material-components/material-components-web/blob/master/packages/mdc-image-list/README.md) |
shape                | [shape documentation](https://github.com/material-components/material-components-web/blob/master/packages/mdc-image-list/README.md) |
theme                | [theme documentation](https://github.com/material-components/material-components-web/blob/master/packages/mdc-image-list/README.md) |
typography           | [typography documentation](https://github.com/material-components/material-components-web/blob/master/packages/mdc-image-list/README.md) |

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
