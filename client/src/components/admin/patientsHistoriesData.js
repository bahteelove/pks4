import React, { useState, useEffect } from 'react';
import axios from 'axios';

import "../style/adminTables.css"

function PatientHistory() {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  const [patientHistory, setPatientHistory] = useState([]);
  const [newHistoryData, setNewHistoryData] = useState({
    patient_id: '',
    date: '',
    issue: '',
    advice: '',
    recipe: '',
    doctor_id: '',
    doctor_name: '',
    patient_name: ''
  });

  useEffect(() => {
    fetchPatientHistory();
    fetchDoctors();
    fetchPatients();
  }, []);

  const fetchPatientHistory = () => {
    axios.get('http://localhost:3080/getpatienthistorytable')
      .then(response => {
        setPatientHistory(response.data);
      })
      .catch(error => {
        console.error('Error fetching patient history:', error);
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

  const fetchPatients = () => {
    axios.get('http://localhost:3080/getpatientstable')
        .then(response => {
        setPatients(response.data);
        })
        .catch(error => {
        console.error('Error fetching patients:', error);
        });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
  
    if (name === 'doctor_name') {
      const selectedDoctor = doctors.find(doctor => doctor.doctor_name === value);
      if (selectedDoctor) {
        setNewHistoryData({ ...newHistoryData, [name]: value, doctor_id: selectedDoctor.doctor_id });
      }
    } else if (name === 'patient_name') {
      const selectedPatient = patients.find(patient => patient.patient_name === value);
      if (selectedPatient) {
        setNewHistoryData({ ...newHistoryData, [name]: value, patient_id: selectedPatient.patient_id });
      }
    } else {
      setNewHistoryData({ ...newHistoryData, [name]: value });
    }
  };

  const addNewHistory = async () => {
    try {
      // Check if any required field is empty
      /*
      if (!newHistoryData.patient_id || !newHistoryData.date || !newHistoryData.issue || !newHistoryData.advice || !newHistoryData.recipe || !newHistoryData.doctor_id) {
        alert('All fields are required');
        return;
      }
      */

      // Send POST request to add new patient history
      await axios.post('http://localhost:3080/addnewpatienthistory', newHistoryData);

      // Fetch updated list of patient history after adding new data
      fetchPatientHistory();

      // Reset the form fields
      setNewHistoryData({
        patient_id: '',
        date: '',
        issue: '',
        advice: '',
        recipe: '',
        doctor_id: '',
        doctor_name: '',
        patient_name: ''
      });

      alert('New patient history added successfully');
    } catch (error) {
      console.error('Error adding new patient history:', error);
    }
  };

  const handleDelete = async(id) => {
    // DELETE /deletepatienthistory/:id
    try {
      await axios.delete(`http://localhost:3080/deletepatienthistory/${id}`);
      fetchPatientHistory(); // Refresh data
      alert(`History ID {${id}} has been deleted`);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    
    <div className="doctor-container">
      <h1>Patient History</h1>
      { patientHistory.length > 0 ?
      <>
        <table className="doctor-table">
          <thead>
            <tr>
              <th className="table-heading">ID</th>
              <th className="table-heading">Patient ID</th>
              <th className="table-heading">Date</th>
              <th className="table-heading">Issue</th>
              <th className="table-heading">Advice</th>
              <th className="table-heading">Recipe</th>
              <th className="table-heading">Doctor ID</th>
              <th className="table-heading">Action</th>
            </tr>
          </thead>
          <tbody>
            {patientHistory.map(history => (
              <tr key={history.id}>
                <td className="table-data">{history.id}</td>
                <td className="table-data">{history.patient_id} ({history.patient_name})</td>
                <td className="table-data">{history.date}</td>
                <td className="table-data">{history.issue}</td>
                <td className="table-data">{history.advice}</td>
                <td className="table-data">{history.recipe}</td>
                <td className="table-data">{history.doctor_id} ({history.doctor_name}) </td>
                <td className="table-data">
                  <button className="delete-btn" onClick={ () => {handleDelete(history.id)} }> Delete </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
      : <p> Here is no data yet </p> }

      <h2>Add New Patient's History</h2>
      <form className="add-doctor-form" onSubmit={addNewHistory}>
        <table className="doctor-table">
          <tbody>
            <tr>
              <td className="form-label">Patient ID</td>
              <td className="form-select">
                <select className="form-select" name="patient_name" value={newHistoryData.patient_name} onChange={handleInputChange}>
                  <option value="">Select Patient</option>
                  {patients.map(patient => (
                    <option key={patient.patient_name} value={patient.patient_name}>
                      {patient.patient_name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td className="form-label">Date</td>
              <td className="form-select">
                <input className="form-input" type="date" name="date" value={newHistoryData.date} onChange={handleInputChange} />
              </td>
            </tr>
            <tr>
              <td className="form-label">Issue</td>
              <td className="form-select">
                <textarea className="form-input" name="issue" value={newHistoryData.issue} onChange={handleInputChange} />
              </td>
            </tr>
            <tr>
              <td className="form-label">Advice</td>
              <td className="form-select">
                <textarea className="form-input" name="advice" value={newHistoryData.advice} onChange={handleInputChange} />
              </td>
            </tr>
            <tr>
              <td className="form-label">Recipe</td>
              <td className="form-select">
                <textarea className="form-input" name="recipe" value={newHistoryData.recipe} onChange={handleInputChange} />
              </td>
            </tr>
            <tr>
              <td className="form-label">Doctor ID (Doctor Name)</td>
              <td className="form-select">
                <select className="form-select" name="doctor_name" value={newHistoryData.doctor_name} onChange={handleInputChange}>
                  <option value="">Select Doctor</option>
                  {doctors.map(doctor => (
                    <option key={doctor.doctor_name} value={doctor.doctor_name}>
                      {doctor.doctor_name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          </tbody>
        </table>
        <button className="submit-btn" type="submit">Add History</button>
      </form>
    </div>


  );
}

export default PatientHistory;
