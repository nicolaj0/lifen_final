import {FhirService} from './../../providers/fhir.service';
import {Component, OnInit} from '@angular/core';
import {FileSystemDirectoryEntry, NgxFileDropEntry, FileSystemFileEntry} from 'ngx-file-drop';
import {map, filter, catchError, mergeMap} from 'rxjs/operators';
import {ElectronService} from '../../providers/electron.service';
import {FilewatcherService} from '../../providers/filewatcher.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  error: any;
  total: number;
  watched: string;
  isLoading: boolean;

  constructor(private fhir: FhirService,
              public electronService: ElectronService,
              public watcher: FilewatcherService) {
  }

  public files: NgxFileDropEntry[] = [];

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    this.watched = "";
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          console.log(droppedFile.relativePath, file);
          const fileToUpload = droppedFile.relativePath;
          this.upload(fileToUpload, file);
        });
      } else {
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  private  upload(fileToUpload: string, file: File) {
    function readFileAsync(file) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      })
    }

    this.isLoading = true;
    this.watched = fileToUpload;

    var data = file === null ? this.electronService.fs.readFileSync(fileToUpload) :  readFileAsync(file);
    this.fhir.postFile(data)
      .pipe(mergeMap(() => this.fhir.getHiso()))
      .subscribe(data => {
        console.log('upload OK');
        this.total = data.total;
        this.isLoading = false;
        console.log(this.total);
      });
  }

  public fileOver(event) {
    console.log(event);
  }

  public fileLeave(event) {
    console.log(event);
  }

  ngOnInit() {
    this.watched = "";
    this.total = 0;
    this.isLoading = false;
    this.watcher.fileDropped$.subscribe((file: string) => {
      this.upload(file, null);
    });
  }

}
