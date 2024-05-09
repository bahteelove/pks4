import React, { useState, useEffect } from 'react';
import axios from 'axios';

import "../style/adminTables.css"

function Doctor() {
  const [doctors, setDoctors] = useState([]);
  const [newDoctorData, setNewDoctorData] = useState({
    doctor_name: '',
    specialization: '',
    avatar: ''
  });

  useEffect(() => {
    fetchDoctors();
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


  const handleInputChangeDoctor = (event) => {
    const { name, value } = event.target;
    setNewDoctorData({ ...newDoctorData, [name]: value });
  };

  const addNewDoctor = async () => {
    try {
      // Check if any required field is empty
      if (!newDoctorData.doctor_name || !newDoctorData.specialization || !newDoctorData.avatar) {
        alert('All fields are required');
        return;
      }
  
      // Check if the doctor name already exists
      const doctorExists = doctors.some(doctor => doctor.doctor_name === newDoctorData.doctor_name);
  
      if (doctorExists) {
        alert('Doctor name is already taken');
        return;
      }
  
      // Send POST request to add a new doctor
      await axios.post('http://localhost:3080/submitform', newDoctorData);
  
      // Fetch updated list of doctors after adding new doctor
      fetchDoctors();
  
      // Reset the form fields
      setNewDoctorData({
        doctor_name: '',
        specialization: '',
        avatar: ''
      });
  
      console.log('New doctor added successfully');
    } catch (error) {
      console.error('Error adding new doctor:', error);
    }
  };

  return (
    <div className="doctor-container">

      <h2>Add New Doctor</h2>
      <form className="add-doctor-form" onSubmit={addNewDoctor}>
        <table className="add-doctor-table">
          <tbody>
            <tr>
              <td className="form-label">Name:</td>
              <td><input className="form-input" type="text" name="doctor_name" value={newDoctorData.doctor_name} onChange={handleInputChangeDoctor} /></td>
            </tr>
            <tr>
              <td className="form-label">Specialization:</td>
              <td><input className="form-input" type="text" name="specialization" value={newDoctorData.specialization} onChange={handleInputChangeDoctor} /></td>
            </tr>
            <tr>
              <td className="form-label">Avatar:</td>
              <td><input className="form-input" type="text" name="avatar" value={newDoctorData.avatar} onChange={handleInputChangeDoctor} /></td>
            </tr>
          </tbody>
        </table>
        <button className="submit-btn" type="submit">Add Doctor</button>
      </form>

    </div>
  );
}

export default Doctor;
