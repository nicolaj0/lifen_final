import { FhirService } from './providers/fhir.service';
import {Component} from '@angular/core';
import {ElectronService} from './providers/electron.service';
import {TranslateService} from '@ngx-translate/core';
import {AppConfig} from '../environments/environment';
import { mergeMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  total: any;
  constructor(public electronService: ElectronService,
              private translate: TranslateService,
              private fhir: FhirService) {

    translate.setDefaultLang('en');
    console.log('AppConfig', AppConfig);

    if (electronService.isElectron()) {
      console.log('Mode electron');
      console.log('Electron ipcRenderer', electronService.ipcRenderer);
      console.log('NodeJS childProcess', electronService.childProcess);


   

      // Something to use when events are received.

    } else {
      console.log('Mode web');
    }
  }
}
