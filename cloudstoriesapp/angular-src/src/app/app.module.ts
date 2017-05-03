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
import { TourismComponent } from './components/tourism/tourism.component';
import { ShoppingComponent } from './components/shopping/shopping.component';
import { HealthComponent } from './components/health/health.component';
import { ValidateService } from './services/validate.service';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'navbar', component: NavbarComponent },
  { path: 'tourism', component: TourismComponent },
  { path: 'shopping', component: ShoppingComponent },
  { path: 'health', component: HealthComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    NavbarComponent,    
    HomeComponent,
    TourismComponent,
    ShoppingComponent,
    HealthComponent
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
  providers: [ValidateService],
  bootstrap: [AppComponent]
})
export class AppModule { }
