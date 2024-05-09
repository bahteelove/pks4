import React, { useState, useEffect } from 'react';
import axios from 'axios';

import "../style/adminTables.css"

function TimeSlots() {
  const [timeSlots, setTimeSlots] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [newTimeSlotData, setNewTimeSlotData] = useState({
    doctor_id: '',
    doctor_name: '',
    patient_id: '',
    patient_name: '',
    time: '',
    status: '',
    status_time: ''
  });

  useEffect(() => {
    fetchTimeSlots();
    fetchDoctors();
  }, []);

  const fetchTimeSlots = () => {
    axios.get('http://localhost:3080/gettimeslotstable')
      .then(response => {
        setTimeSlots(response.data);
      })
      .catch(error => {
        console.error('Error fetching time slots:', error);
      });
  };

  const fetchDoctors = () => {
    axios.get('http://localhost:3080/getdoctorstable')
      .then(response => {
        setDoctors(response.data);
      })
      .catch(error => {
        console.error('Error fetching doctors:', error);
      });
  };

  const handleInputChangeTimeSlot = (event) => {
    const { name, value } = event.target;
  
    if (name === 'doctor_name') {
      const selectedDoctor = doctors.find(doctor => doctor.doctor_name === value);
      if (selectedDoctor) {
        setNewTimeSlotData({ ...newTimeSlotData, [name]: value, doctor_id: selectedDoctor.doctor_id });
      }
    } else {
      setNewTimeSlotData({ ...newTimeSlotData, [name]: value });
    }
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

  const addNewTimeSlot = async () => {
    try {
      // Check if any required field is empty
      if (!newTimeSlotData.doctor_name || !newTimeSlotData.time) {
        alert('Doctor ID and time are required fields');
        return;
      }
      
      // GET /getselecteddoctor/:doctor_id
      

      if (!newTimeSlotData.status || !newTimeSlotData.patient_id) {
        newTimeSlotData.patient_id = 0;
        newTimeSlotData.status = 'not taken'
      }

      newTimeSlotData.status_time = getCurrentDateTime()
  
      // Send POST request to add a new time slot
      await axios.post('http://localhost:3080/addnewtimeslot', newTimeSlotData);

      // Fetch updated list of time slots after adding new time slot
      fetchTimeSlots();

      // Reset the form fields
      setNewTimeSlotData({
        doctor_id: '',
        doctor_name: '',
        patient_id: '',
        patient_name: '',
        time: '',
        status: '',
        status_time: ''
      });
  
      console.log('New time slot added successfully');
    } catch (error) {
      console.error('Error adding new time slot:', error);
    }
  };

  const deleteTimeSlot = async (id) => {
    try {
      await axios.delete(`http://localhost:3080/deletetimeslots/${id}`);
      fetchTimeSlots(); // Refresh data
      console.log(`Time Slot with ID ${id} has been deleted`);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handleReset = async (id) => {
    try {
      const resetSlot = {
        patient_id: 0, 
        patient_name: "",
        status: "not taken",
        status_time: getCurrentDateTime()
      };
  
      // Send POST request to reset the status of the time slot
      await axios.post(`http://localhost:3080/changeslotstatus/${id}`, resetSlot);
  
      fetchTimeSlots(); // Refresh data
      alert(`Time Slot with ID ${id} has been reset`);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    
  <div className="doctor-container">
    <h1>Time Slots</h1>
    <table className="doctor-table">
      <thead>
        <tr>
          <th className="table-heading">ID</th>
          <th className="table-heading">Doctor ID</th>
          <th className="table-heading">Patient ID</th>
          <th className="table-heading">Time</th>
          <th className="table-heading">Status</th>
          <th className="table-heading">Status Time</th>
          <th className="table-heading">Action</th>
          <th className="table-heading">Action</th>
        </tr>
      </thead>
      <tbody>
        {timeSlots.map(slot => (
          <tr key={slot.id}>
            <td className="table-data">{slot.id}</td>
            <td className="table-data">{slot.doctor_id} ({slot.doctor_name}) </td>
            <td className="table-data">{slot.patient_id} { slot.patient_id !== 0 ? <> ({slot.patient_name}) </> : '' } </td>
            <td className="table-data">{slot.time}</td>
            <td className="table-data">{slot.status}</td>
            <td className="table-data">{slot.status_time}</td>
            <td className="table-data">
              <button className="reset-btn" onClick={() => handleReset(slot.id)}>Reset</button>
            </td>
            <td className="table-data">
              <button className="delete-btn" onClick={() => deleteTimeSlot(slot.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    <h2>Add New Time Slot</h2>
    <form className="add-doctor-form" onSubmit={addNewTimeSlot}>
      <table className="add-doctor-table">
          <tbody>
            <tr>
              <td className="form-label">Select Doctor</td>
              <td>
                <select className="form-select" name="doctor_name" value={newTimeSlotData.doctor_name} onChange={handleInputChangeTimeSlot}>
                  <option value="">Select Doctor</option>
                  {doctors.map(doctor => (
                    <option key={doctor.doctor_name} value={doctor.doctor_name}>
                      {doctor.doctor_name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td className="form-label">Time:</td>
              <td> <input className="form-input" type="text" name="time" value={newTimeSlotData.time} onChange={handleInputChangeTimeSlot} /> </td>
            </tr>
            
          </tbody>
        </table>
      <button className="submit-btn" type="submit">Add Time Slot</button>
    </form>
  </div>

  );
}

export default TimeSlots;
