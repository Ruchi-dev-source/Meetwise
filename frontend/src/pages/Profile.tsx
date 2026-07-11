import { useState } from "react";
import {
  Camera,
  MapPin,
  Calendar,
  Link2Off,
  Link2,
  User,
  Edit,
  Mail,
  Phone,
  Briefcase,
  Building,
  Save,
} from "lucide-react";
import { currentUser } from "@/data/mock";

export function Profile() {
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(false);
  const [googleConnected, setGoogleConnected] = useState(true);
  const [outlookConnected, setOutlookConnected] = useState(false);

  const [personal, setPersonal] = useState({
    firstName: currentUser.name.split(" ")[0],
    lastName: currentUser.name.split(" ")[1] ?? "",
    email: "alex.rivera@company.com",
    phone: "+1 (555) 123-4567",
  });

  const [company, setCompany] = useState({
    role: "Product Director",
    department: "Product Management",
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 md:py-12 flex flex-col gap-8">
      <header>
        <h2 className="font-display text-2xl font-bold text-white tracking-tight">Profile Settings</h2>
        <p className="text-xs text-gray-400 mt-1">Configure your personal parameters and calendar synchronizations.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left panel */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-card rounded-2xl p-6 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-r from-primary/20 to-pinky/20" />
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white/10 mt-6 mb-4 group cursor-pointer bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold">
              {currentUser.initials}
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                <Camera className="text-white w-5 h-5" />
              </div>
            </div>
            <h3 className="font-display text-base font-bold text-white">{currentUser.name}</h3>
            <p className="text-xs text-primary font-medium mt-0.5">{company.role}</p>
            <div className="mt-4 w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] text-gray-400 flex items-center justify-center gap-1.5 uppercase font-semibold">
              <MapPin className="w-3.5 h-3.5 text-accent" /> San Francisco, CA
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 flex flex-col gap-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" /> Calendar Integrations
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[10px] font-bold text-gray-700">
                    G
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white leading-tight">Google Cal</p>
                    <p className={`text-[9px] font-bold uppercase mt-0.5 ${googleConnected ? "text-accent" : "text-gray-500"}`}>
                      {googleConnected ? "Connected" : "Disconnected"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setGoogleConnected((v) => !v)}
                  className="text-gray-500 hover:text-pinky transition-colors"
                  title={googleConnected ? "Disconnect" : "Connect"}
                >
                  {googleConnected ? <Link2Off className="w-4 h-4" /> : <Link2 className="w-4 h-4 text-primary" />}
                </button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/5 hover:border-white/10 transition-colors group">
                <div className="flex items-center gap-3 opacity-70 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[10px] font-bold text-blue-600">
                    O
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white leading-tight">Outlook</p>
                    <p className={`text-[9px] font-bold uppercase mt-0.5 ${outlookConnected ? "text-accent" : "text-gray-500"}`}>
                      {outlookConnected ? "Connected" : "Disconnected"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setOutlookConnected((v) => !v)}
                  className="text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                  title={outlookConnected ? "Disconnect" : "Connect"}
                >
                  {outlookConnected ? <Link2Off className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="glass-card rounded-2xl p-6 relative">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <User className="w-4 h-4 text-primary" /> Personal Details
              </h4>
              <button
                onClick={() => setEditingPersonal((v) => !v)}
                className="text-primary hover:text-white hover:bg-white/5 border border-primary/20 rounded-lg px-2.5 py-1 text-xs transition-colors flex items-center gap-1.5"
              >
                {editingPersonal ? <Save className="w-3.5 h-3.5" /> : <Edit className="w-3.5 h-3.5" />}
                {editingPersonal ? "Save" : "Edit"}
              </button>
            </div>
            <form
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              onSubmit={(e) => {
                e.preventDefault();
                setEditingPersonal(false);
              }}
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">First Name</label>
                <input
                  className="bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50 transition-all disabled:opacity-70"
                  disabled={!editingPersonal}
                  type="text"
                  value={personal.firstName}
                  onChange={(e) => setPersonal((p) => ({ ...p, firstName: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Last Name</label>
                <input
                  className="bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50 transition-all disabled:opacity-70"
                  disabled={!editingPersonal}
                  type="text"
                  value={personal.lastName}
                  onChange={(e) => setPersonal((p) => ({ ...p, lastName: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    className="bg-white/5 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 w-full text-xs text-white focus:outline-none focus:border-primary/50 transition-all disabled:opacity-70"
                    disabled={!editingPersonal}
                    type="email"
                    value={personal.email}
                    onChange={(e) => setPersonal((p) => ({ ...p, email: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    className="bg-white/5 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 w-full text-xs text-white focus:outline-none focus:border-primary/50 transition-all disabled:opacity-70"
                    disabled={!editingPersonal}
                    type="tel"
                    value={personal.phone}
                    onChange={(e) => setPersonal((p) => ({ ...p, phone: e.target.value }))}
                  />
                </div>
              </div>
            </form>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-primary" /> Company Details
              </h4>
              <button
                onClick={() => setEditingCompany((v) => !v)}
                className="text-primary hover:text-white hover:bg-white/5 border border-primary/20 rounded-lg px-2.5 py-1 text-xs transition-colors flex items-center gap-1.5"
              >
                {editingCompany ? <Save className="w-3.5 h-3.5" /> : <Edit className="w-3.5 h-3.5" />}
                {editingCompany ? "Save" : "Edit"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Organization</label>
                <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-xl p-3">
                  <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-primary">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">Halcyon Collective</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">Enterprise Plan</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Role / Title</label>
                <input
                  className="bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50 transition-all disabled:opacity-70"
                  disabled={!editingCompany}
                  type="text"
                  value={company.role}
                  onChange={(e) => setCompany((c) => ({ ...c, role: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Department</label>
                <select
                  className="bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50 transition-all disabled:opacity-70"
                  disabled={!editingCompany}
                  value={company.department}
                  onChange={(e) => setCompany((c) => ({ ...c, department: e.target.value }))}
                >
                  <option>Product Management</option>
                  <option>Engineering</option>
                  <option>Design</option>
                  <option>Marketing</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
