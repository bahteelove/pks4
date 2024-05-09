import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import "../style/patientin.css"

import PatientHistory from './patientHistory';
import PatientBooking from './patientBooking';

const PatientIn = () => {
    
    const navigate = useNavigate();    
    const [activeTab, setActiveTab] = useState('booking'); // active status "booking"

    // Function to handle tab change
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const getQuit = () => { navigate(`/`); }

    return (
        <div className="container">
            <div className="nav-bar">
                <button className={activeTab === 'booking' ? 'active' : ''} onClick={() => handleTabChange('booking')}>Booking</button>
                <button className={activeTab === 'history' ? 'active' : ''} onClick={() => handleTabChange('history')}>History</button>
                <button onClick={ () => getQuit() } > Quit </button>
            </div>
            <div className="content">
                { activeTab === 'booking' ? ( <PatientBooking /> ) : ( <PatientHistory /> ) }
            </div>
        </div>
    );
}

export default PatientIn;
