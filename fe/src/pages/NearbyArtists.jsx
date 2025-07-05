import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import toast from "react-hot-toast";
import artistLocationApis from "../apis/artistLocations.apis";
import { Box, Typography } from "@mui/material";
import { useSearchParams } from "react-router-dom";

const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149060.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const artistIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

export default function NearbyArtists() {
  const [searchParams] = useSearchParams();
  const [userCoords, setUserCoords] = useState(null);
  const [nearbyArtists, setNearbyArtists] = useState([]);

  useEffect(() => {
    const center = searchParams.get("center");
    const distance = searchParams.get("distance") || 5;

    if (center) {
      const [lat, lng] = center.split(",").map(Number);
      const coords = { lat, lng };
      setUserCoords(coords);

      artistLocationApis
        .findArtistsByGeology(lat, lng, distance)
        .then((res) => setNearbyArtists(res.data.result))
        .catch((err) => toast.error("Lỗi khi lấy artist gần bạn"));
    }
  }, [searchParams]);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        height: "calc(100vh - 100px)",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      {/* BÊN TRÁI: LIST ARTISTS */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          height: "100%",
          padding: 2,
          paddingBottom: 4,
          boxSizing: "border-box",
        }}
      >
        <Typography sx={{ fontSize: 14, color: "gray", marginBottom: 2 }}>
          {nearbyArtists.length} artists trong khu vực bản đồ
        </Typography>
        {nearbyArtists.length === 0 ? (
          <Typography>Không có nghệ sĩ gần bạn.</Typography>
        ) : (
          nearbyArtists.map((artist) => (
            <Box
              key={artist.id}
              sx={{
                border: "1px solid #ccc",
                borderRadius: 2,
                padding: 2,
                marginBottom: 2,
                backgroundColor: "#fafafa",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <img
                  src={artist.avatar_url}
                  alt={artist.artist_name}
                  width={60}
                  height={60}
                  style={{ borderRadius: "50%", objectFit: "cover" }}
                />
                <Box>
                  <Typography fontWeight={600}>{artist.artist_name}</Typography>
                  <Typography sx={{ fontSize: 13, color: "#555" }}>
                    {artist.address}
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: "#888" }}>
                    Cách bạn khoảng {artist.distance.toFixed(2)} km
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))
        )}
      </Box>

      {/* BÊN PHẢI: MAP */}
      <Box
        sx={{
          flex: 2,
          height: "100%",
          width: "100vw",
        }}
      >
        {userCoords && (
          <MapContainer
            center={userCoords}
            zoom={14}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom
            dragging
            doubleClickZoom
            zoomControl
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />

            <Marker position={userCoords} icon={userIcon}>
              <Popup>
                <Typography fontWeight={600}>📍 Bạn đang ở đây</Typography>
              </Popup>
            </Marker>

            {nearbyArtists.map((artist) => (
              <Marker
                key={artist.id}
                position={[artist.latitude, artist.longitude]}
                icon={artistIcon}
              >
                <Popup>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={artist.avatar_url}
                      alt={artist.artist_name}
                      width={100}
                      height={100}
                      style={{
                        objectFit: "cover",
                        borderRadius: "8px",
                        marginBottom: "8px",
                      }}
                    />
                    <Typography
                      fontWeight={600}
                      sx={{ fontSize: 14, textAlign: "center" }}
                    >
                      {artist.artist_name}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 12,
                        textAlign: "center",
                        color: "#555",
                        mt: 0.5,
                      }}
                    >
                      {artist.address}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 12,
                        color: "#888",
                        textAlign: "center",
                        marginTop: "4px",
                      }}
                    >
                      Cách bạn khoảng {artist.distance.toFixed(2)} km
                    </Typography>
                  </Box>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </Box>
    </Box>
  );
}
