import React,{ useState,useEffect } from 'react';
import { Box,Paper } from '@mui/material';

import axios from 'axios';
import ChatWindow from './ChatWindow';
import MessageInput from './MessageInput';
import useEcho from '../../hooks/useEcho';
import useInitEcho from '../../hooks/useInitEcho';

import useFetchCSRFToken from '../../hooks/useFetchCSRFToken';
import useAuthStore from '../../store/auth';
import usePresenceStore from '../../store/presence_members';
import useOnlineUsersStore from '../../store/online_users';
import { useParams } from 'react-router-dom';



axios.defaults.withCredentials = true;

export default function Chat() {
  const [messages,setMessages] = useState([]);
  const user = useAuthStore((state) => state.user);
  const { conversation_id } = useParams();
  const { users,addUser,removeUser,setUsers,startTyping,stopTyping } = useOnlineUsersStore();





  useFetchCSRFToken();
  //useEcho(user,setMessages);
  useInitEcho(user);

  useEffect(() => {
    window.Echo.join(`conversations.${conversation_id}`)
      .here((users) => {
        console.log("list users: ",users)
        setUsers(users);

      })
      .joining((user) => {
        console.log(user.username,": join");
        addUser(user);
      })
      .leaving((user) => {
        console.log(user.username,": leaving");
        removeUser(user.id);
      })
      .listen('UserMessageEvent',(e) => {
        setMessages(prevMessages => [...prevMessages,e.message]);

      })
      .listenForWhisper('typing',(user) => {
        console.log('typing : ',user);
        startTyping(user);
      })
      .listenForWhisper('stop-typing',(user) => {
        console.log('stop-typing : ',user);

        stopTyping(user);
      });

    return () => {
      window.Echo.leaveChannel(`conversations.${conversation_id}`);
    };
  },[user]);




  useEffect(() => {
    const fetchMessages = () => {
      axios.get(`http://127.0.0.1:8000/api/conversations/${conversation_id}/messages`)
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
        active member: {users.map((user,i) => i === users.length - 1 ? user.username : user.username + ', ')}
      </div>
      <Box sx={{ display: 'flex',flexDirection: 'column',height: '60vh',p: 2 }}>
        <Paper sx={{ flex: 1,mb: 2,p: 2,height: "100%",overflowY: 'auto' }}>
          <ChatWindow messages={messages} user={user} />
        </Paper>
        <MessageInput user={user} setMessages={setMessages} conversation_id={conversation_id} />
      </Box>
    </div>

  );
}

