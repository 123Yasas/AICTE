import React from 'react';
import { useApp } from '../context/AppContext';
import { DEMO_USERS } from '../data/mockData';
import { Badge } from '../components/common/Badge';
import { Users, Shield, Building, Mail, CheckCircle2 } from 'lucide-react';

interface UserManagementPageProps {
  setActiveTab: (tab: string) => void;
}

export const UserManagementPage: React.FC<UserManagementPageProps> = ({ setActiveTab }) => {
  const { applications, currentUser, switchRole } = useApp();

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-2xl font-extrabold text-[#183153] tracking-tight">User & Institution Management</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Role-based access directory, regional scrutiny officers, and affiliated institutions
        </p>
      </div>

      <div className="bg-white p-6 rounded-[22px] border border-sky-100 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[#183153]">Registered Demo Profiles</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DEMO_USERS.map((user) => (
            <div
              key={user.id}
              className={`p-4 rounded-2xl border text-xs flex flex-col justify-between space-y-3 ${
                currentUser.id === user.id
                  ? 'bg-sky-50/50 border-[#0284C7] ring-2 ring-sky-100 shadow-xs'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-xl object-cover" />
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{user.name}</h4>
                  <p className="text-[11px] text-slate-500">{user.email}</p>
                </div>
              </div>

              <div>
                <Badge variant={user.role === 'admin' ? 'purple' : user.role === 'officer' ? 'teal' : 'info'} size="sm">
                  {user.role.toUpperCase()}
                </Badge>
                <div className="text-[11px] font-semibold text-slate-700 mt-1">{user.designation}</div>
              </div>

              <button
                onClick={() => switchRole(user.role)}
                className="w-full py-2 bg-white border border-sky-200 text-[#0284C7] font-bold rounded-xl text-xs hover:bg-sky-50 transition-colors"
              >
                {currentUser.id === user.id ? 'Currently Active' : 'Switch to this User'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Participating Institutions */}
      <div className="bg-white p-6 rounded-[22px] border border-sky-100 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[#183153]">Technical Institutions Registered ({applications.length})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-slate-600 border-b border-slate-100">
              <tr>
                <th className="py-2.5 px-3 font-bold">Institution ID</th>
                <th className="py-2.5 px-3 font-bold">Institution Name</th>
                <th className="py-2.5 px-3 font-bold">State</th>
                <th className="py-2.5 px-3 font-bold">Intake</th>
                <th className="py-2.5 px-3 font-bold">Faculty</th>
                <th className="py-2.5 px-3 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono font-bold text-[#0284C7]">{a.institutionId}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-800">{a.institutionName}</td>
                  <td className="py-2.5 px-3 text-slate-600">{a.state}</td>
                  <td className="py-2.5 px-3 text-slate-700">{a.totalIntake}</td>
                  <td className="py-2.5 px-3 text-slate-700">{a.facultyCount}</td>
                  <td className="py-2.5 px-3">
                    <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
