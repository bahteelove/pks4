import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import '../style/patientHistory.css';
import { jsPDF } from 'jspdf';

const PatientHistory = () => {

    const dataName = "test"; // Data name for local storage

    const { patientId } = useParams();
    const data = localStorage.getItem(dataName); 
    const parsedData = JSON.parse(data);
    const patientsData = parsedData.patients;
    const patient = patientsData.find(patient => patient.patient_id === parseInt(patientId));

    const [expandedVisit, setExpandedVisit] = useState(null);

    const toggleVisitDetails = (index) => {
        setExpandedVisit(index === expandedVisit ? null : index);
    };

    const downloadTheRecipe = (visit) => {
        
        const doc = new jsPDF();
        doc.text(`Date: ${visit.date}`, 10, 10);
        doc.text(`Issue: ${visit.issue}`, 10, 20);
        doc.text(`Advice: ${visit.advice}`, 10, 30);
        doc.text(`Recipe: ${visit.recipe}`, 10, 40);
        doc.text(`Doctor: ${visit.doctor}`, 10, 50);
        doc.text(`CRM Clinic, official recipe for client`, 10, 60);

        doc.save('visit_details.pdf');

    }

    return (
        <div className="history-container">
            <h1>History</h1>
            {patient.history && patient.history.length > 0 ? (
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
                                    <button onClick={ () => downloadTheRecipe(visit) } > download the recipe </button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No history available</p>
            )}
        </div>
    );
}

export default PatientHistory;