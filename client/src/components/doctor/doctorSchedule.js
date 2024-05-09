import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import DoctorHistory from './doctorHistory';
import DoctorPatientReport from './doctorPatientReport';

import '../style/doctorSchedule.css'; // Import CSS file for styling 

const DoctorSchedule = () => {
    const { doctorId } = useParams();

    const [activeTab, setActiveTab] = useState('report'); // active status "report"

    // get datas

    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [timeSlots, setTimeSlots] = useState([]);

    const [selectedTimeSlot, setSelectedTimeSlot] = useState('')
    const [selectedSlot, setSelectedSlot] = useState('');
    const [selectedPatient, setSelectedPatient] = useState('')

    // fetching datas

    useEffect(() => {
        fetchSelectedDoctor();
        fetchTimeSlots();
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

    const fetchTimeSlots = () => {
        axios.get(`http://localhost:3080/gettimeslotsforselecteddoctor/${doctorId}`)
          .then(response => {
            setTimeSlots(response.data);
          })
          .catch(error => {
            console.error('Error fetching time slots:', error);
          });
    }; 

    // Function to handle tab change
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <>
            <div className="container">
                <h2>Welcome, {selectedDoctor.doctor_name} </h2>
                <div className="patient-cards">
                    {timeSlots && timeSlots.map((slot, index) => (
                        <button
                            className="patient-card"
                            key={index}
                            onClick={() => {
                                setSelectedSlot(slot.id);
                                setSelectedPatient(slot.patient_id);
                            }}
                        >
                            <div className="patient-info">
                                <h3>{ slot.patient_name ? slot.patient_name : 'Not taken' }</h3>
                                <p>Time: {slot.time}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {selectedPatient ? (
                <div className="tab-container">
                    <div className="tab">
                        <button className={activeTab === 'report' ? 'active' : ''} onClick={() => handleTabChange('report')}>Report</button>
                        <button className={activeTab === 'history' ? 'active' : ''} onClick={() => handleTabChange('history')}>History</button>
                    </div>
                    <div className="content">
                        { activeTab === 'report' ? 
                        ( <DoctorPatientReport patientId={selectedPatient} slotId={selectedSlot} /> ) : 
                        ( <DoctorHistory patientId={selectedPatient} /> ) }
                    </div>
                </div>
            ) : ( <h2> This time slot has not booked </h2> )}
            
        </>
    );
}

export default DoctorSchedule;
