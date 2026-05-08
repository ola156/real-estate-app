"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/client";
import { 
  Trash2, User, Mail, Shield, 
  Link as LinkIcon, ExternalLink, Loader2, Search, XCircle, CheckCircle 
} from "lucide-react";
import { toast } from "sonner";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // Toggle Agent Link (Enable/Disable)
  const handleToggleAgentLink = async (agentId, currentStatus) => {
    const { error } = await supabase
      .from("profiles")
      .update({ is_link_active: !currentStatus })
      .eq("id", agentId);

    if (error) {
      toast.error("Update failed");
    } else {
      toast.success(currentStatus ? "Link Disabled" : "Link Enabled");
      // Update local state instead of refetching for speed
      setUsers(users.map(u => u.id === agentId ? { ...u, is_link_active: !currentStatus } : u));
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure? This will remove the profile permanently.")) return;

    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", userId);

    if (error) {
      toast.error("Error deleting user");
    } else {
      toast.success("User removed");
      setUsers(users.filter((u) => u.id !== userId));
    }
  };

  const copyAgentLink = (agencyName) => {
    const url = `${window.location.origin}/agent/${encodeURIComponent(agencyName)}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied!");
  };

  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.agency_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Responsive Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Management</h1>
            <p className="text-slate-500 text-sm md:text-base font-medium">Control permissions for the Instrict ecosystem.</p>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search email or agency..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Responsive Table Wrapper */}
        <div className="overflow-x-auto bg-white border border-slate-100 rounded-[1.5rem] md:rounded-[2rem] shadow-xl shadow-slate-200/50">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">User / Agency</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Role</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="4" className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" /></td></tr>
              ) : filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="hidden sm:flex w-10 h-10 bg-slate-100 rounded-xl items-center justify-center text-slate-400">
                        <User size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{user.agency_name || "N/A"}</p>
                        <p className="text-[11px] text-slate-500 truncate max-w-[150px]">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter ${
                      user.role === 'admin' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {user.role || 'user'}
                    </span>
                  </td>
                  <td className="p-6">
                    {user.role === 'agent' && (
                      <button 
                        onClick={() => handleToggleAgentLink(user.id, user.is_link_active)}
                        className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border transition-all ${
                          user.is_link_active 
                            ? 'border-emerald-200 text-emerald-600 bg-emerald-50' 
                            : 'border-rose-200 text-rose-600 bg-rose-50'
                        }`}
                      >
                        {user.is_link_active ? <CheckCircle size={12}/> : <XCircle size={12}/>}
                        {user.is_link_active ? "Active" : "Disabled"}
                      </button>
                    )}
                  </td>
                  <td className="p-6">
                    <div className="flex items-center justify-end gap-1 md:gap-2">
                      {user.role === 'agent' && (
                        <button 
                          onClick={() => copyAgentLink(user.agency_name)}
                          className={`p-2 rounded-lg transition-all ${
                            user.is_link_active 
                              ? 'text-slate-400 hover:text-blue-600 hover:bg-blue-50' 
                              : 'text-slate-200 cursor-not-allowed'
                          }`}
                          disabled={!user.is_link_active}
                          title="Copy Public Link"
                        >
                          <LinkIcon size={18} />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && filteredUsers.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 font-medium">No users found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}