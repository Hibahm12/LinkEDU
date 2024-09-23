import React,{ useEffect,useState } from 'react';

import { Box,TextField,Button } from '@mui/material';
//import SendIcon from '@mui/icons-material/Send';
import usePresenceStore from "../../store/presence_members"
import axios from 'axios';

const MessageInput = ({ user,setMessages }) => {
  const [message,setMessage] = useState('');
  const { typingUsers } = usePresenceStore();
  const [typingTimeout,setTypingTimeout] = useState(null);


  useEffect(() => {
    console.log('typers: ',typingUsers)
  },[typingUsers])


  const handleTyping = () => {
    window.Echo.join(`groupe-messages.1`).whisper('typing',user.username);
  };

  const handleStopTyping = () => {
    window.Echo.join(`groupe-messages.1`).whisper('stop-typing',user.username);
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
      axios.post('http://127.0.0.1:8000/api/groupe-messages/1/message',{
        user_id: user.id,
        groupe_id: 1,
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
