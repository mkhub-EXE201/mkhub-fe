import {
  Box,
  InputAdornment,
  TextField,
  Grid,
} from "@mui/material";
import React, { useContext, useState, useEffect } from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../contexts/app.context";
import { TypeAnimation } from 'react-type-animation';
import { motion, AnimatePresence } from 'framer-motion';
import RunningChips from "../animations/RunningChips";
import AnimatedComponents from "../animations/AnimatedComponents";
import SlideIndicators from "../animations/SlideIndicators";
import PropTypes from 'prop-types';
import artistBanner from '../../assets/artist-banner2.jpg';
import headerBanner from '../../assets/header-banner2.jpg';
import headerbanner4 from '../../assets/header-banner4.jpg';
import headerBanner1 from '../../assets/header-banner1.jpg';
import headerBanner3 from '../../assets/header-banner3.jpg';
import artistBanner4 from '../../assets/artist-banner4.jpg';

// Hero slide data
const heroSlides = [
  {
    id: 1,
    leftImage: headerbanner4,
    rightImage: headerBanner,
    title: "Đẹp Mọi Khoảnh Khắc",
    subtitle: "Mang đến vẻ đẹp rạng ngời và sự tự tin qua dịch vụ trang điểm chuyên nghiệp.",
  },
  {
    id: 2,
    leftImage: artistBanner,
    rightImage: headerBanner3,
    title: "Đội Ngũ Chuyên Nghiệp",
    subtitle: "Makeup Artist dày dạn kinh nghiệm, sẵn sàng biến hoá bạn trong mọi dịp quan trọng.",
  },
  {
    id: 3,
    leftImage: headerBanner1,
    rightImage: artistBanner4,
    title: "Dịch Vụ Trang Điểm Cao Cấp",
    subtitle: "Dịch vụ makeup chuyên nghiệp cho mọi sự kiện, giúp bạn luôn tỏa sáng ở bất cứ nơi đâu.",
  }
];


const { AnimatedImage, AnimatedContent } = AnimatedComponents;

