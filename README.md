Demo and Documention: https://blox.src.zone/material

The Blox Material angular library provides an integration between
[Google's Material Components for the Web](https://github.com/material-components/material-components-web)
and [Angular](https://angular.io).

Blox Material makes it possible to create beautiful apps with modular and customizable UI components,
designed according to the [Material Design Guideliness](https://material.io/guidelines).

The integration between Blox Material and the underlying Material Components for the Web,
is done by providing Angular Directives.

## Status 

Component                | Directives | Comments
------------------------ | --------- |
button                   | [See demo](https://blox.src.zone/material#/directives/button) |
card                     | [See demo](https://blox.src.zone/material#/directives/card) |
checkbox                 | [See demo](https://blox.src.zone/material#/directives/checkbox) |
dialog                   |           |
drawer                   |           |
elevation                | [See demo](https://blox.src.zone/material#/directives/elevation) |
fab                      | [See demo](https://blox.src.zone/material#/directives/fab) |
form-field               | Available |
grid-list                |           |
icon-toggle              | [See demo](https://blox.src.zone/material#/directives/icon-toggle) |
linear-progress          | [See demo](https://blox.src.zone/material#/directives/linear-progress) |
list                     | [See demo](https://blox.src.zone/material#/directives/list) |
menu                     | [See demo](https://blox.src.zone/material#/directives/menu) |
radio                    | [See demo](https://blox.src.zone/material#/directives/radio) |
ripple                   | [See demo](https://blox.src.zone/material#/directives/ripple) |
select                   |           |
slider                   | [See demo](https://blox.src.zone/material#/directives/slider) |
snackbar                 | [See demo](https://blox.src.zone/material#/directives/snackbar) |
switch                   | [See demo](https://blox.src.zone/material#/directives/switch) |
tabs                     | [See demo](https://blox.src.zone/material#/directives/tab) |
textfield                | [See demo](https://blox.src.zone/material#/directives/textfield) |
toolbar                  | [See demo](https://blox.src.zone/material#/directives/toolbar) |

Note: the `@material` packages `layout-grid`, `theme`, and `typography` are supposed to be used by
scss (or css) directly. As such they can be used directly from your Angular app, and we see
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
  applications. The angular-mdc-web integration is mostly based upon Angular Components.
  Blox Material uses Angular Directives for all component integrations.
  There are advantages to both approaches.

## Quick Links
*  [Demo, documentation and examples](https://blox.src.zone/material)