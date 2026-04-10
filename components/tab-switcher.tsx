interface TabSwitcherProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function TabSwitcher({ tabs, activeTab, onTabChange }: TabSwitcherProps) {
  return (
    <div
      className="flex items-center"
      style={{
        background: '#fff',
        border: '1px solid #E0E0E0',
        borderRadius: '8px',
        padding: '0',
        gap: '0',
      }}
    >
      {tabs.map((tab, idx) => (
        <button
          key={tab}
          type="button"
          onClick={() => onTabChange(tab)}
          style={{
            padding: '10px 24px',
            border: activeTab === tab ? '1px solid #0E519B' : 'none',
            borderRight: idx < tabs.length - 1 && activeTab !== tab ? '1px solid #E0E0E0' : activeTab === tab ? '1px solid #0E519B' : 'none',
            borderRadius: idx === 0 ? '8px 0 0 8px' : idx === tabs.length - 1 ? '0 8px 8px 0' : '0',
            background: '#fff',
            color: '#102C4A',
            fontSize: '14px',
            fontWeight: activeTab === tab ? 600 : 500,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
