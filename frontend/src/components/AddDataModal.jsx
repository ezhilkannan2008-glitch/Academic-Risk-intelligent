import React, { useState, useEffect } from 'react';
import { addMarks, getCourses } from '../services/api';

const AddDataModal = ({ isOpen, onClose, onDataAdded }) => {
  const [courses, setCourses] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [courseId, setCourseId] = useState('');
  const [mcqMark, setMcqMark] = useState('');
  const [assignmentMark, setAssignmentMark] = useState('');
  const [sliptestMark, setSliptestMark] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      const fetchCourses = async () => {
        try {
          const data = await getCourses();
          setCourses(data);
          if (data.length > 0) setCourseId(data[0].id);
        } catch (err) {
          console.error("Failed to load courses:", err);
        }
      };
      fetchCourses();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await addMarks({
        student_name: studentName,
        course_id: courseId,
        mcq_mark: mcqMark,
        assignment_mark: assignmentMark,
        sliptest_mark: sliptestMark
      });
      setStudentName('');
      setMcqMark('');
      setAssignmentMark('');
      setSliptestMark('');
      onDataAdded();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add marks");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel">
        <div className="modal-header">
          <h3>Add Manual Data</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        {error && <div className="login-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Student Name</label>
            <input 
              type="text" 
              required 
              value={studentName} 
              onChange={(e) => setStudentName(e.target.value)} 
              placeholder="e.g. Student 1001"
            />
          </div>

          <div className="form-group">
            <label>Course</label>
            <select 
              value={courseId} 
              onChange={(e) => setCourseId(e.target.value)} 
              required
              className="custom-select"
            >
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.course_name}</option>
              ))}
            </select>
          </div>

          <div className="grid-layout" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>MCQ Mark</label>
              <input 
                type="number" 
                required 
                min="0" max="100" 
                value={mcqMark} 
                onChange={(e) => setMcqMark(e.target.value)} 
              />
            </div>
            
            <div className="form-group">
              <label>Assignment</label>
              <input 
                type="number" 
                required 
                min="0" max="100" 
                value={assignmentMark} 
                onChange={(e) => setAssignmentMark(e.target.value)} 
              />
            </div>
            
            <div className="form-group">
              <label>Sliptest</label>
              <input 
                type="number" 
                required 
                min="0" max="100" 
                value={sliptestMark} 
                onChange={(e) => setSliptestMark(e.target.value)} 
              />
            </div>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Saving...' : 'Save Data'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDataModal;
