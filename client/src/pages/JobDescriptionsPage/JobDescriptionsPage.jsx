import React from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,

} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import "./JobDescriptionsPage.css";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";

const jobs = [
  {
    title: "Senior Software Engineer",
    status: "active",
    department: "Engineering",
    location: "San Francisco, CA",
    salary: "$120k - $180k",

    description:
      "We are seeking a Senior Software Engineer to join our growing team...",
    requirements: ["5+ years experience", "React/TypeScript", "Node.js", "AWS"],
    posted: "2024-01-15",
  },
  {
    title: "Product Manager",
    status: "active",
    department: "Product",
    location: "New York, NY",
    salary: "$100k - $150k",

    description: "Join our product team to drive innovation and strategy...",
    requirements: [
      "3+ years PM experience",
      "Analytics skills",
      "Technical background",
    ],
    posted: "2024-01-14",
  },
  {
    title: "UX Designer",
    status: "draft",
    department: "Design",
    location: "Remote",
    salary: "$80k - $120k",
    applicants: 0,
    description:
      "Looking for a talented UX Designer to create exceptional user experiences...",
    requirements: ["Figma expertise", "User research", "Design systems"],
    posted: "2024-01-13",
  },
];

export default function JobDescriptionsPage() {
  const [selectedJob, setSelectedJob] = React.useState(jobs[0].title);

  return (
    <Box className="jd-root">
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
          <input type="file" hidden />
        </Button>
        <Button variant="contained" className="submit-jd-btn">
          Submit
        </Button>
      </Box>

      {/* Job Cards */}
      <Box className="jd-list">
        {jobs.map((job, idx) => (
          <Card key={job.title} className="jd-card" elevation={0}>
            <CardContent className="jd-card-content">
              <Box className="jd-card-main">
                <Box className="jd-card-header">
                  <Typography variant="subtitle1" className="jd-job-title">
                    <b>{job.title}</b>
                  </Typography>
      
                </Box>
                <Box className="jd-card-meta">
                  <Typography variant="body2" className="jd-meta-item">
                    {job.department}
                  </Typography>
                  <Typography variant="body2" className="jd-meta-item">
                    {job.location}
                  </Typography>
                  <Typography variant="body2" className="jd-meta-item">
                    {job.salary}
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
                    {job.requirements.map((req) => (
                      <Chip key={req} label={req} className="jd-req-tag" />
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
                  <DownloadOutlinedIcon/>
                </IconButton>
              </Box>
            </CardContent>
      

            
          </Card>
        ))}
      </Box>
    </Box>
  );
}
