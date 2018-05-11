# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

       <a name="0.9.0"></a>
# [0.9.0](https://github.com/src-zone/material/compare/v0.7.0...v0.9.0) (2018-05-11)


### Features

* upgrade to material-components-web 0.28.0 ([8ccb1b7](https://github.com/src-zone/material/commit/8ccb1b7))
* upgrade to material-components-web 0.29.0 ([3c5ddd5](https://github.com/src-zone/material/commit/3c5ddd5))
* upgrade to material-components-web 0.31.0 ([d20eeb1](https://github.com/src-zone/material/commit/d20eeb1))
* upgrade to material-components-web 0.34.1 ([3ef78c1](https://github.com/src-zone/material/commit/3ef78c1))
* upgrade to material-components-web 0.35.1 ([84ce4f5](https://github.com/src-zone/material/commit/84ce4f5))
* upgrade to material-web-components 0.27.0 ([b4e40c1](https://github.com/src-zone/material/commit/b4e40c1))


### BREAKING CHANGES

* * upgrade to material-components-web 0.35.1
* MdcSelectLabelDirective is removed. Use MdcFloatingLabel instead.
 (following upstream changes in material-components-web 0.35.0)
* mdcSelectLabel is removed. Use mdcFlatingLabel instead.
 (following upstream changes in material-components-web 0.35.0)
* mdcButton property `stroked` is renamed to `outlined`.
 (following upstream changes in material-components-web 0.35.0)
* * upgrade to material-components-web 0.34.1
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
* * dropped compatibility with Angular 4.x, Angular 5 or newer is
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
* * upgrade to material-components-web 0.28.0
* mdcListItemStartDetail renamed to mdcListItemGraphic
* MdcListItemStartDetailDirective renamed to MdcListItemGraphicDirective
* mdcListItemEndDetail renamed to mdcListItemMeta
* MdcListItemEndDetailDirective renamed to MdcListItemGraphicDirective
* * mdcSelect has been removed for now, will be readded when
 upgrading to material-web-components 0.34.0
* mdcListItemTextSecondary was renamed to mdcListItemSecondaryText
* MdcListItemTextSecondaryDirective was renamed to
 MdcListItemSecondaryTextDirective




       <a name="0.8.0"></a>
# [0.8.0](https://github.com/src-zone/material/compare/v0.7.0...v0.8.0) (2018-05-02)




**Note:** Version bump only for package material-demo

      <a name="0.7.0"></a>
# [0.7.0](https://github.com/src-zone/material/compare/v0.6.0...v0.7.0) (2017-12-04)


### Bug Fixes

* fix gtm page urls's for page-view events ([734f9de](https://github.com/src-zone/material/commit/734f9de))
* show background on all cards in the demo ([c47a041](https://github.com/src-zone/material/commit/c47a041))


### feature

* upgrade to material-components-web 0.26.0 ([9d4859b](https://github.com/src-zone/material/commit/9d4859b))




  <a name="0.6.0"></a>
# [0.6.0](https://github.com/src-zone/material/compare/v0.5.0...v0.6.0) (2017-11-14)


### Features

* upgrade to material-components-web 0.25.0 ([db73530](https://github.com/src-zone/material/commit/db73530))


### BREAKING CHANGES

* Upgrade to material-components-web 0.25.0 and rename
mdcTextfield to mdcTextField and mdcFormfield to mdcFormField.
(Following upstream change of changing textfield to text-field).




<a name="0.5.0"></a>
# [0.5.0](https://bitbucket.org/src-zone/material/compare/v0.4.0...v0.5.0) (2017-11-06)


### Bug Fixes

* remove properties that shouldn't be there ([222c0c0](https://bitbucket.org/src-zone/material/commits/222c0c0))




<a name="0.4.0"></a>
# [0.4.0](https://bitbucket.org/src-zone/material/compare/v0.3.0...v0.4.0) (2017-10-30)


### Bug Fixes

* **site:** fix linear-progress icon is too wide ([3a627bb](https://bitbucket.org/src-zone/material/commits/3a627bb))
* **site:** SVG classlist support in IE11, fixes [#2](https://bitbucket.org/src-zone/material/issues/2) ([7da5ae1](https://bitbucket.org/src-zone/material/commits/7da5ae1))
* **site:** SVG classlist support in IE11, fixes [#2](https://bitbucket.org/src-zone/material/issues/2) ([80f21d1](https://bitbucket.org/src-zone/material/commits/80f21d1))


### Features

* add MdcScrollbarResizeDirective ([259674e](https://bitbucket.org/src-zone/material/commits/259674e))
* **elevation:** implement elevation directive (mdcElevation) ([c040dcb](https://bitbucket.org/src-zone/material/commits/c040dcb))
* change mdcToolbarIconMenu to mdcToolbarMenuIcon. ([a80e9d3](https://bitbucket.org/src-zone/material/commits/a80e9d3))
* change property 'expansionRatio' to 'mdcExpansionRatio'. ([a041394](https://bitbucket.org/src-zone/material/commits/a041394))
* implement mdcSwitch component ([7c317b8](https://bitbucket.org/src-zone/material/commits/7c317b8))
* mdcLinearProgress directive added ([47f0fe9](https://bitbucket.org/src-zone/material/commits/47f0fe9))
* **tab,menu:** rename mdcSelect to pick (for menu), or activate (tab). ([97be223](https://bitbucket.org/src-zone/material/commits/97be223))
* remove mdc prefix from all properties that are not directives ([a7769de](https://bitbucket.org/src-zone/material/commits/a7769de))
* **elevation:** add animateTransition property ([0cce0b8](https://bitbucket.org/src-zone/material/commits/0cce0b8))
* **list:** implement and document material list ([fad21c0](https://bitbucket.org/src-zone/material/commits/fad21c0))
* **menu:** implement and document simple-menu ([589b50d](https://bitbucket.org/src-zone/material/commits/589b50d))
* **ripple:** implement ripple surface directive: mdcRipple ([2b60e43](https://bitbucket.org/src-zone/material/commits/2b60e43))
* **select:** directives supporting all mdc-select variants ([d0fdbae](https://bitbucket.org/src-zone/material/commits/d0fdbae))
* **site:** integrate Tag Manager in documentation site ([d85038d](https://bitbucket.org/src-zone/material/commits/d85038d))
* **snackbar:** implement and document MdcSnackbarService ([924742f](https://bitbucket.org/src-zone/material/commits/924742f))


### BREAKING CHANGES

* all properties have been renamed to not include the
mdc prefix. This brings naming conventions in line with modules
maintained by the angular core teams.
* **tab,menu:** mdcSelect properties for menu and tab renamed to
respectively pick, and activate. To prevent nameclashes with the
'mdcSelect' directive being worked on right now.
Please note: we have decided to drop the 'mdc' prefix from
properties, to be more in line in how other libs name their
properties, and for a more convenient (shorter) names.
* use 'mdc' prefix for mdcExpansionratio property,
to bring the naming inline with other properties of Blox Material.
* rename mdcToolbarIconMenu to mdcToolbarMenuIcon,
follows upstream change from mdc-toolbar__icon--menu to
mdc-toolbar__menu-icon




<a name="0.3.0"></a>
# [0.3.0](https://bitbucket.org/src-zone/material/compare/v0.2.1...v0.3.0) (2017-10-18)


### build

* upgrade dependencies. ([1966ca6](https://bitbucket.org/src-zone/material/commits/1966ca6))


### Features

* implement slider support: MdcSliderDirective ([1f3df7b](https://bitbucket.org/src-zone/material/commits/1f3df7b))


### BREAKING CHANGES

* upgrade to material-components-web: 0.23.0




<a name="0.2.1"></a>
## [0.2.1](https://bitbucket.org/src-zone/material/compare/v0.2.0...v0.2.1) (2017-10-13)


### Features

* document mdcCard and related directives ([577482f](https://bitbucket.org/src-zone/material/commits/577482f))




<a name="0.2.0"></a>
# [0.2.0](https://bitbucket.org/src-zone/material/compare/v0.1.4...v0.2.0) (2017-10-03)


### Bug Fixes

* header styling small sizes ([6d07bf8](https://bitbucket.org/src-zone/material/commits/6d07bf8))


### Features

* add getting started guide ([93de853](https://bitbucket.org/src-zone/material/commits/93de853))
* add guides section, tabs at top ([da48325](https://bitbucket.org/src-zone/material/commits/da48325))
* add Roboto Mono font ([641ff40](https://bitbucket.org/src-zone/material/commits/641ff40))
* header title changes per breakpoint ([f617bca](https://bitbucket.org/src-zone/material/commits/f617bca))
* long term caching of static assets ([75388ff](https://bitbucket.org/src-zone/material/commits/75388ff))
* upgrade mdcTextfield to latest breaking changes from upstream ([b26e736](https://bitbucket.org/src-zone/material/commits/b26e736))
