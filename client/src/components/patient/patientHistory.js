import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import '../style/patientHistory.css';
import { jsPDF } from 'jspdf';

const PatientHistory = () => {
    const [historyData, setHistoryData] = useState([])
    const [selectedPatient, setSelectedPatient] = useState([])

    const { patientId } = useParams();
    
    const [expandedVisit, setExpandedVisit] = useState(null);

    useEffect(() => {
        fetchPatientHistory();
        fetchPatients();
      }, []);

    const fetchPatients = () => {
    axios.get(`http://localhost:3080/getselectedpatient/${patientId}`)
        .then(response => {
            setSelectedPatient(response.data);
        })
        .catch(error => {
            console.error('Error fetching doctors:', error);
        });
    };

    const fetchPatientHistory = () => {
        axios.get(`http://localhost:3080/getselectedpatienthistory/${patientId}`)
          .then(response => {
            setHistoryData(response.data);
          })
          .catch(error => {
            console.error('Error fetching patient history:', error);
          });
      };

    const toggleVisitDetails = (index) => {
        setExpandedVisit(index === expandedVisit ? null : index);
    };

    const downloadTheRecipe = (visit) => {
        
        const doc = new jsPDF();
        doc.text(`Date: ${visit.date}`, 10, 10);
        doc.text(`Issue: ${visit.issue}`, 10, 20);
        doc.text(`Advice: ${visit.advice}`, 10, 30);
        doc.text(`Recipe: ${visit.recipe}`, 10, 40);
        doc.text(`Doctor: ${visit.doctor_id}`, 10, 50);
        doc.text(`CRM Clinic, official recipe for client`, 10, 60);

        doc.save('visit_details.pdf');

    }

    return (
        <div className="history-container">
            <h1>History</h1>
            {historyData && historyData.length > 0 ? (
                <ul>
                    {historyData.map((visit, index) => (
                        <li key={index}>
                            <div className="visit-header" onClick={() => toggleVisitDetails(index)}>
                                <p>Date: {visit.date}</p>
                            </div>
                            {expandedVisit === index && (
                                <div className="visit-details">
                                    <p>Issue: {visit.issue}</p>
                                    <p>Advice: {visit.advice}</p>
                                    <p>Recipe: {visit.recipe}</p>
                                    <p>Doctor: {visit.doctor_id}</p>
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