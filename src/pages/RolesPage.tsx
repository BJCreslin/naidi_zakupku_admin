import { useEffect, useState } from 'react';
import {
    Box, Typography, Table, TableHead, TableRow, TableCell, TableBody,
    IconButton, CircularProgress, Dialog, DialogTitle, DialogContent,
    DialogActions, Button, TextField
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete'; // Импортируем иконку для удаления
import axios from '../api/axios';

interface Role {
    id: number;
    name: string;
}

export default function RolesPage() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [newRoleName, setNewRoleName] = useState('');

    useEffect(() => {
        axios.get('/roles')
            .then(res => setRoles(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const openEditDialog = (role: Role) => {
        setEditingRole(role);
        setNewRoleName(role.name);
    };

    const openCreateDialog = () => {
        setEditingRole(null);
        setNewRoleName('');
    };

    const handleSave = async () => {
        try {
            if (editingRole) {
                const updated = { ...editingRole, name: newRoleName };
                await axios.put(`/roles/${editingRole.id}`, updated);
                setRoles(roles.map(r => r.id === updated.id ? updated : r));
            } else {
                const res = await axios.post('/roles', { name: newRoleName });
                setRoles([...roles, res.data]);
            }
            setEditingRole(null);
            setNewRoleName('');
        } catch (err) {
            console.error(err);
            alert('Ошибка при сохранении роли');
        }
    };

    const handleDelete = async (roleId: number) => {
        try {
            await axios.delete(`/roles/${roleId}`);
            setRoles(roles.filter(role => role.id !== roleId)); // Удаляем роль из списка
        } catch (err) {
            console.error(err);
            alert('Ошибка при удалении роли');
        }
    };

    if (loading) return <CircularProgress />;

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Роли</Typography>
                <Button variant="outlined" startIcon={<AddIcon />} onClick={openCreateDialog}>
                    Добавить роль
                </Button>
            </Box>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Название</TableCell>
                        <TableCell>Действия</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {roles.map(role => (
                        <TableRow key={role.id}>
                            <TableCell>{role.id}</TableCell>
                            <TableCell>{role.name}</TableCell>
                            <TableCell>
                                <IconButton onClick={() => openEditDialog(role)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => handleDelete(role.id)} color="error">
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={!!editingRole || newRoleName !== ''} onClose={() => { setEditingRole(null); setNewRoleName(''); }}>
                <DialogTitle>{editingRole ? 'Редактировать роль' : 'Создать роль'}</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Название роли"
                        value={newRoleName}
                        onChange={(e) => setNewRoleName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setEditingRole(null); setNewRoleName(''); }}>Отмена</Button>
                    <Button variant="contained" onClick={handleSave}>Сохранить</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}