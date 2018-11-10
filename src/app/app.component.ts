import { Component, OnInit } from '@angular/core';
import { IsochronesService } from './isochrones.service';

import * as L from 'leaflet';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    public model: any = {};
    public map: L.Map;
    public geoJsonLayers: L.GeoJSON[] = [];
    public marker: L.Marker;
    public nbDurations: number;
    public minBeginDate: Date;
    public isWorking: boolean;
    readonly maxDurationsNumber: number = 10;
    private readonly defaultIcon: L.Icon = L.icon({
        iconUrl: 'assets/leaflet/marker-icon.png',
        shadowUrl: 'assets/leaflet/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41]
    });

   constructor(private isochronesService: IsochronesService) { }

    ngOnInit() {

        L.Marker.prototype.options.icon = this.defaultIcon;
        const beginPosition: L.LatLng = L.latLng(48.86160921192831, 2.3480594158172607);

        this.map = L.map('map').setView(beginPosition, 13);

        L.tileLayer('https://tile.jawg.io/jawg-streets/{z}/{x}/{y}.png?' +
            'access-token=WpzgjRXIDbZlxVLLhuxgcDPcHaPpEK9Mu19hiRq9dlxE0TwBKjx2okFvDM9HdPaB',
            {
                maxZoom: 19,
                minZoom: 5
            }).addTo(this.map);

        this.map.on('click', this.putMarkerOnMap, this);
        this.marker = L.marker(beginPosition).addTo(this.map);

        this.minBeginDate = new Date();
        this.isWorking = false;

        this.model.durations = [10];

        this.model.fromOrTo = 'From';
        this.model.fromOrToValue = this.marker.getLatLng().lng.toFixed(5) + ';' + this.marker.getLatLng().lat.toFixed(5);
        this.model.iterations = 1;
        this.model.delay = 5;
    }

    onSubmit() {
        this.isWorking = true;
        // call service to update the map
        this.isochronesService.getIsochrones(this.model.fromOrTo, this.model.fromOrToValue,
            this.model.durations, this.model.beginDate, this.model.delay, this.model.iterations
        ).subscribe(
            (data: any) => {
                // update map
                this.putIsochrone(data, this.map);
                this.isWorking = false;
            },
            (error) => {
                console.log('Erreur ! : ' + error);
                console.log(error);
                this.isWorking = false;
            }
        );
    }

    putIsochrone(dataJson: any, map: L.Map) {
        console.log('Success ! :' + dataJson);
        const colorArrays = ['rgb(0,255,0)', 'rgb(57,255,0)', 'rgb(114,255,0)',
            'rgb(170,255,0)', 'rgb(227,255,0)', 'rgb(255,227,0)', 'rgb(255,171,0)',
            'rgb(255,114,0)', 'rgb(255,57,0)', 'rgb(255,0,0)'];

        this.geoJsonLayers.forEach((layer) => {map.removeLayer(layer); });
        this.geoJsonLayers = [];

        for (let i = 0; i < dataJson.geojsons.length; i++) {

            const colorNumber: number = Math.round(i * (this.maxDurationsNumber / dataJson.geojsons.length));
            const geoJsonLayer: L.GeoJSON = L.geoJSON(dataJson.geojsons[i], {
                weight: 1,
                color: colorArrays[colorNumber],
                opacity: 0.20
            } as any);

            this.geoJsonLayers.push(geoJsonLayer);
            geoJsonLayer.addTo(map);
        }
    }

    putMarkerOnMap(e: L.LeafletMouseEvent) {
      this.map.removeLayer(this.marker);
      this.marker = L.marker(e.latlng).addTo(this.map);
      this.model.fromOrToValue = this.marker.getLatLng().lng.toFixed(5) + ';' + this.marker.getLatLng().lat.toFixed(5);
    }

    addDuration() {
        if (this.model.durations.length < this.maxDurationsNumber) {
            this.model.durations.push(0);
        }
    }

    removeDuration() {
        if (this.model.durations.length > 1) {
            this.model.durations.splice(this.model.durations.length - 1);
        }
    }

    durationCounter() {
        return new Array(this.model.durations.length);
    }


}
