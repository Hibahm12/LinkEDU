import { useEffect } from 'react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import axios from 'axios';
import usePresenceStore from '../store/presence_members';

const useEcho = (user, setMessages) => {
  const { addMember, removeMember,setMembers,startTyping,stopTyping } = usePresenceStore();

  useEffect(() => {
    if (!user) return;

    window.Pusher = Pusher;
    window.Echo = new Echo({
      broadcaster: 'reverb',
      key: import.meta.env.VITE_REVERB_APP_KEY,
      wsHost: import.meta.env.VITE_REVERB_HOST,
      wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
      wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
      forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
      enabledTransports: ['ws', 'wss'],
      authorizer: (channel, options) => {
        return {
          authorize: (socketId, callback) => {
            axios.post('http://127.0.0.1:8000/api/broadcasting/auth', {
              socket_id: socketId,
              channel_name: channel.name
            }, {
              headers: {
                'X-XSRF-TOKEN': getCookie('csrftoken'),
                'Authorization': `Bearer ${user?.token}`,
              },
            })
              .then(response => {
                callback(false, response.data);
              })
              .catch(error => {
                callback(true, error);
              });
          }
        };
      },
    })
     window.Echo.join(`groupe-messages.1`)
    .here((users) => {
        console.log("list users: ", users)
        setMembers(users);
          
    })
    .joining((user) => {
        console.log(user.username, ": join");
        addMember(user);
    })
    .leaving((user) => {
        console.log(user.username, ": leaving");
        removeMember(user.id);
    })
    .listen('GroupeMessageEvent', (e) => {
      setMessages(prevMessages => [...prevMessages, e.message]);

    })
    .listenForWhisper('typing', (user) => {
      console.log('typing : ', user);
      startTyping(user);
    })
    .listenForWhisper('stop-typing', (user) => {
      console.log('stop-typing : ', user);

      stopTyping(user);
    });

    return () => {
      window.Echo.leaveChannel('groupe-messages.1');
    };
  }, [user, setMessages,addMember, removeMember, setMembers, startTyping, stopTyping]);
};

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

export default useEcho;
