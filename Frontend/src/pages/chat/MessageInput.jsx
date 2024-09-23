import React,{ useEffect,useState } from 'react';

import { Box,TextField,Button } from '@mui/material';
//import SendIcon from '@mui/icons-material/Send';
import useOnlineUsersStore from '../../store/online_users';

import axios from 'axios';

const MessageInput = ({ user,setMessages,conversation_id }) => {
  const [message,setMessage] = useState('');
  const { typingUsers } = useOnlineUsersStore();

  const [typingTimeout,setTypingTimeout] = useState(null);


  useEffect(() => {
    console.log('typers: ',typingUsers)
  },[typingUsers])


  const handleTyping = () => {
    window.Echo.join(`conversations.${conversation_id}`).whisper('typing',user.username);
  };

  const handleStopTyping = () => {
    window.Echo.join(`conversations.${conversation_id}`).whisper('stop-typing',user.username);
  };

  const handleBlur = () => {
    clearTimeout(typingTimeout);
    handleStopTyping();
  };


  const handleKeyDown = () => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    handleTyping();

    setTypingTimeout(setTimeout(() => {
      handleStopTyping();
    },1000));

  }




  const handleSend = () => {
    if (message.trim()) {
      axios.post(`http://127.0.0.1:8000/api/conversations/${conversation_id}/message`,{
        user_id: user.id,
        conversation_id: conversation_id,
        contenu: message,
      })
        .then(response => {
          console.log('Message sent successfully:',response.data);
        })
        .catch(error => {
          console.error('Failed to send message:',error);
        });
      setMessage('');
    }
  };

  return (
    <Box sx={{ display: 'flex',flexDirection: 'column',gap: 1 }}>
      <Box sx={{ display: 'flex',flexDirection: 'row',alignItems: 'center',gap: 1 }}>
        <TextField
          label="Type a message"
          variant="outlined"
          size="small"
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
        />
        <Button
          variant="outlined"
          size="large"
          onClick={handleSend}
        >
          Send
        </Button>
      </Box>
      {typingUsers.length > 0 && (
        <p style={{ alignSelf: 'flex-start',marginTop: '4px' }}>
          {typingUsers.join(', ')} typing...
        </p>
      )}
    </Box>
  );
};

export default MessageInput;
