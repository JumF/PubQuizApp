import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/shared/Layout';
import { Button } from '../components/shared/Button';
import { Loading } from '../components/shared/Loading';
import { getAllQuizzes, deleteQuiz } from '../services/quizService';
import type { Quiz } from '../types';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingQuizId, setDeletingQuizId] = useState<string | null>(null);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const fetchedQuizzes = await getAllQuizzes();
      setQuizzes(fetchedQuizzes);
    } catch (error) {
      console.error('Error loading quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (quizId: string) => {
    if (window.confirm('Weet je zeker dat je deze quiz wilt verwijderen?')) {
      setDeletingQuizId(quizId);
      try {
        await deleteQuiz(quizId);
        setQuizzes(quizzes.filter(q => q.id !== quizId));
      } catch (error) {
        console.error('Error deleting quiz:', error);
        alert('Fout bij verwijderen van quiz');
      } finally {
        setDeletingQuizId(null);
      }
    }
  };

  if (loading) {
    return <Loading text="Quizzen laden..." />;
  }

  return (
    <Layout title="Admin Dashboard" maxWidth="xl">
      <div className="mb-6 flex justify-between items-center">
        <Button variant="secondary" onClick={() => navigate('/')}>← Terug</Button>
        <Button variant="blue" onClick={() => navigate('/admin/quiz/new')}>
          + Nieuwe Quiz
        </Button>
      </div>

      {quizzes.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-200">
          <p className="text-gray-600 mb-4">Nog geen quizzen aangemaakt.</p>
          <Button variant="blue" onClick={() => navigate('/admin/quiz/new')}>
            Maak je eerste quiz
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quiz Naam</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rondes</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vragen</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Acties</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {quizzes.map((quiz) => (
                <tr key={quiz.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{quiz.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{quiz.roundCount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{quiz.questionsPerRound}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button variant="blue" size="sm" onClick={() => navigate(`/admin/quiz/${quiz.id}`)} className="mr-2">
                      Bewerken
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(quiz.id)} disabled={deletingQuizId === quiz.id}>
                      {deletingQuizId === quiz.id ? 'Verwijderen...' : 'Verwijderen'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
};

