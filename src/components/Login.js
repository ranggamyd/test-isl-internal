import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { getData, saveData } from '../utils/database';
import { showError } from '../utils/Popup';
import Icon from 'react-native-vector-icons/FontAwesome';
import Constants from 'expo-constants';
import languages from '../utils/en8li';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const unique12Digit = String(Date.now()).slice(-8) + Math.random().toString().slice(2, 14).padEnd(4, '0');
    const [currentLang, setCurrentLang] = useState('en-US');

    useEffect(() => {
        const getLanguage = async () => {
            const lang = await getData('language');
            setCurrentLang(lang || 'en-US');
        }
        getLanguage();
    }, []);

    const handleLogin = async () => {
        if (!email) {
            showError('Ooops...', languages[currentLang].emailEmpty);
            return;
        }
        if (!password) {
            showError('Ooops...', languages[currentLang].passwordEmpty);
            return;
        }

        const emailDomain = email.split('@')[1];
        if (emailDomain !== 'intilab.com') {
            showError('Ooops...', languages[currentLang].emailDomain);
            return;
        }

        try {
            const deviceid = unique12Digit;
            const pushToken = await getData('pushToken') || 'undefined';

            const response = await fetch(`${Constants.expoConfig.env.API_URL}gettoken`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({ email, password, deviceid, token: pushToken }).toString(),
            });

            if (response.status === 200) {
                const data = await response.json();
                await saveData('user', JSON.stringify(data));
                await saveData('deviceId', deviceid);

                navigation.replace('Main');
            } else if (response.status === 401) {
                const data = await response.json();
                showError('Ooops...', data.message || languages[currentLang].emailPasswordWrong);
            } else if (response.status === 500) {
                showError('Ooops...', languages[currentLang].serverErrorMessage);
            } else {
                const data = await response.json();
                showError('Ooops...', data.message || languages[currentLang].generalErrorMessage);
            }
        } catch (error) {
            showError('Ooops...', `${error.message}`);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#2b8395" />
            <Text style={styles.title}>{languages[currentLang].login}</Text>
            <TextInput
                style={styles.input}
                placeholder={languages[currentLang].email}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder={languages[currentLang].password}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                />
                <TouchableOpacity style={styles.eyeIconContainer} onPress={() => setShowPassword(!showPassword)}>
                    <View>
                        <Icon
                            name={showPassword ? 'eye' : 'eye-slash'}
                            size={24}
                            color="gray"
                        />
                    </View>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>{languages[currentLang].login}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerText}>{languages[currentLang].register}</Text>
            </TouchableOpacity>
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
        borderRadius: 5,
    },
    passwordContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    passwordInput: {
        flex: 1,
        height: 40,
    },
    button: {
        backgroundColor: '#2b8395',
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
        color: '#2b8395',
    },
    eyeIconContainer: {
        padding: 0,
    },
    eyeIcon: {
        width: 20,
        height: 20,
    },
});

export default LoginScreen;
