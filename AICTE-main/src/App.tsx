import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { SimpleNavbar } from './components/layout/SimpleNavbar';
import { CollegeView } from './pages/CollegeView';
import { AicteView } from './pages/AicteView';
import { SimpleLoginPage } from './pages/SimpleLoginPage';
import { UploadDocumentModal } from './components/modals/UploadDocumentModal';
import { AiAgentModal } from './components/modals/AiAgentModal';
import { DocumentDetailDrawer } from './components/modals/DocumentDetailDrawer';
import { MailboxModal } from './components/modals/MailboxModal';
import { ToastContainer } from './components/common/ToastContainer';

const AppContent: React.FC = () => {
  const {
    currentUser,
    isAuthenticated,
    selectedDoc,
    setSelectedDoc,
  } = useApp();

  if (!isAuthenticated) {
    return <SimpleLoginPage />;
  }

  return (
    <div className="min-h-screen bg-[#F4F9FF] text-[#183153] flex flex-col font-sans">
      {/* Clean Top Navigation with 1-Click Role Switcher */}
      <SimpleNavbar />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {currentUser.role === 'college' ? <CollegeView /> : <AicteView />}
        </div>
      </main>

      {/* Global Modals & Drawers */}
      <UploadDocumentModal />
      <AiAgentModal />
      <MailboxModal />
      <DocumentDetailDrawer
        document={selectedDoc}
        onClose={() => setSelectedDoc(null)}
      />
      <ToastContainer />
    </div>
  );
};


export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
