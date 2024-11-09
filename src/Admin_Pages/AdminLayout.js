import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Admin components/Sidebar';
import Topbar from '../Admin components/Topbar';

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <main className="p-4 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
