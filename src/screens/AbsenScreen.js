import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
// import * as MediaLibrary from 'expo-media-library';

const AbsenScreen = ({navigation}) => {
    const [hasCameraPermission, requestCameraPermission] = useCameraPermissions();
    // const [hasMediaPermission, setHasMediaPermission] = useState(null);
    const [photo, setPhoto] = useState(null);
    const cameraRef = useRef(null);

    // Request permissions
    useEffect(() => {
        (async () => {
            requestCameraPermission();
        })();
    }, []);

    const takeSelfie = async () => {
        if (cameraRef.current) {
            const options = { quality: 0.5, base64: true, width: 150, height: 150, skipProcessing: true };
            let newPhoto = await cameraRef.current.takePictureAsync(options);
            setPhoto(newPhoto.uri);

            navigation.navigate('GetLocation', { photoUri: newPhoto.uri });
        }
    };

    return (
        <View style={styles.container}>

            {/* Camera preview */}
            {hasCameraPermission ? (
                <>
                    <View style={styles.cameraContainer}>
                        <CameraView style={styles.camera} facing={'front'} ref={cameraRef}>
                            <View style={styles.cameraFrame}>
                                {photo && (
                                    <Image source={{ uri: photo }} style={styles.photo} />
                                )}
                            </View>
                        </CameraView>
                    </View>
                    <Text style={styles.title}>Perhatian.!</Text>
                    <Text style={styles.textMedium}>Pastikan wajah Anda terlihat jelas, pencahayaan cukup, dan lepas masker.</Text>
                    <TouchableOpacity style={styles.absenButton} onPress={takeSelfie}>
                        <Text style={styles.absenButtonText}>Absen Sekarang</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <Text>Tidak ada akses kamera</Text>
            )}
            
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
        top: 70,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    textMedium: {
        top: 50,
        width: 300,
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center',
    },
    cameraContainer: {
        top: 70,
        width: 300,
        height: 300,
        borderRadius: 150,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        aspectRatio: 1,
    },
    camera: {
        width: '100%',
        height: '100%',
    },
    cameraFrame: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 150,
        borderWidth: 4,
        borderColor: '#fff', // White circle frame
        justifyContent: 'center',
        alignItems: 'center',
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
        backgroundColor: '#2b8395',
        padding: 15,
        borderRadius: 10,
    },
    absenButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    map: {
        width: 250,
        height: 250,
        marginTop: 20,
    },
});

export default AbsenScreen;
