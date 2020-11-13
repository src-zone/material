# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.



<a name="1.0.0-beta.1"></a>
# [1.0.0-beta.1](https://github.com/src-zone/material/compare/v0.18.1...v1.0.0-beta.1) (2020-11-13)


### Bug Fixes

* **icon-button:** disabled property removed from icon-button ([f3d1e80](https://github.com/src-zone/material/commit/f3d1e8012277836b28a83c64b8e2de23b8e7acd8))
* **list:** render primary text correctly ([b3ffb4c](https://github.com/src-zone/material/commit/b3ffb4c469eee73e098f2ebb661e5a784d5ed350))
* **tab:** fix tab focused styling (through ripple) ([2bb3007](https://github.com/src-zone/material/commit/2bb30076cddde2a09b04a447151c8cd501573596))
* **tab:** fix tab focused styling (through ripple) ([8134993](https://github.com/src-zone/material/commit/8134993dce8f4a437b80855fadb1d90b9198d770))
* **tab:** include new directives in module ([5648257](https://github.com/src-zone/material/commit/5648257b32b8eff9f74b576061e017428c898303))
* **top-app-bar:** properly remove event listeners with properties ([ff569ee](https://github.com/src-zone/material/commit/ff569ee5b763c03d2d1aa66ed69c9913f4ce4b20))


### Code Refactoring

* **dialog:** upgrade to material-components-web upgraded@5.1.0 ([e1e66a2](https://github.com/src-zone/material/commit/e1e66a2807a399ed605332d801f1499aa389727b))
* **top-app-bar:** upgrade to material-components-web@5.1.0 ([207b95d](https://github.com/src-zone/material/commit/207b95ddf6e5e86cba08db7ee01e6413d3c53aae))


### feature

* **button:** upgrade to material-components-web@5.1.0 ([1dce48e](https://github.com/src-zone/material/commit/1dce48ebfded4e14886bfe2382fbee890626a6f2))
* **card:** upgrade to material-components-web@5.1.0 ([7e25cde](https://github.com/src-zone/material/commit/7e25cdef4b154dc354c03a3995a041196708f304))
* **checbox:** upgrade to material-components-web@5.1.0 ([9314e9e](https://github.com/src-zone/material/commit/9314e9ee6dc1279b2a5266b1e9c33efb7c78095f))
* **chips:** upgrade to material-components-web@5.1.0 ([2914b20](https://github.com/src-zone/material/commit/2914b20cc30b573aa080f4488fa8508511b8bcf0))
* **drawer:** upgrade to material-components-web@5.1.0 ([2448239](https://github.com/src-zone/material/commit/24482394c93ab69befeefd6dd4b551f198daf014))
* **fab:** upgrade to material-components-web@5.1.0 ([c3111de](https://github.com/src-zone/material/commit/c3111deb18a7e27f7e9ed6690af991ba5f16478c))
* **floating-label:** upgrade to material-components-web@5.1.0 ([d87f3e9](https://github.com/src-zone/material/commit/d87f3e959e4a77887c0c1d2815e74726338aa3eb))
* **focus-trap:** upgrade tomaterial-components-web@5.1.0 ([db4bda9](https://github.com/src-zone/material/commit/db4bda90807c1e6e71db6cae2f3af41f1c81654d))
* **list:** upgrade to material-components-web@5.1.0 ([eb99aca](https://github.com/src-zone/material/commit/eb99aca0f708521ab0352ef344fbd6becc3baf0f)), closes [#658](https://github.com/src-zone/material/issues/658)
* **notched-outline:** upgrade to material-components-web@5.1.0 ([a372d28](https://github.com/src-zone/material/commit/a372d28191da37d6f807971efb5fceef68c30a0f))
* **ripple:** upgrade to material-components-web@5.1.0 ([90b3410](https://github.com/src-zone/material/commit/90b3410b92c3a538d717aba5f7475a2b00ad1951))
* **switch:** upgrade to material-components-web@5.1.0 ([72c705a](https://github.com/src-zone/material/commit/72c705af116c7e95c5aeb8ac26e6e2314a7cc28a))
* **tab:** remove tab component, since it's replaced by a newer component in MCW ([f9523f1](https://github.com/src-zone/material/commit/f9523f19a3fba75d56789e2f749ebb1c4e7ea345))
* **text-field:** upgrade to material-components-web@5.1.0 ([8f1bd2d](https://github.com/src-zone/material/commit/8f1bd2d63b615d6596a44a2e18e28e1d7ddd080d))
* **toolbar:** remove toolbar component, use top-app-bar instead ([94841e8](https://github.com/src-zone/material/commit/94841e85bcde517f252f0f5b078cc96b31d3bed7))
* upgrade to material-components-web@5.1.0 ([b7f9e2d](https://github.com/src-zone/material/commit/b7f9e2d924270e7be697c52563042dc42d91eafa))
* **menu-surface:** add menu-surface directives ([a62e7a1](https://github.com/src-zone/material/commit/a62e7a17474350de786eec649033c3513a441121))


### BREAKING CHANGES

* **toolbar:** deprecated toolbar component is removed, see top-app-bar for a replacement
* **tab:** tab component is removed
* **drawer:** material-components-web drawer upgraded to 5.1.0
* **top-app-bar:** material-components-web top-app-bar upgraded to 5.1.0
* **dialog:** material-components-web dialog upgraded to 5.1.0
* **focus-trap:** focus-trap only traps keyboard-focus
* **focus-trap:** untrapOnOutsideClick not supported anymore
* **focus-trap:** ignoreEscape not supported anymore (trap always ignores escape key presses)
* **list:** list upgraded to material-components-web@5.1.0
* **text-field:** text-field, notched-outline, and floating-label upgraded to material-components-web@5.1.0
* **notched-outline:** notched-outline upgraded to material-components-web@5.1.0
* **floating-label:** floating-label upgraded to material-components-web@5.1.0
* **fab:** fab upgraded to material-components-web@5.1.0
* **switch:** switch upgraded to material-components-web@5.1.0
* **chips:** material-components-web upgraded to 5.1.0
* **chips:** the DOM structure of mdcChip has changed, please check the documentation for examples of the new structure
* **checbox:** material-components-web upgraded to 5.1.0
* **card:** mdcCardPrimaryAction now gets a tabIndex by default, to make the action focusable/tabbable
* **button:** material-components-web upgraded to 5.1.0
* **button:** dense property removed from button, use the buttons density mixin instead, see https://github.com/material-components/material-components-web/tree/master/packages/mdc-button#advanced-sass-mixins
* **button:** labels of buttons should now go into a separate span.mdcButtonLabel element as a child of the mdcButton in most cases
* **ripple:** material-components-web upgraded to 5.1.0
* material-components-web upgraded to 5.1.0



<a name="0.18.1"></a>
## [0.18.1](https://github.com/src-zone/material/compare/v0.18.0...v0.18.1) (2020-07-14)


### Bug Fixes

* **list:** console errors for nonInteractive property fixed ([368ca0f](https://github.com/src-zone/material/commit/368ca0fab9b23f52eb314e6c250f58ce8478304a)), closes [#690](https://github.com/src-zone/material/issues/690)



<a name="0.18.0"></a>
# [0.18.0](https://github.com/src-zone/material/compare/v0.17.0...v0.18.0) (2020-04-06)


### Bug Fixes

* **icon-button:** disabled property should disable the button ([e483175](https://github.com/src-zone/material/commit/e483175cf6a68955d9dfa0ddfcf69a35fe4a29f4))
* **select:** only (de)activate line ripple when there is one ([52041a9](https://github.com/src-zone/material/commit/52041a9f60ce056bd9858dff2e9424dd0f827263)), closes [#663](https://github.com/src-zone/material/issues/663)
* **tab:** activate mdcTabRouter correctly when using Ivy rendering engine (Angular9) ([586cef3](https://github.com/src-zone/material/commit/586cef399c073ac9785a75a568608f6f0da7b520)), closes [#684](https://github.com/src-zone/material/issues/684)


### Features

* **fab:** add extended property to floating action button ([1ba6e7d](https://github.com/src-zone/material/commit/1ba6e7dfaec9f82571262b2bf811f82b9c896cf6))



<a name="0.17.0"></a>
# [0.17.0](https://github.com/src-zone/material/compare/v0.16.0...v0.17.0) (2018-07-11)


### build

* upgrade to material-components-web 0.37.0 ([dccb09d](https://github.com/src-zone/material/commit/dccb09d))


### Features

* **select:** add outlined style variant to mdcSelect ([bdea633](https://github.com/src-zone/material/commit/bdea633))


### BREAKING CHANGES

* upgrade to material-components-web 0.37.0




<a name="0.16.0"></a>
# [0.16.0](https://github.com/src-zone/material/compare/v0.15.0...v0.16.0) (2018-06-20)


### Bug Fixes

* **chips:** only emit selectedChange on actual changes ([5d509d1](https://github.com/src-zone/material/commit/5d509d1))


### Features

* **list:** add ripples to mdcListItem children of interactive mdcList ([#651](https://github.com/src-zone/material/issues/651)) ([c237b23](https://github.com/src-zone/material/commit/c237b23))
* **icon-button:** implement icon-button variants ([395e6db](https://github.com/src-zone/material/commit/395e6db))
* **ripple:** allow customization of ripple styling ([c51dba4](https://github.com/src-zone/material/commit/c51dba4))
* **text-field:** add outlined style variant to text-field ([4a248df](https://github.com/src-zone/material/commit/4a248df))
* **toolbar:** improve scroll performance for viewport property ([d36f83d](https://github.com/src-zone/material/commit/d36f83d))
* **top-app-bar:** add directives for mdc top-app-bar ([75e143a](https://github.com/src-zone/material/commit/75e143a))
* **icon:** remove mdcIcon, please use mdcIconButton instead ([1eee3b9](https://github.com/src-zone/material/commit/1eee3b9))


### BREAKING CHANGES

* mdcIcon has been removed. Please use mdcIconButton
instead. mdcIconButton is a drop in replacement for mdcIcon.
But you should place it on a button or anchor element.
* when an mdcList is interactive (the default), all its
mdcListItem children will get an interaction ripple. Previously you had
to add the ripple with the mdcRipple directive. Thus, you should remove
all mdcRipple directives placed an mdcListItem directives, as they are
not needed anymore.
* **ripple:** the mdcRipple directive does not set the class
mdc-ripple-surface on it's element anymore. This allows for other
classes to be used with mdcRipple, that can be customized with the
provided sass-mixins. For the old behavior, add the `surface` property
to your mdcRipple. This will add the mdc-ripple-surface class as before.




<a name="0.15.0"></a>
# [0.15.0](https://github.com/src-zone/material/compare/v0.14.0...v0.15.0) (2018-06-05)


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


### Features

* all blox material services are now tree-shakeable ([#638](https://github.com/src-zone/material/issues/638)) ([9f7d96f](https://github.com/src-zone/material/commit/9f7d96f))
* **chips:** implement chips and chip-sets ([#640](https://github.com/src-zone/material/issues/640), [#632](https://github.com/src-zone/material/issues/632)) ([449ec52](https://github.com/src-zone/material/commit/449ec52))
* upgrade to material-components-web 0.36.0-0 ([4240ca1](https://github.com/src-zone/material/commit/4240ca1))


### BREAKING CHANGES

* upgrade to material-components-web 0.36.0-0
* Angular 5 is no longer supported.
Please upgrade to Angular 6.




<a name="0.13.0"></a>
# [0.13.0](https://github.com/src-zone/material/compare/v0.12.0...v0.13.0) (2018-05-22)


### Features

* **snackbar:** add afterShow/afterHide observables to MdcSnackbarRef ([87ab60e](https://github.com/src-zone/material/commit/87ab60e))
* **icon:** fix mdcIcon styling & button-like behavior ([bf40e2c](https://github.com/src-zone/material/commit/bf40e2c))
* **select:** add box property to mdcSelect ([ab04988](https://github.com/src-zone/material/commit/ab04988))
* upgrade to material-components-web 0.35.2 ([ac86710](https://github.com/src-zone/material/commit/ac86710))
* **button:** add mdcButtonIcon ([ce47281](https://github.com/src-zone/material/commit/ce47281))
* **button:** add unelevated property to mdcButton ([f1dcd8f](https://github.com/src-zone/material/commit/f1dcd8f))
* **checkbox,icon-toggle,radio:** don't override default ripple size ([1e3657c](https://github.com/src-zone/material/commit/1e3657c))
* **focus-trap,dialog:** implement focus-trap and dialog directives ([fdfa357](https://github.com/src-zone/material/commit/fdfa357))
* **icon-toggle:** rename isOn/isOnChange to on/onChange ([51aef91](https://github.com/src-zone/material/commit/51aef91))
* **linear-progress:** remove is* prefix from properties ([036c04f](https://github.com/src-zone/material/commit/036c04f))
* **list:** add nonInteractive property to mdcList ([112d4d7](https://github.com/src-zone/material/commit/112d4d7))
* **list:** add padded property to mdcListDivider ([4714dde](https://github.com/src-zone/material/commit/4714dde))
* **list:** add selected & activated properties to mdcListItem ([98496a0](https://github.com/src-zone/material/commit/98496a0))
* **list:** rename mdcListDivider property hasInset to inset ([cb11ce7](https://github.com/src-zone/material/commit/cb11ce7))
* **menu:** rename isOpen/isOpenChange properties to open/openChange ([03ca89e](https://github.com/src-zone/material/commit/03ca89e))
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

* set "sideEffects" false in package.json for more agressive tree shaking ([#612](https://github.com/src-zone/material/issues/612), [#609](https://github.com/src-zone/material/issues/609)) ([ef95953](https://github.com/src-zone/material/commit/ef95953))
* add compatibility with rxjs 6 and angular 6 (#611) ([03d71fd](https://github.com/src-zone/material/commit/03d71fd)), closes [#611](https://github.com/src-zone/material/issues/611)


### BREAKING CHANGES

*   The RXJS imports are now optimized for RXJS6.
Effectively when using Angular 5 and thus RXJS 5,
more code from RXJS may end up in your bundles,
leading to a larger bundle size. This DOES NOT
affect Angular 6 and RXJS 6. We suggest to upgrade
to Angular 6 when possible!




<a name="0.11.0"></a>
# 0.11.0 (2018-05-14)


### This version was published from another tag - do not use




<a name="0.10.0"></a>
# 0.10.0 (2018-05-14)


### This version was published from another tag - do not use




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
