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

} from "@mui/material";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import StarIcon from "@mui/icons-material/Star";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import { getTopScoreCandidates } from "../services/services";
import "./TopMatchesPage.css";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";




export default function TopMatchesPage({ jd_id, onBack }) {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openResumeDialog, setOpenResumeDialog] = useState(false);
  const [selectedResumeUrl, setSelectedResumeUrl] = useState("");

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

    if (jd_id) {
      loadTopScores();
    }
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
        <Box className="topmatches-header-actions">
 
        </Box>
      </Box>

      {/* Candidate Cards */}
      <Box className="topmatches-list">
        {candidates.map((c, idx) => (
          <Card key={c.candidate_id} className="topmatch-card" elevation={0}>
            <CardContent className="topmatch-card-content">
              <Box className="topmatch-info">
                <Box className="topmatch-header">
                  <Box className="avatar-topmatch">
                    <Box className="topmatch-avatar-col">
                      <Avatar className="topmatch-avatar">{c.name?.[0]}</Avatar>
                    </Box>
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
                  <Typography variant="body2" className="topmatch-meta-item">
                    {c.email}
                  </Typography>
                  <Typography variant="body2" className="topmatch-meta-item">
                    <PhoneOutlinedIcon
                      sx={{ fontSize: 16, verticalAlign: "middle", mr: 0.5 }}
                    />
                    {c.contact_number}
                  </Typography>
                  <Typography variant="body2" className="topmatch-meta-item">
                    <LocationOnOutlinedIcon
                      sx={{ fontSize: 16, verticalAlign: "middle", mr: 0.5 }}
                    />
                    {c.location || "N/A"}
                  </Typography>
                  <Typography variant="body2" className="topmatch-meta-item">
                    <CalendarMonthOutlinedIcon
                      sx={{ fontSize: 16, verticalAlign: "middle", mr: 0.5 }}
                    />
                    {c.experience}
                  </Typography>
                </Box>

                <Box className="topmatch-analysis">
                  <Box className="topmatch-analysis-details">
                    <Box>
                      <Typography variant="body2" sx={{ color: "#7a7a7a" }}>
                        Key Strengths
                      </Typography>
                      <Box className="topmatch-tags">
                        {(c.key_strengths || []).map((str, idx) => (
                          <Chip
                            key={idx}
                            label={str}
                            className="topmatch-tag"
                          />
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
                </Box>

                <Divider sx={{ my: 2 }} />
                <Box className="topmatch-achievements">
                  <Typography
                    variant="subtitle2"
                    className="topmatch-achievements-title"
                  >
                    <b>Key Achievements</b>
                  </Typography>
                  <ul className="topmatch-achievements-list">
                    {(c.key_achievements || []).map((ach, i) => (
                      <li key={i}>{ach}</li>
                    ))}
                  </ul>
                </Box>

                <Box className="topmatch-education-row">
                  <Box>
                    <Typography
                      variant="subtitle2"
                      className="topmatch-education-title"
                    >
                      <b>Education</b>
                    </Typography>
                    <Typography variant="body2" className="topmatch-education">
                      {c.education}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box className="topmatch-score-col">
                <Typography
                  variant="h4"
                  className="topmatch-score"
                  sx={{ color: "#22c55e", fontWeight: 700 }}
                >
                  {c.total_score}
                </Typography>
                <Typography variant="caption" className="topmatch-score-label">
                  Match Score
                </Typography>
                <Box className="topmatch-actions">
                  <IconButton
                    onClick={() => handleViewResume(c.resume_url)}
                    color="primary"
                  >
                    <VisibilityOutlinedIcon />
                  </IconButton>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
      <Box>
        <Button variant="outlined" onClick={onBack} sx={{ mb: 2 }}>
          ← Back to Job Descriptions
        </Button>

        {/* Render top matches list */}
      </Box>
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
          <Button onClick={handleCloseResumeDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
