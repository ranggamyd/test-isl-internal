import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { showError, showSuccess } from '../utils/Popup';
import Constants from 'expo-constants';

const RegisterScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);


    const handleRegister = async () => {
        if (!email) {
            showError('Ooops...', 'Email wajib diisi');
            return;
        }

        const emailDomain = email.split('@')[1];
        if (emailDomain !== 'intilab.com') {
            showError('Ooops...', 'Email harus menggunakan domain @intilab.com');
            return;
        }

        setIsRegistering(true);

        try {
            const response = await fetch(`${Constants.expoConfig.env.API_URL}register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({ email }).toString(),
            });

            if (response.status === 200) {
                showSuccess('Registrasi berhasil', 'Silahkan cek email anda untuk link aktivasi');
                setTimeout(() => {
                    navigation.replace('Login');
                }, 3000);
            } else if (response.status === 401) {
                showError('Ooops...', 'Email sudah terdaftar');
            } else {
                showError('Ooops...', 'Terjadi kesalahan, silakan coba lagi');
            }
        } catch (error) {
            showError('Ooops...', 'Terjadi kesalahan, silakan coba lagi');
        } finally {
            setIsRegistering(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TouchableOpacity style={styles.button} onPress={isRegistering ? null : handleRegister} disabled={isRegistering}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
            <Text style={styles.registerText}>Silahkan masukan email perusahaan yang sudah terdaftar dan menunggu link yang akan dikirim oleh System</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    registerText: {
        marginTop: 20,
        textAlign: 'center',
        color: '#007AFF',
    },
});

export default RegisterScreen;
