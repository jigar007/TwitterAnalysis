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
    emojiFace: {} = {
        "neutral": "em em-neutral_face",
        "positive": "em em-smile",
        "negative": "em em-angry"
    }
    polyInfo: {} = {
        "template": "block",
        "info": "none",
        "region_name": "Try it out!",
        "median_rent": "",
        "female_part": "",
        "male_emp": "",
        "female_emp": "",
        "median_age": "",
        "post_qualification": "",
        "wholesale_trade_emp": "",
        "public_admin_emp": "",
        "scientific_emp": "",
        "education_emp": "",
        "construction_emp": ""
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

    polygonClicked(reg: String) {
        this.query.getProspData().subscribe(data => {
            for (let d of data) {                
                if (String(d["properties"]["SA2_Code_2011"]) === reg) {
                    this.polyInfo["template"] = "none";
                    this.polyInfo["info"] = "block";
                    this.polyInfo["region_name"] = d["properties"]["SA2_Name_2011"];
                    this.polyInfo["median_rent"] = d["properties"]["Median_rent"] + " $ per week";
                    this.polyInfo["female_part"] = (d["properties"]["Female_labour_force_participation_rate"]*100).toFixed(2) + "%";
                    this.polyInfo["male_emp"] = (d["properties"]["Male_employment_rate"]*100).toFixed(2) + "%";
                    this.polyInfo["female_emp"] = (d["properties"]["Female_employment_rate"]*100).toFixed(2) + "%";
                    this.polyInfo["median_age"] = d["properties"]["Median_age"];
                    this.polyInfo["post_qualification"] = d["properties"]["Proportion_of_working_age_persons_with_post_school_qualificatio"];
                    this.polyInfo["wholesale_trade_emp"] = d["properties"]["Proportion_employed_in_wholesale_trade"];
                    this.polyInfo["public_admin_emp"] = d["properties"]["Proportion_employed_in_public_administration_and_safety"];
                    this.polyInfo["scientific_emp"] = d["properties"]["Proportion_employed_in_professional_scientific_and_technical_se"];
                    this.polyInfo["education_emp"] = d["properties"]["Proportion_employed_in_education_and_training"];
                    this.polyInfo["construction_emp"] = d["properties"]["Proportion_employed_in_construction"];
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
