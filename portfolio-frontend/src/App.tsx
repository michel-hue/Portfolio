import Navbar from './components/Navbar';
import ScrollProgress from './components/ScrollProgress';
import Footer from './components/Footer';
import Home from './pages/Home';

export default function App() {
  return (
    <div className="app">
      <ScrollProgress />
      <Navbar />
      <Home />
      <Footer />
    </div>
  );
}
