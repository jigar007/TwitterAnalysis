import { Component, OnInit } from '@angular/core';
import { LatLngLiteral } from 'angular2-google-maps/core';
import { QueryService } from '../../services/query.service';

@Component({
    selector: 'app-health',
    templateUrl: './health.component.html',
    styleUrls: ['./health.component.css']
})

export class HealthComponent implements OnInit {

    //class variables
    lat: Number = -37.8136;
    lng: Number = 144.9631;
    zoom: Number = 11;
    paths: any = this.fetchPolygons();
    markers: Object[] = this.fetchMarkers();
    visible: Boolean = false;
    emojiFace: {} = {
        "neutral": "em em-neutral_face",
        "positive": "em em-smile",
        "negative": "em em-angry"
    }
    polyInfo: {} = {
        "template": "block",
        "info": "none",
        "region_name": "Try it out!",
        "smokers_rate": "",
        "overwt_rate": "",
        "obese_rate": "",
        "alcohol_cons": ""
    };

    constructor(private query: QueryService) {}

    ngOnInit() {
    }

    //class methods
    fetchPolygons(): any {
        let res = [];
        this.query.getHealthData().subscribe(geometries => {
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
        this.query.getHealthData().subscribe(data => {
            for (let coords of data) {
                for (let obj of coords["latlng"]) {
                    res.push(obj);
                }
            }
        });
        return res;
    }

    polygonClicked(reg: String) {
        this.query.getObeseData().subscribe(data => {
            for (let d of data) {
                if (String(d["properties"]["area_code"]) === reg) {
                    this.polyInfo["template"] = "none";
                    this.polyInfo["info"] = "block";
                    this.polyInfo["region_name"] = d["properties"]["area_name"];
                    this.polyInfo["smokers_rate"] = (d["properties"]["smokers_me_2_rate_3_11_7_13"]*100).toFixed(2);
                    this.polyInfo["overwt_rate"] = (d["properties"]["ovrwght_p_me_2_rate_3_11_7_13"]*100).toFixed(2);
                    this.polyInfo["obese_rate"] = (d["properties"]["obese_p_me_2_rate_3_11_7_13"]*100).toFixed(2);
                    this.polyInfo["alcohol_cons"] = (d["properties"]["alcohol_cons_2_rate_3_11_7_13"]*100).toFixed(2);
                }
            }
        });
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
        if (elem.textContent === "Go to Sydney") {
            elem.textContent = "Go to Melbourne";
            this.lat = -33.8688;
            this.lng = 151.2093;
        }

        else {
            elem.textContent = "Go to Sydney";
            this.lat = -37.8136;
            this.lng = 144.9631;
        }
    }
    
}
