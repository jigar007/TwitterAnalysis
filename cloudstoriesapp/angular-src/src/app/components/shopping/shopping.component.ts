import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-shopping',
    templateUrl: './shopping.component.html',
    styleUrls: ['./shopping.component.css']
})
export class ShoppingComponent implements OnInit {

    lat: Number = -37.814251;
    lng: Number = 144.963169;

    constructor() { }

    ngOnInit() {
    }

}
