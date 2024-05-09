import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import "../style/User.css"

const User = () => {
    const [user, setUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [selectedMessageText, setSelectedMessage] = useState('');
    const [toUser, setToUser] = useState('');
    const [messageTitle, setMessageTitle] = useState('');
    const [messageText, setMessageText] = useState('');
    const [filterTitle, setFilterTitle] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
  
    const { login } = useParams();
  
    useEffect(() => {
      fetchUser();
      fetchMessages();
    }, [login]);
  
    const fetchMessages = () => {
      axios.get(`http://localhost:3080/getmessagestable/`)
        .then(response => {
          setMessages(response.data);
        })
        .catch(error => {
          console.error('Error fetching messages:', error);
        });
    };
  
    const fetchUser = () => {
      axios.get(`http://localhost:3080/getselecteduser/${login}`)
        .then(response => {
          setUser(response.data);
        })
        .catch(error => {
          console.error('Error fetching user:', error);
        });
    };
  
    const showMessage = async (messageId) => {
      try {
        const response = await axios.get(`http://localhost:3080/getselectedmessage/${messageId}`);
        setSelectedMessage(response.data);
        await axios.get(`http://localhost:3080/updatemessagestatus/${messageId}`);
        fetchMessages();
      } catch (error) {
        console.error('Error fetching message:', error);
      }
    };
  
    const sendMessage = async () => {
      // Sending message logic
    };
  
    const filteredMessages = messages.filter(message => {
      return message.message_title.toLowerCase().includes(filterTitle.toLowerCase()) &&
        (filterStatus === '' || message.status === filterStatus);
    });
  
    return (
      <div className="user-details-container">
        <h2>User Details</h2>
        {user ? (
          <>
            <div className="user-info">
              <p><strong>Name:</strong> {user.user_name}</p>
              <p><strong>Login:</strong> {user.login} </p>
            </div>
            <div className="message-filters">
              <label htmlFor="filterTitle">Filter by Title:</label>
              <input type="text" id="filterTitle" value={filterTitle} onChange={(e) => setFilterTitle(e.target.value)} />
              <label htmlFor="filterStatus">Filter by Status:</label>
              <select id="filterStatus" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="">All</option>
                <option value="new">New</option>
                <option value="read">Read</option>
              </select>
            </div>
            <p>Messages</p>
            <table className="message-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date</th>
                  <th>From</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredMessages.map(message => (
                  <tr key={message.id}>
                    <td>{message.message_title}</td>
                    <td>{message.send_date}</td>
                    <td>{message.from_user === "" ? <p> admin </p> : message.from_user}</td>
                    <td>
                      <button className={`see-message-btn ${message.status === 'new' ? 'green-button' : 'blue-button'}`} onClick={() => showMessage(message.id)}>See the message</button>
                    </td>
                  </tr>
                ))}
                {selectedMessageText && (
                  <tr>
                    <td colSpan="4">
                      <div className="message-popup">
                        <table>
                          <tbody>
                            <tr>
                              <th>Title</th>
                              <th>Text</th>
                            </tr>
                            <tr>
                              <td>{selectedMessageText.message_title}</td>
                              <td>{selectedMessageText.message_text}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="message-form">
              <h3>Send a Message</h3>
              <form onSubmit={sendMessage}>
                {/* Message form inputs */}
              </form>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    );
  };
  
  export default User;
  
