import {FhirService} from './fhir.service';
import {Component, Injectable} from '@angular/core';
import {ElectronService} from './electron.service';
import {TranslateService} from '@ngx-translate/core';
import {AppConfig} from '../../environments/environment';
import {mergeMap, catchError} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilewatcherService {

  total: any;
  private fileWatcherSource = new Subject<string>();
  public fileDropped$ = this.fileWatcherSource.asObservable();

  constructor(public electronService: ElectronService,
              private fhir: FhirService) {
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
        this.fileWatcherSource.next(p);
      })
    } else {
      console.log('Mode web');
    }
  }
}
