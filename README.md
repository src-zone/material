A lightweight Material Design library for [Angular](https://angular.io).
Open-source and based upon [Google's Material Components for the Web](https://github.com/material-components/material-components-web).

Blox Material makes it possible to create beautiful Angular apps with modular and customizable UI components,
designed according to the [Material Design Guideliness](https://material.io/guidelines).

## Quick Links
* [Documention, Demo & Examples](https://blox.src.zone/material)
* [Changelog](bundle/CHANGELOG.md)

## Status 

Component                | Directives | Comments
------------------------ | --------- | --
button                   | [See demo](https://blox.src.zone/material#/directives/button) |
card                     | [See demo](https://blox.src.zone/material#/directives/card) |
checkbox                 | [See demo](https://blox.src.zone/material#/directives/checkbox) |
dialog                   |           |
drawer                   |           |
elevation                | [See demo](https://blox.src.zone/material#/directives/elevation) |
fab                      | [See demo](https://blox.src.zone/material#/directives/fab) |
form-field               | Available | See demos for e.g. radio, and checkbox.
grid-list                |           |
icon-toggle              | [See demo](https://blox.src.zone/material#/directives/icon-toggle) |
linear-progress          | [See demo](https://blox.src.zone/material#/directives/linear-progress) |
list                     | [See demo](https://blox.src.zone/material#/directives/list) |
menu                     | [See demo](https://blox.src.zone/material#/directives/menu) |
radio                    | [See demo](https://blox.src.zone/material#/directives/radio) |
ripple                   | [See demo](https://blox.src.zone/material#/directives/ripple) |
select                   | [See demo](https://blox.src.zone/material#/directives/select) |
slider                   | [See demo](https://blox.src.zone/material#/directives/slider) |
snackbar                 | [See demo](https://blox.src.zone/material#/directives/snackbar) |
switch                   | [See demo](https://blox.src.zone/material#/directives/switch) |
tabs                     | [See demo](https://blox.src.zone/material#/directives/tab) |
text-field               | [See demo](https://blox.src.zone/material#/directives/text-field) |
toolbar                  | [See demo](https://blox.src.zone/material#/directives/toolbar) |

Note: the `@material` packages `layout-grid`, `theme`, and `typography` provide styling
(scss, css) only. As such they can be consumed directly from your Angular app, and we see
no reason to wrap their functionality in Angular components or directives.

## Alternatives
* [Material2](https://material.angular.io):
  The Angular team's Material Design components built for and with Angular.
  Currently has a wider range of implemented components.
  The components are not based on Material Components for the Web, but natively
  implemented in Angular.
  Don't use if you are developing both Angular and non-Angular based websites,
  and want to share your customized styling between both.
* [angular-mdc-web](https://github.com/trimox/angular-mdc-web):
  Another integration library for leveraging Material Components for the Web in Angular
  applications. We would choose Blox Material for smaller resulting code size,
  less complexity, and more consistent Angular integration. But we are biased.
