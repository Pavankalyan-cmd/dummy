import React from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  Divider,
  LinearProgress,
} from "@mui/material";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import StarIcon from "@mui/icons-material/Star";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import "./TopMatchesPage.css";

const candidates = [
  {
    rank: 1,
    initials: "SJ",
    name: "Sarah Johnson",
    role: "Senior Software Engineer",
    email: "sarah.j@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    experience: "5+ years",
    matchScore: 98,
    matchPercent: 95,
    responseRate: 95,
    keyStrengths: ["Technical Excellence", "Leadership", "Problem Solving"],
    skills: ["React", "TypeScript", "Node.js", "AWS", "+2 more"],
    achievements: [
      "Led migration to microservices architecture",
      "Reduced deployment time by 60%",
      "Mentored 5 junior developers",
    ],
    education: "MS Computer Science – Stanford University",
    availability: "2 weeks notice",
    salary: "$140k – $160k",
    lastActive: "2 days ago",
  },
  {
    rank: 2,
    initials: "MC",
    name: "Michael Chen",
    role: "Product Manager",
    email: "m.chen@email.com",
    phone: "+1 (555) 234-5678",
    location: "New York, NY",
    experience: "7+ years",
    matchScore: 92,
    matchPercent: 90,
    responseRate: 92,
    keyStrengths: ["Strategic Thinking", "Analytics", "Team Leadership"],
    skills: ["Strategy", "Analytics", "Leadership", "Agile", "+1 more"],
    achievements: [
      "Launched 3 successful products",
      "Improved team efficiency by 40%",
      "Managed cross-functional teams",
    ],
    education: "MBA – Harvard Business School",
    availability: "Immediate",
    salary: "$150k – $170k",
    lastActive: "1 day ago",
  },
];

export default function TopMatchesPage() {
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
          <Button
            variant="outlined"
            startIcon={<DownloadOutlinedIcon />}
            className="export-btn"
          >
            Export List
          </Button>
        </Box>
      </Box>

      {/* Candidate Cards */}
      <Box className="topmatches-list">
        {candidates.map((c, idx) => (
          <Card key={c.name} className="topmatch-card" elevation={0}>
            <CardContent className="topmatch-card-content">
              <Box className="topmatch-info">
                <Box className="topmatch-header">
                  <div className="avatar-topmatch">
                    <Box className="topmatch-avatar-col">
                      <Avatar className="topmatch-avatar">{c.initials}</Avatar>
                    </Box>
                  </div>
                  <div className="topmatch-names">
                    <Chip
                      label={`#${c.rank}`}
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
                      {c.role}
                    </Typography>
                  </div>
                </Box>
                <Box className="topmatch-meta">
                  <Typography variant="body2" className="topmatch-meta-item">
                    {c.email}
                  </Typography>
                  <Typography variant="body2" className="topmatch-meta-item">
                    <PhoneOutlinedIcon
                      sx={{ fontSize: 16, verticalAlign: "middle", mr: 0.5 }}
                    />
                    {c.phone}
                  </Typography>
                  <Typography variant="body2" className="topmatch-meta-item">
                    <LocationOnOutlinedIcon
                      sx={{ fontSize: 16, verticalAlign: "middle", mr: 0.5 }}
                    />
                    {c.location}
                  </Typography>
                  <Typography variant="body2" className="topmatch-meta-item">
                    <CalendarMonthOutlinedIcon
                      sx={{ fontSize: 16, verticalAlign: "middle", mr: 0.5 }}
                    />
                    {c.experience}
                  </Typography>
                </Box>
                <Box className="topmatch-analysis">
                  <Typography
                    variant="subtitle2"
                    className="topmatch-analysis-title"
                  >
                    <b>Match Analysis</b>
                  </Typography>
                  <Typography
                    variant="body2"
                    className="topmatch-progress-label"
                  >
                    <b>{c.matchPercent}% match</b>
                  </Typography>
                  <Box className="topmatch-progress-row">
                    <LinearProgress
                      variant="determinate"
                      value={c.matchPercent}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        background: "#e5e7eb",
                        "& .MuiLinearProgress-bar": { background: "#2563eb" },
                      }}
                      className="topmatch-progress"
                    />
                  </Box>
                  <Box className="topmatch-analysis-details">
                    <Box>
                      <Typography variant="body2" sx={{ color: "#7a7a7a" }}>
                        Key Strengths
                      </Typography>
                      <Box className="topmatch-tags">
                        {c.keyStrengths.map((str) => (
                          <Chip
                            key={str}
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
                        {c.skills.map((skill) => (
                          <Chip
                            key={skill}
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
                    {c.achievements.map((ach, i) => (
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
                  {c.matchScore}
                </Typography>
                <Typography variant="caption" className="topmatch-score-label">
                  Match Score
                </Typography>
                <Box className="topmatch-actions">
                  <Button
                    variant="outlined"
                    className="topmatch-action-btn"
                    startIcon={<DownloadOutlinedIcon />}
                  >
                    Download Resume
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
