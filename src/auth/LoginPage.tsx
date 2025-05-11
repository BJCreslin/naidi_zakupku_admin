import { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { useAuth } from './AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            const res = await axios.post('https://naidizakupku.ru/api/admin/v1/auth/login-by-code', {
                code,
            });
            login(res.data.accessToken);
            navigate('/');
        } catch (e) {
            setError('Неверный код или истёк срок действия');
        }
    };

    return (
        <Container maxWidth="sm">
            <Box mt={10} display="flex" flexDirection="column" alignItems="center">
                <Typography variant="h5">Вход через Telegram-код</Typography>
                <TextField
                    fullWidth
                    label="Код из Telegram (/code)"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    margin="normal"
                />
                {error && <Typography color="error">{error}</Typography>}
                <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
                    Войти
                </Button>
            </Box>
        </Container>
    );
}