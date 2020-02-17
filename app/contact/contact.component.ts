import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';
import 'rxjs/add/operator/switchMap';
import { DrawerPage } from '~/shared/drawer/drawer.page';

import { TNSFontIconService } from 'nativescript-ngx-fonticon';
import * as Email from 'nativescript-email';
import * as TypePhone from 'nativescript-phone';


@Component({
  selector: 'app-contactus',
  moduleId: module.id,
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactUsComponent extends DrawerPage {
  errMess: string;

  constructor(private routerExtensions: RouterExtensions,
    private changeDetectorRef: ChangeDetectorRef,
    private fonticon: TNSFontIconService
  ) {
    super(changeDetectorRef);
  }


  sendEmail() {
    Email.available()
      .then((avail: boolean) => {
        if (avail) {
          Email.compose({
            to: ['confusion@food.net'],
            subject: '[ConFusion]: Query',
            body: 'Dear Sir/Madam:'
          });
        }
        else
          console.log('No Email Configured');
      });
  }

  callRestaurant() {
    const phoneNumber = '+852 1234 5678';
    TypePhone.requestCallPermission('You should accept the permission to be able to make a direct phone call.')
          .then(() => TypePhone.dial(phoneNumber, false))
          .catch(() => TypePhone.dial(phoneNumber, true));
  }






} 