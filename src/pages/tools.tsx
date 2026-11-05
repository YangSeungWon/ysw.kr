import React, { useState, useMemo, useEffect, useRef } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from '@/components/PlainPage.module.css';
import { tools, toolCategories as categories, type ToolCategory } from '@/data/tools';

const Tools: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('all');
  const [search, setSearch] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
      const matchesSearch =
        tool.name.toLowerCase().includes(search.toLowerCase()) ||
        tool.description.toLowerCase().includes(search.toLowerCase()) ||
        tool.tags?.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, search]);

  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = { all: tools.length };
    tools.forEach(tool => {
      stats[tool.category] = (stats[tool.category] || 0) + 1;
    });
    return stats;
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
        return;
      }
      const target = e.target as HTMLElement;
      if (target.closest('input, textarea, select, [contenteditable="true"]')) return;
      // Ctrl/Cmd + G to toggle view mode
      if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
        e.preventDefault();
        setViewMode(prev => prev === 'grid' ? 'list' : 'grid');
      }
      // Number keys to select category
      if (e.key >= '1' && e.key <= '6' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const index = parseInt(e.key) - 1;
        if (index < categories.length) {
          setSelectedCategory(categories[index].key);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Layout title="Tools" description="Free online developer tools - image editing, QR codes, text utilities, and more">
      <div className={styles.page}>
        <h1>Developer Tools</h1>
        <div className={styles.controls}>
          <div className={styles.searchRow}>
            <label htmlFor="tool-search">Search</label>
            <input
              ref={searchRef}
              id="tool-search"
              type="search"
              placeholder="Name, description, or tag"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && <button type="button" onClick={() => setSearch('')}>Clear</button>}
            <div className={styles.views} role="group" aria-label="View">
              <button type="button" aria-pressed={viewMode === 'list'} onClick={() => setViewMode('list')}>List</button>
              <button type="button" aria-pressed={viewMode === 'grid'} onClick={() => setViewMode('grid')}>Grid</button>
            </div>
          </div>
          <div className={styles.filters} role="group" aria-label="Tool category">
            {categories.map(cat => (
              <button type="button" key={cat.key} aria-pressed={selectedCategory === cat.key} onClick={() => setSelectedCategory(cat.key)}>
                {cat.label} ({categoryStats[cat.key] || 0})
              </button>
            ))}
          </div>
        </div>
        <p className={styles.count} role="status">{filteredTools.length} of {tools.length} tools</p>
        {filteredTools.length === 0 ? (
          <p>No tools found. Try another search or category.</p>
        ) : (
          <ul className={`${styles.tools} ${viewMode === 'grid' ? styles.grid : ''}`}>
            {filteredTools.map(tool => (
              <li key={tool.to} className={styles.tool}>
                <Link to={tool.to}>{tool.name}</Link>
                <p>{tool.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
};

export default Tools;
