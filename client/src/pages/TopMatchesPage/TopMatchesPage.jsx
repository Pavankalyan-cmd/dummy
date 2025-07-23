import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Divider,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { getTopScoreCandidates } from "../services/services";
import "./TopMatchesPage.css";

export default function TopMatchesPage({ jd_id, onBack }) {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openResumeDialog, setOpenResumeDialog] = useState(false);
  const [selectedResumeUrl, setSelectedResumeUrl] = useState("");
  const [scoreDialogOpen, setScoreDialogOpen] = useState(false);
  const [selectedBreakdown, setSelectedBreakdown] = useState(null);
  const [selectedTotal, setSelectedTotal] = useState(null);

  const handleViewResume = (resumeUrl) => {
    setSelectedResumeUrl(resumeUrl);
    setOpenResumeDialog(true);
  };

  const handleCloseResumeDialog = () => {
    setOpenResumeDialog(false);
    setSelectedResumeUrl("");
  };

  useEffect(() => {
    const loadTopScores = async () => {
      try {
        const data = await getTopScoreCandidates(jd_id);
        setCandidates(data.top_score_candidates || []);
      } catch (err) {
        console.error("Failed to load top scores", err);
      } finally {
        setLoading(false);
      }
    };

    if (jd_id) loadTopScores();
  }, [jd_id]);

  if (loading) {
    return (
      <Box className="topmatches-loading">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="topmatches-root">
      {/* Header */}
      <Box className="topmatches-header">
        <Box>
          <Typography variant="h5" className="topmatches-title">
            <StarIcon
              sx={{ color: "#fbbf24", mr: 1, verticalAlign: "middle" }}
            />
            <b>Top Matches</b>
          </Typography>
          <Typography variant="body2" className="topmatches-subtitle">
            Highest scoring candidates for your open positions
          </Typography>
        </Box>
      </Box>

      {/* Candidate Cards */}
      <Box className="topmatches-list">
        {candidates.map((c, idx) => (
          <Card key={c.candidate_id} className="topmatch-card" elevation={0}>
            <CardContent className="topmatch-card-content">
              <Box className="topmatch-info">
                <Box className="topmatch-header">
                  <Box className="topmatch-avatar-col">
                    <Avatar className="topmatch-avatar">{c.name?.[0]}</Avatar>
                  </Box>
                  <Box className="topmatch-names">
                    <Chip
                      label={`#${idx + 1}`}
                      size="small"
                      className="topmatch-rank-chip"
                      sx={{
                        background: "#fbbf24",
                        color: "#fff",
                        fontWeight: 700,
                        mt: 1,
                        width: "15%",
                      }}
                    />
                    <Typography variant="h5" className="topmatch-name">
                      <b>{c.name}</b>
                    </Typography>
                    <Typography
                      variant="h6"
                      className="topmatch-role"
                      sx={{ color: "#2563eb", fontWeight: 600 }}
                    >
                      {c.designation}
                    </Typography>
                  </Box>
                </Box>

                <Box className="topmatch-meta">
                  <Typography variant="body2">{c.email}</Typography>
                  <Typography variant="body2">
                    <PhoneOutlinedIcon
                      sx={{ fontSize: 16, verticalAlign: "middle", mr: 0.5 }}
                    />
                    {c.contact}
                  </Typography>
                  <Typography variant="body2">
                    <LocationOnOutlinedIcon
                      sx={{ fontSize: 16, verticalAlign: "middle", mr: 0.5 }}
                    />
                    {c.location || "N/A"}
                  </Typography>
                  <Typography variant="body2">
                    <Tooltip title="Experience">
                      <CalendarMonthOutlinedIcon
                        sx={{ fontSize: 16, verticalAlign: "middle", mr: 0.5 }}
                      />
                    </Tooltip>
                    {Math.round(c.experience)} yrs
                  </Typography>
                </Box>

                <Box className="topmatch-analysis">
                  <Box>
                    <Typography variant="body2" sx={{ color: "#7a7a7a" }}>
                      Key Strengths
                    </Typography>
                    <Box className="topmatch-tags">
                      {(c.key_strengths || []).map((str, idx) => (
                        <Chip key={idx} label={str} className="topmatch-tag" />
                      ))}
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: "#7a7a7a" }}>
                      Skills Match
                    </Typography>
                    <Box className="topmatch-tags">
                      {(c.skills_matched || []).map((skill, idx) => (
                        <Chip
                          key={idx}
                          label={skill}
                          className="topmatch-skill-tag"
                        />
                      ))}
                    </Box>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box className="topmatch-achievements">
                  <Typography variant="subtitle2">
                    <b>Key Achievements</b>
                  </Typography>
                  <ul>
                    {(c.key_achievements || []).map((ach, i) => (
                      <li key={i}>{ach}</li>
                    ))}
                  </ul>
                </Box>

                <Box>
                  <Typography variant="subtitle2">
                    <b>Education</b>
                  </Typography>
                  <Typography variant="body2">{c.education}</Typography>
                </Box>
              </Box>

              <Box className="topmatch-score-col">
                <Typography
                  variant="h4"
                  sx={{ color: "#22c55e", fontWeight: 700 }}
                >
                  {c.total_score}
                </Typography>
                <Typography variant="caption">Match Score</Typography>
                <Button
                  variant="outlined"
                  className="match-btn"
      
                  onClick={() => {
                    setSelectedBreakdown(c.score_breakdown);
                    setSelectedTotal(c.total_score);
                    setScoreDialogOpen(true);
                  }}
                >
                  Score Breakdown
                </Button>
                <IconButton
                  onClick={() => handleViewResume(c.resume_url)}
                  color="primary"
                >
                  <DescriptionOutlinedIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Back Button */}
      <Box>
        <Button variant="outlined" onClick={onBack} sx={{ mb: 2, mt: 4 }}>
          ← Back to Job Descriptions
        </Button>
      </Box>

      {/* Resume Dialog */}
      <Dialog
        open={openResumeDialog}
        onClose={handleCloseResumeDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Candidate Resume</DialogTitle>
        <DialogContent dividers>
          {selectedResumeUrl ? (
            <iframe
              src={selectedResumeUrl}
              width="100%"
              height="600px"
              style={{ border: "none" }}
              title="Resume Viewer"
            />
          ) : (
            <p>Resume not available</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResumeDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Score Breakdown Dialog */}
      <Dialog
        open={scoreDialogOpen}
        onClose={() => setScoreDialogOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Score Breakdown</DialogTitle>
        <DialogContent>
          <Box display="flex" fontWeight="bold" mb={1}>
            <Typography sx={{ flex: 1 }}>Title</Typography>
            <Typography sx={{ flex: 1, textAlign: "center" }}>
              User Score
            </Typography>
            <Typography sx={{ flex: 1, textAlign: "center" }}>
              Weight
            </Typography>
            <Typography sx={{ flex: 1, textAlign: "right" }}>
              Weighted
            </Typography>
          </Box>
          {selectedBreakdown &&
            Object.entries(selectedBreakdown).map(([key, val]) => (
              <Box key={key} display="flex" py={0.5}>
                <Typography sx={{ flex: 1, textTransform: "capitalize" }}>
                  {key}
                </Typography>
                <Typography sx={{ flex: 1, textAlign: "center" }}>
                  {val.score}
                </Typography>
                <Typography sx={{ flex: 1, textAlign: "center" }}>
                  {val.weight}
                </Typography>
                <Typography sx={{ flex: 1, textAlign: "right" }}>
                  {val.weighted}
                </Typography>
              </Box>
            ))}
          <Divider sx={{ my: 2 }} />
          <Box display="flex" fontWeight="bold">
            <Typography sx={{ flex: 3 }}>Total Score</Typography>
            <Typography sx={{ flex: 1, textAlign: "right" }}>
              {selectedTotal}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setScoreDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
