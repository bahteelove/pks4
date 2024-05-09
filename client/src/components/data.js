import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import jsPDF from 'jspdf';

import '../style/doctorReport.css'; // Import CSS file for styling 

const DoctorReport = () => {
    const { doctorId } = useParams();

    const [selectedPatient, setSelectedPatient] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    const dataName = "test";
    const data = localStorage.getItem(`${dataName}`);
    const parsedData = JSON.parse(data);

    const doctorsData = parsedData.doctors;
    const patientsData = parsedData.patients;

    

    const handleSelectPatient = (patientId, time) => {
        setSelectedPatient(patientId);
        setSelectedTime(time);
    };

    const [expandedVisit, setExpandedVisit] = useState(null);
    const toggleVisitDetails = (index) => {
        setExpandedVisit(index === expandedVisit ? null : index);
    };

    const doctor = doctorsData.find(doctor => doctor.doctor_id === parseInt(doctorId));
    const patient = patientsData.find(patient => patient.patient_id === parseInt(selectedPatient));

    return (
        <>
            <h1> Daily Report </h1>
            <div className="patient-cards-r">
                {doctor && doctor.timeSlots.map((slot, index) => (
                    <button
                        className="patient-card-r"
                        key={index}
                        onClick={() => handleSelectPatient(parseInt(slot.patient_id), slot.time)}
                    >
                        <div className="patient-info-r">
                            <h3>{patientsData.find(patient => patient.patient_id === parseInt(slot.patient_id))?.patient_name}</h3>
                            <p>Time: {slot.time}</p>
                        </div>
                    </button>
                ))}
            </div>
            {selectedPatient ? (
                patient && patient.history && patient.history.length > 0 ? (
                    <ul>
                        {patient.history.map((visit, index) => (
                            <li key={index}>
                                <div className="visit-header" onClick={() => toggleVisitDetails(index)}>
                                    <p>Date: {visit.date}</p>
                                </div>
                                {expandedVisit === index && (
                                    <div className="visit-details">
                                        <p>Issue: {visit.issue}</p>
                                        <p>Advice: {visit.advice}</p>
                                        <p>Recipe: {visit.recipe}</p>
                                        <p>Doctor: {visit.doctor}</p>
                                        <button > download the recipe </button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No history available</p>
                )
            ) : null}
        </>
    );
};

export default DoctorReport;
