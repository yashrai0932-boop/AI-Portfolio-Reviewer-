'use client';

import React, { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  className?: string;
  children?: (activeTab: string) => React.ReactNode;
}

export default function Tabs({
  tabs,
  defaultTab,
  onChange,
  className = '',
  children,
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '');

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  return (
    <div className={className}>
      {/* Tab List */}
      <div className="flex gap-1 p-1 bg-[var(--pq-bg-overlay)] rounded-xl border border-[var(--pq-border)] overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg
              transition-all duration-200 whitespace-nowrap cursor-pointer
              ${
                activeTab === tab.id
                  ? 'bg-[var(--pq-primary-600)] text-white shadow-lg shadow-[var(--pq-primary-600)]/20'
                  : 'text-[var(--pq-text-muted)] hover:text-[var(--pq-text-primary)] hover:bg-[var(--pq-bg-subtle)]'
              }
            `}
          >
            {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {children && (
        <div className="mt-6">
          {children(activeTab)}
        </div>
      )}
    </div>
  );
}
