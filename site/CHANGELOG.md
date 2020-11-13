<a name="1.0.0-beta.1"></a>
# [1.0.0-beta.1](https://github.com/src-zone/material/compare/v0.18.1...v1.0.0-beta.1) (2020-11-13)



# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="0.18.1"></a>
## [0.18.1](https://github.com/src-zone/material/compare/v0.18.0...v0.18.1) (2020-07-14)



<a name="0.18.0"></a>
# [0.18.0](https://github.com/src-zone/material/compare/v0.17.0...v0.18.0) (2020-04-06)


### Bug Fixes

* stackblitz demos ([#673](https://github.com/src-zone/material/issues/673)) ([d8d0d04](https://github.com/src-zone/material/commit/d8d0d04d85b7b21db28aac2b61be3e70001022bf))


### Features

* **fab:** add extended property to floating action button ([1ba6e7d](https://github.com/src-zone/material/commit/1ba6e7dfaec9f82571262b2bf811f82b9c896cf6))



<a name="0.17.0"></a>
# [0.17.0](https://github.com/src-zone/material/compare/v0.16.0...v0.17.0) (2018-07-11)


### build

* upgrade to material-components-web 0.37.0 ([dccb09d](https://github.com/src-zone/material/commit/dccb09d))


### Features

* **select:** add outlined style variant to mdcSelect ([bdea633](https://github.com/src-zone/material/commit/bdea633))




<a name="0.16.0"></a>
# [0.16.0](https://github.com/src-zone/material/compare/v0.15.0...v0.16.0) (2018-06-20)


### Bug Fixes

* demos source code buttons visibility on firefox and mobile ([a87b3d4](https://github.com/src-zone/material/commit/a87b3d4))


### Features

* **list:** add ripples to mdcListItem children of interactive mdcList ([#651](https://github.com/src-zone/material/issues/651)) ([c237b23](https://github.com/src-zone/material/commit/c237b23))
* **icon-button:** implement icon-button variants ([395e6db](https://github.com/src-zone/material/commit/395e6db))
* **ripple:** allow customization of ripple styling ([c51dba4](https://github.com/src-zone/material/commit/c51dba4))
* **text-field:** add outlined style variant to text-field ([4a248df](https://github.com/src-zone/material/commit/4a248df))
* **top-app-bar:** add directives for mdc top-app-bar ([75e143a](https://github.com/src-zone/material/commit/75e143a))




<a name="0.15.0"></a>
# [0.15.0](https://github.com/src-zone/material/compare/v0.14.0...v0.15.0) (2018-06-05)


### Bug Fixes

* make focus-trap package available for stackblitz ([4f9f123](https://github.com/src-zone/material/commit/4f9f123))


### feature

* **card:** mdcCardMedia size property value '16-9' renamed to '16:9' ([edc4be3](https://github.com/src-zone/material/commit/edc4be3))


### Features

* upgrade to material-components-web 0.36.0 ([22f0981](https://github.com/src-zone/material/commit/22f0981))


### BREAKING CHANGES

* upgrade to material-components-web 0.36.0
* **card:** replace '16-9' by '16:9' for the size property
of mdcCardMedia




<a name="0.14.0"></a>
# [0.14.0](https://github.com/src-zone/material/compare/v0.13.0...v0.14.0) (2018-06-01)


### Bug Fixes

* correctly pretty print html entities in highlighted code ([c04c237](https://github.com/src-zone/material/commit/c04c237))


### Features

* **chips:** implement chips and chip-sets ([#640](https://github.com/src-zone/material/issues/640), [#632](https://github.com/src-zone/material/issues/632)) ([449ec52](https://github.com/src-zone/material/commit/449ec52))
* upgrade to material-components-web 0.36.0-0 ([4240ca1](https://github.com/src-zone/material/commit/4240ca1))


### BREAKING CHANGES

* upgrade to material-components-web 0.36.0-0




<a name="0.13.0"></a>
# [0.13.0](https://github.com/src-zone/material/compare/v0.12.0...v0.13.0) (2018-05-22)


### Bug Fixes

* fix FAB demo styling on IE11 ([d45e341](https://github.com/src-zone/material/commit/d45e341))


### Features

* **focus-trap,dialog:** implement focus-trap and dialog directives ([fdfa357](https://github.com/src-zone/material/commit/fdfa357))
* add functionality to open component demos in stackblitz IDE ([#617](https://github.com/src-zone/material/issues/617)) ([ceefeb3](https://github.com/src-zone/material/commit/ceefeb3))
* small stackblitz integration improvements ([1c6b81a](https://github.com/src-zone/material/commit/1c6b81a))
* **snackbar:** add afterShow/afterHide observables to MdcSnackbarRef ([87ab60e](https://github.com/src-zone/material/commit/87ab60e))
* upgrade to material-components-web 0.35.2 ([ac86710](https://github.com/src-zone/material/commit/ac86710))
* workaround for stackblitz not supporting stylePreprocessorOptions ([cf2696a](https://github.com/src-zone/material/commit/cf2696a))
* **button:** add unelevated property to mdcButton ([f1dcd8f](https://github.com/src-zone/material/commit/f1dcd8f))
* **icon-toggle:** rename isOn/isOnChange to on/onChange ([51aef91](https://github.com/src-zone/material/commit/51aef91))
* **linear-progress:** remove is* prefix from properties ([036c04f](https://github.com/src-zone/material/commit/036c04f))
* **list:** rename mdcListDivider property hasInset to inset ([cb11ce7](https://github.com/src-zone/material/commit/cb11ce7))
* **menu:** rename isOpen/isOpenChange properties to open/openChange ([03ca89e](https://github.com/src-zone/material/commit/03ca89e))
* **select:** add box property to mdcSelect ([ab04988](https://github.com/src-zone/material/commit/ab04988))
* **slider:** rename isDiscrete to discrete; hasMarkers to markers ([5c9fa82](https://github.com/src-zone/material/commit/5c9fa82))
* **toolbar:** remove is* prefix from property names ([c27c269](https://github.com/src-zone/material/commit/c27c269))


### BREAKING CHANGES

* **toolbar:** rename mdcToolbar properties isFixed,
isWaterfall, isFixedLastRowOnly, isFlexible, isFlexibleDefaultBehavior
to respectively:  fixed, waterfall, fixedLastRowOnly, flexible,
flexibleDefaultBehavior
* **slider:** rename mdcSlider property isDiscrete to discrete,
rename mdcSlider property hasMarkers to markers
* **menu:** rename properties isOpen and isOpenChange
of mdcMenu to open and openChange
* **list:** rename mdcListDivider property hasInset to inset
* **linear-progress:** rename mdcLinearProgress properties
isIndeterminate, isReversed, isClosed to
indeterminate, reversed, closed
* **icon-toggle:** the isOn/isOnChange properties of mdcIconToggle are renamed
to on/onChange




<a name="0.12.0"></a>
# [0.12.0](https://github.com/src-zone/material/compare/v0.9.0...v0.12.0) (2018-05-14)


### Features

* demo site upgrade to angular 6 ([9a49d0d](https://github.com/src-zone/material/commit/9a49d0d))




<a name="0.9.0"></a>
# [0.9.0](https://github.com/src-zone/material/compare/v0.8.0...v0.9.0) (2018-05-11)


### Features

* upgrade to material-components-web 0.35.1 ([84ce4f5](https://github.com/src-zone/material/commit/84ce4f5))
* upgrade to material-components-web 0.34.1 ([3ef78c1](https://github.com/src-zone/material/commit/3ef78c1))
* upgrade to material-components-web 0.31.0 ([d20eeb1](https://github.com/src-zone/material/commit/d20eeb1))
* upgrade to material-components-web 0.29.0 ([3c5ddd5](https://github.com/src-zone/material/commit/3c5ddd5))
* upgrade to material-components-web 0.28.0 ([8ccb1b7](https://github.com/src-zone/material/commit/8ccb1b7))
* upgrade to material-web-components 0.27.0 ([b4e40c1](https://github.com/src-zone/material/commit/b4e40c1))




<a name="0.8.0"></a>
# [0.8.0](https://github.com/src-zone/material/compare/v0.8.0...v0.8.0) (2018-05-02)




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
