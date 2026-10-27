export interface TabOption<T extends string> { id: T; label: string; count?: number }

interface TabsProps<T extends string> {
  tabs: TabOption<T>[];
  activeTab: T;
  onChange: (tab: T) => void;
  ariaLabel: string;
}

export function Tabs<T extends string>({ tabs, activeTab, onChange, ariaLabel }: TabsProps<T>) {
  return <div className="flex gap-1 overflow-x-auto border-b border-outline-subtle no-scrollbar" role="tablist" aria-label={ariaLabel}>{tabs.map((tab) => <button key={tab.id} type="button" role="tab" aria-selected={activeTab === tab.id} onClick={() => onChange(tab.id)} className={`relative flex min-h-touch shrink-0 items-center gap-2 px-4 text-sm font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${activeTab === tab.id ? 'text-brand-600' : 'text-content-muted hover:text-content-primary'}`}>{tab.label}{tab.count !== undefined && <span className={`rounded-full px-2 py-0.5 text-micro ${activeTab === tab.id ? 'bg-brand-100 text-brand-600' : 'bg-surface-muted text-content-muted'}`}>{tab.count}</span>}{activeTab === tab.id && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-brand-500" />}</button>)}</div>;
}
