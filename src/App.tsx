import { Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import Home from './pages/Home';
import Search from './pages/Search';
import Detail from './pages/Detail';
import Watch from './pages/Watch';

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/provider/:provider" element={<div className="text-center py-20 text-gray-500">Provider specific listing coming soon! Check Home for now.</div>} />
        {/* Detail page is part of AppShell to keep nav */}
        <Route path="/detail/:provider/:id" element={<Detail />} />
      </Route>
      
      {/* Watch page takes full screen, no AppShell */}
      <Route path="/watch/:provider/:id/:episodeId" element={<Watch />} />
      
      {/* Fallback 404 */}
      <Route path="*" element={<div className="text-center py-20 text-white">404 - Page Not Found</div>} />
    </Routes>
  );
}

export default App;
