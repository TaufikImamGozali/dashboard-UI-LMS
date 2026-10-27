import React, { useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AccountForm } from '../components/settings/AccountForm';
import { AppearanceForm } from '../components/settings/AppearanceForm';
import { NotificationSettings } from '../components/settings/NotificationSettings';
import { ProfileForm } from '../components/settings/ProfileForm';
import { SettingsTabs, type SettingsTab } from '../components/settings/SettingsTabs';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { ToastContainer } from '../components/ui/Toast';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { useToast } from '../hooks/useToast';
import { profileService } from '../services/profileService';

export const SettingsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const requestedTab = (location.state as { tab?: SettingsTab } | null)?.tab;
  const [active, setActive] = useState<SettingsTab>(requestedTab ?? 'profile');
  const [dirty, setDirty] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { profile, preferences, updateProfile, updatePreferences, resetProfile } = useProfile();
  const { logout } = useAuth();
  const { toasts, showToast, dismissToast } = useToast();
  const onDirtyChange = useCallback((value: boolean) => setDirty(value), []);
  const changeTab = (tab: SettingsTab) => {
    if (dirty && !window.confirm('Discard your unsaved profile changes?')) return;
    setDirty(false);
    setActive(tab);
  };
  const deleteAccount = () => {
    profileService.clearAccountData();
    logout();
    resetProfile();
    sessionStorage.setItem('coursue_flash', 'Your local account data has been deleted.');
    navigate('/login', { replace: true });
  };
  return <div><div className="mb-6"><h1 className="text-2xl font-extrabold text-content-primary">Settings</h1><p className="mt-1 text-sm text-content-muted">Manage your profile, appearance, notifications, and account.</p></div><div className="flex flex-col overflow-hidden rounded-card border border-outline bg-surface shadow-xs md:flex-row"><SettingsTabs active={active} onChange={changeTab} /><section role="tabpanel" className="min-w-0 flex-1 p-5 sm:p-7">{active === 'profile' && <ProfileForm profile={profile} onDirtyChange={onDirtyChange} onSave={(next) => { updateProfile(next); setDirty(false); showToast('Profile changes saved.', 'success'); }} />}{active === 'appearance' && <AppearanceForm />}{active === 'notifications' && <NotificationSettings preferences={preferences} onSave={(next) => { updatePreferences(next); showToast('Notification preferences saved.', 'success'); }} />}{active === 'account' && <AccountForm onPasswordChanged={() => showToast('Password updated successfully.', 'success')} onDeleteAccount={() => setDeleteOpen(true)} />}</section></div><ConfirmDialog isOpen={deleteOpen} title="Delete Account" message="This removes all Coursue data saved in this browser. Type DELETE to confirm." confirmLabel="Delete Account" requiredConfirmationText="DELETE" onCancel={() => setDeleteOpen(false)} onConfirm={deleteAccount} /><ToastContainer toasts={toasts} onDismiss={dismissToast} /></div>;
};
