import React from "react";
import "./map.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { useState, useEffect } from "react";
import Share from "../share/Share";
import Post from "../post/Post";

export default function Map({ refresh, posts, mapCenterLat, mapCenterLng }) {
  const [centerLat, setCenterLat] = useState(50);
  const [centerLng, setCenterLng] = useState(50);
  function LocationMarker() {
    const [position, setPosition] = useState(null);
    const map = useMapEvents({
      click(e) {
        setPosition(e.latlng);
      },
    });

    return position === null ? null : (
      <Marker position={position}>
        <Popup>
          <Share refreshPosts={refresh} position={position} />
        </Popup>
      </Marker>
    );
  }

  useEffect(() => {
    if (posts && posts[0]) {
      if (mapCenterLat) {
        setCenterLat(mapCenterLat);
      } else {
        setCenterLat(posts[0].latitude);
      }
      if (mapCenterLat) {
        setCenterLng(mapCenterLng);
      } else {
        setCenterLng(posts[0].longitude);
      }
    }
  }, [posts, mapCenterLat, mapCenterLng]);

  return (
    <div className="map">
      <MapContainer
        key={JSON.stringify([centerLat, centerLng])}
        center={[centerLat, centerLng]}
        zoom={8}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {posts &&
          posts.map((p) => (
            <Marker key={p.postId} position={[p.latitude, p.longitude]}>
              <Popup>
                <Post post={p} disableShowOnMapButton={true} />
              </Popup>
            </Marker>
          ))}
        <LocationMarker />
      </MapContainer>
    </div>
  );
}
