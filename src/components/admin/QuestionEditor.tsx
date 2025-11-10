import React, { useState } from 'react';
import type { Question } from '../../types';
import { Button } from '../shared/Button';

interface QuestionEditorProps {
  question: Question;
  index: number;
  onUpdate: (data: Partial<Question>) => void;
  onDelete: () => void;
}

export const QuestionEditor: React.FC<QuestionEditorProps> = ({
  question,
  index,
  onUpdate,
  onDelete,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [text, setText] = useState(question.text);
  const [answers, setAnswers] = useState(question.answers);
  const [correctIndex, setCorrectIndex] = useState(question.correctIndex);

  const handleSave = () => {
    onUpdate({
      text,
      answers,
      correctIndex,
    });
    setIsExpanded(false);
  };

  const handleAnswerChange = (idx: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[idx] = value;
    setAnswers(newAnswers);
  };

  return (
    <div className="border-2 border-gray-200 rounded-xl overflow-hidden bg-white">
      {/* Header */}
      <div
        className="bg-gray-50 px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors duration-200"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-500">#{index + 1}</span>
          <span className="font-semibold text-gray-900">{question.text}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {isExpanded ? '▲' : '▼'}
          </span>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-6 space-y-6">
          {/* Question Text */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Vraag
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-900 transition-all duration-200"
              rows={3}
            />
          </div>

          {/* Answers */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Antwoorden
            </label>
            <div className="space-y-3">
              {answers.map((answer, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name={`correct-${question.id}`}
                    checked={correctIndex === idx}
                    onChange={() => setCorrectIndex(idx)}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => handleAnswerChange(idx, e.target.value)}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-900 transition-all duration-200"
                    placeholder={`Antwoord ${idx + 1}`}
                  />
                  {correctIndex === idx && (
                    <span className="text-sm font-semibold text-blue-600 w-24">
                      ✓ Correct
                    </span>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Selecteer het juiste antwoord met het rondje
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button variant="blue" onClick={handleSave} size="sm">
              Opslaan
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsExpanded(false)}
            >
              Annuleren
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={onDelete}
              className="ml-auto"
            >
              Verwijderen
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

