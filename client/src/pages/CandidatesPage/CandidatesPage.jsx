import React, { useEffect, useState, useRef } from "react";
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
  Modal,
  Backdrop,
  Tooltip
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { toast } from "react-toastify";
import { candidateResume, getCandidateResumes,deleteCandidate } from "../services/services";
import "./CandidatesPage.css";
export default function CandidatesPage() {
  const [resumeFiles, setResumeFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const hasFetched = useRef(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedResumeUrl, setSelectedResumeUrl] = useState(null);
  const [showFull, setShowFull] = useState(false);
  const fileInputRef = useRef(null);


  const toggleShow = () => setShowFull((prev) => !prev);


  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
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
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this candidate?"))
      return;

    try {
      await deleteCandidate(id);
      toast.success("Candidate deleted successfully");
      setCandidates((prev) => prev.filter((c) => c.candidate_id !== id));
    } catch (err) {
      toast.error("Failed to delete candidate.");
      console.error(err);
    }
  };


  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setResumeFiles(files);
  };

  const handleSubmit = async () => {
    if (resumeFiles.length === 0) {
      toast.warning("Please select one or more resumes to upload.");
      return;
    }

    try {
      setUploading(true);
      toast.info("Uploading and analyzing resumes...");

      await candidateResume(resumeFiles);
      toast.success("Resumes processed successfully!");

      const updated = await getCandidateResumes();
      setCandidates(updated);
      setResumeFiles([]); 
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; 
      }
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

      <Box className="candidates-controls">
        <Button
          variant="outlined"
          component="label"
          startIcon={<CloudUploadIcon />}
          className="upload-btn"
        >
          Upload File(s)
          <input
            type="file"
            hidden
            multiple
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            ref={fileInputRef}
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
        {resumeFiles.length > 0 && (
          <Box mt={1} sx={{ maxHeight: 100, overflowY: "auto" }}>
            {resumeFiles.map((file, idx) => (
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

      <Box className="candidates-count-row">
        <Typography variant="body2" className="candidates-count">
          Showing <b>{candidates.length}</b> of <b>{candidates.length}</b>{" "}
          candidates
        </Typography>
      </Box>

      <Box className="candidates-list">
        {candidates.map((c) => (
          <Card
            key={c.candidate_id || c.id || c.name}
            className="candidate-card"
            elevation={0}
          >
            <CardContent className="candidate-card-content">
              <Avatar className="candidate-avatar">
                {c.name
                  ?.split(" ")
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
                <Typography
                  variant="body2"
                  className="candidate-desc"
                  sx={{
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: showFull ? "unset" : 2,
                    WebkitBoxOrient: "vertical",
                    textOverflow: "ellipsis",
                  }}
                >
                  {c.professional_summary}
                </Typography>

                {c.professional_summary?.length > 150 && (
                  <Typography
                    variant="body2"
                    color="primary"
                    sx={{ cursor: "pointer", mt: 0.5 }}
                    onClick={toggleShow}
                  >
                    {showFull ? "Show less" : "Show more"}
                  </Typography>
                )}
                <Box className="candidate-meta">
                  <Typography variant="body2" className="candidate-meta-item">
                    {c.email}
                  </Typography>
                  <Typography variant="body2" className="candidate-meta-item">
                    {c.contact_number}
                  </Typography>
                  <Typography variant="body2" className="candidate-meta-item">
                    {c.location || c.Location}
                  </Typography>
                </Box>
                <Box className="candidate-tags">
                  {c.technical_skills?.map((tag) => (
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
                  <Tooltip title="View Resume" arrow>
                    <IconButton
                      onClick={() => {
                        setSelectedResumeUrl(c.resume_url);
                        setOpenModal(true);
                      }}
                    >
                      <DescriptionOutlinedIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete Candidate" arrow>
                    <IconButton onClick={() => handleDelete(c.candidate_id)}>
                      <DeleteOutlineOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            height: "80%",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 2,
          }}
        >
          {selectedResumeUrl ? (
            <iframe
              src={selectedResumeUrl}
              title="Resume Preview"
              width="100%"
              height="100%"
              style={{ border: "none" }}
            />
          ) : (
            <Typography>Loading resume...</Typography>
          )}
        </Box>
      </Modal>
    </Box>
  );
}
