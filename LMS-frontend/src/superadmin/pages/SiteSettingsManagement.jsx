// src/superadmin/pages/SiteSettingsManagement.jsx
import { useEffect, useState } from "react";
import {
  getSuperAdminSettings,
  updateSetting,
  deleteSetting,
} from "../../api/superAdmin";

const IMAGE_BASE_URL = (process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000") + "/";

export default function SiteSettingsManagement() {
  const [formData, setFormData] = useState({
    site_name: "",
    logo_path: "",
    favicon_path: "",
    header_text: "",
    header_button_text: "",
    header_button_link: "",
    phone: "",
    email: "",
    address: "",
    google_maps_embed_code: "",
    facebook_url: "",
    twitter_url: "",
    instagram_url: "",
    linkedin_url: "",
    youtube_url: "",
    meta_description: "",
    meta_keywords: "",
  });

  const [settingId, setSettingId] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [faviconFile, setFaviconFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Settings çek
  const fetchSettings = async () => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await getSuperAdminSettings();
      // response: { data: { ...settings } }
      const data = res.data?.data || res.data;

      if (!data) {
        setLoading(false);
        return;
      }

      setSettingId(data.id);
      setFormData({
        site_name: data.site_name || "",
        logo_path: data.logo_path || "",
        favicon_path: data.favicon_path || "",
        header_text: data.header_text || "",
        header_button_text: data.header_button_text || "",
        header_button_link: data.header_button_link || "",
        phone: data.phone || "",
        email: data.email || "",
        address: data.address || "",
        google_maps_embed_code: data.google_maps_embed_code || "",
        facebook_url: data.facebook_url || "",
        twitter_url: data.twitter_url || "",
        instagram_url: data.instagram_url || "",
        linkedin_url: data.linkedin_url || "",
        youtube_url: data.youtube_url || "",
        meta_description: data.meta_description || "",
        meta_keywords: data.meta_keywords || "",
      });
    } catch (err) {
      console.error("Error loading settings:", err);
      setError("Failed to load settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogoChange = (e) => {
    setLogoFile(e.target.files[0] || null);
  };

  const handleFaviconChange = (e) => {
    setFaviconFile(e.target.files[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const fd = new FormData();

      // text alanları
      Object.keys(formData).forEach((key) => {
        if (key === "logo_path" || key === "favicon_path") return; // bunlar sadece preview için
        fd.append(key, formData[key] ?? "");
      });

      // dosyalar (backend'de 'logo' ve 'favicon' field isimlerine göre)
      if (logoFile) {
        fd.append("logo", logoFile);
      }
      if (faviconFile) {
        fd.append("favicon", faviconFile);
      }

      await updateSetting(fd);
      setMessage("Settings updated successfully.");

      // Güncel pathleri almak için tekrar çek
      fetchSettings();
      setLogoFile(null);
      setFaviconFile(null);
    } catch (err) {
      console.error("Error updating settings:", err);
      setError("Failed to update settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!settingId) {
      setError("No setting record to delete.");
      return;
    }

    const sure = window.confirm(
      "Are you sure you want to delete this setting? This action cannot be undone."
    );
    if (!sure) return;

    setSaving(true);
    setMessage("");
    setError("");

    try {
      await deleteSetting(settingId);
      setMessage("Setting deleted successfully.");

      // formu temizle
      setFormData({
        site_name: "",
        logo_path: "",
        favicon_path: "",
        header_text: "",
        header_button_text: "",
        header_button_link: "",
        phone: "",
        email: "",
        address: "",
        google_maps_embed_code: "",
        facebook_url: "",
        twitter_url: "",
        instagram_url: "",
        linkedin_url: "",
        youtube_url: "",
        meta_description: "",
        meta_keywords: "",
      });
      setSettingId(null);
      setLogoFile(null);
      setFaviconFile(null);
    } catch (err) {
      console.error("Error deleting setting:", err);
      setError("Failed to delete setting.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Site Settings</h1>
        <p className="text-sm text-slate-500">
          Manage global settings like branding, contact info, social links and
          SEO.
        </p>
      </div>

      {/* Messages */}
      {message && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
          {message}
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-slate-500">Loading settings...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* GENERAL */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-4">
            <h2 className="text-sm font-semibold text-slate-900">General</h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Site Name
                </label>
                <input
                  type="text"
                  name="site_name"
                  value={formData.site_name}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Logo */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Logo
                  </label>
                  {formData.logo_path && (
                    <div className="mb-2">
                      <img
                        src={IMAGE_BASE_URL + formData.logo_path}
                        alt="Logo"
                        className="h-12 object-contain"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="block w-full text-xs text-slate-600"
                  />
                </div>

                {/* Favicon */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Favicon
                  </label>
                  {formData.favicon_path && (
                    <div className="mb-2">
                      <img
                        src={IMAGE_BASE_URL + formData.favicon_path}
                        alt="Favicon"
                        className="h-8 w-8 object-contain"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFaviconChange}
                    className="block w-full text-xs text-slate-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* HEADER */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-4">
            <h2 className="text-sm font-semibold text-slate-900">Header</h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Header Text
                </label>
                <input
                  type="text"
                  name="header_text"
                  value={formData.header_text}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Button Text
                  </label>
                  <input
                    type="text"
                    name="header_button_text"
                    value={formData.header_button_text}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Button Link
                  </label>
                  <input
                    type="text"
                    name="header_button_link"
                    value={formData.header_button_link}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* CONTACT */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-4">
            <h2 className="text-sm font-semibold text-slate-900">Contact</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={2}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Google Maps Embed Code
              </label>
              <textarea
                name="google_maps_embed_code"
                value={formData.google_maps_embed_code}
                onChange={handleChange}
                rows={3}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* SOCIAL LINKS */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Social Links
            </h2>

            {[
              "facebook_url",
              "twitter_url",
              "instagram_url",
              "linkedin_url",
              "youtube_url",
            ].map((field) => (
              <div key={field}>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  {field.replace("_url", "").toUpperCase()} URL
                </label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            ))}
          </div>

          {/* SEO */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-4">
            <h2 className="text-sm font-semibold text-slate-900">SEO</h2>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Meta Description
              </label>
              <textarea
                name="meta_description"
                value={formData.meta_description}
                onChange={handleChange}
                rows={3}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Meta Keywords (comma separated)
              </label>
              <input
                type="text"
                name="meta_keywords"
                value={formData.meta_keywords}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center justify-between mt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={saving || !settingId}
              className="inline-flex items-center px-4 py-2 rounded-lg border border-red-300 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
            >
              Delete Setting
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
