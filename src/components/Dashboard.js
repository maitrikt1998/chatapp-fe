import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../authActions';
import { fetchMessage, fetchUsers } from '../userSlice'; 
import { sendMessage } from '../authActions';
import '../App.css';

const Dashboard = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const messages = useSelector(state => state.user.messages);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageInput, setMessageInput] = useState('');

  const backendImagePath = 'http://127.0.0.1:8000/images';
  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      dispatch(fetchUsers());
    }
  }, []); 

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    dispatch(fetchMessage({ sender_id: userInfo.user.id, receiver_id: user.id }));
  };

  const renderMessage = (message) => {
    const isSentByCurrentUser = message.sender_id === userInfo.user.id;
    const messageClass = isSentByCurrentUser ? 'message-sent' : 'message-received';
  
    const messageDate = new Date(message.created_at);
    const formattedDate = messageDate.toLocaleDateString();
    const formattedTime = messageDate.toLocaleTimeString();
  
    return (
      <div key={message.id} className={`message ${messageClass}`}>
        <p>{message.message}</p>
        <span className="message-meta">{formattedDate} <span className='text-red'>{formattedTime}</span></span>
      </div>
    );
  };

  const handleMessageSend = () => {
    
    dispatch(sendMessage({
      message: messageInput,
      sender_id: userInfo.user.id,
      receiver_id: selectedUser.id
    }));

    setMessageInput('');
  }
  
  const users = useSelector((state) => state.user.users);
  const loading = useSelector((state) => state.user.loading);
  const error = useSelector((state) => state.user.error);
  const frontendUrl = "http://localhost:3000";
  return (
    <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Welcome to the ChatBoard, {userInfo && userInfo.user.name}!</h2>
            <button className='btn btn-primary' onClick={handleLogout}>Logout</button>
        </div>
        <div className='col-md-12 row'>
            <div className = "col-md-4">
            <ul className="list-group">
                {users.filter(user => user.id !== userInfo.user.id).map(filteredUser => (
                  <li key={filteredUser.id} className="list-group-item" onClick={() => handleUserClick(filteredUser)}>
                  {filteredUser.image ? (
                    <img src={`${backendImagePath}/${filteredUser.image}`} alt="User Avatar" className="avatar rounded-circle d-flex align-self-center z-depth-1" style={{ width: '50px', height: '50px', marginRight: '25px' }} />
                  ) : (
                    <img src={`${frontendUrl}/default_user.png`} alt="Default Avatar" className="avatar rounded-circle d-flex align-self-center z-depth-1" style={{ width: '50px', height: '50px', marginRight: '25px' }} />
                  )}
                  <span>{filteredUser.name}</span>
                </li>
                ))}
            </ul>
            </div>
            <div className="col-md-8">
      {selectedUser && (
        <section>
          <div className="container">
            <div className="row d-flex justify-content-center">
              <div className="col-md-12 col-lg-12 col-xl-12">
                <div className="card" id="card1" style={{}}>
                  <div className="card-header d-flex align-items-center p-3" style={{ fontSize: 'large' }}>
                    <i className="fas fa-angle-left"></i>
                    
                    {selectedUser.image ? (
                    <img src={`${backendImagePath}/${selectedUser.image}`} alt="User Avatar" className="avatar rounded-circle d-flex align-self-center z-depth-1" style={{ width: '50px', height: '50px', marginRight: '25px' }} />
                  ) : (
                    <img src={`${frontendUrl}/default_user.png`} alt="Default Avatar" className="avatar rounded-circle d-flex align-self-center z-depth-1" style={{ width: '50px', height: '50px', marginRight: '25px' }} />
                  )}
                  <p className="mb-0 fw-bold">{selectedUser.name}</p>
                    <i className="fas fa-times"></i>
                  </div>
                  <div className="card-body">
                    <div className="message-body" style={{ height: '500px', overflow: 'auto', flexDirection: 'column-reverse' }}>
                    {messages.map(renderMessage)}
                    </div>
                    <div className=" row form-outline">
                      <input className="form-control" id="textAreaExample"  
                          placeholder="Type your Message..." value={messageInput} 
                          onChange={(e) => setMessageInput(e.target.value)} />
                      <button className="btn btn-primary mt-2"  onClick={handleMessageSend}>Send</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
        </div>
    </div>
  );
};

export default Dashboard;
