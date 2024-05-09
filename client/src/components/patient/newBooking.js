import * as React from 'react';
import dayjs from 'dayjs';
import Badge from '@mui/material/Badge';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import axios from 'axios';

import '../style/newBooking.css';

function getRandomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function fakeFetch(date, { signal }) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      const daysToHighlight = [];

      resolve({ daysToHighlight });
    }, 500);

    signal.onabort = () => {
      clearTimeout(timeout);
      reject(new DOMException('aborted', 'AbortError'));
    };
  });
}

function getCurrentDateTime() {
  const now = new Date();
  const futureDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // Adding 14 days in milliseconds
  const formattedDateTime = dayjs(futureDate).format('YYYY-MM-DD');
  return formattedDateTime;
}

const initialValue = dayjs(getCurrentDateTime());

function ServerDay(props) {
  const { highlightedDays = [], day, outsideCurrentMonth, onSelect, ...other } = props;
  const isSelected = !props.outsideCurrentMonth && highlightedDays.indexOf(props.day.date()) >= 0;

  const handleClick = () => {
    onSelect(props.day); // Call onSelect with the clicked day
  };

  return (
    <Badge
      key={props.day.toString()}
      overlap="circular"
      badgeContent={isSelected ? '🔴' : undefined}
      onClick={handleClick} // Attach onClick event handler
    >
      <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
    </Badge>
  );
}

export default function DateCalendarServerRequest() {
  const requestAbortController = React.useRef(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [highlightedDays, setHighlightedDays] = React.useState([]);
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [selectedTime, setSelectedTime] = React.useState(null);

  const fetchHighlightedDays = (date) => {
    const controller = new AbortController();
    fakeFetch(date, {
      signal: controller.signal,
    })
      .then(({ daysToHighlight }) => {
        setHighlightedDays(daysToHighlight);
        setIsLoading(false);
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          throw error;
        }
      });

    requestAbortController.current = controller;
  };

  React.useEffect(() => {
    fetchHighlightedDays(initialValue);
    return () => requestAbortController.current?.abort();
  }, []);

  const handleMonthChange = (date) => {
    if (requestAbortController.current) {
      requestAbortController.current.abort();
    }
    setIsLoading(true);
    setHighlightedDays([]);
    fetchHighlightedDays(date);
  };

  const handleDayClick = (day) => {
    setSelectedDate(day);
  };

  const handleTimeClick = (time) => {
    setSelectedTime(time);
  };

  const handleSubmit = () => {
    try {
      const newSlot = {
        doctor_id: 2,
        doctor_name: "Dr. Smith",
        patient_id: 6,
        patient_name: "Zuck",
        time: `${selectedDate.format('YYYY-MM-DD')}, ${selectedTime}`,
        status: "taken",
        status_time: getCurrentDateTime()
      };

      axios.post(`http://localhost:3080/addnewtimeslot`, newSlot);
      alert('Appointment booked successfully!');
    } catch (error) {
      console.log('Error adding new time slot:', error);
    }
  };

  const handleOk = () => {
    try {

      axios.post(`http://localhost:3080/gettimeslotbydatetime`, { time: "2022-05-04, 11:00 AM" });
      alert('Slot thrived succesfully!');
    } catch (error) {
      console.log('Error thriving time slot:', error);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        defaultValue={initialValue}
        loading={isLoading}
        onMonthChange={handleMonthChange}
        renderLoading={() => <DayCalendarSkeleton />}
        disablePast={true} // Disable past dates
        maxDate={dayjs().add(14, 'day')} // Allow dates up to 14 days in the future
        slots={{
          day: (props) => (
            <ServerDay {...props} onSelect={handleDayClick} />
          ),
        }}
        slotProps={{
          day: {
            highlightedDays,
          },
        }}
      />
      {selectedDate && (
        <>
          <p>Selected Date: {selectedDate.format('YYYY-MM-DD')}</p>
          <div>
            <div className='time-slot' onClick={() => handleTimeClick("09:00 AM")}>9:00 AM</div>
            <div className='time-slot' onClick={() => handleTimeClick("10:00 AM")}>10:00 AM</div>
            <div className='time-slot' onClick={() => handleTimeClick("11:00 AM")}>11:00 AM</div>
            <div className='time-slot' onClick={() => handleTimeClick("02:00 PM")}>2:00 PM</div>
            <div className='time-slot' onClick={() => handleTimeClick("03:00 PM")}>3:00 PM</div>
          </div>
        </>
      )}
      {selectedTime && <p className='selected-time'>Selected Time: {selectedTime}</p>}
      <button onClick={handleSubmit}>Submit</button>
      <button onClick={handleOk}>ok</button>
    </LocalizationProvider>
  );
}
