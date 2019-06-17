import { FhirService } from './fhir.service';
import {Component, Injectable} from '@angular/core';
import {ElectronService} from './electron.service';
import {TranslateService} from '@ngx-translate/core';
import {AppConfig} from '../../environments/environment';
import { mergeMap, catchError } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilewatcherService {

  total: any;
  private countdownEndSource = new Subject<string>();
    public countdownEnd$ = this.countdownEndSource.asObservable();
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
             /*  .pipe(mergeMap(() => this.fhir.getHiso())) */
              .subscribe(
              data => {
                console.log('upload OK');
                this.countdownEndSource.next(p);
              },err => console.log('HTTP Error', err),)
      });

    } else {
      console.log('Mode web');
    }
  }
}
