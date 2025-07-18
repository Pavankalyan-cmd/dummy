import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";

import {
  getJobDescriptions,
  uploadJobDescriptions,
} from "../services/services";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./JobDescriptionsPage.css";

export default function JobDescriptionsPage() {
  const [jobs, setJobs] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const hasFetched = useRef(false);

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
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchJDs();
  }, []);

  const handleUpload = async () => {
    if (!selectedFiles.length)
      return toast.warn("Please select at least one file.");

    try {
      setLoading(true);
      toast.info("Uploading and analyzing job descriptions...");

      await uploadJobDescriptions(selectedFiles); // must be implemented in services.js
      toast.success("Job descriptions uploaded successfully!");

      setSelectedFiles([]);
      await fetchJDs();
    } catch (err) {
      toast.error("Failed to upload job descriptions.");
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
            multiple
            accept=".pdf,.doc,.docx"
            onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
          />
        </Button>

        <Button
          variant="contained"
          className="submit-jd-btn"
          disabled={!selectedFiles.length || loading}
          onClick={handleUpload}
        >
          {loading ? "Uploading..." : "Submit"}
        </Button>
        {selectedFiles.length > 0 && (
          <Box mt={1} sx={{ maxHeight: 100, overflowY: "auto" }}>
            {selectedFiles.map((file, idx) => (
              <Typography
                key={idx}
                variant="body2"
                sx={{
                  fontSize: "0.85rem",
                  color: "#555",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: 300,
                }}
              >
                📄 {file.name}
              </Typography>
            ))}
          </Box>
        )}
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

                <Tooltip
                  title={job.description || ""}
                  placement="bottom"
                  componentsProps={{
                    tooltip: {
                      sx: {
                        maxWidth: 700,
                        whiteSpace: "pre-wrap",
                      },
                    },
                  }}
                  arrow
                >
                  <Typography variant="body2" className="jd-desc">
                    {job.description}
                  </Typography>
                </Tooltip>

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
