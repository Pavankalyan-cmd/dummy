import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import CandidatesPage from "../CandidatesPage/CandidatesPage";
import JobDescriptionsPage from "../JobDescriptionsPage/JobDescriptionsPage";
import TopMatchesPage from "../TopMatchesPage/TopMatchesPage";
import Layout from "../Layout/Layout";
import LandingPage from "../LandingPage/LandingPage";
import ProtectedRoute from "../../component/Sidebar/ProtectedRoute";
import Integrations from "../IntegrationsPage/Integrations";

export default function Routespage() {
  return (
    <div>
      <ToastContainer />

      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Layout />}>
            <Route index element={<CandidatesPage />} />

            <Route path="candidates" element={<CandidatesPage />} />
            <Route path="job-descriptions" element={<JobDescriptionsPage />} />
            <Route path="top-matches" element={<TopMatchesPage />} />
            <Route path="integrations" element={<Integrations/>}/>
          </Route>
        </Route>
      </Routes>
    </div>
  );
}
