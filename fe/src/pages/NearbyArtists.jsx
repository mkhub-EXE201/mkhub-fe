import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import toast from "react-hot-toast";
import { Box, Button, Divider, Typography } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Lottie from "react-lottie";
import debounce from "lodash/debounce";
import artistLocationApis from "../apis/artistLocations.apis";
import loadingAnimation from "../assets/loading.json";

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

function MapEventHandler({ onBoundsChanged }) {
  useMapEvents({
    zoomend: debounce(onBoundsChanged, 500),
    moveend: debounce(onBoundsChanged, 500),
  });
  return null;
}

export default function NearbyArtists() {
  const [searchParams] = useSearchParams();
  const [userCoords, setUserCoords] = useState(null);
  const [initialUserCoords, setInitialUserCoords] = useState(null);
  const [nearbyArtists, setNearbyArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [showRecenterButton, setShowRecenterButton] = useState(false);
  const nav = useNavigate();

  const mapRef = useRef(null);

  const fetchArtists = useCallback(async () => {
    const map = mapRef.current;
    if (!map || !userCoords) return;

    const bounds = map.getBounds();
    const center = map.getCenter();

    // Tính khoảng cách từ center tới góc (approx radius)
    const radius = center.distanceTo(bounds.getNorthEast()) / 1000; // km

    nav(
      `/artists/nearby?center=${center.lat.toFixed(6)},${center.lng.toFixed(
        6
      )}&distance=${radius.toFixed(2)}`,
      { replace: true }
    );

    try {
      const res = await artistLocationApis.findArtistsByGeology(
        center.lat,
        center.lng,
        radius
      );
      setNearbyArtists(res.data.result);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách nghệ sĩ gần bạn");
    }
  }, [userCoords, nav]);

  useEffect(() => {
    const center = searchParams.get("center");
    if (!center) return;

    const [lat, lng] = center.split(",").map(Number);
    const coords = { lat, lng };
    setUserCoords(coords);
    setInitialUserCoords(coords); // Lưu vị trí ban đầu
    setLoading(true);
  }, [searchParams]);

  useEffect(() => {
    if (userCoords) {
      fetchArtists().finally(() => setLoading(false));
    }
  }, [userCoords, fetchArtists]);

  const handleMapChanged = () => {
    if (isViewOnly) return;

    fetchArtists();

    const map = mapRef.current;
    if (!map || !initialUserCoords) return;

    const center = map.getCenter();
    const distanceMoved =
      center.distanceTo(
        L.latLng(initialUserCoords.lat, initialUserCoords.lng)
      ) / 1000;

    if (distanceMoved > 5) {
      setShowRecenterButton(true);
    } else {
      setShowRecenterButton(false);
    }
  };

  const handleRecenter = () => {
    const map = mapRef.current;
    if (map && initialUserCoords) {
      map.setView(initialUserCoords, 14);
      fetchArtists();
      setShowRecenterButton(false);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "calc(100vh - 100px)" }}>
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
          height={300}
          width={300}
        />
      ) : (
        <>
          {/* artist & service*/}
          <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
            <Typography sx={{ fontSize: 14, color: "gray", mb: 2 }}>
              {nearbyArtists.length} nghệ sĩ trong khu vực bản đồ
            </Typography>

            {nearbyArtists.length === 0 ? (
              <Typography>Không có artist nào gần bạn.</Typography>
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
                  <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <img
                      src={artist.avatar_url}
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
                      <Typography fontWeight={600}>
                        {artist.artist_name}
                      </Typography>
                      <Typography sx={{ fontSize: 13, color: "#555" }}>
                        {artist.address}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: 13, color: "#777" }}>
                      {artist.distance.toFixed(2)} km
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {artist.services?.slice(0, 2).map((item) => (
                    <Box key={item.id} sx={{ display: "flex", gap: 2, mb: 1 }}>
                      <Typography sx={{ flex: 1 }}>
                        {item.service_name}
                      </Typography>
                      <Typography>~{item.duration}p</Typography>
                      <Typography color="primary" fontWeight={600}>
                        {item.max_price.toLocaleString()} VNĐ
                      </Typography>
                    </Box>
                  ))}

                  <Box sx={{ textAlign: "right", mt: 1 }}>
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

          {/* map */}
          <Box sx={{ flex: 2, position: "relative" }}>
            <MapContainer
              center={userCoords}
              zoom={14}
              ref={mapRef}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <MapEventHandler onBoundsChanged={handleMapChanged} />

              <Marker position={userCoords} icon={userIcon}>
                <Popup>Bạn đang ở đây</Popup>
              </Marker>

              {nearbyArtists.map((artist) => (
                <Marker
                  key={artist.id}
                  position={[artist.latitude, artist.longitude]}
                  icon={artistIcon}
                >
                  <Popup>
                    <Box
                      onClick={() =>
                        nav(`/artists/${artist.artist_id}/profile`)
                      }
                      sx={{ cursor: "pointer" }}
                    >
                      <img
                        src={artist.avatar_url}
                        alt={artist.artist_name}
                        style={{
                          width: "100%",
                          height: 200,
                          objectFit: "cover",
                          borderRadius: 4,
                        }}
                      />
                      <Typography fontWeight={600} mt={1}>
                        {artist.artist_name}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <LocationOnIcon
                          sx={{ fontSize: 16, color: "#ED1E79", mr: 0.5 }}
                        />
                        <Typography fontSize={13}>{artist.address}</Typography>
                      </Box>
                      <Typography fontSize={13} color="gray">
                        {artist.distance.toFixed(2)} km
                      </Typography>
                    </Box>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            {/* Floating buttons */}
            <Button
              variant="contained"
              size="small"
              onClick={() => {
                if (isViewOnly) fetchArtists();
                setIsViewOnly((prev) => !prev);
              }}
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                zIndex: 1000,
                backgroundColor: isViewOnly ? "#1976d2" : "#555",
                color: "#fff",
                "&:hover": {
                  backgroundColor: isViewOnly ? "#115293" : "#333",
                },
              }}
            >
              {isViewOnly ? "Tìm quanh khu vực" : "Xem bản đồ tự do"}
            </Button>

            {showRecenterButton && (
              <Button
                variant="outlined"
                size="small"
                onClick={handleRecenter}
                sx={{
                  position: "absolute",
                  bottom: 16,
                  right: 16,
                  zIndex: 1000,
                  backgroundColor: "#fff",
                }}
              >
                Quay về vị trí của bạn
              </Button>
            )}
          </Box>
        </>
      )}
    </Box>
  );
}
