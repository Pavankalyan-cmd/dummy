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
  console.log(idToken,"token at frontend")
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
