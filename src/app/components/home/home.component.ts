import { FhirService } from './../../providers/fhir.service';
import {Component, OnInit} from '@angular/core';
import {FileSystemDirectoryEntry, NgxFileDropEntry, FileSystemFileEntry} from 'ngx-file-drop';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';
import { ElectronService } from '../../providers/electron.service';
import { FilewatcherService } from '../../providers/filewatcher.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  error: any;
  total: number;
  watched: string;

  constructor(private fhir: FhirService,
    public electronService: ElectronService,
    public watcher:FilewatcherService) {

  }

  public files: NgxFileDropEntry[] = [];

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    this.watched ="";
    for (const droppedFile of files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          // Here you can access the real file
          console.log(droppedFile.relativePath, file);
          this.watched =file.name;
          var data = this.electronService.fs.readFileSync(droppedFile.relativePath);
          this.fhir.postFile(data)
               /*  .pipe(mergeMap(() => this.fhir.getHiso())) */
                .subscribe(
                data => {

                  console.log('upload OK');
                })





        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  public fileOver(event) {
    console.log(event);
  }


  public fileLeave(event) {
    console.log(event);
  }

  ngOnInit() {
    this.watched = ""
    this.watcher.countdownEnd$.subscribe((file:string)=>{
     this.watched =file;
  });
  }

}
