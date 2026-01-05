import { useState } from 'react';
import { PipBoy } from './components/PipBoy/PipBoy';
import { LoginScreen, MainMenu } from './components/Terminal';

type AppScreen = 'login' | 'mainMenu' | 'pipboy';

interface UserData {
  email: string;
  username?: string;
  isGuest: boolean;
  token?: string;
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('login');
  const [userData, setUserData] = useState<UserData | null>(null);

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
    // Volta para tela de login
    setUserData(null);
    setCurrentScreen('login');
  };

  const handleNavigateToPipboy = () => {
    setCurrentScreen('pipboy');
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
        userEmail={userData?.email}
        userName={userData?.username}
        isGuest={userData?.isGuest}
      />
    );
  }

  // Futuramente: tela do Pip-Boy
  return <PipBoy />;
}

export default App;
