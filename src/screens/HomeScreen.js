import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthContext } from '../context/authContext';

const HomeScreen = ({ goToDashboard, goToTasks }) => {

    const { logout } = useContext(AuthContext);

    return (
        <View style={styles.container}>

           <Text style={styles.title}>Bienvenido a tu app de tareas🚀</Text>

            <TouchableOpacity style={styles.card} onPress={goToDashboard}>
                <Text style={styles.icon}>👤</Text>
                <Text>Ver Perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card} onPress={goToTasks}>
                <Text style={styles.icon}>📋</Text>
                <Text>Ver Tareas</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logout} onPress={logout}>
                <Text style={{ color: '#fff' }}>Cerrar sesión</Text>
            </TouchableOpacity>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f2f5',
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 22,
        marginBottom: 20
    },
    card: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        marginBottom: 10,
        width: '70%',
        alignItems: 'center'
    },
    icon: {
        fontSize: 22,
        marginBottom: 5
    },
    logout: {
        marginTop: 20,
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 8
    }
});

export default HomeScreen;