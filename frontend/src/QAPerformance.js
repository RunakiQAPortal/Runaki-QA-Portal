import React, { useState, useEffect } from 'react';

const F = { fontFamily: "'Inter','Segoe UI',sans-serif" };

const ACLR = ['#FF6B35','#A78BFA','#34D399','#FBBF24','#60A5FA','#F472B6','#38BDF8','#FB923C'];
const aclr = (name) => ACLR[(name?.charCodeAt(0) || 0) % ACLR.length];

const sc = (s) => s >= 80 ? '#4ADE80' : s >= 60 ? '#FBBF24' : '#F87171';
const sbg = (s) => s >= 80 ? 'rgba(74,222,128,0.12)' : s >= 60 ? 'rgba(251,191,36,0.12)' : 'rgba(248,113,113,0.12)';
const sbd = (s) => s >= 80 ? 'rgba(74,222,128,0.25)' : s >= 60 ? 'rgba(251,191,36,0.25)' : 'rgba(248,113,113,0.25)';
const slb = (s) => s >= 80 ? 'Excellent' : s >= 60 ? 'Average' : 'Needs Work';

// Demo data if API returns empty
const DEMO_QA = [
  { id: 1, name: 'Miran',     totalEvals: 24, avgScore: 84, coachingCompleted: 18, coachingRate: 75, pendingCoaching: 6 },
  { id: 2, name: 'Sizar',     totalEvals: 21, avgScore: 78, coachingCompleted: 14, coachingRate: 67, pendingCoaching: 7 },
  { id: 3, name: 'Brwa',      totalEvals: 19, avgScore: 91, coachingCompleted: 17, coachingRate: 89, pendingCoaching: 2 },
  { id: 4, name: 'Mohammed',  totalEvals: 16, avgScore: 66, coachingCompleted: 10, coachingRate: 63, pendingCoaching: 6 },
];

