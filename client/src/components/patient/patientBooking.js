import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import '../style/patientBooking.css';
import NewBooking from './newBooking';

const PatientBooking = () => {
    const [fullName, setFullName] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [timeSlotsData, setTimeSlotsData] = useState([]);

    const { patientId } = useParams();
    
    const [selectedDoctor, setSelectedDoctor] = useState({
        doctor_id : "",
        doctor_name : "",
        specialization : "",
        avatar : ""
    });

    const [doctors, setDoctors] = useState([]);
    const [patient, setPatient] = useState([]);

    useEffect(() => {
        fetchPatients();
        fetchDoctors();
        fetchTimeSlots();
    }, []);

    const fetchDoctors = () => {
        axios.get('http://localhost:3080/getdoctorstable')
            .then(response => {
                setDoctors(response.data);
            })
            .catch(error => {
                console.error('Error fetching doctors:', error);
            });
    };

    const fetchPatients = () => {
        axios.get(`http://localhost:3080/getselectedpatient/${patientId}`)
            .then(response => {
                setPatient(response.data);
            })
            .catch(error => {
                console.error('Error fetching doctors:', error);
            });
    };

    const fetchTimeSlots = () => {
        axios.get('http://localhost:3080/gettimeslotstable')
          .then(response => {
            setTimeSlotsData(response.data);
          })
          .catch(error => {
            console.error('Error fetching time slots:', error);
          });
    };  

    const getCurrentDateTime = () => {
        const now = new Date();
      
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Month starts from 0
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
      
        const formattedDateTime = `${year}-${month}-${day}, ${hours}:${minutes}:${seconds}`;
      
        return formattedDateTime;
      }

    const handleDoctorSelect = (doctor) => {
        setSelectedDoctor(doctor);
    };    

    const handleSubmit = async () => {
        try {
            // If the patient has already booked a time slot with the selected doctor
            const isTimeSlotBooked = timeSlotsData.some(timeSlot => {
                return (
                    timeSlot.status === 'taken' &&
                    timeSlot.patient_id === parseInt(patientId) &&
                    timeSlot.doctor_id === selectedDoctor.doctor_id
                );
            });
    
            if (isTimeSlotBooked) {
                alert('You have already booked a time slot with this doctor.');
                return;
            }
    
            // Checking if there is any booked time slot for any doctor adjacent to the selected time slot
            const patientAppointments = timeSlotsData.filter(timeSlot => {
                return timeSlot.status === 'taken' && timeSlot.patient_id === parseInt(patientId);
            });
    
            // Converting the selected time to milliseconds
            const selectedTimeInMillis = new Date(`2024-01-01 ${selectedTime.time}`).getTime();
    
            // Checking if any existing appointment is within one hour of the selected time slot
            const appointmentWithinOneHour = patientAppointments.some(appointment => {
                // Converting the booked appointment
                const appointmentTimeInMillis = new Date(`2024-01-01 ${appointment.time}`).getTime();
    
                // Time difference
                const timeDifference = Math.abs(selectedTimeInMillis - appointmentTimeInMillis);
    
                return timeDifference < 3600000;
            });
    
            // If there is an existing appointment within one hour, prevent booking and alert the user
            if (appointmentWithinOneHour) {
                alert('You cannot book an appointment within one hour of an existing appointment.');
                return;
            }

            const slotStatus = {
                patient_id: patient.patient_id, 
                patient_name: patient.patient_name,
                status: "taken", 
                status_time: getCurrentDateTime()
            }
    
            // Send POST request to add a new time slot
            await axios.post(`http://localhost:3080/changeslotstatus/${selectedTime.id}`, slotStatus).then( alert('Appointment booked successfully!'))
            
            
        } catch (error) {
            alert('Error adding new time slot:', error);
        }
    };

    
    return (
        <div className="booking-container">
            <h1>Welcome, {patient.patient_name}</h1>

            <form onSubmit={ handleSubmit }>
                <div className="doctor-cards">
                    <label>Choose Doctor:</label>
                    {doctors && doctors.map((doctor) => (
                        <div className="doctor-card" key={doctor.doctor_id} onClick={() => handleDoctorSelect(doctor)}>
                            <img src={doctor.avatar} alt={doctor.doctor_name} />
                            <div className="doctor-info">
                                <h3>{doctor.doctor_name}</h3>
                                <p>{doctor.specialization}</p>
                            </div>
                            <input
                                type="radio"
                                name="doctor"
                                value={doctor.doctor_id}
                                checked={selectedDoctor.doctor_id === doctor.doctor_id}
                                onChange={() => setSelectedDoctor(doctor)}
                            />
                        </div>
                    ))}
                </div>
                {selectedDoctor.doctor_name && (
                    <div className="time-slots">
                        <label>Available Time Slots for {selectedDoctor.doctor_name}:</label>
                        
                        {timeSlotsData
                            .filter(timeSlot => timeSlot.doctor_id === selectedDoctor.doctor_id) // Filter time slots by doctor_id
                            .map((timeSlot, index) => (
                                <div
                                    className={`time-slot ${timeSlot.status === 'taken' || timeSlot.status === 'done' ? 'taken' : ''}`}
                                    key={index}
                                    onClick={() => {
                                        if (timeSlot.status !== 'taken' & timeSlot.status !== 'done') setSelectedTime(timeSlot);
                                    }}
                                >
                                    <p>{timeSlot.time}</p>
                                    <input
                                        type="radio"
                                        name="time"
                                        value={timeSlot.time}
                                        checked={selectedTime.id === timeSlot.id}
                                        onChange={() => {
                                            if (timeSlot.status === 'taken' || timeSlot.status === 'done') setSelectedTime(timeSlot);
                                        }}
                                        disabled={timeSlot.status === 'taken' || timeSlot.status === 'done'}
                                    />
                                </div>
                            ))
                        }
                        
                    </div>
                )}
    
                <button type="submit">Book Appointment</button>
            </form>
        </div>
    );
    
}

export default PatientBooking;
