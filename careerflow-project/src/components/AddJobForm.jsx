import React, { useState } from 'react'

export default function AddJobForm({ onAdd }) {
  const [company, setCompany] = useState('')
  const [position, setPosition] = useState('')
  const [status, setStatus] = useState('Applied')
  const [priority, setPriority] = useState('Medium')
  const [date, setDate] = useState('')
  const [link, setLink] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!company || !position) return
    onAdd && onAdd({ company, position, status, priority, archived: false, date: date || new Date().toISOString().slice(0,10), link })
    setCompany('')
    setPosition('')
    setStatus('Applied')
    setPriority('Medium')
    setDate('')
    setLink('')
  }

  return (
    <div className="card">
      <h2>Add Application</h2>
      <form className="form" onSubmit={submit}>
        <label>
          Company
          <input value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g. Acme Inc" />
        </label>

        <label>
          Position
          <input value={position} onChange={e => setPosition(e.target.value)} placeholder="e.g. Frontend Engineer" />
        </label>

        <div className="row">
          <label>
            Status
            <select value={status} onChange={e => setStatus(e.target.value)}>
              <option>Applied</option>
              <option>Interview</option>
              <option>Offer</option>
              <option>Rejected</option>
            </select>
          </label>
          <label>
            Priority
            <select value={priority} onChange={e => setPriority(e.target.value)}>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </label>

          <label>
            Date
            <input type="date" value={date} onChange={e => setDate(e.target.value)} />
          </label>
        </div>

        <label>
          Job Link (optional)
          <input value={link} onChange={e => setLink(e.target.value)} placeholder="https://" />
        </label>

        <div className="form-actions">
          <button type="submit" className="btn">Add Application</button>
        </div>
      </form>
    </div>
  )
}
