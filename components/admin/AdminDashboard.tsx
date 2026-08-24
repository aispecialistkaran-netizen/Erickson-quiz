'use client';

import React, { useState } from 'react';
import { LeadDoc } from '@/types';
import { Button } from '@/components/ui/Button';
import { QUESTIONS } from '@/config/assessment';
import {
  Users,
  TrendingUp,
  Flame,
  Award,
  Download,
  Search,
  Filter,
  Eye,
  LogOut,
  BarChart3,
  Calendar,
  ShieldCheck,
  X,
  FileText,
  UserCheck,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts';

interface AdminDashboardProps {
  leads: LeadDoc[];
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ leads, onLogout }) => {
  const [search, setSearch] = useState('');
  const [tempFilter, setTempFilter] = useState<string>('all');
  const [pathFilter, setPathFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<LeadDoc | null>(null);

  // Compute Metrics
  const totalLeads = leads.length;
  const hotLeads = leads.filter((l) => l.leadTemperature === 'hot').length;
  const warmLeads = leads.filter((l) => l.leadTemperature === 'warm').length;
  const nurtureLeads = leads.filter((l) => l.leadTemperature === 'nurture').length;

  const avgScore =
    totalLeads > 0
      ? Math.round(leads.reduce((acc, l) => acc + (l.overallScore || 0), 0) / totalLeads)
      : 0;

  // Career Path Chart Data
  const careerPathCounts: Record<string, number> = {};
  leads.forEach((l) => {
    const key = l.careerPath || 'exploration';
    careerPathCounts[key] = (careerPathCounts[key] || 0) + 1;
  });

  const careerChartData = [
    { name: 'Professional Coach', count: careerPathCounts.professional_coach || 0, color: '#F4B740' },
    { name: 'Portfolio Career', count: careerPathCounts.portfolio_career || 0, color: '#167FA3' },
    { name: 'Leader-as-Coach', count: careerPathCounts.leader_as_coach || 0, color: '#FFD978' },
    { name: 'HR / People Dev', count: careerPathCounts.hr_people_dev || 0, color: '#1F9D73' },
    { name: 'Exploration', count: careerPathCounts.exploration || 0, color: '#64757D' },
  ];

  // Timeline Intent Data
  const timelineCounts: Record<string, number> = {};
  leads.forEach((l) => {
    const key = l.timeline || 'Exploring';
    timelineCounts[key] = (timelineCounts[key] || 0) + 1;
  });

  const timelineChartData = Object.keys(timelineCounts).map((key) => ({
    name: key,
    value: timelineCounts[key],
  }));

  // Filtering Logic
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      `${lead.firstName} ${lead.lastName} ${lead.email} ${lead.phone} ${lead.role} ${lead.city}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesTemp = tempFilter === 'all' || lead.leadTemperature === tempFilter;
    const matchesPath = pathFilter === 'all' || lead.careerPath === pathFilter;

    return matchesSearch && matchesTemp && matchesPath;
  });

  // CSV Export Handler
  const exportCSV = () => {
    if (!filteredLeads.length) return;

    const headers = [
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'Role',
      'City',
      'Overall Score',
      'Readiness Band',
      'Lead Temperature',
      'Career Path',
      'Timeline',
      'Primary Motivation',
      'Primary Barrier',
      'Credential Interest',
      'UTM Source',
      'UTM Campaign',
      'Created At',
    ];

    const rows = filteredLeads.map((l) => [
      `"${l.firstName}"`,
      `"${l.lastName}"`,
      `"${l.email}"`,
      `"${l.phone}"`,
      `"${l.role || ''}"`,
      `"${l.city || ''}"`,
      l.overallScore,
      `"${l.readinessBand}"`,
      `"${l.leadTemperature}"`,
      `"${l.careerPath}"`,
      `"${l.timeline || ''}"`,
      `"${l.primaryMotivation || ''}"`,
      `"${l.primaryBarrier || ''}"`,
      `"${l.credentialInterest || ''}"`,
      `"${l.utmSource || ''}"`,
      `"${l.utmCampaign || ''}"`,
      `"${l.createdAt}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `erickson-leads-export-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#071E2A] text-white p-4 sm:p-8 select-none">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-[#FFD978]">
              Erickson Coaching India Admin Portal
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              User Intelligence &amp; Analytics Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={exportCSV}>
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>

        {/* Top KPI Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between text-[#64757D] mb-2">
              <span className="text-xs font-bold uppercase">Total Registered Users</span>
              <Users className="w-5 h-5 text-[#167FA3]" />
            </div>
            <span className="text-3xl font-extrabold text-white">{totalLeads}</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between text-[#64757D] mb-2">
              <span className="text-xs font-bold uppercase">Hot Leads</span>
              <Flame className="w-5 h-5 text-[#F4B740]" />
            </div>
            <span className="text-3xl font-extrabold text-[#F4B740]">{hotLeads}</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between text-[#64757D] mb-2">
              <span className="text-xs font-bold uppercase">Warm Leads</span>
              <TrendingUp className="w-5 h-5 text-[#FFD978]" />
            </div>
            <span className="text-3xl font-extrabold text-[#FFD978]">{warmLeads}</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between text-[#64757D] mb-2">
              <span className="text-xs font-bold uppercase">Avg Readiness Score</span>
              <Award className="w-5 h-5 text-[#1F9D73]" />
            </div>
            <span className="text-3xl font-extrabold text-[#1F9D73]">{avgScore}/100</span>
          </div>
        </div>

        {/* Visual Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Career Path Distribution Bar Chart */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#F4B740]" />
              Career Path Distribution
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={careerChartData}>
                  <XAxis dataKey="name" stroke="#64757D" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64757D" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0C3347', borderColor: '#167FA3' }} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {careerChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Timeline Intent Distribution */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#167FA3]" />
              Timeline Intent Distribution
            </h3>
            <div className="h-64 w-full flex items-center justify-center">
              {timelineChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={timelineChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                    >
                      {timelineChartData.map((_, index) => (
                        <Cell
                          key={`pie-cell-${index}`}
                          fill={['#F4B740', '#167FA3', '#1F9D73', '#64757D'][index % 4]}
                        />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0C3347', borderColor: '#167FA3' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-xs text-[#64757D]">No timeline data recorded yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Filters and Table Controls */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64757D]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search leads by name, email, phone, role..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#071E2A] border border-white/15 text-sm text-white placeholder-[#64757D] focus:outline-none focus:border-[#F4B740]"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#64757D]" />
                <select
                  value={tempFilter}
                  onChange={(e) => setTempFilter(e.target.value)}
                  className="bg-[#071E2A] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="all">All Lead Temps</option>
                  <option value="hot">Hot Leads</option>
                  <option value="warm">Warm Leads</option>
                  <option value="nurture">Nurture</option>
                </select>
              </div>

              <select
                value={pathFilter}
                onChange={(e) => setPathFilter(e.target.value)}
                className="bg-[#071E2A] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="all">All Career Paths</option>
                <option value="professional_coach">Professional Coach</option>
                <option value="portfolio_career">Portfolio Career</option>
                <option value="leader_as_coach">Leader-as-Coach</option>
                <option value="hr_people_dev">HR / People Dev</option>
                <option value="exploration">Exploration</option>
              </select>
            </div>
          </div>

          {/* Leads Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[#64757D] uppercase font-bold tracking-wider">
                  <th className="py-3 px-3">User Name</th>
                  <th className="py-3 px-3">Email &amp; Phone</th>
                  <th className="py-3 px-3">Assessment Stage</th>
                  <th className="py-3 px-3">Score</th>
                  <th className="py-3 px-3">Lead Temp</th>
                  <th className="py-3 px-3">Career Path</th>
                  <th className="py-3 px-3">Timeline</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3 text-right">User Analytics</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id || lead.email} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3 font-semibold text-white">
                      {lead.firstName} {lead.lastName}
                      {lead.role && (
                        <span className="block text-[11px] font-normal text-[#64757D]">
                          {lead.role}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-white/90">
                      <div>{lead.email}</div>
                      <div className="text-[11px] text-[#64757D]">{lead.phone}</div>
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          lead.overallScore > 0 || lead.leadStatus === 'completed'
                            ? 'bg-[#1F9D73]/20 text-[#1F9D73] border border-[#1F9D73]/40'
                            : 'bg-[#167FA3]/20 text-[#FFD978] border border-[#167FA3]/40'
                        }`}
                      >
                        {lead.overallScore > 0 || lead.leadStatus === 'completed'
                          ? 'Completed (Form 2)'
                          : 'Registered (Form 1)'}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-extrabold text-[#F4B740]">
                      {lead.overallScore} / 100
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          lead.leadTemperature === 'hot'
                            ? 'bg-[#F4B740]/20 text-[#F4B740] border border-[#F4B740]/40'
                            : lead.leadTemperature === 'warm'
                            ? 'bg-[#FFD978]/20 text-[#FFD978] border border-[#FFD978]/40'
                            : 'bg-white/10 text-[#64757D]'
                        }`}
                      >
                        {lead.leadTemperature}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-white/80 font-medium">
                      {lead.careerPath?.replace('_', ' ')}
                    </td>

                    <td className="py-3 px-3 text-white/80">{lead.timeline || 'N/A'}</td>

                    <td className="py-3 px-3 text-[#64757D]">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="inline-flex items-center gap-1 text-[#167FA3] hover:text-[#FFD978] font-bold transition-colors bg-[#167FA3]/15 px-2.5 py-1 rounded-lg border border-[#167FA3]/30"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Analytics</span>
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredLeads.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-[#64757D]">
                      No user leads match the specified criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* User Analytics Inspector Drawer / Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl p-6 sm:p-8 border-2 border-[#F4B740]/40 shadow-2xl relative space-y-6 text-left">
            <button
              onClick={() => setSelectedLead(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Profile Info */}
            <div className="border-b border-white/10 pb-4 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-[#FFD978] flex items-center gap-1.5 mb-1">
                  <UserCheck className="w-4 h-4 text-[#F4B740]" />
                  User Details &amp; Assessment Analytics
                </span>
                <h2 className="text-2xl font-extrabold text-white">
                  {selectedLead.firstName} {selectedLead.lastName}
                </h2>
                <p className="text-xs text-[#64757D] mt-0.5">
                  {selectedLead.email} · {selectedLead.phone} {selectedLead.city && `· ${selectedLead.city}`}
                </p>
              </div>

              <div className="text-right">
                <span className="text-3xl font-extrabold text-gradient-gold">
                  {selectedLead.overallScore}/100
                </span>
                <span className="block text-xs font-bold uppercase text-[#FFD978]">
                  {selectedLead.leadTemperature} Lead
                </span>
              </div>
            </div>

            {/* Score & Dimensions */}
            <div>
              <h4 className="text-xs font-bold text-[#FFD978] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-[#167FA3]" />
                5 Dimension Scores Breakdown
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {selectedLead.dimensionScores &&
                  Object.entries(selectedLead.dimensionScores).map(([key, val]) => (
                    <div key={key} className="p-3 rounded-xl bg-[#071E2A] border border-white/10 flex items-center justify-between">
                      <span className="text-white/80 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="font-extrabold text-[#F4B740]">{val}/100</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Key Qualitative Responses */}
            <div>
              <h4 className="text-xs font-bold text-[#FFD978] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#167FA3]" />
                Key Assessment Attributes
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#071E2A] border border-white/10">
                  <span className="text-[#64757D] font-bold block mb-1">Career Path:</span>
                  <span className="text-white font-semibold">{selectedLead.careerPath?.replace('_', ' ')}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#071E2A] border border-white/10">
                  <span className="text-[#64757D] font-bold block mb-1">Timeline Intent:</span>
                  <span className="text-white font-semibold">{selectedLead.timeline || 'Exploring'}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#071E2A] border border-white/10">
                  <span className="text-[#64757D] font-bold block mb-1">Primary Motivation:</span>
                  <span className="text-white font-semibold">{selectedLead.primaryMotivation || 'N/A'}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#071E2A] border border-white/10">
                  <span className="text-[#64757D] font-bold block mb-1">Primary Barrier:</span>
                  <span className="text-white font-semibold">{selectedLead.primaryBarrier || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Question by Question Answers Analytics */}
            <div>
              <h4 className="text-xs font-bold text-[#FFD978] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#1F9D73]" />
                12 Questions Analytics Summary
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {QUESTIONS.map((q) => (
                  <div key={q.id} className="p-2.5 rounded-lg bg-white/5 text-xs flex items-center justify-between">
                    <span className="text-white/80 font-medium truncate max-w-md">
                      Q{q.id}. {q.questionText}
                    </span>
                    <span className="text-[#FFD978] font-bold shrink-0 ml-2">
                      Answered
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Attribution & Metadata */}
            <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2 text-[11px] text-[#64757D]">
              <div>
                <span>UTM Source: </span>
                <span className="text-white font-semibold">{selectedLead.utmSource || 'direct'}</span>
              </div>
              <div>
                <span>UTM Campaign: </span>
                <span className="text-white font-semibold">{selectedLead.utmCampaign || 'organic'}</span>
              </div>
              <div>
                <span>Registered At: </span>
                <span className="text-white">{new Date(selectedLead.createdAt).toLocaleString()}</span>
              </div>
              <div>
                <span>Status: </span>
                <span className="text-[#1F9D73] font-bold uppercase">{selectedLead.leadStatus || 'new'}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setSelectedLead(null)}>
                Close User Analytics
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
