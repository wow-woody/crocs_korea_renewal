import './App.css';
import { Route, Routes } from 'react-router-dom';
import Main from './pages/Main';
import New from './pages/New';
import Women from './pages/Women';
import Men from './pages/Men';
import Kids from './pages/Kids';
import Jibbitz from './pages/Jibbitz';
import Collabs from './pages/Collabs';
import Brand from './pages/Brand';
import Promotion from './pages/Promotion';
import Login from './pages/Login';
import Join from './pages/Join';
import Cart from './pages/Cart';
import Header from './components/Header';
import CrocsClubPopup from './components/CrocsClubPopup';

function App() {
    return (
        <div className="App">
            <Header />
            <Routes>
                <Route index element={<Main />} />
                <Route path="/new" element={<New />} />
                <Route path="/women" element={<Women />} />
                <Route path="/men" element={<Men />} />
                <Route path="/kids" element={<Kids />} />
                <Route path="/jibbitz" element={<Jibbitz />} />
                <Route path="/collabs" element={<Collabs />} />
                <Route path="/promotion" element={<Promotion />} />
                <Route path="/Brand" element={<Brand />} />
                <Route path="/login" element={<Login />} />
                <Route path="/join" element={<Join />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/crocsclub" element={<CrocsClubPopup />} />
            </Routes>
        </div>
    );
}

export default App;
