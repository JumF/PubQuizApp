import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../components/shared/Layout';
import { Button } from '../components/shared/Button';
import { QuizEditorComponent } from '../components/admin/QuizEditor';

export const QuizEditor: React.FC = () => {
  const navigate = useNavigate();
  const { quizId } = useParams();

  return (
    <Layout 
      title={quizId ? 'Quiz Bewerken' : 'Nieuwe Quiz'} 
      maxWidth="xl"
    >
      <div className="mb-6">
        <Button onClick={() => navigate('/admin')}>← Terug naar Dashboard</Button>
      </div>

      <QuizEditorComponent 
        quizId={quizId} 
        onSave={() => navigate('/admin')}
        onCancel={() => navigate('/admin')}
      />
    </Layout>
  );
};

