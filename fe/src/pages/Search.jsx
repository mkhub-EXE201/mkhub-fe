import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  TextField,
  List,
  ListItem,
  Typography,
  Tabs,
  Tab,
  Avatar,
  Button,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  ListSubheader,
  CircularProgress,
  Dialog,
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import searchApis from "../apis/search.apis";
import { HttpStatusCode } from "axios";
import ClearIcon from "@mui/icons-material/Clear";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import toast from "react-hot-toast";
import PostModal from "../components/PostModal";
import postApis from "../apis/posts.apis";
import { AppContext } from "../contexts/app.context";

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [localQuery, setLocalQuery] = useState(query);
  const [openPostModal, setOpenPostModal] = useState(null);
  const [results, setResults] = useState({
    users: [],
    posts: [],
    categories: [],
    services: [],
  });
  const [tab, setTab] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [reactions, setReactions] = useState([]);
  const [myReaction, setMyReaction] = useState(null);
  const [currentModal, setCurrentModal] = useState(null);
  const { profile } = useContext(AppContext);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await searchApis.search(20, 1, query);
        if (response.status === HttpStatusCode.Ok) {
          setResults(response.data.result);
        }
      } catch (error) {
        toast.error(error.message || error.data.message);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchResults();
    } else {
      setLoading(false);
    }
  }, [query]);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && localQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(localQuery.trim())}`);
    }
  };

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
    <Box sx={{ width: "100%", margin: "0 auto", padding: 4 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Nhập từ khóa tìm kiếm..."
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        sx={{
          mb: 4,
          width: "60%",
          margin: "0 auto",
          display: "block",
          "& .MuiOutlinedInput-root": {
            borderRadius: "50px",
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: localQuery && (
            <InputAdornment position="end">
              <IconButton onClick={() => setLocalQuery("")}>
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Tabs sx={{ mt: 6 }} value={tab} onChange={handleTabChange} centered>
        <Tab label={`Tài khoản (${results.users.length})`} />
        <Tab label={`Bài đăng (${results.posts.length})`} />
        <Tab label={`Chủ đề makeup (${results.categories.length})`} />
        <Tab label={`Gói makeup (${results.services.length})`} />
      </Tabs>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            mt: 5,
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box sx={{ mt: 2, paddingX: 30 }}>
            {tab === 0 && (
              <List>
                {results.users.length === 0 && (
                  <Typography color="text.secondary">
                    Không tìm thấy tài khoản nào.
                  </Typography>
                )}
                {results.users.map((user) => (
                  <ListItem
                    key={user.id}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      borderRadius: 2,
                      padding: 2,
                      marginY: 2,
                      boxShadow: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <Avatar
                        src={user.avatar_url}
                        sx={{
                          width: 64,
                          height: 64,
                        }}
                      />
                      <Box>
                        <Typography fontWeight={600} fontSize="1.1rem">
                          {user.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {user.bio}
                        </Typography>
                      </Box>
                    </Box>

                    <Button
                      sx={{
                        mt: 2,
                        width: "100%",
                        alignSelf: "center",
                        borderRadius: 2,
                        backgroundColor: "pink",
                        textTransform: "none",
                        ":hover": {
                          opacity: 0.8,
                        },
                      }}
                      onClick={() => navigate(`/artists/${user.id}/profile`)}
                    >
                      Xem thêm
                    </Button>
                  </ListItem>
                ))}
              </List>
            )}
            {tab === 1 && (
              <>
                {results.posts.length === 0 ? (
                  <Typography color="text.secondary">
                    Không tìm thấy bài đăng nào.
                  </Typography>
                ) : (
                  <ImageList variant="standard" cols={3} gap={5}>
                    {results.posts.map((item) => (
                      <ImageListItem key={item.artist_id}>
                        <Box
                          component="img"
                          alt={item.artist_name || "artist image"}
                          onClick={() => {
                            setSelectedPost(item);
                            setSelectedMedia(item.media_url);
                            setOpenPostModal(item);
                            getAllComments(item.id);
                            getAllReactions(item.id);
                            setCurrentModal("post");
                          }}
                          src={`${item.media_url[0]}?w=248&fit=crop&auto=format`}
                          srcSet={`${item.media_url[0]}?w=248&fit=crop&auto=format&dpr=2 2x`}
                          loading="lazy"
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            cursor: "pointer",
                            ":hover": { opacity: 0.8 },
                          }}
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                )}
              </>
            )}

            {tab === 2 && (
              <Box sx={{ mt: 2 }}>
                {results.categories.length === 0 ? (
                  <Typography color="text.secondary">
                    Không tìm thấy chủ đề makeup nào.
                  </Typography>
                ) : (
                  <ImageList
                    sx={{ width: "100%", maxWidth: 1000, mx: "auto" }}
                    cols={3}
                    gap={16}
                  >
                    <ImageListItem
                      key="Subheader"
                      cols={3}
                      sx={{ height: "auto" }}
                    >
                      <ListSubheader
                        component="div"
                        sx={{ fontSize: "1.2rem", fontWeight: 600 }}
                      >
                        Danh sách chủ đề makeup
                      </ListSubheader>
                    </ImageListItem>

                    {results.categories.map((item) => (
                      <ImageListItem
                        key={item.id}
                        onClick={() => navigate(`/category/${item.id}`)}
                        sx={{ cursor: "pointer", ":hover": { opacity: 0.8 } }}
                      >
                        <img
                          src={`${item.thumbnail}?w=248&fit=crop&auto=format`}
                          srcSet={`${item.thumbnail}?w=248&fit=crop&auto=format&dpr=2 2x`}
                          alt={item.name}
                          loading="lazy"
                          style={{
                            height: 270,
                            width: "100%",
                            objectFit: "cover",
                            borderRadius: 8,
                          }}
                        />
                        <ImageListItemBar
                          title={item.name}
                          position="below"
                          sx={{
                            mt: 1,
                            textAlign: "center",
                            ".MuiImageListItemBar-title": {
                              fontWeight: 600,
                              fontSize: "1rem",
                            },
                          }}
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                )}
              </Box>
            )}

            {tab === 3 && (
              <Box sx={{ mt: 2 }}>
                {results.services.length === 0 ? (
                  <Typography color="text.secondary">
                    Không tìm thấy gói makeup nào.
                  </Typography>
                ) : (
                  <ImageList variant="masonry" cols={3} gap={16}>
                    {results.services.map((item) => (
                      <ImageListItem
                        key={item.artist_id}
                        sx={{
                          ":hover": {
                            opacity: 0.8,
                            cursor: "pointer",
                          },
                        }}
                      >
                        <img
                          onClick={() =>
                            navigate(`/artists/${item.artist_id}/profile`)
                          }
                          src={`${item.thumbnail}?w=248&fit=crop&auto=format`}
                          srcSet={`${item.thumbnail}?w=248&fit=crop&auto=format&dpr=2 2x`}
                          alt={item.service_name}
                          loading="lazy"
                          style={{ borderRadius: 12 }}
                        />
                        <ImageListItemBar
                          position="below"
                          title={item.service_name}
                          sx={{
                            mt: 1,
                            textAlign: "center",
                            ".MuiImageListItemBar-title": {
                              fontWeight: 600,
                              fontSize: "1rem",
                            },
                          }}
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                )}
              </Box>
            )}
          </Box>
          {openPostModal && (
            <PostModal
              selectedPost={openPostModal}
              getAllComments={getAllComments}
              currentModal={currentModal}
              closeModal={() => setOpenPostModal(null)}
              selectedMedia={selectedMedia}
              profile={profile}
              myReaction={myReaction}
              setMyReaction={setMyReaction}
              reactions={reactions}
              comments={comments}
              profileType={"client"}
            />
          )}
        </>
      )}
    </Box>
  );
}
