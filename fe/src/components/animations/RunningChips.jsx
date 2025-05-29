import React from "react";
import { Box, Chip } from "@mui/material";
import { keyframes } from "@mui/system";

const scrollLeft = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const animationSpeeds = { slow: 60, medium: 40, fast: 20 };

const RunningChips = () => {
    return (
        <Box
            sx={{
                marginTop: { md: 5, sm: 5, xs: 2 },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: { lg: 4, md: 4, sm: 2, xs: 1 },
            }}
        >
            <Box
                sx={{
                    display: "inline-block",
                    width: "100%"
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        position: "relative",
                        mb: { lg: 3, md: 3, sm: 2, xs: 1 }
                    }}
                >
                    <Box
                        className="scroll-animation"
                        sx={{
                            display: "inline-flex",
                            animation: `${scrollLeft} ${animationSpeeds.medium}s linear infinite`,
                            animationPlayState: "running",
                            width: "calc(250px * 16)",
                            "&:hover": {
                                animationPlayState: "paused"
                            }
                        }}
                    >
                        {Array(16).fill(0).map((_, cycle) => (
                            <Box
                                key={cycle}
                                sx={{
                                    display: "flex",
                                    gap: { lg: 4, md: 4, sm: 2, xs: 1 },
                                    justifyContent: "center",
                                    px: { lg: 2, md: 1.5, sm: 1, xs: 0.5 }
                                }}
                            >
                                {Array(4).fill(0).map((_, index) => {
                                    const labels = ["#makeup", "#beauty", "#style", "#trends"];
                                    return (
                                        <Chip
                                            key={cycle * 4 + index}
                                            label={labels[index]}
                                            sx={{
                                                backgroundColor: (theme) => theme.palette.ochre.lightGrey,
                                                color: (theme) => theme.palette.ochre.dark,
                                                fontWeight: 500,
                                                borderRadius: "999px",
                                                transition: "transform 0.3s ease, background-color 0.3s ease",
                                                "&:hover": {
                                                    transform: "scale(1.05)",
                                                    backgroundColor: (theme) => theme.palette.ochre.light,
                                                },
                                            }}
                                            onClick={() => { }}
                                        />
                                    );
                                })}
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default RunningChips;