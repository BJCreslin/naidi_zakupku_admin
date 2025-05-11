import { Typography, Box, Tabs, Tab, Button } from '@mui/material';
import { useState } from 'react';
import UsersPage from '../pages/UsersPage';
import RolesPage from '../pages/RolesPage';
import { useAuth } from '../auth/AuthContext';

export default function Dashboard() {
    const [tab, setTab] = useState(0);
    const { logout } = useAuth();

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" p={2} bgcolor="#f5f5f5">
                <Typography variant="h6">Admin Panel</Typography>
                <Button onClick={logout}>Выйти</Button>
            </Box>
            <Tabs value={tab} onChange={(_, newTab) => setTab(newTab)}>
                <Tab label="Пользователи" />
                <Tab label="Роли" />
            </Tabs>
            <Box p={2}>
                {tab === 0 && <UsersPage />}
                {tab === 1 && <RolesPage />}
            </Box>
        </Box>
    );
}
