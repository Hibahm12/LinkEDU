import { lazy,Suspense } from 'react';
import { Navigate,Outlet,useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';
import useAuthStore from '../store/auth';


// Notice the empty line here, separating imports from the rest of the code
export const IndexPage2 = lazy(() => import('src/pages/dashboard/professeur'));
export const Demande = lazy(() => import('src/pages/dashboard/demonde-prof'));
export const IndexPage1 = lazy(() => import('src/pages/dashboard/etudiant'));
export const IndexPage = lazy(() => import('src/pages/dashboard/admin'));
export const Bibliotheque = lazy(() => import('src/sections/overview/view/etudiant/Bibliotheque'));
export const KanbanBoard = lazy(() => import('src/pages/kanban/KanbanBoard'));
export const Chat = lazy(() => import('src/pages/chat/chat'));
export const ChatGroupe = lazy(() => import('src/pages/chat-groupe/ChatGroupe'));
export const Parameter = lazy(() => import('src/pages/parameter/parameter-etudiant'));
export const ParameterA = lazy(() => import('src/pages/parameter/parameter-admin'));
export const UserPageE = lazy(() => import('src/pages/table/DataTable_etudiant'));
export const UserPageP = lazy(() => import('src/pages/table/DataTable_prof'));
export const UserPageS = lazy(() => import('src/pages/table/DataTable_sujet'));
export const UserPageSx = lazy(() => import('src/pages/table/DataTable_sujetextern'));
export const LoginPage = lazy(() => import('src/pages/Auth/login'));
export const Password = lazy(() => import('src/pages/Auth/ForgotPassword'));
export const ResetPassword = lazy(() => import('src/pages/Auth/ResetPassword'));
export const TeamCard = lazy(() => import('src/pages/Team/team-view'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const HomeEtud = lazy(() => import('src/pages/etudiant/index'));
export const InternPage = lazy(() => import('src/pages/etudiant/intern'));
export const ExternPage = lazy(() => import('src/pages/etudiant/extern'));
export const GroupsPage = lazy(() => import('src/pages/etudiant/Groups'));
export const Attender = lazy(() => import('src/pages/etudiant/Attender'));
export const HomeEtudiant = lazy(() => import('src/pages/etudiant/homeEtudiant'));
export const Home = lazy(() => import('src/pages/Home/components/Header/Home'));


// ----------------------------------------------------------------------
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);


  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default function Router() {
  const groupId = useAuthStore((state) => state.groupId);
  const routes = useRoutes([
    {

      element: (
        <ProtectedRoute>
          <DashboardLayout>
            <Suspense fallback={<div>Loading...</div>}>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </ProtectedRoute>
      ),
      children: [
        { path: 'Espace-Etudiant',element: <IndexPage1 />,index: true },
        { path: 'Espace-Etudiant/Team',element: <TeamCard groupeId={groupId} /> },
        { path: '/Espace-Etudiant/KanbanBoard',element: <KanbanBoard groupeId={1} /> },
        { path: '/Espace-Etudiant/chat-groupe',element: <ChatGroupe /> },
        { path: '/Espace-Etudiant/chat/:conversation_id',element: <Chat /> },

        { path: '/Espace-Etudiant/Parameter',element: <Parameter /> },
        { path: '/Espace-Etudiant/Bibliotheque',element: <Bibliotheque />,index: true },
        { path: 'Espace-Professeur',element: <IndexPage2 />,index: true },
        { path: '/Espace-Professeur/Demande',element: <Demande />,index: true },
        { path: '/Espace-Professeur/group',element: <GroupsPage />,index: true },
        { path: '/Espace-Professeur/KanbanBoard',element: <KanbanBoard groupeId={groupId} /> },
        { path: 'Admin',element: <IndexPage />,index: true },
        { path: 'Admin/user-etudiant',element: <UserPageE /> },
        { path: 'Admin/user-professeur',element: <UserPageP /> },
        { path: 'Admin/user-sujet',element: <UserPageS /> },
        { path: 'Admin/user-sujetextern',element: <UserPageSx /> },
        { path: '/Admin/Parameter',element: <ParameterA /> },

      ],
    },{
      path: 'Espace-Etudiant/Attender',element: <Attender />
    },
    {
      path: 'Espace-Etudiant/home',element: <HomeEtudiant />
    },{
      path: 'intern',element: <InternPage />  // New intern page route
      // New extern page route
    },{
      path: 'extern',element: <ExternPage />
    },{ path: 'Groups',element: <GroupsPage /> },
    {
      path: '',
      element: <LoginPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: 'Home',
      element: <Home />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
    {
      path: 'forgot-password',
      element: <Password />,

    },{
      path: 'ResetPassword',
      element: <ResetPassword />,

    },

  ]);

  return routes;
}