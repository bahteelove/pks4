<label className="form-label">
        Doctor ID:
        <select className="form-select" name="doctor_id" value={newTimeSlotData.doctor_id} onChange={handleInputChangeTimeSlot}>
          <option value="">Select Doctor</option>
          {doctors.map(doctor => (
            <option key={doctor.doctor_id} value={doctor.doctor_id}>
              {doctor.doctor_id}
            </option>
          ))}
        </select>
      </label>