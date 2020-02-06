import {Component} from "@angular/core";
import { login, LoginResult } from "ui/dialogs";
import { getString, setString } from "application-settings";

import { TNSFontIconService } from 'nativescript-ngx-fonticon';

@Component({
    selector: 'drawer-content',
    templateUrl: './shared/drawer/drawer.component.html',
})
export class DrawerComponent {

    constructor(private fonticon: TNSFontIconService) {
    }
}