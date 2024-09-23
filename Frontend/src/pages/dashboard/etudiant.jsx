import { Helmet } from 'react-helmet-async';

import AppView from 'src/sections/overview/view/app-view-e';

// ----------------------------------------------------------------------

export default function AppPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard | Admin </title>
      </Helmet>

      <AppView />
    </>
  );
}
