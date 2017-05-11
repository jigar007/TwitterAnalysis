import { Component, OnInit } from '@angular/core';
import { QueryService } from '../../services/query.service';
import { LatLngLiteral } from 'angular2-google-maps/core';

@Component({
    selector: 'app-news',
    templateUrl: './news.component.html',
    styleUrls: ['./news.component.css']
})

export class NewsComponent implements OnInit {

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
        "epi_desc": "",
        "evi_desc": "",
        "median_rent": "",
        "emp_rate": "",
        "median_age": "",
        "post_qualification": ""
    };    

    constructor(private query: QueryService) {
    }

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

    //Get the sentiment and text for each tweet and show as a map marker
    fetchMarkers(): Object[] {
        let res: Object[] = [];
        this.query.getNewsData().subscribe(coordinates => {
            for (let coords of coordinates) {
                for (let obj of coords["latlng"]) {
                    res.push(obj);
                }
            }
        });
        return res;
    }

    //showing data on polygon click
    polygonClicked(reg: String) {
        this.query.getAurinData().subscribe(data => {
            for (let d of data) {
                if (String(d["region_main"]) === reg) {
                    this.polyInfo["template"] = "none";
                    this.polyInfo["info"] = "block";
                    this.polyInfo["epi_desc"] = d["prosp_2"]["EPI_Group_Description_2011"];
                    this.polyInfo["evi_desc"] = d["vulner_2"]["EVI_Group_Description_2011"];
                    this.polyInfo["region_name"] = d["region_name"];
                    this.polyInfo["median_rent"] = d["prosp_1"]["Median_rent"];
                    this.polyInfo["emp_rate"] = (d["prosp_1"]["Employment_rate"]*100).toFixed(2);
                    this.polyInfo["median_age"] = d["prosp_1"]["Median_age"];
                    this.polyInfo["post_qualification"] = (d["prosp_1"]["Proportion_of_working_age_persons_with_post_school_qualificatio"]*100).toFixed(2);
                }
            }
        });
    }

    //Hide and show markers
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

    //navigate between Melbourne and Sydney
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