const QAPerformance = () => {
  const [qaOfficers, setQaOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [usersRes, evalRes] = await Promise.all([
        fetch('http://localhost:8080/api/users'),
        fetch('http://localhost:8080/api/evaluations'),
      ]);
      const users = await usersRes.json();
      const evals = await evalRes.json();

      const qaList = users.filter(u => u.role?.toLowerCase() === 'qa');

      if (qaList.length === 0) { setQaOfficers(DEMO_QA); setLoading(false); return; }

      const qaWithStats = qaList.map(qa => {
        const qaEvals = evals.filter(e => e.qa_name === qa.name);
        const totalEvals = qaEvals.length;
        const avgScore = totalEvals > 0
          ? Math.round(qaEvals.reduce((s, e) => s + (e.overall_score_percentage || 0), 0) / totalEvals)
          : 0;
        const coachingCompleted = qaEvals.filter(e => e.coaching_completed).length;
        const pendingCoaching = qaEvals.filter(e => !e.coaching_completed).length;
        const coachingRate = totalEvals > 0 ? Math.round((coachingCompleted / totalEvals) * 100) : 0;
        return { ...qa, totalEvals, avgScore, coachingCompleted, coachingRate, pendingCoaching };
      }).sort((a, b) => b.totalEvals - a.totalEvals);

      setQaOfficers(qaWithStats.length > 0 ? qaWithStats : DEMO_QA);
    } catch {
      setQaOfficers(DEMO_QA);
    } finally {
      setLoading(false);
    }
  };

  const totalEvals = qaOfficers.reduce((s, q) => s + q.totalEvals, 0);
  const overallAvg = qaOfficers.length > 0
    ? Math.round(qaOfficers.reduce((s, q) => s + q.avgScore, 0) / qaOfficers.length)
    : 0;
  const topQA = qaOfficers.reduce((best, q) => (!best || q.avgScore > best.avgScore) ? q : best, null);
  const totalPending = qaOfficers.reduce((s, q) => s + (q.pendingCoaching || 0), 0);

  const RANK_ICON = ['🥇','🥈','🥉'];

  return (
    <div style={{ ...F, padding: '32px', background: '#0D0F1E', minHeight: '100vh' }}>

      <style>{`
        #qaperf-style { }
        .qap-card:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.3) !important; }
        .qap-row:hover { background: rgba(255,255,255,0.04) !important; }
        .qap-detail-btn:hover { background: rgba(96,165,250,0.2) !important; border-color: rgba(96,165,250,0.5) !important; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '3px', color: '#FF6B35', marginBottom: '8px' }}>
          SUPERVISOR VIEW
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <h1 style={{ margin: 0, fontSize: '30px', fontWeight: '800', color: '#FFFFFF', lineHeight: 1.1 }}>
            QA Performance
          </h1>
          <div style={{
            padding: '8px 18px', borderRadius: '20px',
            background: 'rgba(96,165,250,0.12)', border: '1px solid rgba(96,165,250,0.25)',
            fontSize: '13px', fontWeight: '600', color: '#60A5FA',
          }}>
            {qaOfficers.length} QA Officer{qaOfficers.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {[
          {
            label: 'Total QA Officers',
            value: qaOfficers.length,
            sub: 'active officers',
            color: '#60A5FA',
            icon: (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            ),
          },
          {
            label: 'Total Evaluations',
            value: totalEvals,
            sub: 'across all officers',
            color: '#FF6B35',
            icon: (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            ),
          },
          {
            label: 'Overall Avg Score',
            value: `${overallAvg}%`,
            sub: slb(overallAvg),
            color: sc(overallAvg),
            icon: (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            ),
          },
          {
            label: 'Pending Coaching',
            value: totalPending,
            sub: 'needs follow-up',
            color: '#FBBF24',
            icon: (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            ),
          },
        ].map((kpi, i) => (
          <div
            key={i}
            className="qap-card"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '22px 24px',
              transition: 'all 0.2s',
              cursor: 'default',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
              background: `linear-gradient(90deg, ${kpi.color}, ${kpi.color}44)`,
              borderRadius: '16px 16px 0 0',
            }} />
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: `${kpi.color}18`,
              border: `1px solid ${kpi.color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: kpi.color,
              marginBottom: '14px',
            }}>
              {kpi.icon}
            </div>
            <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', color: '#8FA3C4', marginBottom: '6px' }}>
              {kpi.label}
            </div>
            <div style={{ fontSize: '30px', fontWeight: '800', color: '#FFFFFF', lineHeight: 1 }}>
              {loading ? '—' : kpi.value}
            </div>
            <div style={{ fontSize: '12px', color: '#4A5A78', marginTop: '4px' }}>
              {kpi.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Top Performer Banner */}
      {topQA && !loading && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(255,107,53,0.12), rgba(251,191,36,0.08))',
          border: '1px solid rgba(255,107,53,0.25)',
          borderRadius: '16px',
          padding: '20px 28px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
        }}>
          <div style={{ fontSize: '32px' }}>🏆</div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '2px', color: '#FBBF24', marginBottom: '4px' }}>
              TOP PERFORMER THIS PERIOD
            </div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF' }}>
              {topQA.name}
              <span style={{ marginLeft: '12px', fontSize: '14px', color: sc(topQA.avgScore), fontWeight: '700' }}>
                {topQA.avgScore}% avg · {topQA.totalEvals} evals
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px',
        overflow: 'hidden',
      }}>
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '56px 1fr 130px 130px 160px 130px 110px',
          padding: '16px 28px',
          background: 'rgba(255,255,255,0.04)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}>
          {['Rank', 'QA Officer', 'Evaluations', 'Avg Score', 'Coaching Rate', 'Pending', 'Details'].map((col, i) => (
            <div key={i} style={{
              fontSize: '10px', fontWeight: '700',
              letterSpacing: '2px', textTransform: 'uppercase',
              color: '#FF6B35',
            }}>
              {col}
            </div>
          ))}
        </div>

        {/* Rows */}
        <div>
          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#4A5A78' }}>
              <div style={{ fontSize: '14px' }}>Loading QA data...</div>
            </div>
          ) : qaOfficers.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.3 }}>👥</div>
              <div style={{ fontSize: '15px', color: '#4A5A78', fontWeight: '600' }}>No QA officers found</div>
            </div>
          ) : (
            qaOfficers.map((qa, idx) => (
              <div
                key={qa.id}
                className="qap-row"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '56px 1fr 130px 130px 160px 130px 110px',
                  padding: '18px 28px',
                  borderBottom: idx < qaOfficers.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  alignItems: 'center',
                  transition: 'background 0.15s',
                  background: 'transparent',
                  cursor: 'default',
                }}
              >
                {/* Rank */}
                <div style={{ fontSize: '20px' }}>
                  {idx < 3
                    ? RANK_ICON[idx]
                    : <span style={{ fontSize: '14px', fontWeight: '700', color: '#4A5A78' }}>#{idx + 1}</span>
                  }
                </div>

                {/* Officer */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '12px',
                    background: `${aclr(qa.name)}22`,
                    border: `1px solid ${aclr(qa.name)}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px', fontWeight: '800', color: aclr(qa.name),
                    flexShrink: 0,
                  }}>
                    {qa.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF' }}>{qa.name}</div>
                    <div style={{ fontSize: '12px', color: '#4A5A78' }}>{qa.email || 'QA Officer'}</div>
                  </div>
                </div>

                {/* Evaluations */}
                <div style={{ fontSize: '22px', fontWeight: '800', color: '#60A5FA' }}>
                  {qa.totalEvals}
                </div>

                {/* Avg Score */}
                <div>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center',
                    padding: '6px 14px', borderRadius: '20px',
                    background: sbg(qa.avgScore), border: `1px solid ${sbd(qa.avgScore)}`,
                  }}>
                    <span style={{ fontSize: '15px', fontWeight: '800', color: sc(qa.avgScore) }}>
                      {qa.avgScore}%
                    </span>
                  </div>
                </div>

                {/* Coaching Rate */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      flex: 1, height: '6px',
                      background: 'rgba(255,255,255,0.08)',
                      borderRadius: '3px',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${qa.coachingRate}%`,
                        background: qa.coachingRate >= 80
                          ? 'linear-gradient(90deg, #4ADE80, #34D399)'
                          : qa.coachingRate >= 60
                          ? 'linear-gradient(90deg, #FBBF24, #F59E0B)'
                          : 'linear-gradient(90deg, #F87171, #EF4444)',
                        borderRadius: '3px',
                        transition: 'width 0.5s ease',
                      }} />
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#C8D8EC', minWidth: '36px' }}>
                      {qa.coachingRate}%
                    </span>
                  </div>
                </div>

                {/* Pending Coaching */}
                <div>
                  {qa.pendingCoaching > 0 ? (
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '5px',
                      padding: '5px 12px', borderRadius: '20px',
                      background: 'rgba(251,191,36,0.12)',
                      border: '1px solid rgba(251,191,36,0.25)',
                      fontSize: '13px', fontWeight: '700', color: '#FBBF24',
                    }}>
                      {qa.pendingCoaching} pending
                    </span>
                  ) : (
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '5px',
                      padding: '5px 12px', borderRadius: '20px',
                      background: 'rgba(74,222,128,0.1)',
                      border: '1px solid rgba(74,222,128,0.2)',
                      fontSize: '13px', fontWeight: '700', color: '#4ADE80',
                    }}>
                      ✓ Clear
                    </span>
                  )}
                </div>

                {/* Detail Button */}
                <div>
                  <button
                    className="qap-detail-btn"
                    onClick={() => setSelected(selected?.id === qa.id ? null : qa)}
                    style={{
                      padding: '7px 16px',
                      background: selected?.id === qa.id ? 'rgba(96,165,250,0.2)' : 'rgba(96,165,250,0.08)',
                      border: selected?.id === qa.id ? '1px solid rgba(96,165,250,0.5)' : '1px solid rgba(96,165,250,0.2)',
                      borderRadius: '8px',
                      color: '#60A5FA',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {selected?.id === qa.id ? 'Close' : 'Details'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Expanded Detail Panel */}
      {selected && (
        <div style={{
          marginTop: '20px',
          background: 'rgba(255,255,255,0.03)',
          border: `1px solid ${aclr(selected.name)}30`,
          borderRadius: '20px',
          padding: '28px 32px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: '14px',
              background: `${aclr(selected.name)}22`,
              border: `1px solid ${aclr(selected.name)}40`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '20px', fontWeight: '800', color: aclr(selected.name),
            }}>
              {selected.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '2px', color: '#8FA3C4', marginBottom: '4px' }}>
                DETAILED BREAKDOWN
              </div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#FFFFFF' }}>{selected.name}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {[
              { label: 'Total Evaluations', value: selected.totalEvals, color: '#60A5FA' },
              { label: 'Average Score', value: `${selected.avgScore}%`, color: sc(selected.avgScore) },
              { label: 'Coaching Completed', value: selected.coachingCompleted, color: '#4ADE80' },
              { label: 'Coaching Rate', value: `${selected.coachingRate}%`, color: '#A78BFA' },
            ].map((item, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '14px',
                padding: '18px 20px',
              }}>
                <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', color: '#4A5A78', marginBottom: '8px' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: item.color }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          {/* Score bar */}
          <div style={{
            marginTop: '20px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '14px',
            padding: '18px 20px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#8FA3C4', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Score Performance
              </span>
              <span style={{ fontSize: '13px', fontWeight: '700', color: sc(selected.avgScore) }}>
                {slb(selected.avgScore)}
              </span>
            </div>
            <div style={{ height: '10px', background: 'rgba(255,255,255,0.08)', borderRadius: '5px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${selected.avgScore}%`,
                background: `linear-gradient(90deg, ${sc(selected.avgScore)}, ${sc(selected.avgScore)}aa)`,
                borderRadius: '5px',
                transition: 'width 0.6s ease',
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
              <span style={{ fontSize: '11px', color: '#4A5A78' }}>0%</span>
              <span style={{ fontSize: '13px', fontWeight: '800', color: sc(selected.avgScore) }}>
                {selected.avgScore}%
              </span>
              <span style={{ fontSize: '11px', color: '#4A5A78' }}>100%</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default QAPerformance;