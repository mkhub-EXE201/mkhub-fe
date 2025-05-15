import { Box, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import artistApis from "../apis/artists.apis";
import Navbar from "../components/Navbar";
import HttpStatusCode from "../constants/httpStatus";
import toast from "react-hot-toast";
import Skeleton from "../components/Skeleton";

export default function Artists() {
  const [artists, setArtists] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getArtists = async () => {
      try {
        const response = await artistApis.getAllArtists();
        if (response.status === HttpStatusCode.Ok) {
          setArtists(response.data.result);
        }
      } catch (error) {
        toast.error(error.message || error.response.data.msg);
      } finally {
        setIsLoading(false);
      }
    };
    getArtists();
  }, []);
  return (
    <Box>
      <Navbar />
      {isLoading ? (
        <Skeleton />
      ) : (
        <>
          {artists.map((item) => (
            <Box key={item.id}>
              <Typography>{item.name}</Typography>
            </Box>
          ))}
        </>
      )}
    </Box>
  );
}
