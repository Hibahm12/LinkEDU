import { useState,useEffect } from 'react';
import { Card,CardContent,CardMedia,CardActions,Grid,Typography,Button,Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import userImg from '../../../public/assets/background/user.png'; // Correctly imported
import usePresenceStore from '../../store/presence_members';
import { getProfesseurGroup } from '../../api/groupes';
import { createConversation } from '../../api/conversations';
import useAuthStore from '../../store/auth';


const TeamCard = ({ groupeId }) => {
  const { members: teamMembers } = usePresenceStore();
  const [professeur,setProfesseur] = useState(null);
  const [loading,setLoading] = useState(false); // Initial loading state
  const user = useAuthStore((state) => state.user)
  const navigate = useNavigate();




  useEffect(() => {
    setLoading(true)

    const fetchProfesseurGroup = async () => {
      const response = await getProfesseurGroup(groupeId);
      setProfesseur(response.data.professeur);
    };
    fetchProfesseurGroup();

    setLoading(false)
  },[groupeId]);



  const handleMessage = async () => {
    // create conversation

    const newConversation = { etudiant_id: user.id,professeur_id: professeur.user.id };
    console.log("new Conversation : ",newConversation);
    console.log("professeur : ",professeur);
    console.log("user : ",user);
    try {
      const response = await createConversation(newConversation);
      if (response.status == 200 || response.status == 201) {
        navigate(`/Espace-Etudiant/chat/${response.data.conversation.id}`);
      }
      console.log(response);
    } catch (error) {
      console.error('Failed to create task:',error);
    }


  }

  if (loading) {
    return <h2>Loading...</h2>
  }

  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12}>
        <Typography variant="h4" component="h2" sx={{ textAlign: 'center',my: 4 }}>
          Our Team
        </Typography>
      </Grid>

      {
        professeur && (<Grid item key={professeur?.id} xs={12} sm={6} md={3}>
          <Card sx={{
            maxWidth: 345,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            '&:hover': {
              boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
            },
            borderRadius: '10px',
            overflow: 'hidden',
            m: 2,
          }}>
            <CardMedia
              component="img"
              sx={{ width: 140,height: 140,borderRadius: '50%',mt: 2 }}
              image={userImg}
              alt={professeur.user.username}
            />
            <CardContent>
              <Typography gutterBottom variant="h6" component="div">
                {professeur.prenom} {professeur.nom}
              </Typography>
              <Typography gutterBottom variant="p" component="div">
                {professeur.user.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                professor
              </Typography>

              {
                user.etudiant.is_moderator === 1 && (
                  <CardActions>
                    <Box display="flex" justifyContent="center" width="100%" mt={2}>
                      <Button variant="contained" size="small" color="primary" onClick={handleMessage}>
                        Message
                      </Button>
                    </Box>
                  </CardActions>)
              }


            </CardContent>
          </Card>
        </Grid>)
      }

      {teamMembers.map(member => (
        <Grid item key={member.id} xs={12} sm={6} md={3}>
          <Card sx={{
            maxWidth: 345,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            '&:hover': {
              boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
            },
            borderRadius: '10px',
            overflow: 'hidden',
            m: 2,
          }}>
            <CardMedia
              component="img"
              sx={{ width: 140,height: 140,borderRadius: '50%',mt: 2 }}
              image={user}
              alt={member.username}
            />
            <CardContent>
              <Typography gutterBottom variant="h6" component="div">
                {member.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {member.role}
              </Typography>

            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default TeamCard;
