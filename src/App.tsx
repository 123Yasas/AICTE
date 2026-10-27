import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { ToastContainer } from './components/common/ToastContainer';

// Import All Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { ApplicationsListPage } from './pages/ApplicationsListPage';
import { ApplicationWizardPage } from './pages/ApplicationWizardPage';
import { ApplicationDetailPage } from './pages/ApplicationDetailPage';
import { DocumentUploadPage } from './pages/DocumentUploadPage';
import { OCRExtractionPage } from './pages/OCRExtractionPage';
import { ValidationResultsPage } from './pages/ValidationResultsPage';
import { AnomalyDetectionPage } from './pages/AnomalyDetectionPage';
import { DocumentAuthPage } from './pages/DocumentAuthPage';
import { ComplianceCheckerPage } from './pages/ComplianceCheckerPage';
import { InfrastructureReviewPage } from './pages/InfrastructureReviewPage';
import { DeficiencyManagementPage } from './pages/DeficiencyManagementPage';
import { OfficerWorkspacePage } from './pages/OfficerWorkspacePage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ReportsPage } from './pages/ReportsPage';
import { AuditTrailPage } from './pages/AuditTrailPage';
import { RuleConfigPage } from './pages/RuleConfigPage';
import { UserManagementPage } from './pages/UserManagementPage';
import { SettingsPage } from './pages/SettingsPage';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const { isAuthenticated } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPage onLaunch={() => setActiveTab(isAuthenticated ? 'dashboard' : 'login')} setActiveTab={setActiveTab} />;
      case 'login':
        return <LoginPage setActiveTab={setActiveTab} onLoginSuccess={() => setActiveTab('dashboard')} />;
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />;
      case 'applications':
        return <ApplicationsListPage setActiveTab={setActiveTab} />;
      case 'create-application':
        return <ApplicationWizardPage setActiveTab={setActiveTab} />;
      case 'application-detail':
        return <ApplicationDetailPage setActiveTab={setActiveTab} />;
      case 'document-upload':
        return <DocumentUploadPage setActiveTab={setActiveTab} />;
      case 'ocr-extraction':
        return <OCRExtractionPage setActiveTab={setActiveTab} />;
      case 'validation-results':
        return <ValidationResultsPage setActiveTab={setActiveTab} />;
      case 'anomaly-detection':
        return <AnomalyDetectionPage setActiveTab={setActiveTab} />;
      case 'document-auth':
        return <DocumentAuthPage setActiveTab={setActiveTab} />;
      case 'compliance-checker':
        return <ComplianceCheckerPage setActiveTab={setActiveTab} />;
      case 'infrastructure-review':
        return <InfrastructureReviewPage setActiveTab={setActiveTab} />;
      case 'deficiency-management':
        return <DeficiencyManagementPage setActiveTab={setActiveTab} />;
      case 'officer-workspace':
        return <OfficerWorkspacePage setActiveTab={setActiveTab} />;
      case 'notifications':
        return <NotificationsPage setActiveTab={setActiveTab} />;
      case 'reports':
        return <ReportsPage setActiveTab={setActiveTab} />;
      case 'audit-trail':
        return <AuditTrailPage setActiveTab={setActiveTab} />;
      case 'rule-config':
        return <RuleConfigPage setActiveTab={setActiveTab} />;
      case 'user-management':
        return <UserManagementPage setActiveTab={setActiveTab} />;
      case 'settings':
        return <SettingsPage setActiveTab={setActiveTab} />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  const isFullWidthPage = activeTab === 'landing' || activeTab === 'login';

  return (
    <div className="min-h-screen bg-[#F4F9FF] text-[#183153] flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Container with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {!isFullWidthPage && (
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
          />
        )}

        <main className="flex-1 overflow-y-auto">
          <div className={`${isFullWidthPage ? '' : 'p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto'}`}>
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Global Interactive Toast Notification System */}
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
