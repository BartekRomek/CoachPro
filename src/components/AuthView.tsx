import React, { useState } from 'react';
import { Activity, Mail, Lock, User as UserIcon, Key } from 'lucide-react';
import { useAuthStore } from '../authStore';
import { useAppStore } from '../store';

export function AuthView() {
  const [viewMode, setViewMode] = useState<'login' | 'register' | 'parent'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  
  const { login, register, loginAsParent } = useAuthStore();
  const { setCoachId, coachesData } = useAppStore();

  const handleParentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!accessCode) {
      setError('Wprowadź kod dostępu');
      return;
    }

    // Check if access code exists in any coach's data
    let found = false;
    for (const coachId in coachesData) {
      const coach = coachesData[coachId];
      if (coach.settings?.enableParentModule) {
        const player = coach.players.find(p => p.accessCode === accessCode);
        if (player) {
          found = true;
          break;
        }
      }
    }

    if (found) {
      loginAsParent(accessCode);
    } else {
      setError('Nieprawidłowy kod dostępu lub moduł rodzica jest wyłączony');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (viewMode === 'login') {
      const success = login(email, password);
      if (success) {
        const user = useAuthStore.getState().currentUser;
        if (user) setCoachId(user.id);
      } else {
        setError('Nieprawidłowy email lub hasło');
      }
    } else if (viewMode === 'register') {
      if (!name || !email || !password) {
        setError('Wypełnij wszystkie pola');
        return;
      }
      register({ email, password, name });
      const user = useAuthStore.getState().currentUser;
      if (user) setCoachId(user.id);
    }
  };

  if (viewMode === 'parent') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4 border border-blue-500/20">
              <UserIcon className="w-8 h-8 text-blue-500" />
            </div>
            <h1 className="text-3xl font-bold text-white">Strefa Rodzica</h1>
            <p className="text-gray-400 mt-2 text-center">
              Wprowadź kod dostępu otrzymany od trenera
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleParentLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Kod dostępu</label>
              <div className="relative">
                <Key className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  value={accessCode}
                  onChange={e => setAccessCode(e.target.value.toUpperCase())}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors uppercase"
                  placeholder="NP. A1B2C3"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-colors mt-6"
            >
              Zaloguj
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => { setViewMode('login'); setError(''); }}
              className="text-sm text-gray-500 hover:text-gray-400 transition-colors"
            >
              Wróć do logowania trenera
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4 border border-emerald-500/20">
            <Activity className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-bold text-white">CoachPro</h1>
          <p className="text-gray-400 mt-2 text-center">
            {viewMode === 'login' ? 'Zaloguj się do swojego konta trenerskiego' : 'Załóż nowe konto trenerskie'}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {viewMode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Imię i nazwisko</label>
              <div className="relative">
                <UserIcon className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="Jan Kowalski"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Adres email</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="trener@klub.pl"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Hasło</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-gray-950 font-bold py-3 rounded-xl transition-colors mt-6"
          >
            {viewMode === 'login' ? 'Zaloguj się' : 'Zarejestruj się'}
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center space-y-3">
          <button 
            onClick={() => { setViewMode(viewMode === 'login' ? 'register' : 'login'); setError(''); }}
            className="text-sm text-emerald-500 hover:text-emerald-400 transition-colors"
          >
            {viewMode === 'login' ? 'Nie masz konta? Zarejestruj się' : 'Masz już konto? Zaloguj się'}
          </button>
          
          <div className="w-full h-px bg-gray-800 my-2"></div>
          
          <button 
            onClick={() => { setViewMode('parent'); setError(''); }}
            className="text-sm text-blue-500 hover:text-blue-400 transition-colors flex items-center gap-2"
          >
            <UserIcon className="w-4 h-4" />
            Zaloguj jako rodzic / zawodnik
          </button>
        </div>
      </div>
    </div>
  );
}
