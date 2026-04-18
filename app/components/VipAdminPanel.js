"use client";
import { useState, useEffect, useCallback } from "react";
import { Star, RefreshCw, CheckCircle2, Clock, AlertCircle, Users, Loader2, Send } from "lucide-react";

const STATUS_COLORS = {
  PENDING_PAYMENT: "bg-yellow-100 text-yellow-700",
  ACTIVE: "bg-blue-100 text-blue-700",
  MATCHED: "bg-green-100 text-green-700",
  REFUNDED: "bg-gray-100 text-gray-600",
  CANCELLED: "bg-red-100 text-red-700",
};

const FILTER_OPTIONS = ["All", "PENDING_PAYMENT", "ACTIVE", "MATCHED", "REFUNDED"];

function StatCard({ label, value }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
    </div>
  );
}

function ApplicationsTab() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");
  const [notes, setNotes] = useState({});
  const [sending, setSending] = useState({});

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    const qs = filterStatus !== "All" ? `&status=${filterStatus}` : "";
    const res = await fetch(`/api/vip/admin/applications?page=1&limit=20${qs}`);
    const data = await res.json();
    setApplications(data.applications || []);
    setLoading(false);
  }, [filterStatus]);

  useEffect(() => { fetchApplications(); }, [fetchApplications]);

  const handleSendMatch = async (applicationId) => {
    setSending((s) => ({ ...s, [applicationId]: true }));
    const res = await fetch("/api/vip/admin/send-match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId }),
    });
    setSending((s) => ({ ...s, [applicationId]: false }));
    if (res.ok) fetchApplications();
  };

  const handleSaveNote = async (applicationId) => {
    await fetch("/api/vip/admin/applications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId, notes: notes[applicationId] }),
    });
  };

  const total = applications.length;
  const active = applications.filter((a) => a.status === "ACTIVE").length;
  const matched = applications.filter((a) => a.status === "MATCHED").length;
  const refunded = applications.filter((a) => a.status === "REFUNDED").length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        <StatCard label="Total" value={total} />
        <StatCard label="Active" value={active} />
        <StatCard label="Matched" value={matched} />
        <StatCard label="Refunded" value={refunded} />
      </div>

      <div className="flex gap-2 flex-wrap">
        {FILTER_OPTIONS.map((f) => (
          <button
            key={f}
            onClick={() => setFilterStatus(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
              filterStatus === f
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
            }`}
          >
            {f === "All" ? "All" : f.replace("_", " ")}
          </button>
        ))}
        <button onClick={fetchApplications} className="ml-auto p-1.5 text-gray-400 hover:text-gray-700">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-10 text-gray-500 text-sm">No applications found.</div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div key={app.id} className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{app.student?.name || "—"}</div>
                  <div className="text-xs text-gray-500">{app.student?.email}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[app.status] || "bg-gray-100 text-gray-600"}`}>
                    {app.status?.replace("_", " ")}
                  </span>
                  <span className="text-xs text-gray-500">
                    Match {app.matchCount ?? 0} of {app.maxMatches ?? 5}
                  </span>
                </div>
              </div>
              <div className="text-xs text-gray-400">
                Created {new Date(app.createdAt).toLocaleDateString("en-IN")}
              </div>
              <div className="flex items-start gap-2">
                <textarea
                  rows={2}
                  className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Add notes..."
                  value={notes[app.id] ?? app.notes ?? ""}
                  onChange={(e) => setNotes((n) => ({ ...n, [app.id]: e.target.value }))}
                />
                <button
                  onClick={() => handleSaveNote(app.id)}
                  className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium"
                >
                  Save
                </button>
              </div>
              <button
                onClick={() => handleSendMatch(app.id)}
                disabled={app.status !== "ACTIVE" || sending[app.id]}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {sending[app.id] ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Send next match
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TutorPoolTab() {
  const [tutorId, setTutorId] = useState("");
  const [isVip, setIsVip] = useState(true);
  const [availabilityNotes, setAvailabilityNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSave = async () => {
    if (!tutorId.trim()) return;
    setSaving(true);
    setMessage(null);
    const res = await fetch("/api/vip/admin/tutor-vip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tutorId: tutorId.trim(), isVipEligible: isVip, availabilityNotes }),
    });
    setSaving(false);
    setMessage(res.ok ? { type: "success", text: "Tutor VIP status updated." } : { type: "error", text: "Something went wrong. Please try again." });
  };

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">Update tutor VIP eligibility</h3>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Tutor ID</label>
          <input
            type="text"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter tutor ID"
            value={tutorId}
            onChange={(e) => setTutorId(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <input
            id="vip-toggle"
            type="checkbox"
            checked={isVip}
            onChange={(e) => setIsVip(e.target.checked)}
            className="w-4 h-4 accent-blue-600"
          />
          <label htmlFor="vip-toggle" className="text-sm text-gray-700">
            Mark as VIP eligible
          </label>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Availability notes (optional)</label>
          <textarea
            rows={2}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="e.g. Available weekends only"
            value={availabilityNotes}
            onChange={(e) => setAvailabilityNotes(e.target.value)}
          />
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !tutorId.trim()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Star className="w-4 h-4" />}
          Save
        </button>
        {message && (
          <div className={`flex items-center gap-2 text-sm ${message.type === "success" ? "text-green-700" : "text-red-600"}`}>
            {message.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}

export default function VipAdminPanel() {
  const [tab, setTab] = useState("applications");

  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b border-gray-200 pb-1">
        {[
          { key: "applications", label: "Applications", icon: Users },
          { key: "tutorPool", label: "Tutor pool", icon: Star },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              tab === key
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {tab === "applications" ? <ApplicationsTab /> : <TutorPoolTab />}
    </div>
  );
}
