import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { AgmCoreModule } from 'angular2-google-maps/core';

import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { NewsComponent } from './components/news/news.component';
import { ShowsComponent } from './components/shows/shows.component';
import { HealthComponent } from './components/health/health.component';
import { MiscComponent } from './components/misc/misc.component';

import { QueryService } from './services/query.service';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'navbar', component: NavbarComponent },
  { path: 'news', component: NewsComponent },
  { path: 'shows', component: ShowsComponent },
  { path: 'health', component: HealthComponent },
  { path: 'misc', component: MiscComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    NavbarComponent,
    HomeComponent,
    NewsComponent,
    ShowsComponent,
    HealthComponent,
    MiscComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCx0sTN8MQBRiWt3xQ3F60d2zJk7nyjjlU'
    })
  ],
  providers: [QueryService],
  bootstrap: [AppComponent]
})
export class AppModule { }
