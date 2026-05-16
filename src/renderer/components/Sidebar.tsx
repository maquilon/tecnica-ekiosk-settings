import { useState } from 'react';
import { useConfigStore } from '../store/useConfigStore';
import ConfirmDialog from './ui/ConfirmDialog';
import {
  Plus, Search, Copy, Trash2, Power, ArrowUpDown, Filter,
} from 'lucide-react';
import tecnicaLogo from '../assets/tecnica-logo.svg';

export default function Sidebar() {
  const {
    selectedCompanyId, selectCompany, addCompany, deleteCompany,
    duplicateCompany, toggleActive, searchQuery, setSearchQuery,
    sortBy, setSortBy, filterActive, setFilterActive, theme,
    getFilteredCompanies,
  } = useConfigStore();

  const d = theme === 'dark';
  const companies = getFilteredCompanies();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  return (
    <>
      <aside
        className={`w-72 flex-shrink-0 flex flex-col border-r h-full ${
          d ? 'bg-[#0a0a0a] border-[#1c1c1c]' : 'bg-gray-50 border-gray-200'
        }`}
      >
        <div className={`p-4 border-b ${d ? 'border-[#1c1c1c]' : 'border-gray-200'}`}>
          <div className="flex items-center justify-center mb-4">
            <img src={tecnicaLogo} alt="Tecnica Systems" className="h-8 w-auto" />
          </div>
          <div className="flex items-center justify-between mb-3">
            <h2 className={`text-sm font-semibold ${d ? 'text-gray-200' : 'text-gray-800'}`}>
              Companies
            </h2>
            <button
              onClick={addCompany}
              className="btn btn-primary !px-2 !py-1.5 text-xs"
              title="Add Company"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New</span>
            </button>
          </div>
          <div className="relative">
            <Search className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${d ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`input-base ${d ? 'input-dark' : 'input-light'} pl-8 text-xs`}
            />
          </div>
          <div className="flex gap-1.5 mt-2">
            <button
              onClick={() => setSortBy(sortBy === 'name' ? 'date' : 'name')}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                d ? 'text-gray-400 hover:text-gray-200 hover:bg-white/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              title={`Sort by ${sortBy === 'name' ? 'date' : 'name'}`}
            >
              <ArrowUpDown className="w-3 h-3" />
              {sortBy === 'name' ? 'A-Z' : 'Recent'}
            </button>
            <button
              onClick={() => {
                const next = filterActive === 'all' ? 'active' : filterActive === 'active' ? 'inactive' : 'all';
                setFilterActive(next);
              }}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                filterActive !== 'all'
                  ? 'text-brand-primary bg-brand-primary/10'
                  : d ? 'text-gray-400 hover:text-gray-200 hover:bg-white/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Filter className="w-3 h-3" />
              {filterActive === 'all' ? 'All' : filterActive === 'active' ? 'Active' : 'Inactive'}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {companies.length === 0 && (
            <div className={`text-center py-8 text-xs ${d ? 'text-gray-600' : 'text-gray-400'}`}>
              {searchQuery ? 'No companies match your search' : 'No companies yet. Click "New" to add one.'}
            </div>
          )}
          {companies.map((c) => {
            const selected = c.company.id === selectedCompanyId;
            return (
              <div
                key={c.company.id}
                onClick={() => selectCompany(c.company.id)}
                className={`group relative rounded-lg p-3 cursor-pointer transition-all duration-150 ${
                  selected
                    ? d ? 'bg-brand-primary/10 border border-brand-primary/30' : 'bg-brand-primary/5 border border-brand-primary/20'
                    : d ? 'hover:bg-white/5 border border-transparent' : 'hover:bg-gray-100 border border-transparent'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${c.active ? 'bg-brand-success' : 'bg-gray-500'}`}
                      />
                      <h3
                        className={`text-sm font-medium truncate ${
                          selected ? 'text-brand-primary' : d ? 'text-gray-200' : 'text-gray-800'
                        }`}
                      >
                        {c.company.name || 'Untitled'}
                      </h3>
                    </div>
                    <p className={`text-xs mt-0.5 truncate pl-4 ${d ? 'text-gray-500' : 'text-gray-400'}`}>
                      {c.company.domain || 'No domain'}
                    </p>
                  </div>
                  <div className={`flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity`}>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleActive(c.company.id); }}
                      className={`p-1 rounded transition-colors ${d ? 'hover:bg-white/10' : 'hover:bg-gray-200'}`}
                      title={c.active ? 'Deactivate' : 'Activate'}
                    >
                      <Power className={`w-3 h-3 ${c.active ? 'text-brand-success' : 'text-gray-500'}`} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); duplicateCompany(c.company.id); }}
                      className={`p-1 rounded transition-colors ${d ? 'hover:bg-white/10' : 'hover:bg-gray-200'}`}
                      title="Duplicate"
                    >
                      <Copy className={`w-3 h-3 ${d ? 'text-gray-400' : 'text-gray-500'}`} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteTarget(c.company.id); }}
                      className={`p-1 rounded transition-colors ${d ? 'hover:bg-white/10' : 'hover:bg-gray-200'}`}
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3 text-brand-error" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className={`p-3 border-t text-xs text-center ${d ? 'border-[#1c1c1c] text-gray-600' : 'border-gray-200 text-gray-400'}`}>
          {companies.length} {companies.length === 1 ? 'company' : 'companies'}
        </div>
      </aside>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Company"
        message="Are you sure you want to delete this company? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={() => { if (deleteTarget) deleteCompany(deleteTarget); setDeleteTarget(null); }}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
