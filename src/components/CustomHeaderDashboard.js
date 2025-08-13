import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const CustomHeaderDashboard = ({ profilePic, name, role, onNotificationPress, notificationCount }) => {
    return (
        <>
            {/* StatusBar */}
            <StatusBar
                barStyle="light-content" // Gaya teks status bar (light-content untuk teks putih)
                backgroundColor="#2b8395" // Warna latar belakang status bar
            />
            <View style={styles.headerContainer}>
                {/* Kiri: Foto Profil, Nama, Jabatan */}
                <View style={styles.leftSection}>
                    <Image source={{ uri: profilePic }} style={styles.profileImage} />
                    <View style={styles.profileInfo}>
                        <Text style={styles.name}>{name}</Text>
                        <Text style={styles.role}>{role}</Text>
                    </View>
                </View>

                {/* Kanan: Icon Notifikasi dengan Count */}
                <TouchableOpacity onPress={onNotificationPress} style={styles.notificationContainer}>
                    <View style={styles.notificationIcon}>
                        <Icon name="notifications-outline" size={24} color="#2b8395" />
                    </View>
                    {notificationCount > 0 && (
                        <View style={styles.notificationBadge}>
                            <Text style={styles.notificationText}>
                                {notificationCount > 99 ? '99+' : notificationCount}
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImage: {
        width: 55,
        height: 55,
        borderRadius: 30,
        marginRight: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    profileInfo: {
        flexDirection: 'column',
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    role: {
        fontSize: 12,
        color: '#000',
    },
    notificationContainer: {
        position: 'relative',
    },
    notificationIcon: {
        borderWidth: 0.3,
        borderColor: '#e0e0e0',
        backgroundColor: '#f5f5f5',
        borderRadius: 30,
        padding: 5,
    },
    notificationBadge: {
        position: 'absolute',
        right: -2,
        top: -6,
        backgroundColor: 'red',
        borderRadius: 10,
        width: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationText: {
        color: 'white',
        fontSize: 9,
        fontWeight: 'bold',
    },
});

export default CustomHeaderDashboard;
