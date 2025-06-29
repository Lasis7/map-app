import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { OptionsComponent } from '../options/options.component';
const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-map',
  imports: [OptionsComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
})
export class MapComponent implements AfterViewInit {
  map!: L.Map; // The map
  targetMarker!: L.Marker; // Used for saving the marker
  circleMarker!: L.CircleMarker; // Circle around the target marker
  userMarker!: L.Marker; // User's marker
  latlng!: L.LatLng; // User's current location
  targetLatLng!: L.LatLng; // Target's location
  score: number = 0; // User's score
  maxMeters: number = 1000; // Maximum distance the target can be from the user
  settingsVisible: boolean = false;

  constructor() {}

  private initMap(): void {
    // Check if score is saved in localstorage
    if (!localStorage.getItem('score')) {
      localStorage.setItem('score', JSON.stringify(this.score));
    } else {
      const curScore = localStorage.getItem('score');
      this.score = Number(curScore);
    }

    if ('geolocation' in navigator) {
      // Get first position
      navigator.geolocation.getCurrentPosition((location) => {
        const curLat = location.coords.latitude;
        const curLng = location.coords.longitude;

        this.latlng = new L.LatLng(curLat, curLng);
        // Set up the view
        this.map = L.map('map').setView(this.latlng, 13);

        const tiles = L.tileLayer(
          'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          {
            maxZoom: 18,
            minZoom: 3,
            attribution:
              '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          }
        );

        tiles.addTo(this.map);

        // show the scale bar on the lower left corner
        L.control.scale().addTo(this.map);

        // show tooltip on marker
        const userTooltip = L.tooltip({
          permanent: true,
          direction: 'top',
          offset: [-15, -15],
        })
          .setContent('You are here')
          .setLatLng(this.latlng)
          .addTo(this.map);

        this.userMarker = L.marker(this.latlng)
          .bindTooltip(userTooltip)
          .addTo(this.map);

        // Tooltip for the target point
        const targetTooltip = L.tooltip({
          permanent: true,
          direction: 'top',
          offset: [-15, -15],
        }).setContent('Target');

        // Generate target and check if there are prior targets
        if (!localStorage.getItem('target')) {
          const target = this.generateLocation(curLat, curLng);
          this.targetLatLng = target;
          localStorage.setItem('target', JSON.stringify(target));
          const circleMarker = L.circleMarker(this.targetLatLng, {
            radius: 20,
            color: 'red',
            fillColor: 'red',
          }).addTo(this.map);
          this.circleMarker = circleMarker;
          this.targetMarker = L.marker(this.targetLatLng)
            .bindTooltip(targetTooltip)
            .addTo(this.map);
        } else {
          const target = localStorage.getItem('target');
          if (target !== null) {
            const parsed = JSON.parse(target);
            this.targetLatLng = L.latLng(parsed.lat, parsed.lng);
            const circleMarker = L.circleMarker(this.targetLatLng, {
              radius: 20,
              color: 'red',
              fillColor: 'red',
            }).addTo(this.map);
            this.circleMarker = circleMarker;
            this.targetMarker = L.marker(this.targetLatLng)
              .bindTooltip(targetTooltip)
              .addTo(this.map);
          }
        }

        this.trackLocation();
      });
    } else {
      alert('Geolocation is not available');
    }
  }

