import React, { useContext, useEffect, useState } from 'react';
import {
    View, Text, TouchableOpacity, ActivityIndicator, Image, Alert, StyleSheet
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';

import { AuthContext } from '../context/authContext';
import { userService } from '../api/apiService';

const Dashboard = ({ goToTasks }) => {

    const { userToken, Logout } = useContext(AuthContext);

    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    // 🔹 Cargar perfil
    useEffect(() => {
        if (userToken) {
            fetchProfile();
        }
    }, [userToken]);

    const fetchProfile = async () => {
        try {
            const data = await userService.getProfile(userToken);
            setUserData(data);
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "No se pudo cargar el perfil");
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Seleccionar imagen
    const pickImage = async () => {
        try {
            console.log("📸 Abriendo galería...");

            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permission.granted) {
                Alert.alert("Permiso requerido", "Debes aceptar permisos");
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                quality: 0.7,
            });

            console.log("RESULTADO:", result);

            if (!result.canceled) {
                uploadImage(result.assets[0].uri);
            }

        } catch (error) {
            console.error("Error picker:", error);
            Alert.alert("Error", "No se pudo abrir la galería");
        }
    };

    // 🔹 Subir imagen
    const uploadImage = async (uri) => {
        try {
            setUploading(true);

            await userService.uploadProfileImage(userToken, uri);

            Alert.alert("Imagen actualizada");

            fetchProfile();

        } catch (error) {
            console.error(error);
            Alert.alert("Error al subir imagen");
        } finally {
            setUploading(false);
        }
    };

    // 🔹 Loading inicial
    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#39A900" />
                <Text>Cargando perfil...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>

            {/* HEADER */}
            <View style={styles.header}>
                <Text style={styles.title}>Dashboard</Text>

                <TouchableOpacity onPress={Logout}>
                    <Text style={styles.logout}>Cerrar sesión</Text>
                </TouchableOpacity>
            </View>

            {/* PERFIL */}
            <View style={styles.profile}>

                <TouchableOpacity onPress={pickImage}>

                    {uploading ? (
                        <ActivityIndicator size="small" color="#39A900" />
                    ) : userData?.foto_url ? (
                        <Image
                            source={{ uri: userData.foto_url }}
                            style={styles.avatar}
                        />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Text>Sin foto</Text>
                        </View>
                    )}

                </TouchableOpacity>

                <Text style={styles.email}>
                    {userData?.email || "Sin correo"}
                </Text>

                <Text style={styles.role}>
                    {userData?.rol || "Usuario"}
                </Text>

            </View>

            {/* ACCIONES */}
            <View style={styles.actions}>

                <TouchableOpacity style={styles.button} onPress={goToTasks}>
                    <Text style={styles.buttonText}>Ver tareas</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonSecondary} onPress={pickImage}>
                    <Text style={styles.buttonText}>Cambiar foto</Text>
                </TouchableOpacity>

            </View>

        </View>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#0F172A',
        paddingHorizontal: 20,
        paddingTop: 50
    },

    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30
    },

    title: {
        fontSize: 26,
        fontWeight: '700',
        color: '#F1F5F9'
    },

    logout: {
        color: '#F87171',
        fontWeight: '600'
    },

    profile: {
        alignItems: 'center',
        backgroundColor: '#1E293B',
        padding: 25,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#334155'
    },

    avatar: {
        width: 130,
        height: 130,
        borderRadius: 65,
        marginBottom: 10,
        borderWidth: 3,
        borderColor: '#22C55E'
    },

    avatarPlaceholder: {
        width: 130,
        height: 130,
        borderRadius: 65,
        backgroundColor: '#334155',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },

    email: {
        fontSize: 16,
        fontWeight: '600',
        color: '#E2E8F0'
    },

    role: {
        color: '#94A3B8',
        marginTop: 5,
        fontSize: 14
    },

    actions: {
        marginTop: 40,
        gap: 15
    },

    button: {
        backgroundColor: '#f90000',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#22C55E',
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6
    },

    buttonSecondary: {
        backgroundColor: '#334155',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center'
    },

    buttonText: {
        color: '#F8FAFC',
        fontWeight: '600',
        fontSize: 15
    }

});

export default Dashboard;