import React from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { auth, provider, signInWithPopup } from "../../firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "/Users/pavankalyanvandanapu/Desktop/recruitpro/client/src/pages/SignInPage/ SignInPage.css";

export default function SignInPage() {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      toast.success("Login successful");
      navigate("/dashboard/upload");
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      toast.error("Login failed");
    }
  };

  return (
    <Box className="signin-root">
      <Box className="signin-card-wrapper">
        <Card className="signin-card" elevation={3}>
          <CardContent>
            <Box className="signin-logo-row">
              <img
                src="/logo.svg"
                alt="RecruitPro Logo"
                className="signin-logo"
              />
            </Box>
            <Typography variant="h5" className="signin-title">
              <b>Sign In to RecruitPro</b>
            </Typography>
            <Typography variant="body2" className="signin-subtitle">
              Access your account with secure SSO login
            </Typography>

            <Box className="signin-btns">
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                className="signin-sso-btn"
                onClick={handleGoogleSignIn}
              >
                Sign in with Google
              </Button>
            </Box>

            <Divider className="signin-divider" />
            <Typography variant="caption" className="signin-footer">
              By signing in, you agree to our Terms of Service and Privacy
              Policy.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

