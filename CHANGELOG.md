# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

      <a name="0.12.0"></a>
# [0.12.0](https://github.com/src-zone/material/compare/v0.11.0...v0.12.0) (2018-05-14)




**Note:** Version bump only for package undefined

      <a name="0.11.0"></a>
# [0.11.0](https://github.com/src-zone/material/compare/v0.10.0...v0.11.0) (2018-05-14)


### Features

* demo site upgrade to angular 6 ([#614](https://github.com/src-zone/material/issues/614)) ([1973923](https://github.com/src-zone/material/commit/1973923))
* set "sideEffects" false in package.json for more agressive tree shaking ([#612](https://github.com/src-zone/material/issues/612), [#609](https://github.com/src-zone/material/issues/609)) ([ef95953](https://github.com/src-zone/material/commit/ef95953))




<a name="0.10.0"></a>
# [0.10.0](https://github.com/src-zone/material/compare/v0.9.0...v0.10.0) (2018-05-14)


*  feat: add compatibility with rxjs 6 and angular 6 (#611) ([03d71fd](https://github.com/src-zone/material/commit/03d71fd)), closes [#611](https://github.com/src-zone/material/issues/611)



### BREAKING CHANGES

*   The RXJS imports are now optimized for RXJS6.
Effectively when using Angular 5 and thus RXJS 5,
more code from RXJS may end up in your bundles,
leading to a larger bundle size. This DOES NOT
affect Angular 6 and RXJS 6. We suggest to upgrade
to Angular 6 when possible!




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
