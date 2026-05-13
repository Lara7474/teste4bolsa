import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 min-h-screen overflow-x-hidden">
        <div className="p-4 md:p-6 lg:p-8 pt-14 md:pt-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
