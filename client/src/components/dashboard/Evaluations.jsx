import React, { useState, useEffect, useContext } from 'react';
import { FaFilter, FaFileAlt } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import '../../assets/styles/Evaluations.css';

const Evaluations = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState({ by: 'evaluatedAt', order: 'desc' });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { token } = useContext(AuthContext);
  const [progress, setProgress] = useState(0);
  const ITEMS_PER_PAGE = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(evaluations.length / ITEMS_PER_PAGE);
  const paginatedEvaluations = evaluations.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => {
    let interval;
    if (loading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 1 : prev));
      }, 20);
    } else {
      setProgress(100);
      setTimeout(() => setProgress(0), 500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    const fetchEvaluations = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/api/resumes/evaluations?sortBy=${sort.by}&sortOrder=${sort.order}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log('Evaluations:', data); // Debug log to inspect the data structure
          setEvaluations(data);
        } else {
          console.error('Failed to fetch evaluations');
        }
      } catch (error) {
        console.error('Error fetching evaluations:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchEvaluations();
    }
  }, [token, sort]);

  const getScoreClass = (score) => {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
  };

  const handleSort = (by, order) => {
    setSort({ by, order });
    setIsFilterOpen(false);
  };

  const timeAgo = (date) => {
    const now = new Date();
    const seconds = Math.round((now - new Date(date)) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return `${seconds} seconds ago`;
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
  };

  return (
    <div className="candidate-card">
      <div className="section-header">
        <h2 className="section-title">Recent Evaluations</h2>
        <div className="evaluations-container">
          <button
            className="btn btn-outline"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <FaFilter color="156064" />
            Filter
          </button>
          {isFilterOpen && (
            <div className="filter-dropdown">
              <button onClick={() => handleSort('evaluatedAt', 'desc')}>
                Latest to Oldest
              </button>
              <button onClick={() => handleSort('evaluatedAt', 'asc')}>
                Oldest to Latest
              </button>
              <button onClick={() => handleSort('score', 'desc')}>
                Score: High to Low
              </button>
              <button onClick={() => handleSort('score', 'asc')}>
                Score: Low to High
              </button>
            </div>
          )}
        </div>
      </div>
      {loading ? (
        <div className="loader-wrapper">
          <div className="loader"></div>
          <div className="loader-percentage">{progress}%</div>
        </div>
      ) : (
        <>
          <ul className="evaluations">
            {paginatedEvaluations.map((e) => {
              // Defensive: ensure score is a number
              const score = typeof e.score === 'number' ? e.score : Number(e.score);
              const displayScore = isNaN(score) ? 'N/A' : score;
              const scoreClass = isNaN(score) ? '' : getScoreClass(score);
              return (
                <li key={e._id} className="eval-item">
                  <div className="item-content">
                    <FaFileAlt />
                    <span>{e.resumeId?.originalName || 'N/A'}</span>
                  </div>
                  <div className="item-actions">
                    <span className="timestamp">
                      Updated: {timeAgo(e.evaluatedAt)}
                    </span>
                    <span
                      className={`score ${scoreClass}`}
                      data-score={displayScore}
                    >
                      {displayScore}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination-controls">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>&laquo;</button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={currentPage === i + 1 ? 'active' : ''}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>&raquo;</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Evaluations;
