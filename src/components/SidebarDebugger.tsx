"use client";

import { useSidebar } from "@/components/ui/sidebar";

export default function SidebarDebugger() {
  const { state, open, isMobile, openMobile } = useSidebar();
  
  return (
    <div 
      className="fixed top-4 right-4 z-[9999] bg-red-500 text-white p-4 rounded shadow-lg text-sm"
      style={{ zIndex: 99999 }}
    >
      <div>State: {state}</div>
      <div>Open: {open.toString()}</div>
      <div>IsMobile: {isMobile.toString()}</div>
      <div>OpenMobile: {openMobile.toString()}</div>
    </div>
  );
}