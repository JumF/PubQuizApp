import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/shared/Layout';
import { Button } from '../components/shared/Button';
import { Loading } from '../components/shared/Loading';
import type { Quiz } from '../types';
import { getAllQuizzes, deleteQuiz } from '../services/quizService';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    setLoading(true);
    try {
      const data = await getAllQuizzes();
      setQuizzes(data);
    } catch (error) {
      console.error('Error loading quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (quizId: string, quizName: string) => {
    if (window.confirm(`Weet je zeker dat je "${quizName}" wilt verwijderen?`)) {
      try {
        await deleteQuiz(quizId);
        await loadQuizzes();
      } catch (error) {
        console.error('Error deleting quiz:', error);
        alert('Fout bij verwijderen van quiz');
      }
    }
  };

  return (
    <Layout title="Admin Dashboard" maxWidth="xl">
      <div className="mb-6 flex justify-between items-center">
        <Button variant="secondary" onClick={() => navigate('/')}>← Terug</Button>
        <Button variant="blue" onClick={() => navigate('/admin/quiz/new')}>
          + Nieuwe Quiz
        </Button>
      </div>

      {loading ? (
        <Loading text="Quizzen laden..." />
      ) : (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          {quizzes.length === 0 ? (
            <div className="p-8 text-center text-gray-700">
              <p className="mb-4 font-medium">Nog geen quizzen aangemaakt</p>
              <Button variant="blue" onClick={() => navigate('/admin/quiz/new')}>
                + Maak je eerste quiz
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Naam
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Rondes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Vragen per ronde
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Aangemaakt
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Acties
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {quizzes.map((quiz) => (
                    <tr key={quiz.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {quiz.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {quiz.roundCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {quiz.questionsPerRound}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(quiz.createdAt).toLocaleDateString('nl-NL')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                        <button
                          onClick={() => navigate(`/admin/quiz/${quiz.id}`)}
                          className="text-blue-600 hover:text-blue-700 font-semibold px-4 py-2 rounded-xl border-2 border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200"
                        >
                          Bewerken
                        </button>
                        <button
                          onClick={() => handleDelete(quiz.id, quiz.name)}
                          className="text-red-600 hover:text-red-700 font-semibold px-4 py-2 rounded-xl border-2 border-red-600 hover:bg-red-600 hover:text-white transition-all duration-200"
                        >
                          Verwijderen
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

