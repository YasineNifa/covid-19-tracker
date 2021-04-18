import React from "react";
import { MapContainer as LeafletMap , TileLayer } from "react-leaflet";
import './Mapp.css'
const Mapp = ({center,zoom}) => {
    return (
        <div className="mapp">
            <LeafletMap center={center} zoom={zoom}>
                <TileLayer 
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
            </LeafletMap>
            
            
        </div>
    );
};

export default Mapp;

