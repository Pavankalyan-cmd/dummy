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
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { toast } from "react-toastify";

import { candidateResume } from "../services/services";

import "./CandidatesPage.css";

const candidates = [
  {
    initials: "SJ",
    name: "Sarah Johnson",
    status: "new",
    role: "Senior Software Engineer",
    description:
      "Experienced full-stack developer with expertise in React ecosystem and cloud technologies.",
    email: "sarah.j@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    applied: "2024-01-15",
    tags: ["React", "TypeScript", "Node.js", "AWS", "Docker"],
    education: "MS Computer Science – Stanford",
    score: 95,
    scoreColor: "#22C55E",
  },
  {
    initials: "MC",
    name: "Michael Chen",
    status: "reviewed",
    role: "Product Manager",
    description:
      "Strategic product leader with proven track record of launching successful digital products.",
    email: "m.chen@email.com",
    phone: "+1 (555) 234-5678",
    location: "New York, NY",
    applied: "2024-01-14",
    tags: ["Strategy", "Analytics", "Leadership", "Agile", "SQL"],
    education: "MBA – Harvard Business School",
  },
];

export default function CandidatesPage() {
  const [resumeFile, setResumeFile] = React.useState(null);
  const [uploading, setUploading] = React.useState(false);
  const [result, setResult] = React.useState(null);
  const [selectedCandidate, setSelectedCandidate] = React.useState(
    candidates[0].name
  );

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setResumeFile(file);
    setResult(null);
  };

const handleSubmit = async () => {
  if (!resumeFile) {
    toast.warning("Please select a resume to upload.");
    return;
  }

  try {
    setUploading(true);
    toast.info("Uploading and analyzing resume...");

    const res = await candidateResume(resumeFile);
    setResult(res);
    toast.success("Resume processed successfully!");

    console.log("Resume analysis result:", res);
  } catch (error) {
    console.error("Upload failed:", error);
    toast.error("Upload failed. Check console for details.");
  } finally {
    setUploading(false);
  }
};

  return (
    <Box className="candidates-root">
      {/* Header */}
      <Box className="candidates-header">
        <Box>
          <Typography variant="h5" className="candidates-title">
            <b>Candidates</b>
          </Typography>
          <Typography variant="body2" className="candidates-subtitle">
            Manage and review candidate applications
          </Typography>
        </Box>
      </Box>
      <Divider className="sidebar-divider" />

      {/* Controls */}
      <Box className="candidates-controls">
        <Button
          variant="outlined"
          component="label"
          startIcon={<CloudUploadIcon />}
          className="upload-btn"
        >
          Upload File
          <input
            type="file"
            hidden
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
          />
        </Button>

        <Button
          variant="contained"
          className="save-can-btn"
          onClick={handleSubmit}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Submit"}
        </Button>
      </Box>
      <Divider className="sidebar-divider" />

      {/* Result */}
      {result && (
        <Box
          mt={2}
          p={2}
          sx={{ backgroundColor: "#f9f9f9", borderRadius: "8px" }}
        >
          <Typography variant="h6">Upload Result</Typography>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </Box>
      )}

      {/* Candidates Count and View Toggle */}
      <Box className="candidates-count-row">
        <Typography variant="body2" className="candidates-count">
          Showing <b>{candidates.length}</b> of <b>{candidates.length}</b>{" "}
          candidates
        </Typography>
        <Box>
          <Button variant="outlined" className="view-toggle-btn">
            Grid View
          </Button>
          <Button variant="outlined" className="view-toggle-btn">
            List View
          </Button>
        </Box>
      </Box>

      {/* Candidate Cards */}
      <Box className="candidates-list">
        {candidates.map((c) => (
          <Card key={c.name} className="candidate-card" elevation={0}>
            <CardContent className="candidate-card-content">
              <Avatar className="candidate-avatar">{c.initials}</Avatar>
              <Box className="candidate-info">
                <Box className="candidate-header">
                  <Typography variant="subtitle1" className="candidate-name">
                    <b>{c.name}</b>
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  className="candidate-role"
                  sx={{ fontWeight: 600, color: "#2563eb" }}
                >
                  {c.role}
                </Typography>
                <Typography variant="body2" className="candidate-desc">
                  {c.description}
                </Typography>
                <Box className="candidate-meta">
                  <Typography variant="body2" className="candidate-meta-item">
                    {c.email}
                  </Typography>
                  <Typography variant="body2" className="candidate-meta-item">
                    {c.phone}
                  </Typography>
                  <Typography variant="body2" className="candidate-meta-item">
                    {c.location}
                  </Typography>
                  <Typography variant="body2" className="candidate-meta-item">
                    Applied {c.applied}
                  </Typography>
                </Box>
                <Box className="candidate-tags">
                  {c.tags.map((tag) => (
                    <Chip key={tag} label={tag} className="candidate-tag" />
                  ))}
                </Box>
                <Typography variant="body2" className="candidate-education">
                  <b>Education:</b> {c.education}
                </Typography>
              </Box>
              <Box className="candidate-score-col">
                <Box className="candidate-actions">
                  <IconButton>
                    <VisibilityOutlinedIcon />
                  </IconButton>
                  <IconButton>
                    <DownloadOutlinedIcon />
                  </IconButton>
                  <IconButton>
                    <DeleteOutlineOutlinedIcon />
                  </IconButton>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
