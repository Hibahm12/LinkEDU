import React from 'react';
import { ListItem } from '@mui/material';
import MessageItem from './MessageItem';

const MessageList = ({ messages,user }) => {
  return (
    <>
      {messages.map((msg,index) => (
        <ListItem
          key={index}
          sx={{
            display: 'flex',
            justifyContent: msg.user_id === user.id ? 'flex-end' : 'flex-start'
          }}
        >
          <MessageItem msg={msg} user={user} />
        </ListItem>
      ))}
    </>
  );
};

export default MessageList;