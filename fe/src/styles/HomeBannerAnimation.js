import { keyframes } from '@mui/material/styles';

// Animation for the first row of hashtags
export const scrollLeft = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-250px * 8));
  }
`;

// Animation for the second row of hashtags
export const scrollLeft2 = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-220px * 8));
  }
`;

// Animation for fade-in effect
export const fadeIn = keyframes`
  to {
    opacity: 1;
  }
`;

// Animation speed configuration (in seconds)
export const animationSpeeds = {
    slow: 60,
    medium: 40,
    fast: 20
};