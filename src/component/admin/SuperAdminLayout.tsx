"use client";
import React from "react";
import { SuperAdminHeader } from "./SuperAdminHeader";
import { SuperAdminNavbar } from "./SuperAdminNavbar";

interface SuperAdminLayoutProps {
  children: React.ReactNode;
  user?: {
    name?: string;
    email?: string;
    role?: string;
  };
}

export const SuperAdminLayout = ({ children, user }: SuperAdminLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Super Admin Header */}
      <SuperAdminHeader user={user} />
      
      {/* Super Admin Sidebar Navigation */}
      <SuperAdminNavbar />
      
      {/* Main Content */}
      <main className="ml-64 pt-16">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default SuperAdminLayout;
