/* eslint-disable react/prop-types */
import React, { useContext } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import NotificationsNoneOutlined from "@mui/icons-material/NotificationsNoneOutlined";
import AccountCircleOutlined from "@mui/icons-material/AccountCircleOutlined";
import CalendarMonthOutlined from "@mui/icons-material/CalendarMonthOutlined";
import logo from "../assets/logo.png";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { Avatar, Button, InputAdornment, TextField } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DashboardCustomizeOutlined from "@mui/icons-material/DashboardCustomizeOutlined";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../contexts/app.context";
import path from "../constants/path";
import Popover from "../components/Popover";
import userApis from "../apis/users.apis";
import HttpStatusCode from "../constants/httpStatus";
import toast from "react-hot-toast";
const drawerWidth = 300;
const adminMenus = [
  { label: "Dashboard", icon: <DashboardIcon />, to: path.adminDashboard },

  {
    label: "Tài khoản",
    icon: <AccountCircleOutlined />,
    to: path.userManagement,
  },
  {
    label: "Lịch hẹn",
    icon: <CalendarMonthOutlined />,
    to: path.adminDashboard,
  },
  {
    label: "Kiểm duyệt Makeup Artist",
    icon: <VerifiedUserIcon />,
    to: path.artistManagement,
  },
  {
    label: "Chủ đề makeup",
    icon: <DashboardCustomizeOutlined />,
    to: path.categoryManagement,
  },
];

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),

  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function AdminLayout({ children }) {
  const { profile, setIsAuthenticated, setProfile } = useContext(AppContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleLogout = async () => {
    const response = await userApis.logout();
    if (response.status === HttpStatusCode.Ok) {
      setIsAuthenticated(false);
      setProfile(null);
      toast.success(response.data.message, {
        position: "top-center",
      });
    }
    navigate(path.home);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              {
                marginRight: 5,
              },
              open && { display: "none" },
            ]}
          >
            <MenuIcon />
          </IconButton>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            {/* Search */}
            <Box
              display="flex"
              alignItems="center"
              gap={2}
              sx={{ flexGrow: 1 }}
            >
              <TextField
                placeholder="Tìm kiếm"
                size="small"
                sx={{
                  width: {
                    xs: "100%",
                    sm: "80%",
                    md: "600px",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#fff",
                      borderRadius: "20px",
                    },
                    "&:hover fieldset": {
                      borderColor: "#fff",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#fff",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#fff",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#fff",
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: "#fff",
                    opacity: 1,
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchOutlinedIcon sx={{ color: "white" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Notification Bell */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid white",
                borderRadius: "50%",
                padding: 1,
              }}
            >
              <NotificationsNoneOutlined
                style={{ width: 25, height: 25, color: "white" }}
              />
            </Box>
          </Box>
          <Box
            sx={{
              marginX: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
              "&:hover": { opacity: 0.8 },
            }}
          >
            <Popover
              renderPopover={
                <Box
                  sx={{
                    position: "relative",
                    borderRadius: 1,
                    bgcolor: "white",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      color: "black",
                    }}
                  >
                    <Link to={path.profile}>
                      <Button
                        sx={{
                          py: 1,
                          px: 1.5,
                          justifyContent: "flex-start",
                          color: "black",
                          textTransform: "none",
                          "&:hover": {
                            backgroundColor: (theme) => theme.palette.lightGray,
                          },
                        }}
                      >
                        Thông tin tài khoản
                      </Button>
                    </Link>

                    <Button
                      onClick={() => handleLogout()}
                      sx={{
                        mt: 1,
                        py: 1,
                        px: 1.5,
                        justifyContent: "flex-start",
                        color: "black",
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: (theme) => theme.palette.lightGray,
                        },
                      }}
                    >
                      Đăng xuất
                    </Button>
                  </Box>
                </Box>
              }
            >
              <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
                <Avatar
                  src={profile?.avatar_url}
                  alt="avatar"
                  sx={{
                    width: 40,
                    height: 40,
                  }}
                />
                <Typography sx={{ fontSize: 12 }}>
                  {profile?.last_name} {profile?.first_name}
                </Typography>
              </Box>
            </Popover>
            <KeyboardArrowDownIcon />
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <img
              src={logo}
              width={100}
              height="auto"
              style={{ marginLeft: 0 }}
            />
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </Box>
        </DrawerHeader>
        <Divider />
        <Typography sx={{ color: "#667085", paddingX: 3, marginTop: 2 }}>
          Menu
        </Typography>

        <List>
          {adminMenus.map((menu) => (
            <ListItem key={menu.label} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                component={Link}
                to={menu.to}
                sx={{
                  minHeight: 48,
                  px: 2.5,
                  justifyContent: open ? "initial" : "center",
                }}
              >
                <ListItemIcon
                  sx={[
                    {
                      minWidth: 0,
                      justifyContent: "center",
                    },
                    open
                      ? {
                          mr: 3,
                        }
                      : {
                          mr: "auto",
                        },
                  ]}
                >
                  {menu.icon}
                </ListItemIcon>

                <ListItemText
                  primary={menu.label}
                  sx={[
                    open
                      ? {
                          opacity: 1,
                        }
                      : {
                          opacity: 0,
                        },
                  ]}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Box sx={{ display: "flex", flexDirection: "row", gap: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
