import React, { useState } from 'react';
import {
  X,
  Mail,
  ShieldAlert,
  AlertTriangle,
  Key,
  CheckCircle2,
  Clock,
  ExternalLink,
  CheckCheck,
  FileText,
  Building,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { InstitutionalEmailMessage } from '../../types/verification';

export const MailboxModal: React.FC = () => {
  const {
    isMailboxOpen,
    setIsMailboxOpen,
    institutionalEmails,
    currentUser,
    markEmailAsRead,
    markAllEmailsAsRead,
    setSelectedDoc,
    documents,
  } = useApp();

  const [selectedEmail, setSelectedEmail] = useState<InstitutionalEmailMessage | null>(null);

  if (!isMailboxOpen) return null;

  // Filter messages for current user
  const userEmails = institutionalEmails.filter(
    (e) => currentUser.role === 'aicte' || e.toEmail.toLowerCase() === currentUser.email.toLowerCase()
  );

  const activeEmail = selectedEmail || (userEmails.length > 0 ? userEmails[0] : null);

  const handleSelectEmail = (email: InstitutionalEmailMessage) => {
    setSelectedEmail(email);
    markEmailAsRead(email.id);
  };

  const getCategoryBadge = (category: InstitutionalEmailMessage['category']) => {
    switch (category) {
      case 'Forgery / Tampering Rejection':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-800 border border-red-200">
            <ShieldAlert className="w-3 h-3 text-red-600" /> Fraud / Alteration Notice
          </span>
        );
      case 'Payment Expired Rejection':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" /> Non-Payment Termination
          </span>
        );
      case 'OTP':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <Key className="w-3 h-3 text-blue-600" /> 2FA Authentication
          </span>
        );
      case 'Approval Notice':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-800 border border-green-200">
            <CheckCircle2 className="w-3 h-3 text-green-600" /> Regulatory Clearance
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
            <FileText className="w-3 h-3 text-slate-600" /> Official Memo
          </span>
        );
    }
  };

  const handleOpenLinkedDocument = (docId?: string) => {
    if (!docId) return;
    const doc = documents.find((d) => d.id === docId);
    if (doc) {
      setIsMailboxOpen(false);
      setSelectedDoc(doc);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Top Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">Institutional Regulatory Mailbox</h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Live Dispatch
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Official AICTE regulatory communications dispatched to <strong className="text-slate-200">{currentUser.email}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markAllEmailsAsRead}
              className="text-xs font-medium text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-800 transition flex items-center gap-1 border border-slate-700"
              title="Mark all as read"
            >
              <CheckCheck className="w-3.5 h-3.5 text-blue-400" /> Mark All Read
            </button>
            <button
              onClick={() => setIsMailboxOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mailbox Split Container */}
        <div className="flex-1 flex overflow-hidden">
          {/* Email List Sidebar */}
          <div className="w-full md:w-5/12 border-r border-slate-200 flex flex-col bg-slate-50/50">
            <div className="p-3 border-b border-slate-200 bg-white flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>{userEmails.length} Official Messages</span>
              <span className="flex items-center gap-1 text-blue-600 font-semibold">
                <Building className="w-3 h-3" /> {currentUser.institutionName || 'AICTE Desk'}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {userEmails.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <Mail className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm font-medium">No messages in mailbox</p>
                  <p className="text-xs mt-1">Regulatory notices and OTP codes will arrive here.</p>
                </div>
              ) : (
                userEmails.map((email) => {
                  const isSelected = activeEmail?.id === email.id;
                  return (
                    <button
                      key={email.id}
                      onClick={() => handleSelectEmail(email)}
                      className={`w-full text-left p-4 transition flex flex-col gap-1.5 relative ${
                        isSelected
                          ? 'bg-blue-50/80 border-l-4 border-blue-600'
                          : email.read
                          ? 'bg-white hover:bg-slate-50'
                          : 'bg-white font-medium hover:bg-slate-50'
                      }`}
                    >
                      {!email.read && (
                        <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-blue-600 ring-4 ring-blue-100" />
                      )}
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span className="font-semibold text-slate-700">{email.from}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {email.date}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-900 line-clamp-1">
                        {email.subject}
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        {getCategoryBadge(email.category)}
                        {email.documentId && (
                          <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {email.documentId}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Email Reading View */}
          <div className="hidden md:flex flex-1 flex-col bg-white overflow-y-auto">
            {activeEmail ? (
              <div className="p-6 flex flex-col h-full">
                {/* Header Information */}
                <div className="border-b border-slate-200 pb-5 mb-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="text-lg font-bold text-slate-900 leading-snug">
                      {activeEmail.subject}
                    </h3>
                    <div className="shrink-0">{getCategoryBadge(activeEmail.category)}</div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 space-y-1.5 border border-slate-200">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">From:</span>
                      <span className="font-semibold text-slate-800">{activeEmail.from}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">To:</span>
                      <span className="font-semibold text-slate-800">{activeEmail.toEmail} ({activeEmail.toInstitutionName})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Date Dispatched:</span>
                      <span className="font-mono text-slate-700">{activeEmail.date}</span>
                    </div>
                    {activeEmail.regulatoryCitation && (
                      <div className="flex justify-between pt-1 border-t border-slate-200 text-blue-900">
                        <span className="text-blue-700 font-semibold">Statutory Authority:</span>
                        <span className="font-semibold">{activeEmail.regulatoryCitation}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Body Content */}
                <div
                  className="prose prose-slate prose-sm max-w-none flex-1 overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: activeEmail.bodyHtml }}
                />

                {/* Footer Actions */}
                {activeEmail.documentId && (
                  <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between bg-slate-50 p-4 rounded-xl">
                    <div>
                      <div className="text-xs font-semibold text-slate-800">
                        Associated Application: <span className="font-mono text-blue-600">{activeEmail.documentId}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">{activeEmail.documentTitle}</div>
                    </div>
                    <button
                      onClick={() => handleOpenLinkedDocument(activeEmail.documentId)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Inspect Document in Scrutiny Desk
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400">
                <div>
                  <Mail className="w-12 h-12 mx-auto mb-3 opacity-30 text-slate-400" />
                  <p className="text-sm font-semibold text-slate-600">Select an official communication</p>
                  <p className="text-xs text-slate-400 mt-1">Click on any message in the list to inspect full regulatory text.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>AICTE National Regulatory Scrutiny & Notification Gateway v2026</span>
          <span className="font-mono text-slate-600">Encrypted AES-256 Transport Protocol</span>
        </div>
      </div>
    </div>
  );
};
