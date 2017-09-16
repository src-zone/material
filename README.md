The @ blox/material angular library provides an integration between
@ material` from google (https://github.com/material-components/material-components-web
and @ angular` (https://angular.io).

The components and directives are designed with the following design principles:

* Every @material component will get a directive binding as angular integration,
  such as mdcTextfield, mdcTextfieldLabel, mdcCard, etc. Thus there are directives
  for top level `@material` components (components that have their own foundation class inside
  `@material` such as mdc-textfield, see
  https://material.io/components/web/catalog/input-controls/text-fields/), and
  their child components such as the label for an mdc-textfield.

  Directives are a logical choice here, and give slightly greater flexibility than
  exposing the functionality as angular components.

* We may at some point also introduce angular components that provide
  the functionality of the directives, but in a more concise (shorter)
  structure. This is still being discussed.

* Features that `@material` exposes by requiring css classes on html elements
  (such as mdc-textfield-helptext--persistent) will get directive based equivalents
  in this library. It should not be necessary to work directly with the mdc-** css
  classes from `@material` when using our mdc** directives in angular.
  The mdc** directives should control which mdc-** classes are present on an
  element.

* TODO: always follow the structure? Or may directives reorganize or add structure?
  (e.g. the SVG inside mdcCheckbox)?

* None of the provided components will import any of the stylesheets/sass-files
  from `@material`. Your application should include the stylesheets
  they want to use from `@material`. This gives the application designer more flexibility
  in the final css that components use.
  It also reduces style duplication in your code bundles, that will inevitabily occur
  when each component ships with it's own styles.

## Status 

Component                | Directives | Comments
------------------------ | ---------- |
button                   | mdcButton   |
card                     | mdcCard, mdcCardHorizontal, mdcCardPrimary, mdcCardTitle, mdcCardSubtitle, mdcCardText, mdcCardMedia mdcCardMediaItem, mdcCardActions |
checkbox                 | mdcCheckbox, mdcCheckboxInput |
dialog                   |        |
drawer                   |        |
fab                      | mdcFab, mdcFabIcon |
form-field               | mdcFormfield, mdcFormfieldInput, mdcFormfieldLabel |
grid-list                |        |
icon-toggle              |        |
layout-grid              |        |
list                     |        |
menu (simple-menu)       |        |
radio                    | mdcRadio, mdcRadioInput |
ripple                   |        | See AbstractMdcRipple for attaching ripples to other components/directives
select                   |        |
snackbar                 | mdcSnackbar, mdcSnackbarText, mdcSnackbarActionWrapper
switch                   |        |
textfield                | mdcTextfield, mdcTextfieldInput, mdcTextfieldLabel, mdcTextfieldHelptext
toolbar                  | mdcToolbar, mdcToolbarRow, mdcToolbarSection, mdcToolbarTitle, mdcToolbarFixedAdjust

The following are sass/css only elements, and therefore not implemented as angular directives/components. You should use the appropriate
sass mixins (recommended), or if that's not possible, use the css classes:

Component | Sass-Mixins
--------- | -----------
elevation | mdc-elevation, mdc-elevation-transition-rule
