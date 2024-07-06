import React, { useEffect, useMemo, useState } from 'react';
import AppBar from './components/Bars/TopBar';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import SettingsPage from "./pages/SettingsPage";

const router = createBrowserRouter([
  {
    path: "*",
    element: <SettingsPage />,
  },
]);

function App() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row h-[7vh] min-h-[50px]">
        <AppBar />
      </div>
      <div className='flex flex-row min-h-[93vh]  bg-solid-primary-main'>
        {/* <SideBar /> */}
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;
