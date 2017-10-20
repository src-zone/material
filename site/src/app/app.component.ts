import { Component } from '@angular/core';
import { Angulartics2GoogleTagManager, Angulartics2 } from 'angulartics2';

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
