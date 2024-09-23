// navigation-admin.js
import SvgColor from 'src/components/svg-color';

// Helper function to generate icons
const icon = (names) => (
  <SvgColor src={`/assets/icons/navbar/${names}.svg`} sx={{ width: 1,height: 1 }} />
);
const auth = sessionStorage.getItem('auth') ? JSON.parse(sessionStorage.getItem('auth')) : null;
console.log('auth',auth);


const etudiantNav = [
  {
    title: 'dashboard',
    path: '/Espace-Etudiant',
    icon: icon('ic_analytics'),
  },{
    title: 'Team',
    path: '/Espace-Etudiant/Team',
    icon: icon('ic_user'),
  },{
    title: 'Kanban',
    path: '/Espace-Etudiant/KanbanBoard',
    icon: icon('ic_kanban'),
  },{
    title: 'Chat',
    path: '/Espace-Etudiant/chat-groupe',
    icon: icon('ic_chat'),
  },
  {
    title: 'Espace Etudiant',
    path: '/Espace-Etudiant/home',
    icon: icon('ic_espace'),
  },{
    title: 'Parameter',
    path: '/Espace-Etudiant/Parameter',
    icon: icon('ic_parameter'),
  },


];


const professeurNav = [

  { title: 'Dashboard',path: '/Espace-Professeur',icon: icon('ic_analytics') },
  { title: 'Demande',path: '/Espace-Professeur/Demande',icon: icon('ic_demande') },
  { title: 'Groups',path: '/Espace-Professeur/group',icon: icon('ic_group') },
  { title: 'Chat',path: '/Espace-Professeur/chat',icon: icon('ic_chat') },{
    title: 'Kanban',
    path: '/Espace-Professeur/KanbanBoard',
    icon: icon('ic_kanban'),
  },
  {
    title: 'Dashboar',
    path: '/Espace-Professeur',
    icon: icon('ic_analytics')
  },
  {
    title: 'Chat',
    path: '/Espace-Etudiant/Chat',
    icon: icon('ic_chat'),
  },
  {
    title: 'Demande',
    path: '/Espace-Professeur/Demande',
    icon: icon('ic_analytics')
  }


];
const adminNav = [
  {
    title: 'dashboard',
    path: '/admin',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Liste Etudiant',
    path: '/Admin/user-etudiant',
    icon: icon('ic_listeE'),
  },
  {
    title: 'Liste Professeur',
    path: 'Admin/user-professeur',
    icon: icon('ic_listeE'),
  },
  {
    title: 'Liste Sujet',
    path: 'Admin/user-sujet',
    icon: icon('ic_listeE'),
  },
  {
    title: 'Liste Sujet Extern',
    path: 'Admin/user-sujetextern',
    icon: icon('ic_listeE'),
  },
  {
    title: 'Parameter',
    path: '/Admin/Parameter',
    icon: icon('ic_parameter'),
  },
]
const navConfig = (role) => spicifyRole(role);
//auth?.state?.user?.role

function spicifyRole(rol) {
  if (rol === 'admin') {
    return adminNav;
  };
  if (rol === 'etudiant') {
    return etudiantNav;
  };
  return professeurNav;
}
export default navConfig;
