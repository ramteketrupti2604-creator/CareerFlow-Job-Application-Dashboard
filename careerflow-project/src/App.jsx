import React from 'react'
import Dashboard from './components/Dashboard'
import AddJobForm from './components/AddJobForm'
import useLocalStorage from './hooks/useLocalStorage'

export default function App() {
  const [jobs, setJobs] = useLocalStorage('cf_jobs', [
    { id: 1, company: 'Acme Inc', position: 'Frontend Developer', status: 'Applied', date: '2026-02-20', link: '' }
  ])

  const addJob = (job) => {
    setJobs(prev => [{ ...job, id: Date.now() }, ...prev])
  }

  const updateJob = (id, updates) => {
    setJobs(prev => prev.map(j => (j.id === id ? { ...j, ...updates } : j)))
  }

  const removeJob = (id) => {
    setJobs(prev => prev.filter(j => j.id !== id))
  }

  const clearAll = () => {
    setJobs([])
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="container header-inner">
          <h1>CareerFlow</h1>
          <p className="subtitle">Track your job applications, stages and outcomes</p>
        </div>
      </header>
      <main className="container main-grid">
        <section className="left-col">
          <AddJobForm onAdd={addJob} />
        </section>
        <section className="right-col">
          <Dashboard jobs={jobs} onUpdate={updateJob} onRemove={removeJob} onClear={clearAll} />
        </section>
      </main>
    </div>
  )
}
