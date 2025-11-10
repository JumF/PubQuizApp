import React, { useEffect, useState } from 'react';
import { Button } from '../shared/Button';
import { Loading } from '../shared/Loading';
import type { Quiz, Round, Question } from '../../types';
import {
  getQuiz,
  createQuiz,
  updateQuiz,
  getRounds,
  createRound,
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion
} from '../../services/quizService';
import { QuestionEditor } from './QuestionEditor';

interface QuizEditorProps {
  quizId?: string;
  onSave: () => void;
  onCancel: () => void;
}

export const QuizEditorComponent: React.FC<QuizEditorProps> = ({ quizId, onSave, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [quizName, setQuizName] = useState('');
  const [rounds, setRounds] = useState<Round[]>([]);
  const [selectedRound, setSelectedRound] = useState<number>(0);
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (quizId) {
      loadQuiz();
    }
  }, [quizId]);

  useEffect(() => {
    if (quiz && rounds.length > 0) {
      loadQuestions(quiz.id, rounds[selectedRound]?.id);
    }
  }, [selectedRound, quiz, rounds]);

  const loadQuiz = async () => {
    if (!quizId) return;

    setLoading(true);
    try {
      const quizData = await getQuiz(quizId);
      if (quizData) {
        setQuiz(quizData);
        setQuizName(quizData.name);
        const roundsData = await getRounds(quizId);
        setRounds(roundsData);
        if (roundsData.length > 0) {
          const questionsData = await getQuestions(quizId, roundsData[0].id);
          setQuestions(questionsData);
        }
      }
    } catch (error) {
      console.error('Error loading quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadQuestions = async (quizId: string, roundId: string) => {
    if (!roundId) return;
    try {
      const questionsData = await getQuestions(quizId, roundId);
      setQuestions(questionsData);
    } catch (error) {
      console.error('Error loading questions:', error);
    }
  };

  const handleCreateQuiz = async () => {
    if (!quizName.trim()) {
      alert('Vul een naam in voor de quiz');
      return;
    }

    setSaving(true);
    try {
      const newQuizId = await createQuiz({
        name: quizName,
        roundCount: 5,
        questionsPerRound: 10,
      });

      // Create default rounds
      for (let i = 0; i < 5; i++) {
        await createRound(newQuizId, {
          name: `Ronde ${i + 1}`,
          order: i,
        });
      }

      onSave();
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert('Fout bij aanmaken van quiz');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateQuizName = async () => {
    if (!quiz || !quizName.trim()) return;

    setSaving(true);
    try {
      await updateQuiz(quiz.id, { name: quizName });
      alert('Quiz naam bijgewerkt');
    } catch (error) {
      console.error('Error updating quiz:', error);
      alert('Fout bij bijwerken van quiz');
    } finally {
      setSaving(false);
    }
  };

  const handleAddQuestion = async () => {
    if (!quiz || rounds.length === 0) return;

    const currentRound = rounds[selectedRound];
    const order = questions.length;

    try {
      await createQuestion(quiz.id, currentRound.id, {
        text: 'Nieuwe vraag',
        answers: ['Antwoord 1', 'Antwoord 2', 'Antwoord 3', 'Antwoord 4'],
        correctIndex: 0,
        order,
      });
      await loadQuestions(quiz.id, currentRound.id);
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };

  const handleUpdateQuestion = async (questionId: string, data: Partial<Question>) => {
    if (!quiz || rounds.length === 0) return;

    const currentRound = rounds[selectedRound];
    try {
      await updateQuestion(quiz.id, currentRound.id, questionId, data);
      await loadQuestions(quiz.id, currentRound.id);
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!quiz || rounds.length === 0) return;
    if (!window.confirm('Weet je zeker dat je deze vraag wilt verwijderen?')) return;

    const currentRound = rounds[selectedRound];
    try {
      await deleteQuestion(quiz.id, currentRound.id, questionId);
      await loadQuestions(quiz.id, currentRound.id);
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  if (loading) {
    return <Loading text="Quiz laden..." />;
  }

  if (!quizId) {
    // Create new quiz mode
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Nieuwe Quiz Aanmaken</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Quiz Naam
            </label>
            <input
              type="text"
              value={quizName}
              onChange={(e) => setQuizName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-900 transition-all duration-200"
              placeholder="Bijv. Algemene Kennis Quiz"
            />
          </div>
          <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-xl border border-blue-200">
            Er worden automatisch 5 rondes aangemaakt met elk ruimte voor 10 vragen.
          </div>
          <div className="flex gap-4">
            <Button variant="primary" onClick={handleCreateQuiz} disabled={saving}>
              {saving ? 'Aanmaken...' : 'Quiz Aanmaken'}
            </Button>
            <Button variant="secondary" onClick={onCancel}>
              Annuleren
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Edit existing quiz mode
  return (
    <div className="space-y-6">
      {/* Quiz Name */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Quiz Instellingen</h2>
        <div className="flex gap-4">
          <input
            type="text"
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-900 transition-all duration-200"
          />
          <Button variant="primary" onClick={handleUpdateQuizName} disabled={saving}>
            Naam Opslaan
          </Button>
        </div>
      </div>

      {/* Round Selector */}
      {rounds.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
          <h3 className="text-xl font-bold mb-4 text-gray-900">Rondes</h3>
          <div className="flex gap-2 flex-wrap">
            {rounds.map((round, index) => (
              <button
                key={round.id}
                onClick={() => setSelectedRound(index)}
                className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
                  selectedRound === index
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {round.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Questions */}
      {rounds.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              Vragen voor {rounds[selectedRound]?.name}
            </h3>
            <Button variant="primary" onClick={handleAddQuestion}>+ Vraag Toevoegen</Button>
          </div>

          {questions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Nog geen vragen. Klik op "Vraag Toevoegen" om te beginnen.
            </p>
          ) : (
            <div className="space-y-4">
              {questions.map((question, index) => (
                <QuestionEditor
                  key={question.id}
                  question={question}
                  index={index}
                  onUpdate={(data) => handleUpdateQuestion(question.id, data)}
                  onDelete={() => handleDeleteQuestion(question.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

