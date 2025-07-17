import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { getJobDescriptions, uploadJobDescription } from "../services/services";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./JobDescriptionsPage.css";

export default function JobDescriptionsPage() {
  const [jobs, setJobs] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchJDs = async () => {
    try {
      setLoading(true);
      const data = await getJobDescriptions();
      setJobs(data);
    } catch (err) {
      toast.error("Failed to fetch job descriptions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJDs();
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) return toast.warn("Please select a file first.");
    try {
      setLoading(true);
      const jdData = await uploadJobDescription(selectedFile);
      setJobs((prev) => [...prev, jdData]);
      toast.success("Job description uploaded successfully!");
      setSelectedFile(null);
    } catch (err) {
      toast.error("Failed to upload job description.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="jd-root">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <Box className="jd-header">
        <Box>
          <Typography variant="h5" className="jd-title">
            <b>Job Descriptions</b>
          </Typography>
          <Typography variant="body2" className="jd-subtitle">
            Create and manage job postings
          </Typography>
        </Box>
      </Box>

      {/* Controls Row */}
      <Box className="jd-controls">
        <Button
          variant="outlined"
          component="label"
          startIcon={<CloudUploadIcon />}
          className="upload-jd-btn"
        >
          Upload JD
          <input
            type="file"
            hidden
            accept=".pdf,.doc,.docx"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
        </Button>

        <Button
          variant="contained"
          className="submit-jd-btn"
          disabled={!selectedFile || loading}
          onClick={handleUpload}
        >
          {loading ? <CircularProgress size={20} /> : "Submit"}
        </Button>
      </Box>

      {/* Job Cards */}
      <Box className="jd-list">
        {jobs.length === 0 && !loading && (
          <Typography variant="body2" sx={{ mt: 2 }}>
            No job descriptions found.
          </Typography>
        )}

        {jobs.map((job, idx) => (
          <Card key={job.jd_id || idx} className="jd-card" elevation={0}>
            <CardContent className="jd-card-content">
              <Box className="jd-card-main">
                <Box className="jd-card-header">
                  <Typography variant="subtitle1" className="jd-job-title">
                    <b>{job.jobtitle}</b>
                  </Typography>
                  {job.company && (
                    <Typography
                      variant="body2"
                      className="jd-meta-item"
                      sx={{ color: "#888" }}
                    >
                      {job.company}
                    </Typography>
                  )}
                </Box>

                <Box className="jd-card-meta">
                  <Typography variant="body2" className="jd-meta-item">
                    {job.location || "Location not specified"}
                  </Typography>
                  <Typography variant="body2" className="jd-meta-item">
                    {job.salary_range || "Salary not specified"}
                  </Typography>
                </Box>

                <Typography variant="body2" className="jd-desc">
                  {job.description}
                </Typography>

                <Box className="jd-req-row">
                  <Typography variant="body2" className="jd-req-label">
                    <p>Key Requirements:</p>
                  </Typography>
                  <Box className="jd-req-tags">
                    {job.required_experience && (
                      <Chip
                        label={job.required_experience}
                        className="jd-req-tag"
                      />
                    )}
                    {job.required_skills?.map((skill, i) => (
                      <Chip key={i} label={skill} className="jd-req-tag" />
                    ))}
                  </Box>
                </Box>
              </Box>

              <Box className="jd-card-actions">
                <IconButton>
                  <VisibilityOutlinedIcon />
                </IconButton>
                <IconButton>
                  <DeleteOutlineOutlinedIcon />
                </IconButton>
                <IconButton>
                  <DownloadOutlinedIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
