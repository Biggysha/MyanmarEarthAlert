import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import Navigation from './components/Navigation';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import News from './pages/News';
import Education from './pages/Education';
import AlertRegistration from './pages/AlertRegistration';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <main className="container py-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/news" element={<News />} />
            <Route path="/education" element={<Education />} />
            <Route path="/register" element={<AlertRegistration />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
