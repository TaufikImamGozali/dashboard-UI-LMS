export interface GroupTabOption<T extends string> {
  id: T;
  label: string;
  count?: number;
}

interface GroupTabsProps<T extends string> {
  tabs: GroupTabOption<T>[];
  activeTab: T;
  onChange: (tab: T) => void;
  ariaLabel: string;
}

export function GroupTabs<T extends string>({ tabs, activeTab, onChange, ariaLabel }: GroupTabsProps<T>) {
  return (
    <div className="flex gap-1 overflow-x-auto border-b border-slate-100 no-scrollbar" role="tablist" aria-label={ariaLabel}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.id}
          onClick={() => onChange(tab.id)}
          className={`relative flex shrink-0 items-center gap-2 px-4 py-3 text-sm font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${
            activeTab === tab.id ? 'text-brand-600' : 'text-slateText-muted hover:text-slateText-primary'
          }`}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={`rounded-full px-2 py-0.5 text-[10px] ${activeTab === tab.id ? 'bg-brand-100 text-brand-600' : 'bg-brand-surface text-slateText-muted'}`}>
              {tab.count}
            </span>
          )}
          {activeTab === tab.id && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-brand-500" />}
        </button>
      ))}
    </div>
  );
}
