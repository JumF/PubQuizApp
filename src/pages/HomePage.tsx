import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/shared/Layout';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout title="AI PubQuiz" maxWidth="lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Admin Card */}
        <div
          className="group relative cursor-pointer"
          onClick={() => navigate('/admin')}
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-orange-500 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
          <div className="relative bg-slate-800 rounded-2xl p-6 sm:p-8 border border-slate-700 hover:border-blue-500/50 transition-all duration-200">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Admin Panel</h3>
            <p className="text-slate-400 text-sm">Beheer quizzen en vragen</p>
            <div className="mt-4 flex items-center text-blue-500 group-hover:gap-2 transition-all">
              <span className="text-sm font-semibold">Ga verder</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Quizmaster Card */}
        <div
          className="group relative cursor-pointer"
          onClick={() => navigate('/admin/session/new')}
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-orange-500 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
          <div className="relative bg-slate-800 rounded-2xl p-6 sm:p-8 border border-slate-700 hover:border-orange-500/50 transition-all duration-200">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Quizmaster</h3>
            <p className="text-slate-400 text-sm">Start nieuwe quiz sessie</p>
            <div className="mt-4 flex items-center text-orange-500 group-hover:gap-2 transition-all">
              <span className="text-sm font-semibold">Ga verder</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Player Card */}
        <div
          className="group relative cursor-pointer sm:col-span-2 lg:col-span-1"
          onClick={() => navigate('/play')}
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-orange-500 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
          <div className="relative bg-slate-800 rounded-2xl p-6 sm:p-8 border border-slate-700 hover:border-blue-500/50 transition-all duration-200">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-orange-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Speler</h3>
            <p className="text-slate-400 text-sm">Join een quiz met code</p>
            <div className="mt-4 flex items-center text-blue-400 group-hover:gap-2 transition-all">
              <span className="text-sm font-semibold">Ga verder</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

