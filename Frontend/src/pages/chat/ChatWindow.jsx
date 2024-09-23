import React,{ useRef,useEffect } from 'react';
import { List } from '@mui/material';
import MessageList from './MessageList';

const ChatWindow = ({ messages,user }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  },[messages]);

  return (
    <List>
      <MessageList messages={messages} user={user} />
      <div ref={messagesEndRef} />
    </List>
  );
};

export default ChatWindow;
