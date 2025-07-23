import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { fetchUserWeights,updateUserWeights } from "../services/services";

const WeightEditor = () => {
  const [weightsData, setWeightsData] = useState({});
  const [selectedRole, setSelectedRole] = useState("fresher");
  const [currentWeights, setCurrentWeights] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const loadWeights = async () => {
      try {
        const response = await fetchUserWeights(); // { weights: {...} }
        setWeightsData(response.weights || {});
        setSelectedRole("fresher");
        setCurrentWeights(response.weights?.fresher || {});
      } catch (error) {
        console.error("Failed to fetch weights:", error);
        setMessage({ type: "error", text: "Failed to load weights." });
      } finally {
        setLoading(false);
      }
    };

    loadWeights();
  }, []);

  const handleRoleChange = (event) => {
    const role = event.target.value;
    setSelectedRole(role);
    setCurrentWeights(weightsData[role] || {});
    setMessage(null);
  };

  const handleWeightChange = (field, value) => {
    setCurrentWeights((prev) => ({
      ...prev,
      [field]: parseInt(value, 10) || 0,
    }));
    setMessage(null);
  };

  const handleUpdate = async () => {
    const total = Object.values(currentWeights).reduce(
      (sum, val) => sum + val,
      0
    );
    if (total !== 100) {
      setMessage({ type: "error", text: "Weights must sum up to 100." });
      return;
    }

    try {
      await updateUserWeights(selectedRole, currentWeights);
      setWeightsData((prev) => ({ ...prev, [selectedRole]: currentWeights }));
      setMessage({ type: "success", text: "Weights updated successfully." });
    } catch (error) {
      console.error("Update failed:", error);
      setMessage({ type: "error", text: "Failed to update weights." });
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box p={4}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom>
          Role-Based Weight Configuration
        </Typography>

        {message && (
          <Alert severity={message.type} sx={{ mb: 2 }}>
            {message.text}
          </Alert>
        )}

        <Box display="flex" gap={4} mt={2}>
          {/* Role Selection */}
          <Box flex={1}>
            <FormControl fullWidth>
              <InputLabel id="role-select-label">Select Role</InputLabel>
              <Select
                labelId="role-select-label"
                value={selectedRole}
                label="Select Role"
                onChange={handleRoleChange}
              >
                {Object.keys(weightsData).map((role) => (
                  <MenuItem key={role} value={role}>
                    {role
                      .replace("_", " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Weight Fields */}
          <Box flex={1} display="flex" flexDirection="column" gap={2}>
            {Object.entries(currentWeights).map(([field, value]) => (
              <TextField
                key={field}
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                type="number"
                value={value}
                onChange={(e) => handleWeightChange(field, e.target.value)}
                InputProps={{ inputProps: { min: 0, max: 100 } }}
                fullWidth
              />
            ))}
          </Box>
        </Box>

        {/* Submit */}
        <Box mt={4} textAlign="right">
          <Button variant="contained" color="primary" onClick={handleUpdate}>
            Update Weights
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default WeightEditor;
