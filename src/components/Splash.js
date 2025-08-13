import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { getData } from '../utils/database';

const Splash = ({ navigation }) => {
    useEffect(() => {
        const checkUser = async () => {
            try {
                const dataUser = await getData('user');
                if (dataUser) {
                    navigation.replace('Main');
                } else {
                    navigation.replace('Login');
                }
            } catch (e) {
                console.warn(e);
                navigation.replace('Login');
            }
        };

        checkUser();
    }, []);

    return (
        <View style={styles.container}>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
});

export default Splash;