  // Function for continuous tracking
  private trackLocation(): void {
    navigator.geolocation.watchPosition(
      (position) => {
        const trackLat = position.coords.latitude;
        const trackLng = position.coords.longitude;

        this.latlng = new L.LatLng(trackLat, trackLng);
        this.userMarker.setLatLng(this.latlng);

        const distance = this.distanceToTarget(
          trackLat,
          trackLng,
          this.targetLatLng.lat,
          this.targetLatLng.lng
        );

        if (distance < 100) {
          navigator.vibrate(200);
          this.score++;
          localStorage.setItem('score', JSON.stringify(this.score));
          this.map.removeLayer(this.targetMarker);
          this.map.removeLayer(this.circleMarker);
          const targetTooltip = L.tooltip({
            permanent: true,
            direction: 'top',
            offset: [-15, -15],
          }).setContent('Target');

          // Generate next target
          const nextTarget = this.generateLocation(
            this.latlng.lat,
            this.latlng.lng
          );
          this.targetLatLng = nextTarget;
          localStorage.setItem('target', JSON.stringify(this.targetLatLng));
          const circleMarker = L.circleMarker(nextTarget, {
            radius: 20,
            color: 'red',
            fillColor: 'red',
          }).addTo(this.map);
          this.circleMarker = circleMarker;
          this.targetMarker = L.marker(nextTarget)
            .bindTooltip(targetTooltip)
            .addTo(this.map);
        }
      },
      (error) => {
        console.error(error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
    );
  }

  // Refresh target if it is in an inaccessible spot
  refreshTarget() {
    this.map.removeLayer(this.targetMarker);
    this.map.removeLayer(this.circleMarker);
    const nextTarget = this.generateLocation(this.latlng.lat, this.latlng.lng);
    this.targetLatLng = nextTarget;
    localStorage.setItem('target', JSON.stringify(this.targetLatLng));
    const circleMarker = L.circleMarker(nextTarget, {
      radius: 20,
      color: 'red',
      fillColor: 'red',
    }).addTo(this.map);
    this.circleMarker = circleMarker;
    const targetTooltip = L.tooltip({
      permanent: true,
      direction: 'top',
      offset: [-15, -15],
    }).setContent('Target');
    this.targetMarker = L.marker(nextTarget)
      .bindTooltip(targetTooltip)
      .addTo(this.map);
  }

  resetScore(score: string) {
    this.score = Number(score);
    localStorage.setItem('score', JSON.stringify(this.score));
  }

  // https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
  // 1 = current position, 2 = target point
  private distanceToTarget(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) {
    const r = 6371000; // Earth's radius in meters
    const p = Math.PI / 180;

    const a =
      0.5 -
      Math.cos((lat2 - lat1) * p) / 2 +
      (Math.cos(lat1 * p) *
        Math.cos(lat2 * p) *
        (1 - Math.cos((lon2 - lon1) * p))) /
        2;

    return 2 * r * Math.asin(Math.sqrt(a)); // Return the distance to the target
  }

  // https://gis.stackexchange.com/questions/334297/generate-coordinates-with-minimum-maximum-distance-from-given-coordinates
  private generateLocation(latitude: number, longitude: number) {
    const EARTH_RADIUS = 6371; // in km
    const DEGREE = ((EARTH_RADIUS * 2 * Math.PI) / 360) * 1000; // 1° latitude in meters

    const minMeters = 400;
    const maxMeters = this.maxMeters;

    // Random distance [1 km, 2 km] in a non-uniform way (closer to 1 km is more likely)
    const r = (maxMeters - minMeters) * Math.random() ** 0.5 + minMeters;

    const theta = Math.random() * 2 * Math.PI;

    const dy = r * Math.sin(theta);
    const dx = r * Math.cos(theta);

    const newLatitude = latitude + dy / DEGREE;
    const newLongitude =
      longitude + dx / (DEGREE * Math.cos(this.deg2rad(latitude)));

    const newLocation = L.latLng(newLatitude, newLongitude);
    return newLocation;
  }

  // Used by generateLocation
  deg2rad(deg: number) {
    return deg * (Math.PI / 180);
  }

  // New maximum radius
  changeRadius(newRadius: string) {
    this.maxMeters = Number(newRadius);
  }

  // Changes settings-window's visibility
  settingsVisibility() {
    this.settingsVisible = !this.settingsVisible;
  }

  clickedOutsideSettings(boolean: boolean) {
    this.settingsVisible = boolean;
  }

  ngAfterViewInit(): void {
    this.initMap();
  }
}
