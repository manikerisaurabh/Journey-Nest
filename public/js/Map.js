let mapToken =
    "pk.eyJ1IjoiZGVsdGEtc3R1ZHVlbnQiLCJhIjoiY2xvMDk0MTVhMTJ3ZDJrcGR5ZDFkaHl4ciJ9.Gj2VU1wvxc7rFVt5E4KLOQ";
console.log(mapToken);
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: "map", // container ID
    center: coordinates, // starting position [lng, lat]
    zoom: 9, // starting zoom
});
const Marker = new mapboxgl.Marker({ color: "red" })
    .setLngLat(coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 }))
    .setHtml("<h4>Exact location after booking</h4>")
    .addTo(map);