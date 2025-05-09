import React from "react";
import Grid from "@mui/material/Grid";
import SkeletonMui from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

export default function Skeleton() {
  return (
    <Grid container direction="row" spacing={4}>
      {[...Array(6)].map((_, index) => (
        <Grid item key={index} container direction="column" spacing={2}>
          <SkeletonMui variant="rectangular" width={300} height={210} />
          <Box sx={{ pt: 0.5 }}>
            <SkeletonMui width="60%" height={30} sx={{ mt: 1 }} />
            <SkeletonMui width={300} height={30} />
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}
