import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";


import CandidatesPage from "../CandidatesPage/CandidatesPage";
import JobDescriptionsPage from "../JobDescriptionsPage/JobDescriptionsPage";
import TopMatchesPage from "../TopMatchesPage/TopMatchesPage";
import Layout from "../Layout/Layout";
import LandingPage from "../LandingPage/LandingPage";
import ProtectedRoute from "../../component/Sidebar/ProtectedRoute";

export default function Routespage() {
  return (
    <div>
      <ToastContainer />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />

        {/* Protected Routes under Layout */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Layout />}>
            <Route index element={<CandidatesPage />} />

            <Route path="candidates" element={<CandidatesPage />} />
            <Route path="job-descriptions" element={<JobDescriptionsPage />} />
            <Route path="top-matches" element={<TopMatchesPage />} />
            {/* You can add settings route here if needed */}
            {/* <Route path="settings" element={<SettingsPage />} /> */}
          </Route>
        </Route>
      </Routes>
    </div>
  );
}
