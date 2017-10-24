# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

  <a name="0.3.0"></a>
# [0.3.0](https://bitbucket.org/src-zone/material/compare/v0.2.1...v0.3.0) (2017-10-18)


### Bug Fixes

* **slider:** correctly pass mdcDiscrete property to foundation on init ([4b6056f](https://bitbucket.org/src-zone/material/commits/4b6056f))
* **textfield:** textfield label should float when textfield has a value ([2d5da6f](https://bitbucket.org/src-zone/material/commits/2d5da6f))
* **slider:** workaround for upstream mdc-slider bug with destroy() ([f16f3f8](https://bitbucket.org/src-zone/material/commits/f16f3f8))
* **slider:** workaround mdc-slider bug preventing focus via tabIndex ([377c045](https://bitbucket.org/src-zone/material/commits/377c045))
* **ripple:** properly set style property (instead of style) ([72985b0](https://bitbucket.org/src-zone/material/commits/72985b0))


### build

* upgrade dependencies. ([1966ca6](https://bitbucket.org/src-zone/material/commits/1966ca6))


### Features

* **slider:** implement slider support: MdcSliderDirective ([1f3df7b](https://bitbucket.org/src-zone/material/commits/1f3df7b))
* **slider:** `@angular/forms` support for mdcSlider ([e120ed8](https://bitbucket.org/src-zone/material/commits/e120ed8))
* give mdcRadio, mdcCheckbox, mdcTab ripples ([58b6e41](https://bitbucket.org/src-zone/material/commits/58b6e41))
* **fab:** mdcFab.mdcPlain removed, mdcFab.mdcExited added ([9b3e638](https://bitbucket.org/src-zone/material/commits/9b3e638))


### BREAKING CHANGES

* upgrade to material-components-web: 0.23.0




  <a name="0.2.1"></a>
## [0.2.1](https://bitbucket.org/src-zone/material/compare/v0.2.0...v0.2.1) (2017-10-13)


### Bug Fixes

* **card:** exception when using mdcCompact on mdcCardActions fixed ([54bf6f9](https://bitbucket.org/src-zone/material/commits/54bf6f9))


### Features

* **icon-toggle:** implement icon-toggle directives ([b76f8cd](https://bitbucket.org/src-zone/material/commits/b76f8cd))
* **ripple:** refactor how ripples are added to directives ([db5dc2d](https://bitbucket.org/src-zone/material/commits/db5dc2d))
* **button:** remove mdcPrimary/mdcSecondary/mdcAccent modifiers ([cafff95](https://bitbucket.org/src-zone/material/commits/cafff95))


### BREAKING CHANGES

* **button:** mdcPrimary/mdcSecondary/mdcAccent inputs no longer
supported for mdcButton. (Following upstream changes in mdc-button).




<a name="0.2.0"></a>
# [0.2.0](https://bitbucket.org/src-zone/material/compare/v0.1.4...v0.2.0) (2017-10-03)


### Bug Fixes

* **toolbar:** export MdcToolbarIcon and MdcToolbarIconMenu ([742689c](https://bitbucket.org/src-zone/material/commits/742689c))


### Features

* **tab:** create an mdcTabRouter directive ([9266fe2](https://bitbucket.org/src-zone/material/commits/9266fe2))
* **tab:** create an mdcTabRouter directive ([75388ff](https://bitbucket.org/src-zone/material/commits/75388ff))
* **textfield:** upgrade mdcTextfield to latest breaking changes from upstream ([b26e736](https://bitbucket.org/src-zone/material/commits/b26e736))
