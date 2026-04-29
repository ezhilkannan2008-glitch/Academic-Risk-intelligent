import React, { useState, useEffect, useRef, useCallback } from 'react';
import { addMarks, getCourses } from '../services/api';

const EMPTY_ROW = () => ({
  id: Math.random(),
  enroll_no: '',
  student_name: '',
  test_marks: '',
  mcq: '',
  assignment: '',
  sliptest: '',
  status: 'idle', // idle | saving | saved | error
  error: '',
});

const AddDataModal = ({ isOpen, onClose, onDataAdded, fixedCourseId = null }) => {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState(fixedCourseId || '');
  const [rows, setRows] = useState([EMPTY_ROW(), EMPTY_ROW(), EMPTY_ROW(), EMPTY_ROW(), EMPTY_ROW()]);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(''); // '', 'success', 'partial'
  const [tab, setTab] = useState('grid'); // 'grid' | 'single'
  // Single form state
  const [single, setSingle] = useState({ student_name: '', enroll_no: '', mcq: '', assignment: '', sliptest: '' });
  const [singleLoading, setSingleLoading] = useState(false);
  const [singleMsg, setSingleMsg] = useState('');
  const tableRef = useRef();

  useEffect(() => {
    if (isOpen && !fixedCourseId) {
      // Only fetch courses list when NOT inside a specific course page
      getCourses().then(data => {
        setCourses(data);
        if (data.length > 0) setCourseId(String(data[0].id));
      }).catch(() => {});
    } else if (fixedCourseId) {
      setCourseId(String(fixedCourseId));
    }
  }, [isOpen, fixedCourseId]);

  if (!isOpen) return null;

  // ── Grid helpers ──────────────────────────────────────
  const updateCell = (idx, field, val) => {
    setRows(prev => prev.map((r, i) => i === idx ? { ...r, [field]: val, status: 'idle', error: '' } : r));
  };

  const addRows = (n = 5) => {
    setRows(prev => [...prev, ...Array.from({ length: n }, EMPTY_ROW)]);
  };

  const deleteRow = (idx) => {
    setRows(prev => prev.length === 1 ? prev : prev.filter((_, i) => i !== idx));
  };

  const clearAll = () => {
    setRows([EMPTY_ROW(), EMPTY_ROW(), EMPTY_ROW(), EMPTY_ROW(), EMPTY_ROW()]);
    setSaveStatus('');
  };

  // Tab navigation like Excel
  const handleKeyDown = (e, rowIdx, field) => {
    const FIELDS = ['enroll_no', 'student_name', 'test_marks', 'mcq', 'assignment', 'sliptest'];
    const fIdx = FIELDS.indexOf(field);
    if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      if (fIdx < FIELDS.length - 1) {
        focusCell(rowIdx, FIELDS[fIdx + 1]);
      } else if (rowIdx < rows.length - 1) {
        focusCell(rowIdx + 1, FIELDS[0]);
      } else {
        addRows(1);
        setTimeout(() => focusCell(rowIdx + 1, FIELDS[0]), 50);
      }
    } else if (e.key === 'Tab' && e.shiftKey) {
      e.preventDefault();
      if (fIdx > 0) focusCell(rowIdx, FIELDS[fIdx - 1]);
      else if (rowIdx > 0) focusCell(rowIdx - 1, FIELDS[FIELDS.length - 1]);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (rowIdx < rows.length - 1) focusCell(rowIdx + 1, field);
      else { addRows(1); setTimeout(() => focusCell(rowIdx + 1, field), 50); }
    }
  };

  const focusCell = (rowIdx, field) => {
    const el = tableRef.current?.querySelector(`[data-row="${rowIdx}"][data-field="${field}"]`);
    if (el) el.focus();
  };

  // ── Bulk Save ─────────────────────────────────────────
  const handleBulkSave = async () => {
    const valid = rows.filter(r => r.student_name.trim() && r.mcq !== '' && r.assignment !== '' && r.sliptest !== '');
    if (valid.length === 0) { setSaveStatus('nodata'); return; }
    setSaving(true);
    setSaveStatus('');

    // Mark all valid rows as "saving"
    setRows(prev => prev.map(r =>
      valid.find(v => v.id === r.id) ? { ...r, status: 'saving' } : r
    ));

    let successCount = 0;
    for (const row of valid) {
      try {
        await addMarks({
          student_name: row.enroll_no ? `${row.enroll_no} - ${row.student_name}` : row.student_name,
          course_id: courseId,
          mcq_mark: parseFloat(row.mcq) || 0,
          assignment_mark: parseFloat(row.assignment) || 0,
          sliptest_mark: parseFloat(row.sliptest) || 0,
        });
        setRows(prev => prev.map(r => r.id === row.id ? { ...r, status: 'saved' } : r));
        successCount++;
      } catch (err) {
        const msg = err.response?.data?.error || 'Failed';
        setRows(prev => prev.map(r => r.id === row.id ? { ...r, status: 'error', error: msg } : r));
      }
    }

    setSaving(false);
    setSaveStatus(successCount === valid.length ? 'success' : 'partial');
    if (successCount > 0) onDataAdded();
  };

  // ── Single Save ───────────────────────────────────────
  const handleSingleSave = async (e) => {
    e.preventDefault();
    setSingleLoading(true);
    setSingleMsg('');
    try {
      await addMarks({
        student_name: single.enroll_no ? `${single.enroll_no} - ${single.student_name}` : single.student_name,
        course_id: courseId,
        mcq_mark: parseFloat(single.mcq) || 0,
        assignment_mark: parseFloat(single.assignment) || 0,
        sliptest_mark: parseFloat(single.sliptest) || 0,
      });
      setSingle({ student_name: '', enroll_no: '', mcq: '', assignment: '', sliptest: '' });
      setSingleMsg('✅ Saved successfully!');
      onDataAdded();
    } catch (err) {
      setSingleMsg('❌ ' + (err.response?.data?.error || 'Failed to save.'));
    }
    setSingleLoading(false);
  };

  const filledCount = rows.filter(r => r.student_name.trim()).length;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="excel-modal glass-panel" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="excel-modal-header">
          <div className="excel-modal-title">
            <span>📊</span>
            <h3>Student Marks Entry</h3>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* Course Selector + Tabs */}
        <div className="excel-course-bar">
          {!fixedCourseId && (
            <>
              <label className="excel-label">📚 Course:</label>
              <select
                className="excel-course-select"
                value={courseId}
                onChange={e => setCourseId(e.target.value)}
              >
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.course_name}</option>
                ))}
              </select>
            </>
          )}

          {/* Tabs */}
          <div className="excel-tabs">
            <button
              className={`excel-tab ${tab === 'grid' ? 'active' : ''}`}
              onClick={() => setTab('grid')}
            >
              📋 Spreadsheet
            </button>
            <button
              className={`excel-tab ${tab === 'single' ? 'active' : ''}`}
              onClick={() => setTab('single')}
            >
              ✏️ Single Entry
            </button>
          </div>
        </div>

        {/* ── GRID VIEW ── */}
        {tab === 'grid' && (
          <>
            <div className="excel-table-wrapper" ref={tableRef}>
              <table className="excel-table">
                <thead>
                  <tr>
                    <th className="excel-th row-num">#</th>
                    <th className="excel-th">Enroll No</th>
                    <th className="excel-th">Student Name <span className="req">*</span></th>
                    <th className="excel-th">Test Marks</th>
                    <th className="excel-th">MCQ <span className="req">*</span></th>
                    <th className="excel-th">Assignment <span className="req">*</span></th>
                    <th className="excel-th">Sliptest <span className="req">*</span></th>
                    <th className="excel-th">Status</th>
                    <th className="excel-th del-col"></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => (
                    <tr
                      key={row.id}
                      className={`excel-row ${row.status === 'saved' ? 'row-saved' : ''} ${row.status === 'error' ? 'row-error' : ''}`}
                    >
                      <td className="excel-td row-num">{idx + 1}</td>
                      <td className="excel-td">
                        <input
                          className="excel-input"
                          data-row={idx} data-field="enroll_no"
                          value={row.enroll_no}
                          onChange={e => updateCell(idx, 'enroll_no', e.target.value)}
                          onKeyDown={e => handleKeyDown(e, idx, 'enroll_no')}
                          placeholder="TU625..."
                          disabled={row.status === 'saved'}
                        />
                      </td>
                      <td className="excel-td">
                        <input
                          className="excel-input name-input"
                          data-row={idx} data-field="student_name"
                          value={row.student_name}
                          onChange={e => updateCell(idx, 'student_name', e.target.value)}
                          onKeyDown={e => handleKeyDown(e, idx, 'student_name')}
                          placeholder="Full Name"
                          disabled={row.status === 'saved'}
                        />
                      </td>
                      <td className="excel-td">
                        <input
                          className="excel-input num-input"
                          type="number" min="0" max="100"
                          data-row={idx} data-field="test_marks"
                          value={row.test_marks}
                          onChange={e => updateCell(idx, 'test_marks', e.target.value)}
                          onKeyDown={e => handleKeyDown(e, idx, 'test_marks')}
                          placeholder="0"
                          disabled={row.status === 'saved'}
                        />
                      </td>
                      <td className="excel-td">
                        <input
                          className="excel-input num-input"
                          type="number" min="0" max="100"
                          data-row={idx} data-field="mcq"
                          value={row.mcq}
                          onChange={e => updateCell(idx, 'mcq', e.target.value)}
                          onKeyDown={e => handleKeyDown(e, idx, 'mcq')}
                          placeholder="0"
                          disabled={row.status === 'saved'}
                        />
                      </td>
                      <td className="excel-td">
                        <input
                          className="excel-input num-input"
                          type="number" min="0" max="100"
                          data-row={idx} data-field="assignment"
                          value={row.assignment}
                          onChange={e => updateCell(idx, 'assignment', e.target.value)}
                          onKeyDown={e => handleKeyDown(e, idx, 'assignment')}
                          placeholder="0"
                          disabled={row.status === 'saved'}
                        />
                      </td>
                      <td className="excel-td">
                        <input
                          className="excel-input num-input"
                          type="number" min="0" max="100"
                          data-row={idx} data-field="sliptest"
                          value={row.sliptest}
                          onChange={e => updateCell(idx, 'sliptest', e.target.value)}
                          onKeyDown={e => handleKeyDown(e, idx, 'sliptest')}
                          placeholder="0"
                          disabled={row.status === 'saved'}
                        />
                      </td>
                      <td className="excel-td status-col">
                        {row.status === 'saving' && <span className="status-saving">⟳</span>}
                        {row.status === 'saved'  && <span className="status-saved">✓</span>}
                        {row.status === 'error'  && <span className="status-error" title={row.error}>✗</span>}
                      </td>
                      <td className="excel-td del-col">
                        <button className="row-del-btn" onClick={() => deleteRow(idx)} title="Delete row">×</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Grid Actions */}
            <div className="excel-footer">
              <div className="excel-footer-left">
                <button className="excel-action-btn" onClick={() => addRows(5)}>+ Add 5 Rows</button>
                <button className="excel-action-btn" onClick={() => addRows(1)}>+ Add Row</button>
                <button className="excel-action-btn danger" onClick={clearAll}>↺ Clear All</button>
                <span className="excel-count">{filledCount} of {rows.length} rows filled</span>
              </div>
              <div className="excel-footer-right">
                {saveStatus === 'success'  && <span className="save-success">✅ All saved!</span>}
                {saveStatus === 'partial'  && <span className="save-partial">⚠️ Some rows failed</span>}
                {saveStatus === 'nodata'   && <span className="save-partial">⚠️ Fill at least one row</span>}
                <button
                  className="excel-save-btn"
                  onClick={handleBulkSave}
                  disabled={saving}
                >
                  {saving ? '⟳ Saving...' : `💾 Save ${filledCount > 0 ? filledCount : ''} Records`}
                </button>
              </div>
            </div>
          </>
        )}

        {/* ── SINGLE ENTRY VIEW ── */}
        {tab === 'single' && (
          <form onSubmit={handleSingleSave} className="single-entry-form">
            <div className="single-row-grid">
              <div className="form-group">
                <label className="excel-label">Enroll No</label>
                <input
                  className="excel-single-input"
                  type="text"
                  value={single.enroll_no}
                  onChange={e => setSingle(s => ({ ...s, enroll_no: e.target.value }))}
                  placeholder="TU6251..."
                />
              </div>
              <div className="form-group">
                <label className="excel-label">Student Name <span className="req">*</span></label>
                <input
                  className="excel-single-input"
                  type="text"
                  required
                  value={single.student_name}
                  onChange={e => setSingle(s => ({ ...s, student_name: e.target.value }))}
                  placeholder="Full name"
                />
              </div>
            </div>
            <div className="single-marks-grid">
              {[
                { key: 'mcq',        label: 'MCQ',        max: 100 },
                { key: 'assignment', label: 'Assignment',  max: 100 },
                { key: 'sliptest',   label: 'Sliptest',   max: 100 },
              ].map(({ key, label, max }) => (
                <div key={key} className="form-group">
                  <label className="excel-label">{label} <span className="req">*</span></label>
                  <input
                    className="excel-single-input num-input"
                    type="number" min="0" max={max} required
                    value={single[key]}
                    onChange={e => setSingle(s => ({ ...s, [key]: e.target.value }))}
                    placeholder="0"
                  />
                  <span className="max-label">/ {max}</span>
                </div>
              ))}
            </div>

            {singleMsg && (
              <div className={singleMsg.startsWith('✅') ? 'single-success' : 'single-error'}>
                {singleMsg}
              </div>
            )}

            <button type="submit" className="excel-save-btn full-width" disabled={singleLoading}>
              {singleLoading ? '⟳ Saving...' : '💾 Save Entry'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddDataModal;
