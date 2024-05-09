import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import '../style/doctorHistory.css';
import { jsPDF } from 'jspdf';

const DoctorHistory = (props) => {
    const { doctorId } = useParams();
    const { patientId } = props;

    const [expandedVisit, setExpandedVisit] = useState(null);

    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [timeSlots, setTimeSlots] = useState([]);
    const [selectedPatientHistory, setSelectedPatientHistory] = useState([])

    const [selectedTimeSlot, setSelectedTimeSlot] = useState('')
    const [selectedPatient, setSelectedPatient] = useState('');

    // fetching datas

    useEffect(() => {
        fetchSelectedDoctor();
        fetchTimeSlots();
        fetchSelectedPatient();
        fetchSelectedPatientHistory();
    }, [patientId]);

    const fetchSelectedDoctor = () => {
        axios.get(`http://localhost:3080/getselecteddoctor/${doctorId}`)
            .then(response => {
                setSelectedDoctor(response.data);
            })
            .catch(error => {
                console.error('Error fetching selected doctor:', error);
            });
    };

    const fetchTimeSlots = () => {
        axios.get(`http://localhost:3080/gettimeslotsforselecteddoctor/${doctorId}`)
          .then(response => {
            setTimeSlots(response.data);
          })
          .catch(error => {
            console.error('Error fetching time slots:', error);
          });
    }; 

    const fetchSelectedPatient = () => {
        axios.get(`http://localhost:3080/getselectedpatient/${patientId}`)
           .then(response => {
               setSelectedPatient(response.data);
           })
           .catch(error => {
               console.error('Error fetching doctors:', error);
           });
   }; 

   const fetchSelectedPatientHistory = () => {
    axios.get(`http://localhost:3080/getselectedpatienthistory/${patientId}`)
      .then(response => {
        setSelectedPatientHistory(response.data);
      })
      .catch(error => {
        console.error('Error fetching patient history:', error);
      });
  };

    const toggleVisitDetails = (index) => {
        setExpandedVisit(index === expandedVisit ? null : index);
    };

    return (
        <div className="history-container">
            <h1>History of {selectedPatient.patient_name}</h1>
            {selectedPatientHistory && selectedPatientHistory.length > 0 ? (
                <ul>
                    {selectedPatientHistory.map((visit, index) => (
                        <li key={index}>
                            <div className="visit-header" onClick={() => toggleVisitDetails(index)}>
                                <p>Date: {visit.date}</p>
                            </div>
                            {expandedVisit === index && (
                                <div className="visit-details">
                                    <p>Issue: {visit.issue}</p>
                                    <p>Advice: {visit.advice}</p>
                                    <p>Recipe: {visit.recipe}</p>
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

export default DoctorHistory;