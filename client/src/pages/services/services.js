import { getAuth } from "firebase/auth";
import axios from "axios";

const API_BASE = process.env.REACT_APP_BASE_URL;

export const candidateResume = async (resumeFile) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) throw new Error("User not authenticated");

  const idToken = await user.getIdToken();

  const formData = new FormData();
  formData.append("resume", resumeFile);
  try {
    const response = await axios.post(
      `${API_BASE}/api/candidate-resume`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error analyzing resume and JD:",
      error.response?.data || error.message
    );
    throw error;
  }
};


export const getCandidateResumes = async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) throw new Error("User not authenticated");

  const idToken = await user.getIdToken();

  try {
    const response = await axios.get(`${API_BASE}/api/candidate-resumes`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    console.log(response.data.candidates);
    return response.data.candidates; // Return just the list
  } catch (error) {
    console.error(
      "Error fetching candidate resumes:",
      error.response?.data || error.message
    );
    throw error;
  }
};





export const getJobDescriptions = async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) throw new Error("User not authenticated");

  const idToken = await user.getIdToken();

  try {
    const response = await axios.get(`${API_BASE}/api/job-descriptions`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    console.log(response.data.job_descriptions);
    return response.data.job_descriptions; // Return just the JD list
  } catch (error) {
    console.error(
      "Error fetching job descriptions:",
      error.response?.data || error.message
    );
    throw error;
  }
};



export const uploadJobDescription = async (file) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) throw new Error("User not authenticated");

  const idToken = await user.getIdToken();

  const formData = new FormData();
  formData.append("jd_file", file); // key name must match FastAPI param

  try {
    const response = await axios.post(`${API_BASE}/api/upload-jd`, formData, {
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Uploaded JD:", response.data.jd_data);
    return response.data.jd_data;
  } catch (error) {
    console.error(
      "Error uploading JD file:",
      error.response?.data || error.message
    );
    throw error;
  }
};

