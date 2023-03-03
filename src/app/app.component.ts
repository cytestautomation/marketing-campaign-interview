import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private translateService: TranslateService,
    private router: Router,
    private config: PrimeNGConfig
  ) {
    let defLang = translateService.getBrowserCultureLang();
    if (defLang !== 'pl-PL') {
      defLang = 'en-US';
    }
    translateService.setDefaultLang(defLang);
    translateService.use(defLang);
  }

  ngOnInit() {}
}
