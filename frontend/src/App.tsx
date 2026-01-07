import { useState, useEffect } from 'react';
import { PipBoyWithCharacter } from './components/PipBoy/PipBoyWithCharacter';
import { LoginScreen, MainMenu, Encyclopedia } from './components/Terminal';

type AppScreen = 'login' | 'mainMenu' | 'pipboy' | 'encyclopedia';

interface UserData {
  email: string;
  username?: string;
  isGuest: boolean;
  token?: string;
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('login');
  const [userData, setUserData] = useState<UserData | null>(null);

  // Restore session from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('userEmail');
    const username = localStorage.getItem('userName');

    if (token && email) {
      setUserData({
        email,
        username: username || undefined,
        isGuest: email === 'guest@local',
        token,
      });
      setCurrentScreen('mainMenu');
    }
  }, []);

  // Handlers do LoginScreen
  const handleLogin = async (email: string, password: string) => {
    try {
      const apiUrl = window.location.hostname === 'localhost'
        ? 'http://localhost:3000'
        : `http://${window.location.hostname}:3000`;

      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        alert('Login falhou! Verifique email e senha.');
        return;
      }

      const data = await response.json();

      // Save token to localStorage
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('userEmail', data.user.email);
      localStorage.setItem('userName', data.user.username);

      setUserData({
        email: data.user.email,
        username: data.user.username,
        isGuest: false,
        token: data.access_token,
      });
      setCurrentScreen('mainMenu');
    } catch (error) {
      console.error('Erro no login:', error);
      alert('Erro ao conectar com servidor!');
    }
  };

  const handleRegister = async (email: string, password: string, username: string) => {
    try {
      const apiUrl = window.location.hostname === 'localhost'
        ? 'http://localhost:3000'
        : `http://${window.location.hostname}:3000`;

      const response = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username, role: 'PLAYER' }),
      });

      if (!response.ok) {
        alert('Registro falhou! Email pode já estar em uso.');
        return;
      }

      const data = await response.json();

      // Save token to localStorage
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('userEmail', data.user.email);
      localStorage.setItem('userName', data.user.username);

      setUserData({
        email: data.user.email,
        username: data.user.username,
        isGuest: false,
        token: data.access_token,
      });
      setCurrentScreen('mainMenu');
    } catch (error) {
      console.error('Erro no registro:', error);
      alert('Erro ao conectar com servidor!');
    }
  };

  const handleGuestAccess = async () => {
    try {
      const apiUrl = window.location.hostname === 'localhost'
        ? 'http://localhost:3000'
        : `http://${window.location.hostname}:3000`;

      const response = await fetch(`${apiUrl}/auth/guest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        alert('Erro ao acessar como convidado!');
        return;
      }

      const data = await response.json();

      // Save token to localStorage
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('userEmail', 'guest@local');
      localStorage.setItem('userName', 'Guest');

      setUserData({
        email: 'guest@local',
        isGuest: true,
        token: data.access_token,
      });
      setCurrentScreen('mainMenu');
    } catch (error) {
      console.error('Erro no acesso convidado:', error);
      alert('Erro ao conectar com servidor!');
    }
  };

  // Handlers do MainMenu
  const handleNewGame = () => {
    // Futuramente: tela de criação de personagem/partida
    alert('NEW GAME: Em desenvolvimento');
  };

  const handleLoadGame = () => {
    // Futuramente: tela de entrar em partida
    alert('LOAD GAME: Em desenvolvimento');
  };

  const handleSettings = () => {
    // Futuramente: tela de configurações
    alert('SETTINGS: Em desenvolvimento');
  };

  const handleExit = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');

    // Volta para tela de login
    setUserData(null);
    setCurrentScreen('login');
  };

  const handleNavigateToPipboy = () => {
    setCurrentScreen('pipboy');
  };

  const handleNavigateToEncyclopedia = () => {
    setCurrentScreen('encyclopedia');
  };

  const handleBackToMainMenu = () => {
    setCurrentScreen('mainMenu');
  };

  // Renderiza a tela apropriada
  if (currentScreen === 'login') {
    return (
      <LoginScreen
        onLogin={handleLogin}
        onRegister={handleRegister}
        onGuestAccess={handleGuestAccess}
      />
    );
  }

  if (currentScreen === 'mainMenu') {
    return (
      <MainMenu
        onNewGame={handleNewGame}
        onLoadGame={handleLoadGame}
        onSettings={handleSettings}
        onExit={handleExit}
        onNavigateToPipboy={handleNavigateToPipboy}
        onNavigateToEncyclopedia={handleNavigateToEncyclopedia}
        userEmail={userData?.email}
        userName={userData?.username}
        isGuest={userData?.isGuest}
      />
    );
  }

  if (currentScreen === 'encyclopedia') {
    return <Encyclopedia onBack={handleBackToMainMenu} />;
  }

  // Tela do Pip-Boy com seletor de personagem e cheats
  return <PipBoyWithCharacter />;
}

export default App;
