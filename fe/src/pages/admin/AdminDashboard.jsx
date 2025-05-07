import React from "react";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import EventNoteOutlined from "@mui/icons-material/EventNoteOutlined";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import { Box, Card, Typography } from "@mui/material";

export default function AdminDashboard() {
  console.log("AdminDashboard");
  return (
    <>
      {/* số users */}
      <Card
        variant="outlined"
        sx={{
          width: 300,
          padding: 2,
          borderRadius: 5,
        }}
      >
        <PeopleOutlineIcon
          sx={{
            width: 50,
            height: 50,
            backgroundColor: "#f2f4f7",
            padding: 2,
            borderRadius: 2,
          }}
        />
        <Typography sx={{ marginY: 2, fontSize: 14, color: "text.secondary" }}>
          Tài khoản
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{ fontWeight: "bold", fontSize: 24, color: "text.primary" }}
          >
            3,782
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: "#ecfdf3",
              color: "#039855",
              fontSize: 14,
              fontWeight: 600,
              borderRadius: "9999px",
              paddingY: "2px",
              paddingX: "8px",
              gap: "4px",
            }}
          >
            {/* Icon SVG nè */}
            <Box
              component="svg"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
            >
              <path
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.56462 1.62393C5.70193 1.47072 5.90135 1.37432 6.12329 1.37432C6.1236 1.37432 6.12391 1.37432 6.12422 1.37432C6.31631 1.37415 6.50845 1.44731 6.65505 1.59381L9.65514 4.5918C9.94814 4.88459 9.94831 5.35947 9.65552 5.65246C9.36273 5.94546 8.88785 5.94562 8.59486 5.65283L6.87329 3.93247V10.125C6.87329 10.5392 6.53751 10.875 6.12329 10.875C5.70908 10.875 5.37329 10.5392 5.37329 10.125V3.93578L3.65516 5.65282C3.36218 5.94562 2.8873 5.94547 2.5945 5.65248C2.3017 5.35949 2.30185 4.88462 2.59484 4.59182L5.56462 1.62393Z"
              />
            </Box>
            11.01%
          </Box>
        </Box>
      </Card>
      {/* số lịch hẹn */}
      <Card
        variant="outlined"
        sx={{
          width: 300,
          padding: 2,
          borderRadius: 5,
        }}
      >
        <EventNoteOutlined
          sx={{
            width: 50,
            height: 50,
            backgroundColor: "#f2f4f7",
            padding: 2,
            borderRadius: 2,
          }}
        />
        <Typography sx={{ marginY: 2, fontSize: 14, color: "text.secondary" }}>
          Lịch hẹn
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{ fontWeight: "bold", fontSize: 24, color: "text.primary" }}
          >
            5,359
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: "#ecfdf3",
              color: "#039855",
              fontSize: 14,
              fontWeight: 600,
              borderRadius: "9999px",
              paddingY: "2px",
              paddingX: "8px",
              gap: "4px",
            }}
          >
            {/* Icon SVG nè */}
            <Box
              component="svg"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
            >
              <path
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.56462 1.62393C5.70193 1.47072 5.90135 1.37432 6.12329 1.37432C6.1236 1.37432 6.12391 1.37432 6.12422 1.37432C6.31631 1.37415 6.50845 1.44731 6.65505 1.59381L9.65514 4.5918C9.94814 4.88459 9.94831 5.35947 9.65552 5.65246C9.36273 5.94546 8.88785 5.94562 8.59486 5.65283L6.87329 3.93247V10.125C6.87329 10.5392 6.53751 10.875 6.12329 10.875C5.70908 10.875 5.37329 10.5392 5.37329 10.125V3.93578L3.65516 5.65282C3.36218 5.94562 2.8873 5.94547 2.5945 5.65248C2.3017 5.35949 2.30185 4.88462 2.59484 4.59182L5.56462 1.62393Z"
              />
            </Box>
            11.01%
          </Box>
        </Box>
      </Card>
      {/* tỉ lệ đánh giá */}
      <Card
        variant="outlined"
        sx={{
          width: 300,
          padding: 2,
          borderRadius: 5,
        }}
      >
        <ThumbUpOffAltIcon
          sx={{
            width: 50,
            height: 50,
            backgroundColor: "#f2f4f7",
            padding: 2,
            borderRadius: 2,
          }}
        />
        <Typography sx={{ marginY: 2, fontSize: 14, color: "text.secondary" }}>
          Tỷ lệ hài lòng
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{ fontWeight: "bold", fontSize: 24, color: "text.primary" }}
          >
            4.7%
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: "#ecfdf3",
              color: "#039855",
              fontSize: 14,
              fontWeight: 600,
              borderRadius: "9999px",
              paddingY: "2px",
              paddingX: "8px",
              gap: "4px",
            }}
          >
            {/* Icon SVG nè */}
            <Box
              component="svg"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
            >
              <path
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.56462 1.62393C5.70193 1.47072 5.90135 1.37432 6.12329 1.37432C6.1236 1.37432 6.12391 1.37432 6.12422 1.37432C6.31631 1.37415 6.50845 1.44731 6.65505 1.59381L9.65514 4.5918C9.94814 4.88459 9.94831 5.35947 9.65552 5.65246C9.36273 5.94546 8.88785 5.94562 8.59486 5.65283L6.87329 3.93247V10.125C6.87329 10.5392 6.53751 10.875 6.12329 10.875C5.70908 10.875 5.37329 10.5392 5.37329 10.125V3.93578L3.65516 5.65282C3.36218 5.94562 2.8873 5.94547 2.5945 5.65248C2.3017 5.35949 2.30185 4.88462 2.59484 4.59182L5.56462 1.62393Z"
              />
            </Box>
            11.01%
          </Box>
        </Box>
      </Card>
    </>
  );
}
