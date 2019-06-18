import {FhirService} from './providers/fhir.service';
import 'reflect-metadata';
import '../polyfills';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {ElectronService} from './providers/electron.service';
import {WebviewDirective} from './directives/webview.directive';
import {AppComponent} from './app.component';
import {HomeComponent} from './components/home/home.component';

import {NgxFileDropModule} from 'ngx-file-drop';
import {MatCard, MatCardModule, MatIconModule, MatToolbarModule, MatProgressSpinnerModule} from "@angular/material";


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WebviewDirective
  ],
  imports: [
    BrowserModule,
    NgxFileDropModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatToolbarModule
  ],
  providers: [ElectronService, FhirService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
