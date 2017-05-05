import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-tourism',
    templateUrl: './tourism.component.html',
    styleUrls: ['./tourism.component.css']
})
export class TourismComponent implements OnInit {

    lat: Number = -37.814251;
    lng: Number = 144.963169;

    constructor() { }

    ngOnInit() {
    }

}
