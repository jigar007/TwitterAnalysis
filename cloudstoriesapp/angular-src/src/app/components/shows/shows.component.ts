import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-shows',
    templateUrl: './shows.component.html',
    styleUrls: ['./shows.component.css']
})
export class ShowsComponent implements OnInit {

    lat: Number = -37.814251;
    lng: Number = 144.963169;

    constructor() { }

    ngOnInit() {
    }

}
