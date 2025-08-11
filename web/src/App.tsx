import { Link, Route, Routes } from 'react-router-dom';
import './App.css';
import FlappyBird from './pages/FlappyBird';

function App() {
  return (
    <>
      <nav style={{ marginBottom: 20 }}>
        <Link to=/>Home</Link> | <Link to=/flappy>Flappy Bird</Link>
      </nav>
      <Routes>
        <Route path=/ element={
          <>
            <h1>Vite + React</h1>
            <p>Welcome! Try the Flappy Bird game.</p>
          </>
        } />
        <Route path=/flappy element={<FlappyBird />} />
      </Routes>
    </>
  );
}

export default App;

