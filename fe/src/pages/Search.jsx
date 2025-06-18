import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import searchApis from "../apis/search.apis";
import { HttpStatusCode } from "axios";

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  const navigate = useNavigate();
  const [localQuery, setLocalQuery] = useState(query); // 👈 input field riêng
  const [results, setResults] = useState({
    users: [],
    posts: [],
    categories: [],
    services: [],
  });
  const [tab, setTab] = useState(0);

  useEffect(() => {
    const fetchResults = async () => {
      const response = await searchApis.search(20, 1, query);
      if (response.status === HttpStatusCode.Ok) {
        setResults(response.data.result);
      }
    };

    if (query) {
      fetchResults();
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

  return (
    <Box sx={{ maxWidth: 800, margin: "0 auto", padding: 4 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Nhập từ khóa tìm kiếm..."
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        sx={{
          mb: 4,
          "& .MuiOutlinedInput-root": {
            borderRadius: "50px",
          },
        }}
      />

      <Tabs value={tab} onChange={handleTabChange} centered>
        <Tab label={`Tài khoản (${results.users.length})`} />
        <Tab label={`Bài đăng (${results.posts.length})`} />
        <Tab label={`Chủ đề makeup (${results.categories.length})`} />
        <Tab label={`Gói makeup (${results.services.length})`} />
      </Tabs>

      <Box sx={{ mt: 2 }}>
        {tab === 0 && (
          <List>
            {results.users.length === 0 && (
              <Typography>Không tìm thấy tài khoản nào.</Typography>
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
                  }}
                >
                  Xem thêm
                </Button>
              </ListItem>
            ))}
          </List>
        )}
        {tab === 1 && (
          <List>
            {results.posts.length === 0 && (
              <Typography>Không tìm thấy bài đăng nào.</Typography>
            )}
            {results.posts.map((post) => (
              <ListItem key={post.id}>
                <Typography>{post.title}</Typography>
              </ListItem>
            ))}
          </List>
        )}
        {tab === 2 && (
          <List>
            {results.categories.length === 0 && (
              <Typography>Không tìm thấy chủ đề makeup nào.</Typography>
            )}
            {results.categories.map((cate) => (
              <ListItem key={cate.id}>
                <Typography>{cate.name}</Typography>
              </ListItem>
            ))}
          </List>
        )}
        {tab === 3 && (
          <List>
            {results.services.length === 0 && (
              <Typography>Không tìm thấy gói makeup nào.</Typography>
            )}
            {results.services.map((service) => (
              <ListItem key={service.id}>
                <Typography>{service.service_name}</Typography>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
}
