import React from 'react';

import { Box,Typography } from '@mui/material';

const MessageItem = ({ msg,user }) => {
  return (
    <Box
      sx={{
        backgroundColor: msg.user_id === user.id ? 'primary.light' : 'grey.300',
        color: msg.user_id === user.id ? 'white' : 'black',
        borderRadius: 1,
        p: 1,
        maxWidth: '75%'
      }}
    >
      <Typography variant="body1">
        <span style={{ fontWeight: 'bold',color: '#1565c0',display: 'block' }}>
          {msg.user.username}
        </span>
        {msg.contenu}
      </Typography>
      <Typography variant="caption" display="block">
        {msg.time}
      </Typography>
    </Box>
  );
};

export default MessageItem;
