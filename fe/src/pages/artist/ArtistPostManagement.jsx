import React, { useContext, useEffect, useState } from "react";
import {
  Backdrop,
  Box,
  Button,
  Fade,
  Grid,
  TextField,
  Modal,
  Typography,
  IconButton,
  DialogContent,
  DialogTitle,
  DialogActions,
  Dialog,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import FavoriteIcon from "@mui/icons-material/Favorite";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Skeleton from "../../components/Skeleton";
import { AppContext } from "../../contexts/app.context";
import { addPostSchema } from "../../schemas/addPostSchema";
import artistApis from "../../apis/artists.apis";
import mediaApis from "../../apis/media.apis";
import HttpStatusCode from "../../constants/httpStatus";
import { useDropzone } from "react-dropzone";
import RemoveIcon from "@mui/icons-material/Remove";
import postApis from "../../apis/posts.apis";
import CancelIcon from "@mui/icons-material/Cancel";
import PostModal from "../../components/PostModal";

export default function ArtistPostManagement() {
  const { profile } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [openAlert, setOpenAlert] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [reactions, setReactions] = useState([]);
  const [myReaction, setMyReaction] = useState(null);
  const [currentModal, setCurrentModal] = useState(null);

  const handleClose = () => {
    setOpenAlert(false);
  };
  const closeModal = () => {
    setCurrentModal(null);
  };
  const handleRequestDelete = (post_id) => {
    setDeleteTargetId(post_id);
    setOpenAlert(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteTargetId) return;
    setOpenAlert(true);
    const response = await postApis.deletePost(deleteTargetId);
    if (response.status === HttpStatusCode.Ok) {
      toast.success(response.data.message, {
        position: "top-center",
      });
      fetchPosts();
    }
    setOpenAlert(false);
    setDeleteTargetId(null);
  };

  const onDrop = (acceptedFiles) => {
    const currentFiles = watch("media_url") || [];
    const currentPreviews = watch("media_url_preview") || [];

    const mapped = acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setValue("media_url", [...currentFiles, ...acceptedFiles], {
      shouldValidate: true,
    });
    setValue("media_url_preview", [...currentPreviews, ...mapped], {
      shouldValidate: true,
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
      "video/*": [],
    },
    multiple: true,
  });
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(addPostSchema),
    defaultValues: {
      media_url: [],
      media_url_preview: [],
      content: "",
      hashtags: [""],
    },
  });
  useEffect(() => {
    const previews = watch("media_url_preview") || [];
    return () => {
      previews.forEach((item) => {
        if (item?.preview) URL.revokeObjectURL(item.preview);
      });
    };
  }, [watch("media_url_preview")]);

  const handleRemoveFile = (index) => {
    const files = watch("media_url") || [];
    const previews = watch("media_url_preview") || [];

    if (previews[index]?.preview) {
      URL.revokeObjectURL(previews[index].preview);
    }

    files.splice(index, 1);
    previews.splice(index, 1);

    setValue("media_url", files);
    setValue("media_url_preview", previews);
  };

  const onSubmit = async (data) => {
    const files = watch("media_url") || [];
    const formData = new FormData();
    formData.append("folderName", "post");
    files.forEach((file) => {
      formData.append("images", file);
    });
    let response = await mediaApis.uploadImage(formData);
    const uploadedUrls = response.data.result;
    const payload = {
      content: data.content,
      media_url: uploadedUrls,
    };
    response = await postApis.addPost(payload);
    if (response.status === HttpStatusCode.Ok) {
      setOpen(false);
      reset();
      toast.success(response.data.message, {
        position: "top-center",
      });
      fetchPosts();
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await artistApis.getArtistPosts(profile.artist_id);
      if (res.status === HttpStatusCode.Ok) {
        setPosts(res.data.result);
      }
    } catch (err) {
      toast.error(err.message || err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [profile.id]);

  useEffect(() => {
    if (files.length > 0) {
      const previews = files.map((file) => URL.createObjectURL(file));
      setPreviews(previews);
      return () => {
        previews.forEach((url) => URL.revokeObjectURL(url));
      };
    }
  }, [files]);

  let customPosts = posts;
  if (posts.length % 3 !== 0) {
    const emptySlots = 3 - (posts.length % 3);
    customPosts = [...posts, ...Array(emptySlots).fill({ id: "empty" })];
  }

  const getAllReactions = async (postId) => {
    try {
      const response = await postApis.getAllReactions(postId);
      if (response.status === HttpStatusCode.Ok) {
        setReactions(response.data.result);
        response.data.result.map((item) => {
          if (item.user_id === profile.id) {
            setMyReaction(item);
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllComments = async (postId) => {
    const response = await postApis.getAllComments(postId);
    if (response.status === HttpStatusCode.Ok) {
      setComments(response.data.result);
    }
  };

  return (
    <Box sx={{ margin: 4 }}>
      {loading ? (
        <Skeleton />
      ) : (
        <>
          <Box display="flex" justifyContent="space-between" mb={4}>
            <Typography fontSize={40} fontWeight={600} color="primary">
              Bài đăng của bạn
            </Typography>
            <Button onClick={() => setOpen(true)}>Thêm bài đăng mới +</Button>
          </Box>

          <Grid container spacing={2}>
            {customPosts.map((post, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                {post.id === "empty" ? (
                  <Box sx={{ width: "100%", height: 420 }} />
                ) : (
                  <Box
                    position="relative"
                    sx={{ height: 420, cursor: "pointer" }}
                  >
                    <img
                      loading="lazy"
                      src={post.media_url?.[0]}
                      alt="post"
                      style={{
                        width: "100%",
                        minWidth: 300,
                        maxWidth: 320,
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                    {/* Overlay hiển thị khi hover */}
                    <Box
                      className="hover-overlay"
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        color: "#fff",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                        gap: 2,
                        opacity: 0,
                        transition: "opacity 0.3s ease-in-out",
                        "&:hover": {
                          opacity: 1,
                        },
                      }}
                      onClick={() => {
                        setSelectedPost(post);
                        setSelectedMedia(post.media_url);
                        setOpenDetail(true);
                        getAllComments(post.id);
                        getAllReactions(post.id);
                        setCurrentModal("post");
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <FavoriteIcon fontSize="small" />
                        <Typography>{post.Comment.length || 0}</Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <ChatIcon fontSize="small" />
                        <Typography>{post.Reaction.length || 0}</Typography>
                      </Box>
                    </Box>
                    {/* Nút xóa */}
                    <CancelIcon
                      onClick={() => handleRequestDelete(post.id)}
                      sx={{
                        width: 30,
                        height: 30,
                        position: "absolute",
                        top: -15,
                        right: -10,
                        cursor: "pointer",
                        zIndex: 2,
                        ":hover": {
                          opacity: 0.8,
                        },
                      }}
                    />
                  </Box>
                )}
              </Grid>
            ))}
          </Grid>
          <Dialog
            open={openAlert}
            onClose={handleClose}
            keepMounted
            TransitionComponent={Fade}
            transitionDuration={300}
            BackdropProps={{
              sx: {
                backdropFilter: "blur(8px)",
                backgroundColor: "rgba(0,0,0,0.2)",
              },
            }}
            PaperProps={{
              sx: {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "20px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 12px 32px rgba(0, 0, 0, 0.35)",
                color: "#fff",
                px: 3,
                py: 2,
                transition: "all 0.3s ease",
              },
            }}
          >
            <DialogTitle
              id="alert-dialog-title"
              sx={{
                fontWeight: 600,
                fontSize: 22,
                color: "rgba(255, 255, 255, 0.95)",
              }}
            >
              Xác nhận trước khi xóa
            </DialogTitle>

            <DialogContent>
              <Typography
                variant="body1"
                sx={{ color: "rgba(255, 255, 255, 0.85)", mb: 1 }}
              >
                Bạn có chắc chắn muốn xóa bài đăng này?
              </Typography>
            </DialogContent>

            <DialogActions sx={{ gap: 1 }}>
              <Button
                onClick={handleClose}
                variant="outlined"
                sx={{
                  borderColor: "rgba(255, 255, 255, 0.3)",
                  color: "#ddd",
                  "&:hover": {
                    borderColor: "#aaa",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                Hủy
              </Button>
              <Button
                onClick={handleDeleteConfirmed}
                color="error"
                variant="contained"
                sx={{
                  backgroundColor: "#ff4d4f",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#e53935",
                  },
                }}
              >
                Xóa
              </Button>
            </DialogActions>
          </Dialog>

          <Modal
            open={open}
            onClose={() => setOpen(false)}
            closeAfterTransition
            BackdropComponent={Backdrop}
          >
            <Fade in={open}>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 800,
                  maxHeight: "80vh",
                  overflowY: "auto",
                  bgcolor: "background.paper",
                  p: 4,
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" mb={3}>
                  Thêm bài đăng mới
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)}>
                  <Box display="flex" flexDirection="column" gap={3}>
                    <TextField
                      label="Nội dung"
                      multiline
                      minRows={2}
                      {...register("content")}
                      error={!!errors.content}
                      helperText={errors.content?.message}
                    />

                    <TextField
                      label="Hashtags (phân cách bởi dấu phẩy)"
                      {...register("hashtags")}
                      error={!!errors.hashtags}
                      helperText={errors.hashtags?.message}
                    />

                    <Box
                      {...getRootProps()}
                      sx={{
                        border: "2px dashed gray",
                        p: 2,
                        textAlign: "center",
                        borderRadius: 2,
                      }}
                    >
                      <input {...getInputProps()} />
                      <Typography>
                        Kéo thả hoặc click để chọn ảnh/video cho bài viết
                      </Typography>
                    </Box>

                    <Box
                      mt={2}
                      sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}
                    >
                      {watch("media_url_preview")?.map((item, index) => (
                        <Box
                          key={index}
                          sx={{ width: 120, height: 120, position: "relative" }}
                        >
                          {item.file?.type.startsWith("image/") ? (
                            <img
                              src={item.preview}
                              alt="preview"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: 8,
                              }}
                            />
                          ) : item.file?.type.startsWith("video/") ? (
                            <video
                              src={item.preview}
                              controls
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: 8,
                              }}
                            />
                          ) : (
                            <Typography>Không xác định</Typography>
                          )}
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveFile(index)}
                            sx={{
                              position: "absolute",
                              top: 0,
                              right: 0,
                              bgcolor: "white",
                            }}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>

                    <Box display="flex" justifyContent="flex-end" gap={2}>
                      <Button onClick={() => setOpen(false)}>Huỷ</Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        variant="contained"
                      >
                        {isSubmitting ? "...Đang đăng bài" : "Đăng bài"}
                      </Button>
                    </Box>
                  </Box>
                </form>
              </Box>
            </Fade>
          </Modal>
          {selectedPost && openDetail && (
            <PostModal
              selectedPost={selectedPost}
              getAllComments={getAllComments}
              currentModal={currentModal}
              closeModal={closeModal}
              selectedMedia={selectedMedia}
              profile={profile}
              myReaction={myReaction}
              setMyReaction={setMyReaction}
              reactions={reactions}
              comments={comments}
              profileType={"artist"}
            />
          )}
        </>
      )}
    </Box>
  );
}
