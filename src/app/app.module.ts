import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';
import {routing} from './app.routing';

import {AlertComponent} from './_components';
import {ErrorInterceptor, JwtInterceptor} from './_helpers';
import {HomeComponent} from './home';
import {LoginComponent} from './login';
import {RegisterComponent} from './register';
import {ContextMenuModule} from 'ngx-contextmenu';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {SettingsComponent} from '@app/settings';
import {AngularWeatherWidgetModule, WeatherApiName} from 'angular-weather-widget';
import {TaskViewComponent} from './task-view/task-view.component';


// used to create fake backend
// import {fakeBackendProvider} from './_helpers';
;

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    routing,
    ContextMenuModule.forRoot({useBootstrap4: true}),
    AngularWeatherWidgetModule.forRoot({
      key: 'a2c20eb7b45259cbe879addf87f11b2e',
      name: WeatherApiName.OPEN_WEATHER_MAP,
      baseUrl: 'http://api.openweathermap.org/data/2.5'
    })
  ],
  declarations: [
    AppComponent,
    AlertComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    SettingsComponent
      ,
      TaskViewComponent],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},

    // provider used to create fake backend
    // fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
