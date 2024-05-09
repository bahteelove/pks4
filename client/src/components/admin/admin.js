import React, { useState } from 'react';
import axios from 'axios';

import "../style/admin.css"

import Doctor from './doctorsData';
import Patient from './patientsData';
import TimeSlots from './timeSlotsData';
import PatientHistory from './patientsHistoriesData';

function Admin() {
  const [activeTab, setActiveTab] = useState("");

  return (
    <div className="container">
      <button className={`module-button ${activeTab === "Doctor" ? "active" : ""}`} onClick={() => setActiveTab("Doctor")}>Doctor</button>
      <button className={`module-button ${activeTab === "TimeSlots" ? "active" : ""}`} onClick={() => setActiveTab("TimeSlots")}>Time Slots</button>
      <button className={`module-button ${activeTab === "Patient" ? "active" : ""}`} onClick={() => setActiveTab("Patient")}>Patient</button>
      <button className={`module-button ${activeTab === "PatientHistory" ? "active" : ""}`} onClick={() => setActiveTab("PatientHistory")}>Patient History</button>

      {activeTab === "Doctor" && <Doctor />}
      {activeTab === "TimeSlots" && <TimeSlots />}
      {activeTab === "Patient" && <Patient />}
      {activeTab === "PatientHistory" && <PatientHistory />}
    </div>
  );
}

export default Admin;
