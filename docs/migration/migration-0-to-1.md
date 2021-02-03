# Migrate from Blox Material v0.18.1 to v1.0.0

The material-components-web dependency has been upgraded to version 5.1.0. This upgrade includes substantial changes to many of the material components DOM-structure, and their styling via Sass. The Sass theming structure has chenged to use the new Sass module structure via `@use` instead of `@import`. More information can be found at [Material Components Web Theming](https://github.com/material-components/material-components-web/blob/master/docs/theming.md), and in the documentation for our components at [Blox Material Components](https://material.src.zone/components).

The remainder of this upgrade guide focuses on the new DOM-structure, and on changes in properties and action handlers
that are introduced by the new material-components-web.

## Button

* No changes required
* When adding a trailing `mdcButtonIcon` to the button, the label should be wrapped in an `mdcButtonLabel` directive:
  ```html
  <button mdcButton>
    <span mdcButtonLabel>Label</span>
    <i mdcButtonIcon class="material-icons">favorite</i>
  </button>
  ```

## Card

* No changes required

## Checkbox

* No changes required

## Chips

* Chip DOM structure has changed
* The `mdcChipText` should be wrapped in `mdcChipCell` + `mdcChipPrimaryAction`. Before:
  ```html
  <div mdcChip>
    <i mdcChipIcon class="material-icons">wb_sunny</i>
    <div mdcChipText>Turn lights on</div>
  </div>
  ```
  After:
  ```html
  <div mdcChip>
    <i mdcChipIcon class="material-icons">wb_sunny</i>
    <span mdcChipCell>
      <span mdcChipPrimaryAction>
        <div mdcChipText>Turn lights on</div>
      </span>
    </span>
  </div>
  ```
* An (optional) trailing icon for input chips should be wrapped in an `mdcChipCell`. Before:
  ```html
  <div mdcChip>
    <i mdcChipIcon class="material-icons">face</i>
    <div mdcChipText>Text</div>
    <i class="material-icons" mdcChipIcon>cancel</i>
  </div>
  ```
  After:
  ```html
  <div mdcChip>
    <i mdcChipIcon class="material-icons">face</i>
    <span mdcChipCell>
      <span mdcChipPrimaryAction>
        <div mdcChipText>Text</div>
      </span>
    </span>
    <span mdcChipCell>
      <i mdcChipIcon class="material-icons">cancel</i>
    </span>
  </div>
  ```

## Dialog

* The `mdcFocusTrap` directive is not required anymore. An `mdcDialog` will automatically also have the focus trap directive attached.
* The `scrollable` property from `mdcDialogBody` is dropped. Whether a dialog body must be scrollable is now automatically detected by the dialog based on the height of the dialog body.
* The DOM structure has changed:
  * `mdcDialogSurface` must be wrapped in `mdcDialogContainer`.
  * `mdcDialogHeader` + `mdcDialogHeaderTitle` is replaced by `mdcDialogTitle`.
  * `mdcDialogBody` is replaced by `mdcDialogContent`.
  * `mdcDialogFooter` is replaced by `mdcDialogActions`.
  * `mdcDialogCancel` should be raplced by `mdcDialogTrigger="close"`.
  * `mdcDialogAccept` should be replaced by `mdcDialogTrigger="accept"`.
  * `mdcDialogBackdrop` should be replaced by `mdcDialogScrim`.
  
  Before:
  ```html
  <aside mdcDialog mdcFocusTrap>
    <div mdcDialogSurface>
      <header mdcDialogHeader>
        <h2 mdcDialogHeaderTitle>Modal Dialog</h2>
      </header>
      <section mdcDialogBody scrollable>The dialog body</section>
      <footer mdcDialogFooter>
        <button mdcButton mdcDialogCancel>Decline</button>
        <button mdcButton mdcDialogAccept>Accept</button>
      </footer>
    </div>
    <div mdcDialogBackdrop></div>
  </aside>
  ```
  After:
  ```html
  <aside mdcDialog>
    <div mdcDialogContainer>
      <div mdcDialogSurface>
        <h2 mdcDialogTitle>Modal Dialog</h2>
        <section mdcDialogContent>The dialog body</section>
        <footer mdcDialogActions>
          <button mdcButton mdcDialogTrigger="close">Decline</button>
          <button mdcButton mdcDialogTrigger="accept" mdcDialogDefault>Accept</button>
        </footer>
      </div>
    </div>
    <div mdcDialogScrim></div>
  </aside>
  ```

## Drawer

* The drawer types are now named: `permanent`, `dismissible` (was `persistent`), and `modal` (was `temporary`).
* The DOM structure has changed:
  * `mdcDrawerContainer` is not wrapping `mdcDrawer` anymore, and its properties are moved to `mdcDrawer`
    (this only affects `dismissible` and `modal` drawers).
  * `mdcDrawerToolbarSpacer` does not exist anymore.
  * `mdcDrawerHeaderContent` is replaced by `mdcDrawerTitle`, and `mdcDrawerSubtitle`.
  * For modal drawers an `mdcDrawerScrim` should be added as a sibling element of the `mdcDrawer`.
  * For `dismissible` drawers it is recommended to apply the `mdcDrawerAppContent` directive to
    the sibling element next to the drawer so that open/close animations work correctly.
  
  Before:
  ```html
  <aside [mdcDrawerContainer]="drawerType" [(open)]="open">
    <nav mdcDrawer>
      <div mdcDrawerToolbarSpacer></div>
      <div mdcDrawerHeader>
        <div mdcDrawerHeaderContent>Header</div>
      </div>
      <div mdcDrawerContent mdcListGroup>
        ...
      </div>
    </nav>
  </aside>
  <div>page content</div>
  ```
  After:
  ```html
  <aside [mdcDrawer]="drawerType" [(open)]="open">
    <div mdcDrawerHeader>
      <h3 mdcDrawerTitle>Header</h3>
      <h6 mdcDrawerSubtitle>subtitle</h6>
    </div>
    <div mdcDrawerContent mdcListGroup>
      ...
    </div>
  </aside>
  <div mdcDrawerScrim *ngIf="drawerType === 'modal'"></div>
  <div [mdcDrawerAppContent]="drawerType === 'dismissible'">page content</div>
  ```

## Elevation

* No changes required

## Floating Action Button

* The `extended` property is removed. A floating action button will automatically be
  *extended* when it contains an `mdcFabLabel`. Before:
  ```html
  <button mdcFab extended>
    <span mdcFabIcon class="material-icons">favorite</span>
    <span mdcFabLabel>Like</span>
  </button>
  ```
  After:
  ```html
  <button mdcFab>
    <span mdcFabIcon class="material-icons">favorite</span>
    <span mdcFabLabel>Like</span>
  </button>
  ```

## Focus Trap

* A focus trap is now automatically applied to `mdcDialog` and modal `mdcDrawer` directives. So you should remove `mdcFocusTrap` from elements with those directives.
* The escape key does not untrap an `mdcFocusTrap` anymore. Add your own handlers if untrapping on Escape key press is required. (Note that `mdcDialog` and `mdcDrawer` already have their own handlers for the Escape key, so handling Escape is only needed if you are implementing a raw `mdcFocusTrap`).
* `mdcFocusTrap` does not block mouse interaction anymore. Add a scrim element to prevent mouse interactions outside the trap (for an example check out the demo at https://material.src.zone/components/focus-trap). Please note that `mdcDialog` and `mdcDrawer` already come with scrim elements.
* Property `untrapOnOutsideClick` is not supported anymore. Please add your own click handler to the scrim mentioned in the previous bullet.
* Property `ignoreEscape` is not supported anymore. See the previous comments about handling the Escape key.

## Icon Button

* No changes required for the non-toggling variant of `mdcIconButton`.
* The DOM structure has changed for toggling `mdcIconButton`. The on/off icons are now child elements of `mdcIconButton`. Before:
  ```html
  <button mdcIconButton
    class="material-icons"
    labelOn="Remove from favorites"
    labelOff="Add to favorites"
    iconOn="favorite"
    iconOff="favorite_border"
    [(on)]="favorite"></button>
  ```
  After:
  ```html
  <button mdcIconToggle
    labelOn="Remove from favorites"
    labelOff="Add to favorites"
    [(on)]="favorite">
    <i mdcIcon="on" class="material-icons">favorite</i>
    <i mdcIcon class="material-icons">favorite_border</i>
  </button>
  ```
* See https://material.src.zone/components/icon-button for more examples, including samples for SVG icons, and samples for icon fonts that use classnames instead of ligatures.

## Icon toggle

* `mdcIconToggle` is replaced by `mdcIconButton`. See above.

## Linear Progress

* No changes required

## List

* The `activated` property was removed. Use `selected` to enable either the *activated*, or the *selected* state. The `mdcList` will choose between the different selection modes (`aria-current`, `aria-selected`, `aria-checked`) depending on `selectionMode` and DOM-structure.
* Not setting the `nonInteractive` property will now make the list fully interactive. Previously a list without `nonInteractive` set would only have stylings applied, but mouse and keyboard actions were not handled.
* The DOM-structure of single-line-lists has changed. The text of each item should now be wrapped in `mdcListItemText` directives. Before:
  ```html
  <li mdcListItem>Wi-Fi</li>
  ```
  After:
  ```html
  <li mdcListItem>
    <span mdcListItemText>Wi-Fi</span>
  </li>
  ```
* The DOM structure of two-line-lists has changed. The primary text of a list item should now be wrapped in `mdcListItemPrimary` directives. Before:
  ```html
  <li mdcListItem>
    <span mdcListItemText>
      Wi-Fi
      <span mdcListItemSecondaryText>Strong signal</span>
    </span>
  </li>
  ```
  After:
  ```html
  <li mdcListItem>
    <span mdcListItemText>
      <span mdcListItemPrimaryText>Wi-Fi</span>
      <span mdcListItemSecondaryText>Strong signal</span>
    </span>
  </li>
  ```

## Menu

* It is recommended to open an `mdcMenu` through an `mdcMenuTrigger` directive. This takes care of following ARIA recommended practices for focusing the correct element, and maintaining proper `aria-*` and `role` attributes on the interaction element, menu, and list.
* The `cancel` output has been removed. For detecting if the menu was closed without any menu choice selection, try to use `afterClosed` in combination with listening for `pick`.
* The DOM-structure of menu items has changed. Before:
  ```html
  <li mdcListItem value="reload">Reload</li>
  ```
  After:
  ```html
  <li mdcListItem value="reload">
    <span mdcListItemText>Reload</span>
  </li>
  ```

## Radio Button

* No changes required

## Ripple

* No changes required

## Select
* The `box` and `outlined` property are gone. An `mdcSelect` will now display in the `outlined` variant when the `mdcFloatingLabel` is wrapped inside `mdcNotchedOutline` and `mdcNotchedOutlineNotch` directives. Otherwise the boxed variant will be used. You can change the styling at runtime, by changing the DOM-structure, as demonstrated in the [Select Component Guide](material.src.zone/components/select).
* The `mdcSelect` does not wrap a native `select` input element anymore, but uses `mdcSelectMenu` and `mdcList` for the list of choices.
* There is no need anymore to include an empty disabled option value for representing the *no choice* state.
* For an outlined `mdcSelect` the changes are as follows. Before:
  ```html
  <div mdcSelect outlined>
    <select mdcSelectControl [(ngModel)]="value" [disabled]="disabled">
      <option value="" disabled selected></option>
      <option value="green">Green</option>
      <option value="orange">Orange</option>
      <option value="red">Red</option>
    </select>
    <label mdcFloatingLabel>Pick a Color</label>
  </div>
  ```
  After:
  ```html
  <div mdcSelect [(ngModel)]="value" [disabled]="disabled">
    <div mdcSelectAnchor>
      <div mdcSelectText>{{value}}</div>
      <span mdcNotchedOutline>
        <span mdcNotchedOutlineNotch>
          <span mdcFloatingLabel>Pick a Color</span>
        </span>
      </span>
    </div>
    <div mdcSelectMenu>
      <ul mdcList>
        <li mdcListItem value="green">Green</li>
        <li mdcListItem value="orange">Orange</li>
        <li mdcListItem value="red">Red</li>
      </ul>
    </div>
  </div>
  ```
* For a boxed `mdcSelect` the changes are as follows. Before:
  ```html
  <div mdcSelect box>
    <select mdcSelectControl [(ngModel)]="value" [disabled]="disabled">
      <option value="" disabled selected></option>
      <option value="green">Green</option>
      <option value="orange">Orange</option>
      <option value="red">Red</option>
    </select>
    <label mdcFloatingLabel>Pick a Color</label>
  </div>
  ```
  After:
  ```html
  <div mdcSelect [(ngModel)]="value" [disabled]="disabled">
    <div mdcSelectAnchor>
      <div mdcSelectText>{{value}}</div>
      <span mdcFloatingLabel>Pick a Color</span>
    </div>            
    <div mdcSelectMenu>
      <ul mdcList>
        <li mdcListItem value="green">Green</li>
        <li mdcListItem value="orange">Orange</li>
        <li mdcListItem value="red">Red</li>
      </ul>
    </div>
  </div>
  ```

## Slider

* No changes required

## Snackbar
* The `MdcSnackbarService` property `startAligned` property is replaced by a properyy with the name `leading`.
* The `MdcSnackbarService` property `dismissesOnAction` was removed. Snackbars will always close when the action button is clicked.
* The property `multiline` of `MdcSnackbarMessage` is replaced by a property with the name `stacked`.
* The property `actionOnBottom` was removed. Set the `stacked` property when the action button must be shown below the text instead of adjacent to the text.
* The default value for the `timeout` property of an `MdcSnackbarMessage` was changed from 2750ms to 5000ms.
* The property (observer) `afterShow` of `MdcSnackbarRef` was replaced by property `afterOpened`.
* The property (observer) `afterHide` of `MdcSnackbarRef` was replaced by property `afterClosed`.

## Switch

* The DOM-structure has changed. Before:
  ```html
  <div mdcSwitch>
    <input mdcSwitchInput type="checkbox"/>
  </div>
  ```
  After:
  ```html
  <div mdcSwitch>
    <div mdcSwitchThumb>
      <input mdcSwitchInput type="checkbox"/>
    </div>
  </div>
  ```

## Tabs

* The old `mdcTab*` directives have been replaced by completely new `mdcTab*` directives, based on a new material components web component.
* For details about the new components please check the [Tab Directives Guide](material.src.zone/components/tabs).
* The `mdcTabBarScroller*` directives are removed. A scroller must now always be added by having an `mdcTabScroller` directive inside the `mdcTabBar`. (The old `mdcTabBarScroller*` directives were optional, and were wrapping the tab bar instead of being wrapped by it).
* The `mdcTabRouter` directive is now implied by having an element that has both an `mdcTab` and a `routerLink` attribute. It is recommended to change `mdcTabRouter` to `mdcTab` (although `mdcTabRouter` is still supported for backward compatibility).
* The most notable changes are documented with the following snippets. Before:
  ```html
  <nav mdcTabBar>
    <a mdcTab tabindex="0">Tab 1</a>
    <a mdcTab tabindex="0">Tab 2</a>
  </nav>
  ```
  After:
  ```html
  <nav mdcTabBar>
    <div mdcTabScroller>
      <div mdcTabScrollerArea>
        <div mdcTabScrollerContent>
          <a mdcTab>
            <span mdcTabContent>
              <span mdcTabLabel>Tab 1</span>
            </span>
            <span mdcTabIndicator><span mdcTabIndicatorContent></span></span>
          </a>
          <a mdcTab>
            <span mdcTabContent>
              <span mdcTabLabel>Tab 2</span>
            </span>
            <span mdcTabIndicator><span mdcTabIndicatorContent></span></span>
          </a>
        </div>
      </div>
    </div>
  </nav>
  ```

## Text Field
* The `box` and `outlined` property are gone. An `mdcTextField` will now display in the `outlined` variant when the `mdcFloatingLabel` is wrapped inside `mdcNotchedOutline` and `mdcNotchedOutlineNotch` directives. Otherwise the boxed variant will be used. You can change the styling at runtime, by changing the DOM-structure, as demonstrated in the [Text Field Component Guide](material.src.zone/components/text-field).
* `mdcTextFieldHelperText` must now be wrapped inside an `mdcTextFieldHelperLine` directive.
* For an outlined `mdcTextField` the changes are as follows. Before:
  ```html
  <div mdcTextField outlined [helperText]="helpertxt">
    <input mdcTextFieldInput type="text"/>
    <label mdcFloatingLabel>Input Label</label>
  </div>
  <p mdcTextFieldHelperText #helpertext="mdcHelperText">Help text</p>
  ```
  After:
  ```html
  <label mdcTextField [helperText]="helpertext">
    <input mdcTextFieldInput type="text"/>
    <span mdcNotchedOutline>
      <span mdcNotchedOutlineNotch>
        <span mdcFloatingLabel>Input Label</span>
      </span>
    </span>
  </label>
  <div mdcTextFieldHelperLine>
    <p mdcTextFieldHelperText #helpertext="mdcHelperText">Help text</p>
  </div>
  ```
* For a boxed `mdcTextField` the changes are as follows. Before:
  ```html
  <div mdcTextField boxed [helperText]="helpertxt">
    <input mdcTextFieldInput type="text"/>
    <label mdcFloatingLabel>Input Label</label>
  </div>
  <p mdcTextFieldHelperText #helpertext="mdcHelperText">Help text</p>
  ```
  After:
  ```html
  <label mdcTextField [helperText]="helpertext">
    <input mdcTextFieldInput type="text"/>
    <span mdcFloatingLabel>Input Label</span>
  </label>
  <div mdcTextFieldHelperLine>
    <p mdcTextFieldHelperText #helpertext="mdcHelperText">Help text</p>
  </div>
  ```

## Toolbar

* `mdcToolbar` was replaced by `mdcTopAppBar`. Please see https://material.src.zone/components/top-app-bar
  for instructions and examples on using the `mdcTopAppBar` directive.

## Utility

* All documented utility directives have remained unchanged.
