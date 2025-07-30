"use client";

import { useEffect, useState } from "react";

export default function VendorProfilePage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    bio: "",
    logo: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Fetch current vendor info
    async function fetchProfile() {
      setLoading(true);
      try {
        const res = await fetch("/api/vendors/me");
        const data = await res.json();
        if (res.ok && data.vendor) {
          setForm({
            name: data.vendor.name || "",
            phone: data.vendor.phone || "",
            address: data.vendor.address || "",
            bio: data.vendor.bio || "",
            logo: data.vendor.logo || "",
          });
        } else {
          setError(data.error || "Failed to load profile");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("/api/vendors/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading profile...</div>;

  return (
    <div className="max-w-md mx-auto py-12">
      <h1 className="text-2xl font-bold mb-6 text-center">Vendor Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <input name="name" placeholder="Business Name" value={form.name} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} className="w-full border p-2 rounded" />
        <textarea name="bio" placeholder="About your business" value={form.bio} onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="logo" placeholder="Logo URL (optional)" value={form.logo} onChange={handleChange} className="w-full border p-2 rounded" />
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded font-semibold" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
        {error && <div className="text-red-600 text-center">{error}</div>}
        {success && <div className="text-green-600 text-center">Profile updated!</div>}
      </form>
    </div>
  );
} 