const express = require('express');
const router = express.Router();
const db = require('../utils/db');

// Create viva_quizzes table (ENHANCED)
db.run(`
  CREATE TABLE IF NOT EXISTS viva_quizzes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active',
    created_by TEXT,
    total_questions INTEGER DEFAULT 0,
    passing_score INTEGER DEFAULT 70,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create viva_questions table (ENHANCED WITH MULTIPLE CHOICE)
db.run(`
  CREATE TABLE IF NOT EXISTS viva_questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quiz_id INTEGER NOT NULL,
    question TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT,
    option_d TEXT,
    correct_answer TEXT NOT NULL,
    points INTEGER DEFAULT 1,
    FOREIGN KEY (quiz_id) REFERENCES viva_quizzes(id) ON DELETE CASCADE
  )
`);

// Create viva_assignments table (NEW - ASSIGN QUIZZES TO AGENTS)
db.run(`
  CREATE TABLE IF NOT EXISTS viva_assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quiz_id INTEGER NOT NULL,
    agent_id INTEGER NOT NULL,
    agent_name TEXT NOT NULL,
    agent_email TEXT NOT NULL,
    assigned_by TEXT NOT NULL,
    assigned_at TEXT DEFAULT CURRENT_TIMESTAMP,
    due_date TEXT,
    status TEXT DEFAULT 'pending',
    score INTEGER,
    completed_at TEXT,
    FOREIGN KEY (quiz_id) REFERENCES viva_quizzes(id) ON DELETE CASCADE
  )
`);

// Create viva_answers table (NEW - STORE AGENT ANSWERS)
db.run(`
  CREATE TABLE IF NOT EXISTS viva_answers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    assignment_id INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    selected_answer TEXT,
    is_correct INTEGER DEFAULT 0,
    FOREIGN KEY (assignment_id) REFERENCES viva_assignments(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES viva_questions(id) ON DELETE CASCADE
  )
