import { Component, OnInit } from '@angular/core';
import { QueryService } from '../../services/query.service';
import { LatLngLiteral } from 'angular2-google-maps/core';

@Component({
    selector: 'app-misc',
    templateUrl: './misc.component.html',
    styleUrls: ['./misc.component.css']
})

export class MiscComponent implements OnInit {

    //class variables
    lat: Number = -37.8136;
    lng: Number = 144.9631;
    zoom: Number = 11;
    paths: any = this.fetchPolygons();
    markers: Object[] = this.fetchMarkers();
    visible: Boolean = false;
    neg = require("../../res/neg_small.png");
    neutral = require("../../res/neutral_small.png");
    pos = require("../../res/smile_small.png");

    emojiFace: {} = {
        "neutral": this.neg,
        "positive": this.neutral,
        "negative": this.pos
    }

    polyInfo: {} = {
        "template": "block",
        "info": "none",
        "region_name": "Try it out!",
        "overwt_info": "",
        "obese_info": "",
        "smokers_info": "",
        "alcohol_info": "",
        "evi_desc": "",
        "epi_desc": "",
        "family_income": "",        
        "avg_taxable_income": "",
        "indi_income": "",
        "median_rent": ""
    };

    constructor(private query: QueryService) { }

    ngOnInit() {
    }

    //class methods
    fetchPolygons(): any {
        let res = [];
        this.query.getMiscData().subscribe(geometries => {
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
        this.query.getMiscData().subscribe(coordinates => {
            for (let coords of coordinates) {
                for (let obj of coords["latlng"]) {
                    res.push(obj);
                }
            }
        });
        return res;
    }

    polygonClicked(reg: String) {
        this.query.getAurinData().subscribe(data => {
            for (let d of data) {
                if (String(d["region_main"]) === reg) {
                    this.polyInfo["template"] = "none";
                    this.polyInfo["info"] = "block";
                    this.polyInfo["obese_info"] = (d["health_data"]["obese_p_me_2_rate_3_11_7_13"]).toFixed(2);
                    this.polyInfo["overwt_info"] = (d["health_data"]["ovrwght_p_me_2_rate_3_11_7_13"]).toFixed(2);
                    this.polyInfo["smokers_info"] = (d["health_data"]["smokers_me_2_rate_3_11_7_13"]).toFixed(2);
                    this.polyInfo["alcohol_info"] = (d["health_data"]["alcohol_cons_2_rate_3_11_7_13"]).toFixed(2);
                    this.polyInfo["region_name"] = d["region_name"];
                    this.polyInfo["evi_desc"] = d["vulner_2"]["EVI_Group_Description_2011"];
                    this.polyInfo["epi_desc"] = d["prosp_2"]["EPI_Group_Description_2011"];
                    this.polyInfo["family_income"] = (d["prosp_1"]["Median_family_income"]).toFixed(2);
                    this.polyInfo["avg_taxable_income"] = (d["prosp_1"]["Average_taxable_income"]).toFixed(2);
                    this.polyInfo["indi_income"] = (d["vulner_1"]["Median_individual_income"]).toFixed(2);
                    this.polyInfo["median_rent"] = (d["vulner_1"]["Median_rent"]).toFixed(2);
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