// Main layout component with synchronized sliding
const MainLayout = ({ currentSlide, onSlideChange, isAutoPlaying, setIsAutoPlaying }) => {
  // Auto-advance slides
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      onSlideChange((prev) => (prev + 1) % heroSlides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, onSlideChange]);

  const handleSlideChange = (slideIndex) => {
    onSlideChange(slideIndex);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      width: '100%',
      gap: { xs: 2, md: 0 },
      pt: { xs: 1, md: 6 },
      mt: { xs: 1, md: 0 },
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Left: Artist Banner (50% width) - Animated Image */}
      <Box
        sx={{
          width: { xs: '100%', md: '50%' },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          pr: { xs: 0, md: 2 },
          height: { md: '100%' },
          minHeight: '550px'
        }}
      >
        <AnimatedImage
          src={heroSlides[currentSlide].leftImage}
          alt="Artist Banner"
          slideKey={`slide-${currentSlide}`}
          delay={0.5}
          style={{
            width: '100%',
            height: '100%',
            minHeight: '550px',
            maxHeight: '550px',
            objectFit: 'cover',
            objectPosition: 'center',
            borderRadius: '20px',
            position: 'relative'
          }}
          containerSx={{
            width: '100%',
            height: '550px',
            borderRadius: '20px'
          }}
        />
      </Box>

      {/* Right: All other content (50% width) */}
      <Box
        sx={{
          width: { xs: '100%', md: '50%' },
          display: 'flex',
          flexDirection: 'column',
          pl: { xs: 0, md: 2 },
          height: '550px', // Match AnimatedImage height
          justifyContent: 'space-between',
          overflow: 'visible'
        }}
      >
        {/* Top: TypeAnimation and Search - Animated Text */}
        <Box
          sx={{
            display: { xs: 'none', md: 'block' },
          }}
        >
          <Box>
            <Box
              component="span"
              sx={{
                color: "white",
                fontSize: "40px",
                fontWeight: 600,
                textTransform: "uppercase",
                display: "block",
                marginBottom: "16px"
              }}
            >
              Makeup Hub
            </Box>
            <TypeAnimation
              sequence={[
                'Kết nối Makeup Artist', 2000,
                'Tìm kiếm dịch vụ phù hợp', 2000,
                'Đặt lịch nhanh chóng', 2000,
              ]}
              wrapper="span"
              cursor={true}
              repeat={Infinity}
              style={{
                color: "#f8bbd0",
                fontSize: "24px",
                fontWeight: 500,
                display: "block",
                marginBottom: "20px"
              }}
            />
          </Box>

          <TextField
            placeholder="Tìm kiếm dịch vụ..."
            size="small"
            sx={{
              width: '100%',
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

        {/* Running Chips - Positioned with enough space */}
        <Box sx={{
          flex: '0 0 auto',
          my: 0 // Add margin for better spacing
        }}>
          <RunningChips />
        </Box>

        {/* Bottom: Animated Content and Images */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          width: '100%',
          height: 'auto',
          minHeight: '280px',
          maxHeight: '280px',
          mt: 'auto',
          mb: 0
        }}>
          {/* Left Content Box - Animated */}
          <AnimatedContent
            slideKey={`slide-${currentSlide}`}
            delay={0.5}
            style={{ flex: 1 }}
          >
            <Box
              sx={{
                height: '100%',
                backgroundColor: "rgba(255, 255, 255, 0.25)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                padding: 3,
                borderRadius: 5,
                textAlign: "left",
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                position: 'relative',
                paddingBottom: '70px',
              }}
            >
              <Box>
                <h2 style={{ margin: '0 0 16px 0', fontSize: '24px' }}>
                  {heroSlides[currentSlide].title}
                </h2>
                <p style={{ margin: '0 0 24px 0', fontSize: '16px', lineHeight: 1.5 }}>
                  {heroSlides[currentSlide].subtitle}
                </p>
              </Box>
              <Box
                component="button"
                sx={{
                  position: 'absolute', // Position absolutely
                  bottom: '20px', // Fixed distance from bottom
                  left: '50%', // Center horizontally
                  transform: 'translateX(-50%)', // Center horizontally
                  width: 'fit-content',
                  backgroundColor: '#d9d9d9',
                  color: 'black',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '10px 24px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  '&:hover': {
                    backgroundColor: '#fec9d9',
                    transform: 'translateX(-50%) translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                  },
                  '&:active': {
                    transform: 'translateX(-50%) translateY(0)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  }
                }}
                onClick={() => navigate('/booking')}
              >
                Đặt lịch ngay
              </Box>
            </Box>
          </AnimatedContent>

          {/* Right Image Box - Animated */}
          <Box
            sx={{
              flex: 1,
              borderRadius: 5,
              position: 'relative',
              overflow: 'hidden',
              padding: 0
            }}
          >
            <AnimatedImage
              src={heroSlides[currentSlide].rightImage}
              alt="Product Image"
              slideKey={`slide-${currentSlide}`}
              delay={0.5}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center'
              }}
              containerSx={{
                width: '100%',
                height: '100%'
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

// Add PropTypes validation for MainLayout
MainLayout.propTypes = {
  currentSlide: PropTypes.number.isRequired,
  onSlideChange: PropTypes.func.isRequired,
  isAutoPlaying: PropTypes.bool.isRequired,
  setIsAutoPlaying: PropTypes.func.isRequired
};

export default function Headers({ isScrolled }) {
  const navigate = useNavigate();
  const { profile } = useContext(AppContext);

  // Slide state management
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const handleSlideChange = (slideIndex) => {
    setCurrentSlide(slideIndex);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: "auto", opacity: 1 }}
        animate={{
          height: isScrolled ? 0 : "auto",
          opacity: isScrolled ? 0 : 1,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut"
        }}
        style={{
          overflow: "hidden",
          zIndex: 998,
          position: "relative",
          marginTop: "-100px",
        }}
      >
        <Box
          sx={{
            backgroundImage:
              "linear-gradient(0deg, #FEBED0 -17.62%, #091B65 58.6%)",
            borderBottomLeftRadius: { xs: "20px", sm: "100px", md: "50px" },
            borderBottomRightRadius: { xs: "20px", sm: "100px", md: "50px" },
            paddingBottom: { xs: 1, sm: 1, md: 1 },
            minHeight: { xs: 'auto', md: '85vh' },
            display: 'flex',
            alignItems: 'center',
            paddingTop: { xs: "80px", sm: "90px", md: "40px" },
          }}
        >
          <Box sx={{
            py: { xs: 3, md: 5 },
            px: { xs: 2, sm: 4, md: 8 },
            width: '100%'
          }}>
            <Box sx={{
              position: 'relative',
            }}>
              <MainLayout
                currentSlide={currentSlide}
                onSlideChange={setCurrentSlide}
                isAutoPlaying={isAutoPlaying}
                setIsAutoPlaying={setIsAutoPlaying}
              />

              {/* Position SlideIndicators after MainLayout but still in the header area */}
              <Box sx={{
                width: '100%',
                position: 'relative',
                marginTop: '20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <SlideIndicators
                  currentSlide={currentSlide}
                  totalSlides={heroSlides.length}
                  onSlideChange={handleSlideChange}
                  containerSx={{
                    position: 'relative',
                    bottom: 'auto',
                    left: 'auto',
                    transform: 'none',
                    padding: '10px 0',
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* Display search field only on small screens */}
          <Grid item xs={12} sx={{ display: { xs: 'block', md: 'none' }, mt: 3, px: { xs: 2, sm: 5 } }}>
            <Box textAlign="center">
              <TypeAnimation
                sequence={[
                  'Kết nối makeup artist', 2000,
                  'Makeup hub', 1500,
                ]}
                wrapper="span"
                cursor={true}
                repeat={Infinity}
                style={{
                  color: "white",
                  fontSize: "32px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  display: "block",
                }}
              />
              <Box
                display="flex"
                gap={2}
                alignItems="center"
                justifyContent="center"
              >
                <TextField
                  placeholder="Tôi đang tìm kiếm dịch vụ..."
                  size="small"
                  sx={{
                    mt: 3,
                    width: "100%",
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
            </Box>
          </Grid>
        </Box>
      </motion.div>
    </AnimatePresence>
  );
}

Headers.propTypes = {
  isScrolled: PropTypes.bool
};

Headers.defaultProps = {
  isScrolled: false
};