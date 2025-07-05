import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import toast from "react-hot-toast";
import artistLocationApis from "../apis/artistLocations.apis";
import { Box, Button, Divider, Typography } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import loadingAnimation from "../assets/loading.json";
import Lottie from "react-lottie";

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
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [userCoords, setUserCoords] = useState(null);
  const [nearbyArtists, setNearbyArtists] = useState([]);
  const nav = useNavigate();
  useEffect(() => {
    const center = searchParams.get("center");
    const distance = searchParams.get("distance") || 5;

    if (center) {
      const [lat, lng] = center.split(",").map(Number);
      const coords = { lat, lng };
      setUserCoords(coords);

      artistLocationApis
        .findArtistsByGeology(lat, lng, distance)
        .then((res) => {
          setNearbyArtists(res.data.result);
          setLoading(false);
        })
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
      {loading ? (
        <Lottie
          options={{
            loop: true,
            autoplay: true,
            animationData: loadingAnimation,
            rendererSettings: {
              preserveAspectRatio: "xMidYMid slice",
            },
          }}
          height={500}
          width={500}
        />
      ) : (
        <>
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
                    border: "1px solid #ddd",
                    borderRadius: 2,
                    p: 2,
                    mb: 2,
                    backgroundColor: "#fff",
                  }}
                >
                  {/* Avatar + Name + Distance */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <img
                      src={artist.avatar_url || "/default-avatar.jpg"}
                      alt={artist.artist_name}
                      width={60}
                      height={60}
                      style={{
                        borderRadius: "50%",
                        objectFit: "cover",
                        aspectRatio: "1 / 1",
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography fontWeight={600}>
                          {artist.artist_name}
                        </Typography>
                        <Typography
                          sx={{ fontSize: 13, color: "#555", fontWeight: 600 }}
                        >
                          {artist.distance.toFixed(2)} km
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize: 13, color: "#555", mt: 0.5 }}>
                        {artist.address}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Full-width Divider - moved outside avatar box */}
                  <Divider sx={{ my: 2 }} />

                  {/* Services (max 2) */}
                  {artist.services &&
                    artist.services.slice(0, 2).map((service) => (
                      <Box key={service.id} sx={{ my: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 2,
                            alignItems: "center",
                          }}
                        >
                          <Typography fontWeight={500} sx={{ flex: 1 }}>
                            {service.service_name}
                          </Typography>
                          <Typography fontWeight={500}>
                            ~{service.duration}p
                          </Typography>
                          <Typography fontWeight={600} color="primary">
                            {service.max_price.toLocaleString()} VNĐ
                          </Typography>
                        </Box>
                      </Box>
                    ))}

                  {/* See detail */}
                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
                  >
                    <Button
                      variant="text"
                      size="small"
                      onClick={() =>
                        nav(`/artists/${artist.artist_id}/profile`)
                      }
                    >
                      Xem chi tiết →
                    </Button>
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
                    <Typography fontWeight={600}>📍Bạn đang ở đây</Typography>
                  </Popup>
                </Marker>

                {nearbyArtists.map((artist) => (
                  <Marker
                    key={artist.id}
                    position={[artist.latitude, artist.longitude]}
                    icon={artistIcon}
                  >
                    <Popup closeButton={false}>
                      <Box
                        onClick={() =>
                          nav(`/artists/${artist.artist_id}/profile`)
                        }
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                          lineHeight: 1.2,
                        }}
                      >
                        <Box
                          component="img"
                          src={artist.avatar_url}
                          alt={artist.artist_name}
                          sx={{
                            width: "100%",
                            height: 150,
                            objectFit: "cover",
                            borderRadius: 1,
                            mb: 0.5,
                            transition: "transform 0.2s ease-in-out",
                            "&:hover": {
                              transform: "scale(1.05)",
                            },
                          }}
                        />

                        <Typography
                          variant="body2"
                          component="div"
                          fontWeight={600}
                          sx={{ fontSize: 14, m: 0, p: 0 }}
                        >
                          {artist.artist_name}
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            gap: 0.5,
                            alignItems: "flex-start",
                          }}
                        >
                          <LocationOnIcon
                            sx={{ fontSize: 16, color: "#ED1E79", mt: "2px" }}
                          />
                          <Typography
                            variant="body2"
                            component="div"
                            sx={{ fontSize: 13, color: "#555", m: 0, p: 0 }}
                          >
                            {artist.address}
                          </Typography>
                        </Box>

                        <Typography
                          variant="body2"
                          component="div"
                          sx={{ fontSize: 13, color: "#888", m: 0, p: 0 }}
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
        </>
      )}
    </Box>
  );
}
