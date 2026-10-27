import React from 'react';
import { Bell, BellRing, CalendarDays, Clock3 } from 'lucide-react';
import type { Session } from '../../types/group';

interface UpcomingSessionCardProps {
  session: Session;
  onToggleReminder: () => void;
}

export const UpcomingSessionCard: React.FC<UpcomingSessionCardProps> = ({ session, onToggleReminder }) => {
  const startsAt = new Date(session.startsAt);
  return (
    <section className="rounded-3xl border border-slate-100 bg-surface p-5 shadow-card">
      <h2 className="text-sm font-extrabold text-slateText-primary">Upcoming Session</h2>
      <div className="mt-4 rounded-2xl bg-brand-50 p-4">
        <h3 className="text-sm font-extrabold text-brand-700">{session.title}</h3>
        <div className="mt-3 space-y-2 text-xs font-semibold text-slateText-secondary">
          <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-brand-500" /> {new Intl.DateTimeFormat('en', { weekday: 'short', month: 'short', day: 'numeric' }).format(startsAt)}</p>
          <p className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-brand-500" /> {new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(startsAt)}</p>
        </div>
        <div className="mt-4 flex items-center gap-2 border-t border-brand-100 pt-3">
          <img height="160" width="160" loading="lazy" src={session.mentor.avatar} alt={session.mentor.name} className="h-8 w-8 rounded-full object-cover" />
          <div className="min-w-0"><p className="truncate text-xs font-bold text-slateText-primary">{session.mentor.name}</p><p className="text-micro text-slateText-muted">Session mentor</p></div>
        </div>
      </div>
      <button type="button" aria-pressed={session.reminderSet} onClick={onToggleReminder} className={`mt-4 flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-xs font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${session.reminderSet ? 'bg-emerald-50 text-emerald-600' : 'bg-brand-500 text-white hover:bg-brand-600'}`}>
        {session.reminderSet ? <BellRing className="h-4 w-4" /> : <Bell className="h-4 w-4" />} {session.reminderSet ? 'Reminder Set' : 'Set Reminder'}
      </button>
    </section>
  );
};
