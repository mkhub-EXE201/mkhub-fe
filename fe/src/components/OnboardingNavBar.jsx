import { Box, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function OnboardingNavBar() {
  return (
    <Box
      sx={{
        paddingTop: { xs: 2, sm: 2, md: 4 },
        paddingX: { xs: 2, sm: 3, md: 7 },
        paddingBottom: { xs: 1, sm: 1, md: 3 },
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between",
        alignItems: "center",
        gap: { xs: 2, sm: 0 },
        boxShadow: 2,
      }}
    >
      {/* left - logo & title */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          alignItems: "center",
        }}
      >
        <Link to={"/"}>
          <img src={logo} width={150} height={"auto"} />
        </Link>
        <Typography sx={{ fontSize: 30 }}>
          Đăng kí trở thành Makeup Artist
        </Typography>
      </Box>
      {/* right - profile */}
      <img
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAADACAMAAAB/Pny7AAAAMFBMVEXFxcX////CwsLIyMjMzMz8/Pzv7+/5+fnz8/PY2Nj29vbk5OS/v7/h4eHPz8/S0tLbr2APAAAE30lEQVR4nO2djbqkIAiGG9LKn+r+73brNLvNb2MIwpn1vYK+RwFFoKapVCqVSqVSqVQqlUqlUqlUKpVKpVLBATvSn5JH2xo3dkPvfT90wU2mlf4iDND8yLg84VdJ0l93CmgmF4ZnJVc93Ti3v2fPueDfKdnol/Vpf4EcMGOwx1J+GMIs/amfAHBdipTNfNoo/b1HwNz1iVIW7DA2avcamHBCyg+dU7o4cXrrwA5Wx0WVizOmGsvD4hh9atokH/aKQZ1bMwEpZcE76a+/B2MuO70mNTBnaVnWZlRjN5C3LivWaVEDH05iSWpmJWoybH9nmDSoAWR8eVKjIN6Ao9GyRE9xMWAIDGbDirs08+JqjEU83Liz5+QjOtnsQH6EuUU42oyUWoSXZiaz/iujnJaWJFze4icxMTOl9W+ILQ0QW8zKICWmpYr9t0jFmplBy8XLeGcgjTH/kPHOht78V0aJTFpkMP+VTkBLA+RBZqMX2Wc8u2zxZ+VdABgmLZeuvNFwmcyyzwTE8DjmBVt+m0WO8L+JKZ/Z4BNzCeX3GZ+Y4h6ALsP0QkzpbQaOTUv5M0Bkiv8yYgjzZVVMFfNfiPkmB8DqmovHmfmLguZXHWe+66AZuW7NIlcANt9s67U5C5i4xAwCWUCWtPmKxFsgMBmNlahK5zrQyLzQtEyJc5E3DZ4nDStUEMTy2DRIlQJw7DOxugaGuOmFpLA8nQcxMQxFDYI1zuTlJkGwj4u6rEG0EAgm2qURLggmzZ93sq1bQFnW6KUrtcGQHWrkC04pS4EV9GwBunHmQYuCIu0GaEKnV9IM0FKYjZb2JgqXJu3IdrIbaBQ4shsyHbR03fw90GbsNC22v4P3afpaG5eAN6KuaraTq8t+D0SHMJzeKR1zgGrUVqpl3WrzGTm2GzWPa1hnG6SL8S4qbaBfiOCCP7MyfXCgUg4sFuNPn5+tD0af1cTzxn+lD0bb6uCCzFWOYD/TEzDlSNnkqGgGXo9lFFnaflbhpafkQTOHaDjWmNwdttOPsj2nQLQsG8viyG01aDFHyyMGJ2U5y4WMvBTACmVoUQOAPjNMAiE0clXP2bm4Gs6yxtJpJ47m2Z2yiSf6x8x7Sr4GGqJc+VtsKBY/2bUUVMO9xzYK7TSioTkfsCUuObGMllUNe7yJjPHlEe7hh5GlLOsdvGcBYGqbf0PP+szZUtfKfMBzujT+AHOP5avYoppkdkYN1zENyAuyEuB6VaMsk0mHp2qrzCnmGZZzDUNBZhI9w5Nnaa+8Q++fea+Wx5B7NFPcK+9YYh/A1V+SBm2vI2cuJgXSfA3TjKlkSLsdBK1/g+7aWfjg/wrCy4D4wtAtDWG1Lx6qmcGcrf/p0DQ8U9f7I/E0r2oqFoamTYi02j8HkiJu0iHGGVBMc86pJKWly74KiFz8X0OQDlAQMP+SHTg1BMy/DLn3GsYxZqexuS5ASZDZyAw1mnZZ9j4TvmE+krXPuObLYglZzln66x/JWZii72QpZMRNzolsODJmUlH88ocW/AR0kExjvgY/lKrkM3kq6Od0bY55Be2cSZpJiRnQlxp1JrMYDVKKdLb8Ncgcuo582SPI/BnfFPMckKPcorqQueJxYphGfmXSo9wZ5+DvDHB/3BKolEkBV02jMf6voM4AXyWmUXeZ2TiY5vwHme9RB/ByBC0AAAAASUVORK5CYII="
        style={{
          width: 50,
          height: 50,
          borderRadius: "50%",
        }}
      />
    </Box>
  );
}
