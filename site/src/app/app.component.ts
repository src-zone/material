import { Component } from '@angular/core';
import { Angulartics2 } from 'angulartics2';
import { Angulartics2GoogleTagManager } from 'angulartics2/gtm';

@Component({
  selector: 'blox-app',
  templateUrl: './app.component.html'
})
export class AppComponent {
    year = 2017;

    constructor(angulartics2GoogleTagManager: Angulartics2GoogleTagManager, angulartics2: Angulartics2) {
        angulartics2.withBase('/material#');
    }
}
