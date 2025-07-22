import React from "react";
import { Box, Typography, Button, Grid, Paper, Container } from "@mui/material";
import CloudSyncIcon from "@mui/icons-material/CloudSync";
import WorkIcon from "@mui/icons-material/Work";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";

export default function Integrations() {
  return (
    <Box
      sx={{
        minHeight: "100vh",

        py: 8,
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#5B21B6" }}
        >
          🌐 Integrations
        </Typography>

        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          Seamlessly connect RecruitPro with your favorite HR and payroll
          systems.
        </Typography>

        <Grid container spacing={4}>
          {/* Dayforce */}
          <Grid item xs={12} sm={6}>
            <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
              <CloudSyncIcon sx={{ fontSize: 40, color: "#5B21B6", mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: "medium" }}>
                Dayforce
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
                Sync employee data, job roles, and payroll status.
              </Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  mt: 2,
                  backgroundColor: "#5B21B6",
                  ":hover": { backgroundColor: "#4c1caa" },
                }}
              >
                loading...
              </Button>
            </Paper>
          </Grid>

          {/* Workday */}
          <Grid item xs={12} sm={6}>
            <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
              <WorkIcon sx={{ fontSize: 40, color: "#5B21B6", mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: "medium" }}>
                Workday
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
                Import job descriptions and automate interview scheduling.
              </Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  mt: 2,
                  backgroundColor: "#5B21B6",
                  ":hover": { backgroundColor: "#4c1caa" },
                }}
              >
                loading...
              </Button>
            </Paper>
          </Grid>

          {/* Add More integrations here */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3, textAlign: "center" }}>
              <IntegrationInstructionsIcon
                sx={{ fontSize: 40, color: "#5B21B6", mb: 1 }}
              />
              <Typography variant="h6" sx={{ fontWeight: "medium" }}>
                More integrations coming soon...
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
