import './App.css';
import ViewUsers from '../src/view/ViewUsers';
import ViewPosts from './view/ViewPosts';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" exact element={<ViewUsers />} />
        <Route path="/viewPosts" exact element={<ViewPosts />} />
      </Routes>

    </div>
  );
}

export default App;
