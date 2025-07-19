import React from "react";
import { Button, Typography, Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import "./LandingPage.css";
import { useNavigate } from "react-router-dom";
// make sure this path is correcth
import { getIdToken } from "firebase/auth";
import { auth, provider, signInWithPopup } from "../../firebase";

const features = [
  "Reduce screening time by 80%",
  "Improve candidate quality scoring",
  "Integrate with existing HR tools",
  "Scale your recruitment process",
];

export default function LandingPage() {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await getIdToken(user);

      localStorage.setItem("accessToken", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/dashboard/candidates");
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      alert("Google Sign-In failed. Check your Firebase config.");
    }
  };

  return (
    <Box className="landing-root">
      <header className="landing-header">
        <Box className="logo-box">
          <img src="/logo.svg" alt="RecruitPro Logo" className="logo-img" />
          <Typography
            variant="h6"
            className="logo-text"
            sx={{ fontWeight: "bold" }}
          >
            RecruitPro
          </Typography>
        </Box>
      </header>
      <main className="landing-main">
        <Typography className="platform-badge" variant="caption">
          ✨ AI-Powered Recruitment Platform
        </Typography>
        <Typography
          className="main-title"
          variant="h2"
          sx={{ fontWeight: "bold" }}
        >
          Smart Resume Screening
          <br />& Candidate Matching
        </Typography>
        <Typography className="main-desc" variant="subtitle1">
          Transform your recruitment process with AI-powered resume analysis,
          intelligent candidate scoring, and seamless integrations.
        </Typography>
        <Box className="cta-buttons">
          <Button
            variant="contained"
            className="start-trial-btn"
            onClick={handleGoogleSignIn}
          >
            Sign In with Google
          </Button>
        </Box>
        <Box className="features-row">
          {features.map((feature, idx) => (
            <Box key={idx} className="feature-item">
              <CheckCircleIcon color="success" fontSize="small" />
              <Typography variant="body2">{feature}</Typography>
            </Box>
          ))}
        </Box>
      </main>
    </Box>
  );
}
