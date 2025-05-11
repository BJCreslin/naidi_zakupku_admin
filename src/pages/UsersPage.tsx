import { useEffect, useState } from 'react';
import {
    Box, Typography, Table, TableHead, TableRow, TableCell, TableBody,
    IconButton, CircularProgress, Dialog, DialogTitle, DialogContent,
    DialogActions, Button, TextField, FormControlLabel, Switch, FormGroup, FormControl, FormLabel, Checkbox
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import axios from '../api/axios';

interface Role {
    id: number;
    name: string;
}

interface User {
    id: number;
    username: string;
    enabled: boolean;
    userRoles: { role: Role }[];
    createdAt: string;
    updatedAt: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [editedUsername, setEditedUsername] = useState('');
    const [editedEnabled, setEditedEnabled] = useState(false);
    const [selectedRoleIds, setSelectedRoleIds] = useState<Set<number>>(new Set());

    useEffect(() => {
        Promise.all([
            axios.get('/users'),
            axios.get('/roles')
        ])
            .then(([userRes, roleRes]) => {
                setUsers(userRes.data);
                setRoles(roleRes.data);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const openEditDialog = (user: User) => {
        setEditingUser(user);
        setEditedUsername(user.username);
        setEditedEnabled(user.enabled);
        setSelectedRoleIds(new Set(user.userRoles.map(ur => ur.role.id)));
    };

    const toggleRole = (roleId: number) => {
        setSelectedRoleIds(prev => {
            const copy = new Set(prev);
            copy.has(roleId) ? copy.delete(roleId) : copy.add(roleId);
            return copy;
        });
    };

    const handleSave = async () => {
        if (!editingUser) return;

        try {
            const updated = {
                id: editingUser.id,
                username: editedUsername,
                enabled: editedEnabled,
                roleIds: Array.from(selectedRoleIds),
            };
            await axios.put(`/users/${editingUser.id}`, updated);
            const updatedUser = { ...editingUser, username: editedUsername, enabled: editedEnabled, userRoles: roles.filter(r => selectedRoleIds.has(r.id)).map(role => ({ role })) };
            setUsers(users.map(u => u.id === editingUser.id ? updatedUser : u));
            setEditingUser(null);
        } catch (err) {
            console.error(err);
            alert('Ошибка при сохранении');
        }
    };

    if (loading) return <CircularProgress />;

    return (
        <Box>
            <Typography variant="h6" mb={2}>Список пользователей</Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Имя пользователя</TableCell>
                        <TableCell>Включен</TableCell>
                        <TableCell>Роли</TableCell>
                        <TableCell>Создан</TableCell>
                        <TableCell>Обновлён</TableCell>
                        <TableCell>Действия</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map(user => (
                        <TableRow key={user.id}>
                            <TableCell>{user.username}</TableCell>
                            <TableCell>{user.enabled ? 'Да' : 'Нет'}</TableCell>
                            <TableCell>{user.userRoles.map(ur => ur.role.name).join(', ')}</TableCell>
                            <TableCell>{new Date(user.createdAt).toLocaleString()}</TableCell>
                            <TableCell>{new Date(user.updatedAt).toLocaleString()}</TableCell>
                            <TableCell>
                                <IconButton size="small" onClick={() => openEditDialog(user)}>
                                    <EditIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={!!editingUser} onClose={() => setEditingUser(null)} maxWidth="sm" fullWidth>
                <DialogTitle>Редактировать пользователя</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Имя пользователя"
                        value={editedUsername}
                        onChange={(e) => setEditedUsername(e.target.value)}
                    />
                    <FormControlLabel
                        control={<Switch checked={editedEnabled} onChange={(e) => setEditedEnabled(e.target.checked)} />}
                        label="Активен"
                    />
                    <FormControl component="fieldset" margin="normal">
                        <FormLabel component="legend">Роли</FormLabel>
                        <FormGroup>
                            {roles.map(role => (
                                <FormControlLabel
                                    key={role.id}
                                    control={<Checkbox checked={selectedRoleIds.has(role.id)} onChange={() => toggleRole(role.id)} />}
                                    label={role.name}
                                />
                            ))}
                        </FormGroup>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditingUser(null)}>Отмена</Button>
                    <Button variant="contained" onClick={handleSave}>Сохранить</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
