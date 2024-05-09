import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import '../style/doctorReport.css'; // Import CSS file for styling 
import jsPDF from 'jspdf';

const DoctorReport = () => {
    const { doctorId } = useParams();

    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [timeSlots, setTimeSlots] = useState([]);

    // fetching datas

    useEffect(() => {
        fetchSelectedDoctor();
        fetchTimeSlotsBySelectedDoctor();
    }, []);

    const fetchSelectedDoctor = () => {
        axios.get(`http://localhost:3080/getselecteddoctor/${doctorId}`)
            .then(response => {
                setSelectedDoctor(response.data);
            })
            .catch(error => {
                console.error('Error fetching selected doctor:', error);
            });
    };

    const fetchTimeSlotsBySelectedDoctor = () => {
        axios.get(`http://localhost:3080/gettimeslotsforselecteddoctor/${doctorId}`)
          .then(response => {
            setTimeSlots(response.data);
          })
          .catch(error => {
            console.error('Error fetching time slots:', error);
          });
    }; 

    /*
    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        doc.text("Doctor's Daily Report" + new Date, 10, 10);
        doc.text("Doctor: " + selectedDoctor.doctor_name, 10, 20);
    
        let appointmentCount = 0; // Counter for numbering appointments
    
        selectedDoctor.timeSlots.forEach((slot, index) => {
            appointmentCount++; // Increment the appointment count
            if (slot.patient_id !== 0) {
                patientsData.forEach(patient => {
                    if (patient.patient_id === slot.patient_id) {
                        const lastVisit = patient.history[0];
                        if (lastVisit && isToday(lastVisit.date)) {
                            // Add numbering before patient card
                            doc.text(appointmentCount + ". Patient Name: " + patient.patient_name, 10, 30 + (index) * 50);
                            doc.text("Date: " + lastVisit.date, 20, 40 + (index) * 50);
                            doc.text("Issue: " + lastVisit.issue, 20, 50 + (index) * 50);
                            doc.text("Advice: " + lastVisit.advice, 20, 60 + (index) * 50);
                            doc.text("Recipe: " + lastVisit.recipe, 20, 70 + (index) * 50);
                        } 
                    }
                });
            } else {
                // If no appointment, write NO APPOINTMENT
                doc.text(appointmentCount + ". NO APPOINTMENT", 10, 30 + index * 50);
            }
        });
    
        doc.save("doctor_report.pdf");
        handleCloseSlot();
    };

    // Function to handle closing the selected time slot
    const handleCloseSlot = () => {
        const updatedDoctorsData = doctorsData.map(doctor => {
            if (doctor.doctor_id === parseInt(doctorId)) {
                const updatedTimeSlots = doctor.timeSlots.map(slot => {
                        return {
                            ...slot,
                            status: "not taken",
                            patient_id: 0
                        };
                });
                return {
                    ...doctor,
                    timeSlots: updatedTimeSlots
                };
            }
            return doctor;
        });

        const updatedData = {
            doctors: updatedDoctorsData,
            patients: patientsData
        };
        localStorage.setItem(`${dataName}`, JSON.stringify(updatedData));

        window.location.reload();

    };
    */

    return (
        <div className="doctor-report-container">
            <h1>Daily Report</h1>
            {selectedDoctor && (
                <div className="doctor-info">
                    
                    <div className="time-slots">
                        <h4>Schedule</h4>
                        <ul>
                            {timeSlots.map((slot, index) => (
                                <li key={index}>
                                    <span>{slot.time}</span>
                                    <p> {slot.patient_name ? slot.patient_name : slot.status} </p>
                                    <p> {slot.status === "done" ? slot.status : 'waiting'} </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
            <button className='down' onClick={() => {}}>Close the shift and Download Report </button>
        </div>
    );
};

export default DoctorReport;
