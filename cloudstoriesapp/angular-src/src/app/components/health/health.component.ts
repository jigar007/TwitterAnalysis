import { Component, OnInit } from '@angular/core';
import { LatLngLiteral } from 'angular2-google-maps/core';
import { QueryService } from '../../services/query.service';

var polygons = require('../../res/polygons.json');

@Component({
    selector: 'app-health',
    templateUrl: './health.component.html',
    styleUrls: ['./health.component.css']
})
export class HealthComponent implements OnInit {

    lat: Number = -37.814251;
    lng: Number = 144.963169;

    zoom: number = 10;

    constructor(private query: QueryService) {}

    ngOnInit() {
    }

    test: any = this.query.sampleJson().subscribe(data => {
        console.log(data.name);
    });

    getLatLong(poly: any): LatLngLiteral[][] {
        let multi_polygons: LatLngLiteral[][] = [];
        for (let feature of polygons["features"]) {
            let single_polygon: LatLngLiteral[] = [];
            if (feature["geometry"]["type"] === "Polygon") {
                for (let coords of feature["geometry"]["coordinates"][0]) {                    
                    single_polygon.push({lng: coords[0], lat: coords[1]});
                }    
            }
            else if (feature["geometry"]["type"] === "MultiPolygon") {
                for (let coords of feature["geometry"]["coordinates"][0][0]) {                    
                    single_polygon.push({lng: coords[0], lat: coords[1]});
                }                 
            }
            multi_polygons.push(single_polygon);
        }
        return multi_polygons;
    }

    paths: LatLngLiteral[][] = this.getLatLong(polygons);
}
