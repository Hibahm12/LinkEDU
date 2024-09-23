import React,{ useState,useEffect } from 'react';
import { Box,Paper } from '@mui/material';

import axios from 'axios';
import ChatWindow from './ChatWindow';
import MessageInput from './MessageInput';
import useEcho from '../../hooks/useEcho';
import useFetchCSRFToken from '../../hooks/useFetchCSRFToken';
import useAuthStore from '../../store/auth';
import usePresenceStore from '../../store/presence_members';


axios.defaults.withCredentials = true;

export default function ChatGroupe() {
  const [messages,setMessages] = useState([]);
  const user = useAuthStore((state) => state.user);
  const { members } = usePresenceStore();



  useFetchCSRFToken();
  useEcho(user,setMessages);


  useEffect(() => {
    const fetchMessages = () => {
      axios.get('http://127.0.0.1:8000/api/groupe-messages/1/messages')
        .then(response => {
          setMessages(response.data);
        })
        .catch(error => {
          console.log('Failed to fetch messages',error);
        });
    };

    fetchMessages();
  },[user]);

  return (
    <div>
      <div>
        active member: {members.map((member,i) => i === members.length - 1 ? member.username : member.username + ', ')}
      </div>
      <Box sx={{ display: 'flex',flexDirection: 'column',height: '60vh',p: 2 }}>
        <Paper sx={{ flex: 1,mb: 2,p: 2,height: "100%",overflowY: 'auto' }}>
          <ChatWindow messages={messages} user={user} />
        </Paper>
        <MessageInput user={user} setMessages={setMessages} />
      </Box>
    </div>

  );
}

