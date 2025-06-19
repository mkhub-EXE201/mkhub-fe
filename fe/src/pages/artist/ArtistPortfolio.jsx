import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Skeleton,
  Tab,
  Tabs,
  Typography,
  Modal,
} from "@mui/material";
import artistApis from "../../apis/artists.apis";
import { AppContext } from "../../contexts/app.context";
import toast from "react-hot-toast";
import ArtistProfile from "../../components/ArtistProfile";
import ArtistAddress from "../../components/ArtistAddress";
import paymentApi from "../../apis/payments.apis";
import { useNavigate } from "react-router-dom";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function ArtistPortfolio() {
  const { profile } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [portfolio, setPortfolio] = useState([]);
  const [value, setValue] = useState(0);
  const [stripeStatus, setStripeStatus] = useState(false);
  let uri = "";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([getArtistPortfolio(), getOwnStripeStatus()]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    fetchData();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getArtistPortfolio = async () => {
    try {
      const response = await artistApis.getArtistProfile(profile.artist_id);
      setPortfolio(response.data.result);
    } catch (error) {
      toast.error(error.message || error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const getOwnStripeStatus = async () => {
    try {
      const response = await artistApis.getArtistPaymentAccountStatus();
      setStripeStatus(response.data.result.stripe_connected);
      console.log("stripe status: ", response.data.result.stripe_connected);
    } catch (error) {
      toast.error(error.message || error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const getStripeConnectionString = async () => {
    try {
      const response = await paymentApi.connect();
      uri = response.data.result;
      window.location.href = uri;
      //  window.open(uri, "_blank");
    } catch (error) {
      toast.error(error.message || error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ margin: 4 }}>
      <Typography
        variant="h1"
        sx={{ color: (theme) => theme.palette.primary.main }}
      >
        Hồ sơ cá nhân
      </Typography>
      <Box>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Skeleton variant="circular" width={100} height={100} />
            <Skeleton variant="rectangular" width={310} height={60} />
            <Skeleton variant="rounded" width={310} height={60} />
          </Box>
        ) : (
          <Box sx={{ marginY: 4 }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Thông tin cá nhân" {...a11yProps(0)} />
              <Tab label="Sổ địa chỉ" {...a11yProps(1)} />
            </Tabs>
            {value === 0 && (
              <>
                <ArtistProfile portfolio={portfolio} />
              </>
            )}
            {value === 1 && <ArtistAddress profile={profile} />}
            {!stripeStatus && (
              <Modal open>
                <Box
                  sx={{
                    width: "90%",
                    maxWidth: 400,
                    margin: "8rem auto",
                    backgroundColor: "white",
                    borderRadius: 3,
                    boxShadow: 3,
                    p: 4,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    Thiết lập tài khoản Stripe
                  </Typography>

                  <Typography color="text.secondary">
                    Để có thể nhận thanh toán từ khách hàng, bạn cần kết nối tài
                    khoản Stripe.
                  </Typography>

                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={getStripeConnectionString}
                    sx={{ mt: 2 }}
                  >
                    Thiết lập ngay
                  </Button>
                </Box>
              </Modal>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