`);

// Get statistics
router.get('/stats', (req, res) => {
  const stats = {};
  
  db.get('SELECT COUNT(*) as total FROM viva_quizzes WHERE status = "active"', (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    stats.total = row ? row.total || 0 : 0;
    
    db.get('SELECT COUNT(*) as totalQuestions FROM viva_questions', (err, row) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      stats.totalQuestions = row ? row.totalQuestions || 0 : 0;
      
      db.get('SELECT COUNT(*) as archived FROM viva_quizzes WHERE status = "archived"', (err, row) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        stats.archived = row ? row.archived || 0 : 0;
        
        db.get('SELECT COUNT(*) as totalAssignments FROM viva_assignments', (err, row) => {
          if (err) return res.status(500).json({ error: 'Database error' });
          stats.totalAssignments = row ? row.totalAssignments || 0 : 0;
          
          res.json(stats);
        });
      });
    });
  });
});

// Get all quizzes with questions
router.get('/', (req, res) => {
  db.all('SELECT * FROM viva_quizzes ORDER BY created_at DESC', (err, quizzes) => {
    if (err) {
      console.error('Error fetching quizzes:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (quizzes.length === 0) {
      return res.json([]);
    }

    const quizzesWithQuestions = [];
    let completed = 0;

    quizzes.forEach((quiz) => {
      db.all('SELECT * FROM viva_questions WHERE quiz_id = ?', [quiz.id], (err, questions) => {
        if (err) {
          console.error('Error fetching questions:', err);
        }
        quizzesWithQuestions.push({ ...quiz, questions: questions || [] });
        completed++;
        if (completed === quizzes.length) {
          res.json(quizzesWithQuestions);
        }
      });
    });
  });
});

// Get quiz by ID with questions
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM viva_quizzes WHERE id = ?', [id], (err, quiz) => {
    if (err) {
      console.error('Error fetching quiz:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    
    db.all('SELECT * FROM viva_questions WHERE quiz_id = ?', [id], (err, questions) => {
      if (err) {
        console.error('Error fetching questions:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      res.json({
        ...quiz,
        questions: questions || []
      });
    });
  });
});

// Create quiz with questions (ENHANCED)
router.post('/', (req, res) => {
  const { title, description, questions, created_by, passing_score } = req.body;

  db.run(
    'INSERT INTO viva_quizzes (title, description, created_by, total_questions, passing_score) VALUES (?, ?, ?, ?, ?)',
    [title, description, created_by, questions.length, passing_score || 70],
    function(err) {
      if (err) {
        console.error('Error creating quiz:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      const quizId = this.lastID;

      if (questions && questions.length > 0) {
        const stmt = db.prepare(
          'INSERT INTO viva_questions (quiz_id, question, option_a, option_b, option_c, option_d, correct_answer, points) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        );
        questions.forEach((q) => {
          stmt.run(
            quizId, 
            q.question, 
            q.option_a, 
            q.option_b, 
            q.option_c || '', 
            q.option_d || '', 
            q.correct_answer, 
            q.points || 1
          );
        });
        stmt.finalize();
      }

      res.status(201).json({ id: quizId, message: 'Quiz created successfully' });
    }
  );
});

// Assign quiz to agents (NEW)
router.post('/assignments', (req, res) => {
  const { quiz_id, agents, assigned_by, due_date } = req.body;
  
  const stmt = db.prepare(
    'INSERT INTO viva_assignments (quiz_id, agent_id, agent_name, agent_email, assigned_by, due_date) VALUES (?, ?, ?, ?, ?, ?)'
  );
  
  agents.forEach(agent => {
    stmt.run(quiz_id, agent.id, agent.name, agent.email, assigned_by, due_date);
  });
  
  stmt.finalize();
  
  res.status(201).json({ message: 'Quiz assigned successfully' });
});

// Get assignments for a specific agent (NEW)
router.get('/assignments/agent/:email', (req, res) => {
  const { email } = req.params;
  
  db.all(
    `SELECT a.*, q.title, q.description, q.total_questions, q.passing_score 
     FROM viva_assignments a 
     JOIN viva_quizzes q ON a.quiz_id = q.id 
     WHERE a.agent_email = ? 
     ORDER BY a.assigned_at DESC`,
    [email],
    (err, assignments) => {
      if (err) {
        console.error('Error fetching assignments:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(assignments || []);
    }
  );
});

// Get all assignments (for QA/Owner) (NEW)
router.get('/assignments', (req, res) => {
  db.all(
    `SELECT a.*, q.title 
     FROM viva_assignments a 
     JOIN viva_quizzes q ON a.quiz_id = q.id 
     ORDER BY a.assigned_at DESC`,
    (err, assignments) => {
      if (err) {
        console.error('Error fetching assignments:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(assignments || []);
    }
  );
});

// Submit quiz answers (NEW)
router.post('/assignments/:id/submit', (req, res) => {
  const { id } = req.params;
  const { answers } = req.body; // Array of { question_id, selected_answer }
  
  // Get assignment details
  db.get('SELECT * FROM viva_assignments WHERE id = ?', [id], (err, assignment) => {
    if (err || !assignment) {
      return res.status(500).json({ error: 'Assignment not found' });
    }
    
    // Get all questions for this quiz
    db.all('SELECT * FROM viva_questions WHERE quiz_id = ?', [assignment.quiz_id], (err, questions) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      let correctCount = 0;
      const stmt = db.prepare(
        'INSERT INTO viva_answers (assignment_id, question_id, selected_answer, is_correct) VALUES (?, ?, ?, ?)'
      );
      
      answers.forEach(answer => {
        const question = questions.find(q => q.id === answer.question_id);
        const isCorrect = question && question.correct_answer === answer.selected_answer ? 1 : 0;
        if (isCorrect) correctCount++;
        
        stmt.run(id, answer.question_id, answer.selected_answer, isCorrect);
      });
      
      stmt.finalize();
      
      // Calculate score
      const score = Math.round((correctCount / questions.length) * 100);
      
      // Update assignment
      db.run(
        'UPDATE viva_assignments SET status = ?, score = ?, completed_at = ? WHERE id = ?',
        ['completed', score, new Date().toISOString(), id],
        (err) => {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }
          
          res.json({ 
            message: 'Quiz submitted successfully', 
            score,
            correctCount,
            totalQuestions: questions.length
          });
        }
      );
    });
  });
});

// Get quiz results (NEW)
router.get('/assignments/:id/results', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM viva_assignments WHERE id = ?', [id], (err, assignment) => {
    if (err || !assignment) {
      return res.status(500).json({ error: 'Assignment not found' });
    }
    
    db.all(
      `SELECT a.*, q.question, q.option_a, q.option_b, q.option_c, q.option_d, q.correct_answer 
       FROM viva_answers a 
       JOIN viva_questions q ON a.question_id = q.id 
       WHERE a.assignment_id = ?`,
      [id],
      (err, answers) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        
        res.json({
          assignment,
          answers: answers || []
        });
      }
    );
  });
});

// Archive/Unarchive quiz
router.patch('/:id/archive', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  db.run(
    'UPDATE viva_quizzes SET status = ? WHERE id = ?',
    [status, id],
    function(err) {
      if (err) {
        console.error('Error archiving quiz:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Quiz status updated successfully' });
    }
  );
});

// Delete quiz
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM viva_quizzes WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Error deleting quiz:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ message: 'Quiz deleted successfully' });
  });
});

module.exports = router;