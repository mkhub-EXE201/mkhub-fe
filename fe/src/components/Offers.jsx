import {
  Box,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import React from "react";
import Card from "@mui/material/Card";
import firstSignUpOffer from "../assets/first-signup-offer.jpg";

export default function Offers() {
  return (
    <Box
      sx={{
        marginX: { xs: 2, sm: 6, md: 12, lg: 10 },
        marginY: 4,
      }}
    >
      <Typography
        variant="h5"
        sx={{
          marginY: { xs: 3, sm: 3, md: 6 },
          color: (theme) => theme.palette.primary.main,
          textTransform: "uppercase",
          fontSize: {
            xs: "24px",
            sm: "44px",
            md: "44px",
          },
          fontWeight: 700,
        }}
      >
        Ưu đãi của Makeup hub
      </Typography>
      <Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column", // xếp dọc trên mobile
              md: "row", // xếp ngang từ md trở lên
            },
            gap: "20px",
          }}
        >
          {/* Box trái */}
          <Box sx={{ flex: 1 }}>
            <Box
              sx={{ borderRadius: "20px", overflow: "hidden", height: "100%" }}
            >
              <Card
                sx={{
                  border: "none",
                  width: "100%",
                  height: {
                    xs: "auto",
                    sm: 255,
                    md: 410,
                  },
                }}
              >
                <CardActionArea sx={{ height: "100%", width: "100%" }}>
                  <CardMedia
                    component="img"
                    image={firstSignUpOffer}
                    sx={{
                      width: "100%",
                      height: {
                        xs: 180,
                        sm: 200,
                        md: 280,
                      },
                      objectFit: "cover",
                    }}
                  />
                  <CardContent
                    sx={{
                      padding: { xs: "10px", sm: "15px", md: "20px" },
                      backgroundColor: (theme) => theme.palette.lightPink,
                      borderBottomLeftRadius: "20px",
                      borderBottomRightRadius: "20px",
                    }}
                  >
                    <Typography
                      gutterBottom
                      sx={{
                        fontSize: { xs: 14, sm: 20, md: 28, lg: 32 },
                        color: (theme) => theme.palette.darkBlue,
                      }}
                      fontWeight={600}
                    >
                      Ưu đãi cho hội viên lần đầu đăng ký!
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Box>
          </Box>

          {/* Box phải */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            {/* Thẻ ưu đãi 1 */}
            <Card
              sx={{
                border: "none",
                width: "100%",
                borderRadius: "20px",
              }}
            >
              <CardActionArea
                sx={{
                  height: {
                    xs: 180,
                    sm: 220,
                    md: 195,
                  },
                  backgroundColor: (theme) => theme.palette.lightPink,
                  borderRadius: "20px",
                }}
              >
                <CardContent
                  sx={{ padding: { xs: "10px", sm: "15px", md: "20px" } }}
                >
                  <Typography
                    gutterBottom
                    sx={{
                      textAlign: "center",
                      fontSize: { xs: 14, sm: 20, md: 28 },
                      color: (theme) => theme.palette.darkPink,
                    }}
                    fontWeight={600}
                  >
                    GIẢM 10% CHO LẦN ĐẶT DỊCH VỤ MAKEUP ĐẦU TIÊN
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>

            {/* Thẻ ưu đãi 2 */}
            <Card
              sx={{
                border: "none",
                width: "100%",
                borderRadius: "20px",
              }}
            >
              <CardActionArea
                sx={{
                  height: {
                    xs: 180,
                    sm: 220,
                    md: 195,
                  },
                  backgroundColor: (theme) => theme.palette.lightBlue,
                  borderRadius: "20px",
                }}
              >
                <CardContent
                  sx={{ padding: { xs: "10px", sm: "15px", md: "20px" } }}
                >
                  <Typography
                    gutterBottom
                    sx={{
                      textAlign: "center",
                      fontSize: { xs: 14, sm: 20, md: 28 },
                      color: (theme) => theme.palette.darkBlue,
                    }}
                    fontWeight={600}
                  >
                    GÓI HÀNG THÁNG TIẾT KIỆM HƠN DÀNH CHO MAKEUP ARTIST
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
