import React, { useContext, useEffect, useState } from 'react';
import {
    View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, TextInput, Modal, Alert, RefreshControl
} from 'react-native';

import { AuthContext } from '../context/authContext';
import { taskApiService } from '../api/apiService';

const TaskScreen = ({ goBack }) => {

    const { userToken } = useContext(AuthContext);

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [editId, setEditId] = useState(null);

    // ✅ Cargar tareas
    useEffect(() => {
        if (userToken) {
            fetchTasks();
        }
    }, [userToken]);

    // 🔹 OBTENER TAREAS
    const fetchTasks = async () => {
        try {
            setLoading(true);

            const data = await taskApiService.getAll(userToken);
            setTasks(data?.datos || []);

        } catch (error) {
            console.error("Error al obtener tareas:", error);
        } finally {
            setLoading(false);
        }
    };

    // 🔄 REFRESH
    const onRefresh = async () => {
        setRefreshing(true);
        await fetchTasks();
        setRefreshing(false);
    };

    // 🔹 CREAR / EDITAR
    const handleSave = async () => {
        if (!titulo.trim()) {
            Alert.alert("Error", "El título es obligatorio");
            return;
        }

        try {
            if (editId) {
                await taskApiService.update(userToken, editId, {
                    titulo,
                    descripcion
                });
            } else {
                await taskApiService.create(userToken, {
                    titulo,
                    descripcion
                });
            }

            resetForm();
            fetchTasks();

        } catch (error) {
            console.error(error);
            Alert.alert("Error", "No se pudo guardar la tarea");
        }
    };

    // 🔹 ELIMINAR
    const handleDelete = (id) => {
        Alert.alert("Eliminar", "¿Seguro que quieres eliminar?", [
            { text: "Cancelar" },
            {
                text: "Eliminar",
                onPress: async () => {
                    try {
                        await taskApiService.delete(userToken, id);
                        fetchTasks();
                    } catch (error) {
                        console.error(error);
                    }
                }
            }
        ]);
    };

    // 🔹 EDITAR
    const handleEdit = (task) => {
        setTitulo(task.titulo);
        setDescripcion(task.descripcion);
        setEditId(task.id);
        setModalVisible(true);
    };

    const resetForm = () => {
        setTitulo("");
        setDescripcion("");
        setEditId(null);
        setModalVisible(false);
    };

    // 🔄 LOADING
    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#39A900" />
            </View>
        );
    }

    return (
        <View style={styles.container}>

            {/* 🔥 HEADER CON BOTÓN FUNCIONANDO */}
            <View style={styles.header}>
                <TouchableOpacity onPress={goBack}>
                    <Text style={styles.back}>← Volver</Text>
                </TouchableOpacity>

                <Text style={styles.title}>Mis tareas</Text>
            </View>

            {/* LISTA */}
            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                contentContainerStyle={{ paddingBottom: 100 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                renderItem={({ item }) => (
                    <View style={styles.card}>

                        <Text style={styles.taskTitle}>📌 {item.titulo}</Text>
                        <Text style={styles.taskDesc}>{item.descripcion}</Text>

                        <View style={styles.actions}>

                            <TouchableOpacity onPress={() => handleEdit(item)}>
                                <Text style={styles.edit}>Editar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => handleDelete(item.id)}>
                                <Text style={styles.delete}>Eliminar</Text>
                            </TouchableOpacity>

                        </View>

                    </View>
                )}
                ListEmptyComponent={
                    <View style={styles.center}>
                        <Text>No hay tareas aún</Text>
                    </View>
                }
            />

            {/* BOTÓN FLOTANTE */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.fabText}>＋</Text>
            </TouchableOpacity>

            {/* MODAL */}
            <Modal visible={modalVisible} animationType="slide">

                <View style={styles.modalContainer}>

                    <Text style={styles.modalTitle}>
                        {editId ? "Editar tarea" : "Nueva tarea"}
                    </Text>

                    <TextInput
                        placeholder="Título"
                        placeholderTextColor="#FFFFFF"
                        style={styles.input}
                        value={titulo}
                        onChangeText={setTitulo}
                    />

                    <TextInput
                        placeholder="Descripción"
                        placeholderTextColor="#FFFFFF"
                        style={styles.input}
                        value={descripcion}
                        onChangeText={setDescripcion}
                    />

                    <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                        <Text style={styles.saveText}>Guardar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={resetForm}>
                        <Text style={styles.cancel}>Cancelar</Text>
                    </TouchableOpacity>

                </View>

            </Modal>

        </View>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#000000'
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 50,
        paddingHorizontal: 20,
        marginBottom: 15
    },

    back: {
        color: '#E50914',
        fontWeight: '700',
        fontSize: 19
    },

    title: {
        fontSize: 22,
        fontWeight: '800',
        color: '#FFFFFF'
    },

    // 🎬 TARJETAS TIPO NETFLIX
    card: {
        backgroundColor: '#1C1C1C',
        marginHorizontal: 20,
        marginVertical: 8,
        padding: 18,
        borderRadius: 10,

        borderWidth: 1,
        borderColor: '#333'
    },

    taskTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF'
    },

    taskDesc: {
        color: '#B3B3B3',
        marginTop: 5,
        fontSize: 14
    },

    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 12,
        gap: 20
    },

    // ✏️ EDITAR
    edit: {
        color: '#FFFFFF',
        fontWeight: '600'
    },

    // 🗑️ ELIMINAR
    delete: {
        color: '#E50914',
        fontWeight: '700'
    },

    // 🔴 BOTÓN FLOTANTE
    fab: {
        position: 'absolute',
        bottom: 25,
        right: 25,
        backgroundColor: '#E50914',
        width: 65,
        height: 65,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },

    fabText: {
        color: '#fff',
        fontSize: 30,
        fontWeight: '800'
    },

    // 🎬 MODAL
    modalContainer: {
        flex: 1,
        padding: 25,
        justifyContent: 'center',
        backgroundColor: '#000000'
    },

    modalTitle: {
        fontSize: 22,
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: '800',
        color: '#FFFFFF'
    },

    input: {
        backgroundColor: '#1C1C1C',
        padding: 15,
        marginBottom: 12,
        borderRadius: 8,
        color: '#FFFFFF'
    },

    saveBtn: {
        backgroundColor: '#E50914',

        padding: 15,
        borderRadius: 8,
        marginTop: 10
    },

    saveText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: '700'
    },

    cancel: {
        marginTop: 15,
        textAlign: 'center',
        color: '#ffffff'
    },

    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }

});

export default TaskScreen;