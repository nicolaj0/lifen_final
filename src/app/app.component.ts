import { FhirService } from './providers/fhir.service';
import {Component} from '@angular/core';
import {ElectronService} from './providers/electron.service';
import {TranslateService} from '@ngx-translate/core';
import {AppConfig} from '../environments/environment';
import { mergeMap } from 'rxjs/operators';

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


      const watcher = electronService.chokidar.watch("./**/*.pdf", {
        persistent: true
      });

      // Something to use when events are received.
      watcher.on("add", (p, stats) => {
        console.log(`File ${p} has been added`);
        var data = electronService.fs.readFileSync("./" + p);
        this.fhir.postFile(data)
              .pipe(mergeMap(() => this.fhir.getHiso()))
              .subscribe(
              data => {
                this.total = data.total;
                console.log(data.total);
              })
      });

    } else {
      console.log('Mode web');
    }
  }
}
