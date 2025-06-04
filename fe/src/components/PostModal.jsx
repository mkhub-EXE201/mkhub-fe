/* eslint-disable react/prop-types */
import React, { useState } from "react";
import {
  Modal as ModalMui,
  Avatar,
  Divider,
  IconButton,
  Box,
  Typography,
  TextField,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import reactionApis from "../apis/reactions.apis";
import postApis from "../apis/posts.apis";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { REACTION_REFERENCE_TYPE, REACTION_TYPE } from "../constants/enum";
import commentApis from "../apis/comment.apis";
import HttpStatusCode from "../constants/httpStatus";

export default function PostModal({
  selectedPost,
  getAllComments,
  currentModal,
  closeModal,
  selectedMedia,
  profile,
  myReaction,
  setMyReaction,
  reactions,
  comments,
}) {
  const [comment, setComment] = useState("");

  const handleAddComment = async () => {
    try {
      const payload = {
        post_id: selectedPost.id,
        content: comment,
      };
      const response = await commentApis.addComment(payload);
      if (response.status === HttpStatusCode.Ok) {
        setComment("");
        getAllComments(selectedPost.id);
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  return (
    <ModalMui
      open={currentModal === "post"}
      onClose={closeModal}
      post={selectedPost}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: 1000,
          height: 500,
          bgcolor: "background.paper",
          boxShadow: 24,
          outline: "none",
          borderRadius: 2,
          display: "flex",
          overflow: "hidden",
        }}
      >
        {/* Left: Swiper */}
        <Box sx={{ width: "50%", height: "100%", bgcolor: "#000" }}>
          <Swiper
            spaceBetween={10}
            style={{ width: "100%", height: "100%" }}
            slidesPerView={1}
          >
            {selectedMedia.map((url, idx) => (
              <SwiperSlide key={idx}>
                <img
                  src={url}
                  alt={`slide-${idx}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    backgroundColor: "#000",
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>

        {/* Right: Content */}
        <Box
          sx={{
            width: "50%",
            height: "100%",
            p: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar src={profile.avatar_url} />
              <Typography variant="h6" gutterBottom>
                {profile.name}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
              {selectedPost.content}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                my: 1,
              }}
            >
              {!myReaction ? (
                <IconButton
                  onClick={async () => {
                    const payload = {
                      reference_id: selectedPost.id,
                      reference_type: REACTION_REFERENCE_TYPE.POST,
                      reaction_type: REACTION_TYPE.LOVE,
                    };
                    await reactionApis.addReaction(payload);
                    await postApis.getAllReactions(selectedPost.id);
                  }}
                >
                  <FavoriteBorderIcon
                    sx={{
                      fontSize: 26,
                    }}
                  />
                </IconButton>
              ) : (
                <IconButton
                  onClick={async () => {
                    await reactionApis.deleteReaction(myReaction.id);
                    setMyReaction(null);
                    await postApis.getAllReactions(selectedPost.id);
                  }}
                >
                  <FavoriteIcon
                    sx={{
                      color: "red",
                      fontSize: 26,
                    }}
                  />
                </IconButton>
              )}
              <Typography variant="body2">
                {reactions.length || 0} lượt thích
              </Typography>
            </Box>
            <Divider />
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              pr: 1,
            }}
          >
            {comments && comments.length > 0 ? (
              comments.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1,
                    mb: 2,
                  }}
                >
                  <Avatar
                    src={item.avatar_url}
                    sx={{ width: 36, height: 36 }}
                  />
                  <Box
                    sx={{
                      backgroundColor: "#f0f2f5",
                      padding: "8px 12px",
                      borderRadius: "18px",
                      maxWidth: "100%",
                    }}
                  >
                    <Typography sx={{ fontWeight: 500, fontSize: 14 }}>
                      {item.last_name} {item.first_name}
                    </Typography>
                    <Typography sx={{ fontSize: 14 }}>
                      {item.content}
                    </Typography>
                  </Box>
                </Box>
              ))
            ) : (
              <Typography>Không có bình luận nào.</Typography>
            )}
          </Box>

          <Box sx={{ mt: 2 }}>
            <TextField
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAddComment();
                }
              }}
              fullWidth
              placeholder="Comment..."
              variant="outlined"
              size="small"
              InputProps={{
                sx: {
                  borderRadius: "20px",
                  paddingY: "6px",
                  paddingX: "12px",
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                  backgroundColor: "#f9f9f9",
                  "& fieldset": {
                    borderColor: "#ccc",
                  },
                  "&:hover fieldset": {
                    borderColor: "#aaa",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#555",
                  },
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "#888",
                  opacity: 1,
                },
              }}
            />
          </Box>
        </Box>
      </Box>
    </ModalMui>
  );
}
