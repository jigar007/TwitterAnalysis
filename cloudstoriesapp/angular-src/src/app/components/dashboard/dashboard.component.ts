import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {   

    constructor() { }

    ngOnInit() {
    }

    //class methods
    changeMarkerStatus(elem): void {
        if (elem.textContent === "Show Markers") {
            elem.textContent = "Hide Markers";
        }

        else {
            elem.textContent = "Show Markers";
        }
    }

    changeCity(elem): void {
        if (elem.textContent === "Sydney") {
            elem.textContent = "Melbourne";
        }

        else {
            elem.textContent = "Sydney";
        }
    }

}
