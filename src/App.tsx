import { Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './auth/LoginPage';
import Dashboard from './components/Dashboard';
import { useAuth } from './auth/AuthContext.tsx';

export default function App() {
    const { token } = useAuth();

    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
                path="/*"
                element={token ? <Dashboard /> : <Navigate to="/login" replace />}
            />
        </Routes>
    );
}
