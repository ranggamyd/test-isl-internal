import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { saveData, getData } from '../utils/database';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { showError } from '../utils/Popup';
import makeSlice from '../utils/makeSlice';
import Constants from 'expo-constants';

const GetLocationScreen = ({ route, navigation }) => {
    const { photoUri } = route.params;
    const [user_id, setUser_id] = useState(null);
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [locationText, setLocationText] = useState('Waiting for location...');

    const [date, setDate] = useState(new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    const [time, setTime] = useState(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.2,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [pulseAnim]);

    // Request permissions
    useEffect(() => {
        const getUser = async () => {
            const dataUser = await getData('user');
            setUser_id(JSON.parse(dataUser).id);
        }
        getUser();
        (async () => {
            // Request location permission
            let { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
            if (locationStatus !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            // Get current location
            let locationData = await Location.getCurrentPositionAsync({});
            setLocation(locationData);

        })();
    }, []);

    // Update time every second
    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Function to calculate distance
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371e3; // metres
        const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon1 - lon2) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const d = R * c; // in metres
        return d;
    };

    // Error handling for location
    useEffect(() => {
        if (errorMsg) {
            setLocationText(errorMsg);
            navigation.navigate('Attendance', { message: errorMsg, code: 400 });
        } else if (location) {
            const calculatedDistance = calculateDistance(location.coords.latitude, location.coords.longitude, -6.317303568231981, 106.64796384591155);
            let numberDistance = calculatedDistance.toFixed(2);
            if (calculatedDistance <= 50) {
                setLocationText(`Anda berada di sekitar Kantor`);
            } else if (calculatedDistance > 50 && calculatedDistance < 1000) {
                setLocationText(`Jarak ${calculatedDistance.toFixed(2)} meter dari Kantor`);
            } else {
                numberDistance = (calculatedDistance / 1000).toFixed(2);
                setLocationText(`Jarak ${(calculatedDistance / 1000).toFixed(2)} km dari Kantor`);
            }
        }
    }, [errorMsg, location]);

    // Function to send data to server
    const sendDataToServer = async () => {
        const calculatedDistance = calculateDistance(
            location.coords.latitude,
            location.coords.longitude,
            -6.317303568231981,
            106.64796384591155
        );
        let numberDistance = calculatedDistance.toFixed(2);

        if (photoUri && location) {
            // Resize image to 100x100
            const resizedPhoto = await ImageManipulator.manipulateAsync(
                photoUri,
                [{ resize: { width: 100, height: 100 } }],
                { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
            );

            // Membuat objek data
            const data = {
                user_id: user_id,
                tgl: new Date().toISOString().split('T')[0],
                jam: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
                lat: location.coords.latitude,
                long: location.coords.longitude,
                distance: numberDistance,
                selfie: await FileSystem.readAsStringAsync(resizedPhoto.uri, { encoding: 'base64' })
            };

            try {
                const online = await fetch('https://www.google.com', { method: 'HEAD' });
                if (!online.ok) {
                    throw new Error('offline');
                }
                const response = await fetch(`${Constants.expoConfig.env.API_URL}route`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Slice': makeSlice('Attendance', 'add'),
                        'token' : JSON.parse(await getData('user')).token
                    },
                    body: JSON.stringify(data),
                });
                
                if (!response.ok) {
                    if (response.status === 401) {
                        throw new Error('Unauthorized: 401');
                    } else if (response.status === 500) {
                        throw new Error('Internal Server Error: 500');
                    } else {
                        throw new Error('Network response was not ok');
                    }
                }

                const dataResponse = await response.json();
                
                navigation.navigate('Main');
            } catch (error) {
                if (error.message === 'offline') {
                    saveData('absenOffline', JSON.stringify(data));
                    navigation.navigate('Attendance', { message: 'Anda sedang offline. Data akan dikirim saat Anda kembali online.', code: 400 });
                } else if (error.message === 'Unauthorized: 401') {
                    showError('Tidak diizinkan. Silakan periksa kredensial Anda.');
                } else if (error.message === 'Internal Server Error: 500') {
                    showError('Terjadi kesalahan pada server. Silakan coba lagi nanti.');
                } else {
                    showError('Terjadi kesalahan. Silakan coba lagi.');
                }
            }
        } else {
            showError('Foto atau lokasi tidak tersedia');
        }
    };

    useEffect(() => {
        if (location && locationText != 'Waiting for location...') {
            const interval = setInterval(() => {
                sendDataToServer();
            }, 5000);
            return () => clearInterval(interval);
        }

    }, [location, locationText]);

    return (
        <View style={styles.container}>

            <Text style={styles.locationText}>{locationText}</Text>

            {/* Map View */}
            {location ? (
                <>
                    <MapView
                        style={styles.map}
                        provider={PROVIDER_GOOGLE}
                        apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
                        initialRegion={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                            latitudeDelta: 0.005,
                            longitudeDelta: 0.005,
                        }}
                    >
                        <Marker
                            coordinate={{
                                latitude: location.coords.latitude,
                                longitude: location.coords.longitude,
                            }}
                        >
                            {photoUri && (
                                <View style={{ alignItems: 'center' }}>
                                    <Image
                                        source={{ uri: photoUri }}
                                        style={{ width: 50, height: 50, borderRadius: 25 }}
                                    />
                                    <View style={{
                                        width: 0,
                                        height: 0,
                                        borderLeftWidth: 10,
                                        borderRightWidth: 10,
                                        borderBottomWidth: 20,
                                        borderLeftColor: 'transparent',
                                        borderRightColor: 'transparent',
                                        borderBottomColor: 'red',
                                        marginTop: -5,
                                    }} />
                                </View>
                            )}
                        </Marker>
                    </MapView>
                    <Text style={styles.title}>{date}</Text>
                    <Text style={styles.timeText}>{time}</Text>
                </>
            ) : (
                <></>
            )}

            {/* Button to send data to server */}
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <TouchableOpacity style={styles.sendButton}>
                    <View style={styles.outerCircle}>
                        <View style={styles.middleCircle}>
                            <View style={styles.innerCircle}>
                                <Text style={styles.sendButtonText}>Sedang Mengirim Data ke Server</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        top: 15,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    locationText: {
        top: 10,
        fontSize: 16,
    },
    timeText: {
        fontSize: 50,
        marginBottom: 10,
    },
    photo: {
        width: '100%',
        height: '100%',
        borderRadius: 150, // Image within circle
    },
    button: {
        position: 'absolute',
        bottom: 10,
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    absenButton: {
        position: 'absolute',
        bottom: 50,
        backgroundColor: '#28a745',
        padding: 15,
        borderRadius: 10,
    },
    absenButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    map: {
        width: 350,
        height: 350,
        marginTop: 20,
    },
    sendButton: {
        top: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    outerCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#FFD580', // Orange muda
        justifyContent: 'center',
        alignItems: 'center',
    },
    middleCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#FFA500', // Orange
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FF8C00', // Orange tua
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonText: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
    },
});

export default GetLocationScreen;
