import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser, sendMessage } from "../authActions";
import { useEffect, useState } from "react";
import { addNewMessage, fetchMessage, fetchUsers } from "../userSlice";
import '../App.css';
import { io } from "socket.io-client";


const Dashboard = () => {

  const socket = io('http://localhost:3005');

  const [selectedUser, setSelectedUser] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const messages = useSelector(state => state.user.messages);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const users = useSelector((state) => state.user.users);
  const frontendUrl = "http://localhost:3000";
  const backendImagePath = 'http://127.0.0.1:8000/images';

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      dispatch(fetchUsers());
    }

    socket.on('message', (message) => {
      console.log("My Message"+message);
      dispatch(addNewMessage(message));

      console.log("Received Message:", message);

        const { sender_id, receiver_id } = message;

        const isMessageFromCurrentUser = sender_id === userInfo.user.id;
        const isMessageForSelectedUser = receiver_id === selectedUser?.id;

        if (isMessageFromCurrentUser && isMessageForSelectedUser) {
          dispatch(addNewMessage(message));
        }
    });
  }, []); 

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    dispatch(fetchMessage({ sender_id: userInfo.user.id, receiver_id: user.id }));
  };

  const handleMessageSend = () => {
    dispatch(sendMessage({
      message: messageInput,
      sender_id: userInfo.user.id,
      receiver_id: selectedUser.id
    }));

    socket.emit('message', {
      message: messageInput,
      sender_id: userInfo.user.id,
      receiver_id: selectedUser.id
    });
    setMessageInput('');
  }

  const renderMessage = (message) => {
    console.log("user id"+userInfo.user.id,"Sender Id"+message.sender_id);
  
  const isSentByCurrentUser = message.sender_id === userInfo.user.id;
  const isReceivedByCurrentUser = message.receiver_id === userInfo.user.id;

  const isSentToSelectedUser = isSentByCurrentUser && message.receiver_id === selectedUser?.id;
  const isReceivedFromSelectedUser = isReceivedByCurrentUser && message.sender_id === selectedUser?.id;

  if (isSentToSelectedUser || isReceivedFromSelectedUser) {
    const messageClass = isSentByCurrentUser ? 'message-sent' : 'message-received';
  
    // const messageDate = new Date(message.created_at);
    // const formattedDate = messageDate.toLocaleDateString();
    // const formattedTime = messageDate.toLocaleTimeString();

    const hasDateAndTime = message.created_at && !isNaN(new Date(message.created_at).getTime());
    const messageDate = hasDateAndTime ? new Date(message.created_at) : new Date(); // Use current date if created_at is unavailable
    const formattedDate = hasDateAndTime ? messageDate.toLocaleDateString() : new Date().toLocaleDateString(); // Use current date if created_at is unavailable
    const formattedTime = hasDateAndTime ? messageDate.toLocaleTimeString() : new Date().toLocaleTimeString(); // Use current time if created_at is unavailable


    return (
      <div key={message.id} className={`message ${messageClass}`}>
        <p>{message.message}</p>
        <span className="message-meta">{formattedDate} <span className='text-red'>{formattedTime}</span></span>
      </div>
    );
  } else {
    // Message not related to the selected user, don't render
    return null;
  }
  };

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
  )
}

export default Dashboard;
