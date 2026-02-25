import React, { useMemo, useState } from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'

function Stats({ jobs }) {
  const total = jobs.length
  const byStatus = jobs.reduce((acc, j) => {
    acc[j.status] = (acc[j.status] || 0) + 1
    return acc
  }, {})

  return (
    <div className="stats">
      <div className="stat-card">
        <div className="stat-value">{total}</div>
        <div className="stat-label">Total Applications</div>
      </div>
      {['Applied', 'Interview', 'Offer', 'Rejected'].map(s => (
        <div className="stat-card" key={s}>
          <div className="stat-value">{byStatus[s] || 0}</div>
          <div className="stat-label">{s}</div>
        </div>
      ))}
    </div>
  )
}

function buildMonthlyData(jobs, months = 6) {
  const now = new Date()
  const labels = []
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    labels.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: d.toLocaleString(undefined, { month: 'short', year: 'numeric' })
    })
  }

  const counts = labels.map(l => ({ name: l.label, key: l.key, count: 0 }))

  jobs.forEach(j => {
    if (!j.date) return
    const d = new Date(j.date)
    if (isNaN(d)) return
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const idx = counts.findIndex(c => c.key === key)
    if (idx >= 0) counts[idx].count++
  })

  return counts
}

export default function Dashboard({ jobs = [], onUpdate, onRemove, onClear }) {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [editingId, setEditingId] = useState(null)
  const [editDraft, setEditDraft] = useState({})

  const changeStatus = (id, next) => onUpdate && onUpdate(id, { status: next })

  const handleClearAll = () => {
    if (typeof window !== 'undefined' && window.confirm)
      if (window.confirm('Are you sure you want to clear all applications? This cannot be undone.')) {
        onClear && onClear()
      }
  }

  const visibleJobs = useMemo(() => jobs.filter(j => !j.archived), [jobs])

  const filteredJobs = useMemo(() => {
    const q = query.trim().toLowerCase()
    return visibleJobs.filter(j => {
      if (statusFilter !== 'All' && j.status !== statusFilter) return false
      if (!q) return true
      return (
        (j.company || '').toLowerCase().includes(q) ||
        (j.position || '').toLowerCase().includes(q) ||
        (j.status || '').toLowerCase().includes(q) ||
        (j.priority || '').toLowerCase().includes(q)
      )
    })
  }, [visibleJobs, query, statusFilter])

  const monthlyData = useMemo(() => buildMonthlyData(visibleJobs, 6), [visibleJobs])

  const statusMap = useMemo(() => visibleJobs.reduce((acc, j) => {
    acc[j.status] = (acc[j.status] || 0) + 1
    return acc
  }, {}), [visibleJobs])

  const statusData = useMemo(() => Object.entries(statusMap).map(([name, value]) => ({ name, value })), [statusMap])

  const COLORS = ['#6366F1', '#60A5FA', '#A78BFA', '#F472B6', '#FB923C']

  const startEdit = (job) => {
    setEditingId(job.id)
    setEditDraft({ ...job })
  }

  const saveEdit = (id) => {
    onUpdate && onUpdate(id, editDraft)
    setEditingId(null)
    setEditDraft({})
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditDraft({})
  }

  const archive = (id) => {
    if (typeof window !== 'undefined' && window.confirm && window.confirm('Archive this application?')) {
      onUpdate && onUpdate(id, { archived: true })
    }
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <h2>Dashboard</h2>
        <div>
          <button className="btn btn-danger" onClick={handleClearAll}>Clear All</button>
        </div>
      </div>
      <Stats jobs={visibleJobs} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 12, marginBottom: 16 }}>
        <div className="card" style={{ padding: 12, background: 'transparent', boxShadow: 'none' }}>
          <h3 style={{ margin: '0 0 8px' }}>Monthly Application Trend</h3>
          <div style={{ width: '100%', height: 180 }}>
            <ResponsiveContainer>
              <AreaChart data={monthlyData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" stroke="var(--muted)" />
                <YAxis stroke="var(--muted)" />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#6366F1" fillOpacity={1} fill="url(#colorUv)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card" style={{ padding: 12, background: 'transparent', boxShadow: 'none' }}>
          <h3 style={{ margin: '0 0 8px' }}>Status Distribution</h3>
          <div style={{ width: '100%', height: 180 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={70} innerRadius={34} label />
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                <Legend verticalAlign="bottom" height={24} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'center' }}>
        <input className="search" placeholder="Smart search — company, position, priority..." value={query} onChange={e => setQuery(e.target.value)} />
        <select className="status-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option>All</option>
          <option>Applied</option>
          <option>Interview</option>
          <option>Offer</option>
          <option>Rejected</option>
        </select>
      </div>

      <div className="table-wrap">
        <table className="job-table premium">
          <thead>
            <tr>
              <th>Company</th>
              <th>Position</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.map(job => (
              <tr key={job.id} className="hover-row">
                <td>
                  {editingId === job.id ? (
                    <input value={editDraft.company} onChange={e => setEditDraft(d => ({ ...d, company: e.target.value }))} />
                  ) : (
                    job.company
                  )}
                </td>
                <td>
                  {editingId === job.id ? (
                    <input value={editDraft.position} onChange={e => setEditDraft(d => ({ ...d, position: e.target.value }))} />
                  ) : (
                    job.position
                  )}
                </td>
                <td>
                  {editingId === job.id ? (
                    <select value={editDraft.priority} onChange={e => setEditDraft(d => ({ ...d, priority: e.target.value }))}>
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  ) : (
                    <span className={`tag tag-${(job.priority||'Medium').toLowerCase()}`}>{job.priority || 'Medium'}</span>
                  )}
                </td>
                <td>
                  {editingId === job.id ? (
                    <select value={editDraft.status} onChange={e => setEditDraft(d => ({ ...d, status: e.target.value }))}>
                      <option>Applied</option>
                      <option>Interview</option>
                      <option>Offer</option>
                      <option>Rejected</option>
                    </select>
                  ) : (
                    job.status
                  )}
                </td>
                <td>
                  {editingId === job.id ? (
                    <input type="date" value={editDraft.date} onChange={e => setEditDraft(d => ({ ...d, date: e.target.value }))} />
                  ) : (
                    job.date
                  )}
                </td>
                <td className="actions">
                  {editingId === job.id ? (
                    <>
                      <button className="btn" onClick={() => saveEdit(job.id)}>Save</button>
                      <button className="btn btn-danger" onClick={cancelEdit}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="btn" onClick={() => startEdit(job)}>Edit</button>
                      <button className="btn" onClick={() => archive(job.id)}>Archive</button>
                      <button className="btn btn-danger" onClick={() => onRemove && onRemove(job.id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}

            {filteredJobs.length === 0 && (
              <tr>
                <td colSpan="6" className="muted">No matching applications.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
