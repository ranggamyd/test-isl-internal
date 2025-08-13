import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import makeSlice from '../utils/makeSlice';
import Constants from 'expo-constants';
import { getLang, getData } from '../utils/database';
import languages from '../utils/en8li';

const ChangePasswordScreen = ({navigation}) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [currentLang, setCurrentLang] = useState('en-US');

    useEffect(() => {
        const getLanguage = async () => {
            const lang = await getLang();
            setCurrentLang(lang || 'en-US');
        };
        getLanguage();
    }, []);

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            Alert.alert(
                languages[currentLang].error,
                languages[currentLang].passwordMismatch
            );
            return;
        }

        const response = await fetch(`${Constants.expoConfig.env.API_URL}route`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Slice': makeSlice('Profile', 'changePassword'),
                'token' : JSON.parse(await getData('user')).token
            },
            body: JSON.stringify({ old_password: oldPassword, new_password: newPassword, confirm_password: confirmPassword })
        });
        const data = await response.json();
        if (response.status === 200) {
            Alert.alert(
                languages[currentLang].success,
                data.message,
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack()
                    }
                ]
            );
        } else {
            Alert.alert(
                languages[currentLang].error,
                data.message
            );
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back-outline" size={20} color="#4A4A4A" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{languages[currentLang].changePassword}</Text>
                <View style={{ width: 20 }} />
            </View>

            <View style={styles.contentContainer}>
                {/* Input Kata Sandi Lama */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder={languages[currentLang].oldPassword}
                        secureTextEntry={!showOldPassword}
                        value={oldPassword}
                        onChangeText={setOldPassword}
                    />
                    <TouchableOpacity onPress={() => setShowOldPassword(!showOldPassword)}>
                        <Icon name={showOldPassword ? "eye-off" : "eye"} style={styles.icon} />
                    </TouchableOpacity>
                </View>

                {/* Input Kata Sandi Baru */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder={languages[currentLang].newPassword}
                        secureTextEntry={!showNewPassword}
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />
                    <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                        <Icon name={showNewPassword ? "eye-off" : "eye"} style={styles.icon} />
                    </TouchableOpacity>
                </View>

                {/* Input Konfirmasi Kata Sandi */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder={languages[currentLang].confirmPassword}
                        secureTextEntry={!showConfirmPassword}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                        <Icon name={showConfirmPassword ? "eye-off" : "eye"} style={styles.icon} />
                    </TouchableOpacity>
                </View>

                {/* Tombol Ubah Kata Sandi */}
                <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
                    <Text style={styles.buttonText}>
                        {languages[currentLang].changePassword}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
        elevation: 2,
        justifyContent: 'space-between',
    },
    backIcon: {
        fontSize: 18,
        color: '#2b8395'
    },
    headerTitle: {
        fontSize: 18,
        color: '#4A4A4A',

    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#F8F9FA',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#4A4A4A',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 5,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
    },
    input: {
        flex: 1,
        height: 45,
        fontSize: 16,
        color: '#4A4A4A',
    },
    icon: {
        fontSize: 22,
        color: '#2b8395',
        marginLeft: 10,
    },
    button: {
        backgroundColor: '#2b8395',
        borderRadius: 5,
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        paddingVertical: 12,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ChangePasswordScreen;
