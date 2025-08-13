import React, { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { saveData, getData } from '../utils/database';
import { showError } from '../utils/Popup';
import { useNavigation } from '@react-navigation/native';

// Set notification handler
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

const NotificationHandler = () => {
    const notificationListener = useRef();
    const responseListener = useRef();
    const navigation = useNavigation();


    useEffect(() => {
        registerForPushNotificationsAsync().then((token) => {
            if (token) {
                saveData('pushToken', token);
            } else {
                console.warn('Push token is undefined');
            }
        });

        // Listener for in-app notifications
        notificationListener.current = Notifications.addNotificationReceivedListener(async (notification) => {
            // Handle received notification
            
            const newNotification = {
                id: notification.date,
                timestamp: Date.now(),
                title: notification.request.content.title,
                message: notification.request.content.body,
                is_read: false,
            };

            if (newNotification.title === 'Announcement') {
                await saveDataToLocalStorage('announcement', newNotification);
            } 
            
            await saveDataToLocalStorage('notification', newNotification);
        });

        // Listener for notification response
        responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
            const { screen, params } = response?.notification?.request?.content?.data || {};
            if (screen) {
                navigation.navigate(screen, params);
            }
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    return null;
};

const saveDataToLocalStorage = async (key, data) => {
    try {
        let existingData = await getData(key);
        existingData = existingData ? existingData : [];
        existingData.push(data);
        await saveData(key, existingData);
    } catch (error) {
        console.log(`Failed to save data for key ${key}:`, error);
    }
};

async function registerForPushNotificationsAsync() {
    let token = '';

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        try {
            const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
            if (!projectId) {
                throw new Error('Project ID not found in app configuration');
            }

            // Attempt to get notification permissions
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            // Generate and save token regardless of permission status
            token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;

            if (finalStatus !== 'granted') {
                showError(
                    'Notifications Disabled',
                    'Notifications are currently disabled. Please enable them in your device settings to receive alerts.'
                );
            }
        } catch (error) {
            console.log(error.message);
            showError('Notification Error', error.message || 'An unknown error occurred');
        }
    } else {
        showError('Device Required', 'You must use a physical device to receive push notifications.');
    }

    return token;
}

export default NotificationHandler;
