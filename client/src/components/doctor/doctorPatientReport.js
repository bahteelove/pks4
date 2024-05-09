import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import "../style/doctorPatientReport.css"

const DoctorPatientReport = (props) => {
    const { doctorId } = useParams();
    const { patientId, slotId } = props;

    const [issue, setIssue] = useState('');
    const [advice, setAdvice] = useState('');
    const [recipe, setRecipe] = useState('');

    //const [selectedDoctor, setSelectedDoctor] = useState('');
    const [slot, setSlot] = useState([]);

    const [selectedPatient, setSelectedPatient] = useState('');  

    // fetching datas

    useEffect(() => {
        //fetchSelectedDoctor();
        fetchSelectedPatient();
        fetchSelectedSlot();
    }, [slotId]);

    /*
    const fetchSelectedDoctor = () => {
        axios.get(`http://localhost:3080/getselecteddoctor/${doctorId}`)
            .then(response => {
                setSelectedDoctor(response.data);
            })
            .catch(error => {
                console.error('Error fetching selected doctor:', error);
            });
    };
    */

    const fetchSelectedPatient = () => {
        axios.get(`http://localhost:3080/getselectedpatient/${patientId}`)
            .then(response => {
                setSelectedPatient(response.data);
            })
            .catch(error => {
                console.error('Error fetching slot:', error);
            });
    };

    const fetchSelectedSlot = () => {
        axios.get(`http://localhost:3080/gettimeslotbyid/${slotId}`)
            .then(response => {
                setSlot(response.data[0]);
            })
            .catch(error => {
                console.error('Error fetching slot:', error);
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
     
   const handleSaveData = () => {

        const newHistory = {
            patient_id: slot.patient_id,
            date: new Date().toLocaleDateString('ru-RU'),
            issue: issue,
            advice: advice,
            recipe: recipe,
            doctor_id: slot.doctor_id
        };

        
        axios.post('http://localhost:3080/addNewPatientHistory', newHistory)
            .then(response => {
                //console.log('New patient history added successfully');
                // Reset form fields if needed
                setIssue('');
                setAdvice('');
                setRecipe('');
            })
            .catch(error => {
                console.error('Error adding new patient history:', error);
            });


        axios.get(`http://localhost:3080/changestatusnottaken/${slotId}`)

        alert("Recipe has added. Good job")
        //console.log( slot[0] )
        window.location.reload();
    };

    const handleMarkAsDone = () => {
        axios.post(`http://localhost:3080/changeslotstatus/${slotId}`, { status: "done", status_time: getCurrentDateTime() })
            .then(response => {
                
            })
            .catch(error => {
                console.error('Error adding new patient history:', error);
            });

        alert("Marked as Done. Good job")
        //console.log( slot[0] )
        window.location.reload();
    }

    return (
        <>
            <div className="data-inputs">
                <label> Patient name: { selectedPatient.patient_name } </label><br/>
                <label> Issue: </label>
                <input
                    type="text"
                    value={issue}
                    onChange={(e) => setIssue(e.target.value)}
                    placeholder="Issue"
                />
                <label> Advice: </label>
                <input
                    type="text"
                    value={advice}
                    onChange={(e) => setAdvice(e.target.value)}
                    placeholder="Advice"
                />
                <label> Recipe: </label>
                <input
                    type="text"
                    value={recipe}
                    onChange={(e) => setRecipe(e.target.value)}
                    placeholder="Recipe"
                />
                <button onClick={ handleSaveData } > Save </button>
                <button onClick={ handleMarkAsDone } > Mark as Done </button>
            </div>
        </>
    );
}

export default DoctorPatientReport;