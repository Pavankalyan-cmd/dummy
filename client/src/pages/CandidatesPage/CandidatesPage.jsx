import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { toast } from "react-toastify";

import { candidateResume, getCandidateResumes } from "../services/services";

import "./CandidatesPage.css";

export default function CandidatesPage() {
  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const data = await getCandidateResumes();
        setCandidates(data);
      } catch (err) {
        console.error("Failed to fetch resumes:", err);
        toast.error("Failed to fetch candidates.");
      }
    };

    fetchCandidates();
  }, []);

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
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Upload failed. Check console for details.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box className="candidates-root">
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

      <Box className="candidates-list">
        {candidates.map((c) => (
          <Card key={c.name} className="candidate-card" elevation={0}>
            <CardContent className="candidate-card-content">
              <Avatar className="candidate-avatar">
                {c.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </Avatar>
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
                  {c.designation}
                </Typography>
                <Typography variant="body2" className="candidate-desc">
                  {c.professional_summary}
                </Typography>
                <Box className="candidate-meta">
                  <Typography variant="body2" className="candidate-meta-item">
                    {c.email}
                  </Typography>
                  <Typography variant="body2" className="candidate-meta-item">
                    {c.contact_number}
                  </Typography>
                  <Typography variant="body2" className="candidate-meta-item">
                    {c.Location}
                  </Typography>
                </Box>
                <Box className="candidate-tags">
                  {c.technical_skills.map((tag) => (
                    <Chip key={tag} label={tag} className="candidate-tag" />
                  ))}
                </Box>
                <Typography variant="body2" className="candidate-education">
                  <b>Education:</b> {c.education?.[0]?.degree} –{" "}
                  {c.education?.[0]?.institution}
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
