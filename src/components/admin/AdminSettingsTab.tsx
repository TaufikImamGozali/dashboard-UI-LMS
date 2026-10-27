import React, { useState } from 'react';
import type { PlatformSettings } from '../../types/admin';
import type { ToastType } from '../ui/Toast';
import { ToggleSwitch } from '../ui/ToggleSwitch';
import { Save, AlertTriangle, ShieldCheck, Database } from 'lucide-react';

interface AdminSettingsTabProps {
  settings: PlatformSettings;
  onSave: (updated: Partial<PlatformSettings>) => void;
  showToast: (message: string, type?: ToastType) => void;
}

export const AdminSettingsTab: React.FC<AdminSettingsTabProps> = ({
  settings,
  onSave,
  showToast,
}) => {
  const [platformName, setPlatformName] = useState(settings.platformName);
  const [supportEmail, setSupportEmail] = useState(settings.supportEmail);
  const [allowRegistration, setAllowRegistration] = useState(settings.allowRegistration);
  const [maintenanceMode, setMaintenanceMode] = useState(settings.maintenanceMode);
  const [maxUploadSizeMb, setMaxUploadSizeMb] = useState(settings.maxUploadSizeMb);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      platformName,
      supportEmail,
      allowRegistration,
      maintenanceMode,
      maxUploadSizeMb,
    });
    showToast('Platform settings saved successfully!', 'success');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* General Platform Settings Card */}
      <div className="p-6 rounded-3xl bg-surface border border-outline shadow-card space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-outline-subtle">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-500 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-content-primary">
              Global Platform Configuration
            </h3>
            <p className="text-xs text-content-muted">
              Matches singleton row in database table <code className="font-mono text-brand-600">public.platform_settings</code>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-content-secondary mb-1.5">
              Platform Name
            </label>
            <input
              type="text"
              required
              value={platformName}
              onChange={(e) => setPlatformName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-outline bg-surface text-content-primary focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-content-secondary mb-1.5">
              Support Email Address
            </label>
            <input
              type="email"
              required
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-outline bg-surface text-content-primary focus:border-brand-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Max Upload Size Slider */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2 text-xs">
            <span className="font-bold text-content-secondary">
              Max Upload File Size
            </span>
            <span className="font-extrabold text-brand-500 px-2.5 py-0.5 rounded-full bg-brand-50">
              {maxUploadSizeMb} MB
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            value={maxUploadSizeMb}
            onChange={(e) => setMaxUploadSizeMb(Number(e.target.value))}
            className="w-full accent-brand-500 cursor-pointer"
          />
          <p className="text-meta text-content-muted mt-1">
            Allowed range: 1 MB to 100 MB per assignment/lesson attachment.
          </p>
        </div>
      </div>

      {/* Access & Safety Toggles */}
      <div className="p-6 rounded-3xl bg-surface border border-outline shadow-card space-y-4">
        <h3 className="text-sm font-bold text-content-primary uppercase tracking-wider mb-2">
          Access & Registration Controls
        </h3>

        <div className="divide-y divide-outline-subtle">
          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-content-primary">
                Allow Public Student Registration
              </p>
              <p className="text-meta text-content-muted">
                When enabled, new users can sign up via the register page.
              </p>
            </div>
            <ToggleSwitch
              label="Allow Registration"
              checked={allowRegistration}
              onChange={setAllowRegistration}
            />
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-content-primary flex items-center gap-1.5 text-amber-600">
                <AlertTriangle className="w-3.5 h-3.5" /> Maintenance Mode
              </p>
              <p className="text-meta text-content-muted">
                Locks student courses and displays a maintenance banner to all non-admin users.
              </p>
            </div>
            <ToggleSwitch
              label="Maintenance Mode"
              checked={maintenanceMode}
              onChange={setMaintenanceMode}
            />
          </div>
        </div>
      </div>

      {/* Security Policies info */}
      <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Row-Level Security (RLS) Enforced</p>
          <p className="text-meta text-emerald-700 mt-0.5">
            Database constraints prevent unauthorized modification of this table by students or mentors. Last updated at: <strong>{settings.updatedAt}</strong>.
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-purple-glow transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>
    </form>
  );
};
