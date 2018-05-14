# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="0.9.0"></a>
# [0.9.0](https://github.com/src-zone/material/compare/v0.8.0...v0.9.0) (2018-05-11)


### Features

* upgrade to material-components-web 0.35.1 ([84ce4f5](https://github.com/src-zone/material/commit/84ce4f5))
* upgrade to material-components-web 0.34.1 ([3ef78c1](https://github.com/src-zone/material/commit/3ef78c1))
* upgrade to material-components-web 0.31.0 ([d20eeb1](https://github.com/src-zone/material/commit/d20eeb1))
* upgrade to material-components-web 0.29.0 ([3c5ddd5](https://github.com/src-zone/material/commit/3c5ddd5))
* upgrade to material-components-web 0.28.0 ([8ccb1b7](https://github.com/src-zone/material/commit/8ccb1b7))
* upgrade to material-web-components 0.27.0 ([b4e40c1](https://github.com/src-zone/material/commit/b4e40c1))


### BREAKING CHANGES

* upgrade to material-components-web 0.35.1
  * MdcSelectLabelDirective is removed. Use MdcFloatingLabel instead.
    (following upstream changes in material-components-web 0.35.0)
  * mdcSelectLabel is removed. Use mdcFlatingLabel instead.
    (following upstream changes in material-components-web 0.35.0)
  * mdcButton property `stroked` is renamed to `outlined`.
    (following upstream changes in material-components-web 0.35.0)
* upgrade to material-components-web 0.34.1
  * MdcTextFieldLabelDirective is renamed to MdcFloatingLabelDirective
    (following upstream changes in material-components-web 0.32.0)
  * mdcTextFieldLabel is renamed to mdcFloatingLabel
    (following upstream changes in material-components-web 0.32.0)
  * mdcButton input compact has been removed
    (following upstream changes in material-components-web 0.33.0)
  * mdcCard input compact has been removed (since it was removed
    from mdcButton)
  * mdcSelect is now based on the native select control and is
    not compatible with the old mdcSelect directives
    (following upstream changes in material-components-web 0.34.0).
    Please check the documentation for mdcSelect, mdcSelectControl,
    and mdcSelectLabel.
* dropped compatibility with Angular 4.x, Angular 5 or newer is
  required
* upgrade to material-components-web 0.31.0
  * mdcSimpleMenu renamed to mdcMenu
    (following upstream changes in material-components-web 0.30.0)
  * MdcSimpleMenuDirective renamed to MdcMenuDirective
    (following upstream changes in material-components-web 0.30.0)
  * mdc-card directives removed: mdcCardHorizontal, mdcCardPrimary,
    mdcCardTitle, mdcCardSubtitle, mdcCardText, mdcCardMediaItem
    (following upstream changes in material-components-web 0.30.0)
  * mdc-card directives added: mdcCardMediaContent, mdcCardActionButtons,
    mdcCardActionIcons, mdcCardPrimaryAction, mdcIcon
    (following upstream changes in material-components-web 0.30.0 and
    0.31.0)
  * mdcTextField output bottomLineAnimationEnd has been removed
    (following upstream changes in material-components-web 0.30.0)
* upgrade to material-components-web 0.28.0
  * mdcListItemStartDetail renamed to mdcListItemGraphic
  * MdcListItemStartDetailDirective renamed to MdcListItemGraphicDirective
  * mdcListItemEndDetail renamed to mdcListItemMeta
  * MdcListItemEndDetailDirective renamed to MdcListItemGraphicDirective
* upgrade to material-components-web 0.27.0
  * mdcListItemTextSecondary was renamed to mdcListItemSecondaryText
  * MdcListItemTextSecondaryDirective was renamed to
    MdcListItemSecondaryTextDirective
  * The 'isActive' property of mdcTab and mdcTabRouter is renamed to 'active'.




<a name="0.8.0"></a>
# [0.8.0](https://github.com/src-zone/material/compare/v0.7.0...v0.8.0) (2018-05-02)


### Bug Fixes

* **checkbox:** fix event name in adapter impl ([7eadd26](https://github.com/src-zone/material/commit/7eadd26))


### Documentation

* document mdcTab and related directives ([#133](https://github.com/src-zone/material/issues/133)) ([d89457b](https://github.com/src-zone/material/commit/d89457b))


### BREAKING CHANGES

* The 'isActive' property of mdcTab and mdcTabRouter is renamed to 'active'.




<a name="0.7.0"></a>
# [0.7.0](https://github.com/src-zone/material/compare/v0.6.0...v0.7.0) (2017-12-04)


### Bug Fixes

* **menu:** keep correct open/close state of menu ([e4885aa](https://github.com/src-zone/material/commit/e4885aa)), closes [#87](https://github.com/src-zone/material/issues/87)
* show textfield in disabled state when native input is disabled ([#104](https://github.com/src-zone/material/issues/104)) ([d8aac22](https://github.com/src-zone/material/commit/d8aac22)), closes [#102](https://github.com/src-zone/material/issues/102)


### feature

* upgrade to material-components-web 0.26.0 ([9d4859b](https://github.com/src-zone/material/commit/9d4859b))
* implement permanent, persistent, and temporary drawer types


### BREAKING CHANGES

* * Upgrade to material-components-web 0.26.0
* Rename directive mdcTextFieldHelptext to mdcTextFieldHelperText
(follows upstream name change in @material/textfield)
* Rename mdcTextField property helptext to helperText (follows upstream
name change in @material/textfield)
* Rename mdcTextField property isValid to valid
* Rename mdcTextField property boxed to box
* Rename mdcTextFieldHelperText exportAs mdcHelptext to mdcHelperText
* Rename mdcTextFieldHelperText property isValidation to validation
* Rename mdcTextFieldHelperText property isPersistent to persistent




<a name="0.6.0"></a>
# [0.6.0](https://github.com/src-zone/material/compare/v0.5.0...v0.6.0) (2017-11-14)


### Features

* upgrade to material-components-web 0.25.0 ([db73530](https://github.com/src-zone/material/commit/db73530))


### BREAKING CHANGES

* Upgrade to material-components-web 0.25.0 and rename
mdcTextfield to mdcTextField and mdcFormfield to mdcFormField.
(Following upstream change of changing textfield to text-field).




<a name="0.5.0"></a>
# [0.5.0](http://github.com/src-zone/material/compare/v0.4.0...v0.5.0) (2017-11-06)


### Features

* rxjs lettable operators ([c3dc01c](http://github.com/src-zone/material/commits/c3dc01c))
* use rxjs lettable operators (may improve consumer app bundle size) ([71c2635](http://github.com/src-zone/material/commits/71c2635))




<a name="0.4.0"></a>
# [0.4.0](http://github.com/src-zone/material/compare/v0.3.0...v0.4.0) (2017-10-30)


### Bug Fixes

* pass proper options on internal MdcEventRegistry calls ([bc27686](http://github.com/src-zone/material/commits/bc27686))
* **ripple:** fix detach/attach of ripple ([fded6b1](http://github.com/src-zone/material/commits/fded6b1))
* **ripple:** workaround for MDC bug: ripple retains focus after drag. ([0f55dff](http://github.com/src-zone/material/commits/0f55dff), [ed16358](http://github.com/src-zone/material/commits/ed16358))


### Features

* add MdcScrollbarResizeDirective ([259674e](http://github.com/src-zone/material/commits/259674e))
* **elevation:** implement elevation directive (mdcElevation) ([c040dcb](http://github.com/src-zone/material/commits/c040dcb))
* **toolbar**: change mdcToolbarIconMenu to mdcToolbarMenuIcon. ([a80e9d3](http://github.com/src-zone/material/commits/a80e9d3))
* **switch**: implement mdcSwitch component ([7c317b8](http://github.com/src-zone/material/commits/7c317b8))
* **linear-progress**: mdcLinearProgress directive added ([47f0fe9](http://github.com/src-zone/material/commits/47f0fe9))
* **tab,menu:** rename mdcSelect to pick (for menu), or activate (tab). ([97be223](http://github.com/src-zone/material/commits/97be223))
* remove mdc prefix from all properties that are not directives ([a7769de](http://github.com/src-zone/material/commits/a7769de))
* **bundle:** update mdcSlider when page layout changes ([5960da4](http://github.com/src-zone/material/commits/5960da4))
* **elevation:** add animateTransition property ([0cce0b8](http://github.com/src-zone/material/commits/0cce0b8))
* **list:** implement and document material list ([fad21c0](http://github.com/src-zone/material/commits/fad21c0))
* **menu:** implement and document simple-menu ([589b50d](http://github.com/src-zone/material/commits/589b50d))
* **ripple:** implement ripple surface directive: mdcRipple ([2b60e43](http://github.com/src-zone/material/commits/2b60e43))
* **select:** directives supporting all mdc-select variants ([d0fdbae](http://github.com/src-zone/material/commits/d0fdbae))
* **snackbar:** implement and document MdcSnackbarService ([924742f](http://github.com/src-zone/material/commits/924742f))


### BREAKING CHANGES

* all properties have been renamed to not include the
mdc prefix. This brings naming conventions in line with modules
maintained by the angular core teams.
* rename mdcToolbarIconMenu to mdcToolbarMenuIcon,
follows upstream change from mdc-toolbar__icon--menu to
mdc-toolbar__menu-icon




<a name="0.3.0"></a>
# [0.3.0](https://github.com/src-zone/material/compare/v0.2.1...v0.3.0) (2017-10-18)


### Bug Fixes

* **slider:** correctly pass mdcDiscrete property to foundation on init ([4b6056f](https://github.com/src-zone/material/commits/4b6056f))
* **textfield:** textfield label should float when textfield has a value ([2d5da6f](https://github.com/src-zone/material/commits/2d5da6f))
* **slider:** workaround for upstream mdc-slider bug with destroy() ([f16f3f8](https://github.com/src-zone/material/commits/f16f3f8))
* **slider:** workaround mdc-slider bug preventing focus via tabIndex ([377c045](https://github.com/src-zone/material/commits/377c045))
* **ripple:** properly set style property (instead of style) ([72985b0](https://github.com/src-zone/material/commits/72985b0))


### build

* upgrade dependencies. ([1966ca6](https://github.com/src-zone/material/commits/1966ca6))


### Features

* **slider:** implement slider support: MdcSliderDirective ([1f3df7b](https://github.com/src-zone/material/commits/1f3df7b))
* **slider:** `@angular/forms` support for mdcSlider ([e120ed8](https://github.com/src-zone/material/commits/e120ed8))
* give mdcRadio, mdcCheckbox, mdcTab ripples ([58b6e41](https://github.com/src-zone/material/commits/58b6e41))
* **fab:** mdcFab.mdcPlain removed, mdcFab.mdcExited added ([9b3e638](https://github.com/src-zone/material/commits/9b3e638))


### BREAKING CHANGES

* upgrade to material-components-web: 0.23.0




<a name="0.2.1"></a>
## [0.2.1](https://github.com/src-zone/material/compare/v0.2.0...v0.2.1) (2017-10-13)


### Bug Fixes

* **card:** exception when using mdcCompact on mdcCardActions fixed ([54bf6f9](https://github.com/src-zone/material/commits/54bf6f9))


### Features

* **icon-toggle:** implement icon-toggle directives ([b76f8cd](https://github.com/src-zone/material/commits/b76f8cd))
* **ripple:** refactor how ripples are added to directives ([db5dc2d](https://github.com/src-zone/material/commits/db5dc2d))
* **button:** remove mdcPrimary/mdcSecondary/mdcAccent modifiers ([cafff95](https://github.com/src-zone/material/commits/cafff95))


### BREAKING CHANGES

* **button:** mdcPrimary/mdcSecondary/mdcAccent inputs no longer
supported for mdcButton. (Following upstream changes in mdc-button).




<a name="0.2.0"></a>
# [0.2.0](https://github.com/src-zone/material/compare/v0.1.4...v0.2.0) (2017-10-03)


### Bug Fixes

* **toolbar:** export MdcToolbarIcon and MdcToolbarIconMenu ([742689c](https://github.com/src-zone/material/commits/742689c))


### Features

* **tab:** create an mdcTabRouter directive ([9266fe2](https://github.com/src-zone/material/commits/9266fe2))
* **tab:** create an mdcTabRouter directive ([75388ff](https://github.com/src-zone/material/commits/75388ff))
* **textfield:** upgrade mdcTextfield to latest breaking changes from upstream ([b26e736](https://github.com/src-zone/material/commits/b26e736))
