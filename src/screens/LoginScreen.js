import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { AuthContext } from '../context/authContext';
import { loginService } from '../api/apiService';

const loginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);

    const handlelogin = async () => {
        if (!email || !password) {
            return Alert.alert('Error', 'Por favor ingresa tu correo y contraseña');
        }

        setLoading(true);

        try {
            const data = await loginService(email, password);

            // ⚠️ Ajusta según tu backend
            login(data.idToken);

        } catch (e) {
            Alert.alert('❌ Error de login', e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>ADSO gestor de tareas</Text>

            <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                placeholderTextColor="#FFFFFF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="#FFFFFF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            {loading ? (
                <ActivityIndicator size="large" color="#ff0000" />
            ) : (
                <Button title="Iniciar Sesión" onPress={handlelogin} color="#ff0303" />
            )}
        </View>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#000000',
        justifyContent: 'center',
        paddingHorizontal: 25
    },

    title: {
        fontSize: 34,
        fontWeight: '900',
        color: '#E50914',
        textAlign: 'center',
        marginBottom: 40
    },

    input: {
        backgroundColor: '#1C1C1C',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        color: '#FFFFFF'
    },

    button: {
        backgroundColor: '#E50914',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10
    },

    buttonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 16
    },

    loading: {
        marginTop: 20
    }

});

export default loginScreen;