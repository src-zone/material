# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

      <a name="0.6.0"></a>
# [0.6.0](https://github.com/src-zone/material/compare/v0.5.0...v0.6.0) (2017-11-14)


### Features

* upgrade to material-components-web 0.25.0 ([db73530](https://github.com/src-zone/material/commit/db73530))


### BREAKING CHANGES

* Upgrade to material-components-web 0.25.0 and rename
mdcTextfield to mdcTextField and mdcFormfield to mdcFormField.
(Following upstream change of changing textfield to text-field).




      <a name="0.5.0"></a>
# [0.5.0](http://src-zone/material/compare/v0.4.0...v0.5.0) (2017-11-06)


### Features

* rxjs lettable operators ([c3dc01c](http://src-zone/material/commits/c3dc01c))
* use rxjs lettable operators (may improve consumer app bundle size) ([71c2635](http://src-zone/material/commits/71c2635))




     <a name="0.4.0"></a>
# [0.4.0](http://src-zone/material/compare/v0.3.0...v0.4.0) (2017-10-30)


### Bug Fixes

* pass proper options on internal MdcEventRegistry calls ([bc27686](http://src-zone/material/commits/bc27686))
* **ripple:** fix detach/attach of ripple ([fded6b1](http://src-zone/material/commits/fded6b1))
* **ripple:** workaround for MDC bug: ripple retains focus after drag. ([0f55dff](http://src-zone/material/commits/0f55dff), [ed16358](http://src-zone/material/commits/ed16358))


### Features

* add MdcScrollbarResizeDirective ([259674e](http://src-zone/material/commits/259674e))
* **elevation:** implement elevation directive (mdcElevation) ([c040dcb](http://src-zone/material/commits/c040dcb))
* **toolbar**: change mdcToolbarIconMenu to mdcToolbarMenuIcon. ([a80e9d3](http://src-zone/material/commits/a80e9d3))
* **switch**: implement mdcSwitch component ([7c317b8](http://src-zone/material/commits/7c317b8))
* **linear-progress**: mdcLinearProgress directive added ([47f0fe9](http://src-zone/material/commits/47f0fe9))
* **tab,menu:** rename mdcSelect to pick (for menu), or activate (tab). ([97be223](http://src-zone/material/commits/97be223))
* remove mdc prefix from all properties that are not directives ([a7769de](http://src-zone/material/commits/a7769de))
* **bundle:** update mdcSlider when page layout changes ([5960da4](http://src-zone/material/commits/5960da4))
* **elevation:** add animateTransition property ([0cce0b8](http://src-zone/material/commits/0cce0b8))
* **list:** implement and document material list ([fad21c0](http://src-zone/material/commits/fad21c0))
* **menu:** implement and document simple-menu ([589b50d](http://src-zone/material/commits/589b50d))
* **ripple:** implement ripple surface directive: mdcRipple ([2b60e43](http://src-zone/material/commits/2b60e43))
* **select:** directives supporting all mdc-select variants ([d0fdbae](http://src-zone/material/commits/d0fdbae))
* **snackbar:** implement and document MdcSnackbarService ([924742f](http://src-zone/material/commits/924742f))


### BREAKING CHANGES

* all properties have been renamed to not include the
mdc prefix. This brings naming conventions in line with modules
maintained by the angular core teams.
* rename mdcToolbarIconMenu to mdcToolbarMenuIcon,
follows upstream change from mdc-toolbar__icon--menu to
mdc-toolbar__menu-icon




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
