import { Component, OnInit } from '@angular/core';
import { QueryService } from '../../services/query.service';
import { LatLngLiteral } from 'angular2-google-maps/core';

@Component({
    selector: 'app-shows',
    templateUrl: './shows.component.html',
    styleUrls: ['./shows.component.css']
})

export class ShowsComponent implements OnInit {

    //class variables
    lat: Number = -37.8136;
    lng: Number = 144.9631;
    zoom: Number = 11;
    paths: any = this.fetchPolygons();
    markers: Object[] = this.fetchMarkers();
    visible: Boolean = false;

    constructor(private query: QueryService) { }

    ngOnInit() {
    }

    //class methods
    fetchPolygons(): any {
        let res = [];
        this.query.getNewsData().subscribe(geometries => {
            for (let i = 0; i < geometries.length; i++) {
                let single_polygon: LatLngLiteral[] = [];
                if (geometries[i]["geometry"]["type"] === "Polygon") {
                    for (let coords of geometries[i]["geometry"]["coordinates"][0]) {
                        single_polygon.push({lng: coords[0], lat: coords[1]});
                    }
                }
                else if (geometries[i]["geometry"]["type"] === "MultiPolygon") {
                    for (let coords of geometries[i]["geometry"]["coordinates"][0][0]) {
                        single_polygon.push({lng: coords[0], lat: coords[1]});
                    }
                }
                res.push({"path": single_polygon, "region": geometries[i]["properties"]["SA2_MAIN11"]});
            }
        });
        return res;
    }

    fetchMarkers(): Object[] {
        let res: Object[] = [];
        this.query.getShowsData().subscribe(coordinates => {
            for (let coords of coordinates) {
                for (let obj of coords["latlng"]) {
                    res.push(obj);
                }
            }
        });
        return res;
    }

    polygonClicked(reg: String) {
        console.log(reg);
    }

    changeMarkerStatus(elem): void {
        if (elem.textContent === "Show Markers") {
            elem.textContent = "Hide Markers";
            this.visible = !this.visible;

        }

        else {
            elem.textContent = "Show Markers";
            this.visible = !this.visible;
        }
    }

    changeCity(elem): void {
        if (elem.textContent === "Sydney") {
            elem.textContent = "Melbourne";
            this.lat = -33.8688;
            this.lng = 151.2093;
        }

        else {
            elem.textContent = "Sydney";
            this.lat = -37.8136;
            this.lng = 144.9631;
        }
    }

}
