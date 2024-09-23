import { Box, Button, Card, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ForgotPasswordView() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleForgotPassword = async (event) => {
    event.preventDefault();
    const response = await fetch('http://localhost:8000/api/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Reset Password Email Sent:', data);
      navigate('/login');
    } else {
      console.error('Forgot Password Error:', await response.json());
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card sx={{ p: 3, width: 300 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Forgot Password</Typography>
        <form onSubmit={handleForgotPassword}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={e => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" fullWidth>Reset Password</Button>
        </form>
      </Card>
    </Box>
  );
}
