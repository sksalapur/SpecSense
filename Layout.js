import React from 'react';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <main>{children}</main>
    </div>
  );
}