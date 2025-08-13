import { Alert } from 'react-native';
import { getData, deleteData } from './database';
import Constants from 'expo-constants';

export const checkLoginStatus = async (navigation) => {
    
    try {
        const dataUser = await getData('user');
        const deviceId = await getData('deviceId');

        if (dataUser && deviceId) {
            const user = JSON.parse(dataUser);
            
            try {
                const response = await fetch(`${Constants.expoConfig.env.API_URL}cektoken`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'token': user.token
                    }
                });

                if (response.status === 401 || response.status === 500) {
                    Alert.alert('Ooops...', 'Akun kamu telah login di perangkat lain', [
                        {
                            text: 'OK',
                            onPress: async () => {
                                await deleteData('user');
                                await deleteData('deviceId');
                                navigation.navigate('Login');
                            }
                        }
                    ]);
                }
            } catch (error) {
                console.error('Error checking login status:', error);
            }
        }
    } catch (error) {
        console.error('Error memeriksa status login:', error);
    }
};