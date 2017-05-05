import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-health',
    templateUrl: './health.component.html',
    styleUrls: ['./health.component.css']
})
export class HealthComponent implements OnInit {

    lat: Number = -37.814251;
    lng: Number = 144.963169;

    constructor() { }

    ngOnInit() {
    }

}
