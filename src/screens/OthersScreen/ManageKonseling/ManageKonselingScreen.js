import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import FormApproveKonseling from './FormApproveKonseling';
import RoomKonseling from './RoomKonseling';
import Constants from 'expo-constants';
import { getData } from '../../../utils/database';
import makeSlice from '../../../utils/makeSlice';
import { showError, showSuccess , showInfo} from '../../../utils/Popup';
import languages from '../../../utils/en8li';

const ManageKonselingScreen = () => {
    const [user, setUser] = useState(null);
    const [konseling, setKonseling] = useState([]);
    const [roomKonseling, setRoomKonseling] = useState([]);
    const [currentLang, setCurrentLang] = useState('en-US');
    const navigation = useNavigation();
    // Open Modal
    const [isModalApprove, setModalApprove] = useState(false);
    const [modalIndex, setModalIndex] = useState(null);
    const [roomKonselingIndex, setRoomKonselingIndex] = useState(null);
    const [isRoomKonselingVisible, setRoomKonselingVisible] = useState(false);

    const openModalApprove = (index) => {
        setModalIndex(index);
        setModalApprove(true);
    }
    const closeModalApprove = (index) => {
        setModalIndex(index);
        setModalApprove(false);
    }

    const fetchDataKonseling = async () => {
        try {
            const user = JSON.parse(await getData('user'));
            setUser(user);
            const response = await fetch(`${Constants.expoConfig.env.API_URL}route`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Slice': makeSlice('Konsultasi', 'getKonseling'),
                    'token' : user.token
                },
                body: JSON.stringify({
                    user_id: user.id
                })
            });
            
            const data = await response.json();
            setKonseling(data.data);
        } catch (error) {
            console.log(error);
        }
    }

    const fetchDataRoomKonseling = async (room_id) => {        
        try {
            const response = await fetch(`${Constants.expoConfig.env.API_URL}route`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Slice': makeSlice('Konsultasi', 'getConsuleRoom'),
                    'token' : user.token
                },
                body: JSON.stringify({
                    id: room_id
                })
            });
            const data = await response.json();
            setRoomKonseling(data.data);
            if(response.status !== 201 && response.status !== 200){
                showError(data.message);
            }
        } catch (error) {
            console.log(error);
            showError(error.message);
        }
    }

    const showRoomKonseling = (room_id) => {
        setRoomKonselingIndex(room_id);
        fetchDataRoomKonseling(room_id);
        setRoomKonselingVisible(true);
    }

    const closeRoomKonseling = (room_id) => {
        setRoomKonselingIndex(room_id);
        setRoomKonselingVisible(false);
    }

    const refreshDataKonseling = () => {
        setKonseling([]);
        fetchDataKonseling();
    }

    useEffect(() => {
        fetchDataKonseling();
    }, []);

    // console.log(konseling);

    return (
        <>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Icon name="arrow-back-outline" size={24} color="#2b8395" onPress={() => navigation.goBack()} />
                    <Text style={styles.titleText}>{languages[currentLang].manage_konseling}</Text>
                    <Icon name="refresh-outline" size={24} color="#2b8395" onPress={refreshDataKonseling} />
                </View>
            </View>
            <ScrollView style={styles.konselingContainer}>
                {konseling.length > 0 ? (
                    
                    konseling.map((item, index) => (
                        <View>
                            <TouchableOpacity key={index} data={item} onPress={() => item.status == 0 ? openModalApprove(index) : item.status == 1 ? showRoomKonseling(item.id) : showDataKonseling(item)} style={styles.card}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.konselingItemName}>{item.identitas !== null && item.identitas !== 'nama' && item.user_id !== user.id ? `Anonim${Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000}` : item.user.nama_lengkap}</Text>
                                    <Text style={item.status == 0 ? styles.draft : item.status == 1 ? styles.approved : styles.rejected}>{item.status == 0 ? languages[currentLang].draft : item.status == 1 ? languages[currentLang].approved : languages[currentLang].rejected}</Text>
                                </View>
                                <View style={styles.cardDetails}>
                                    <View style={styles.cardDetailsItem}><Icon name="calendar-outline" size={20} color="#5e5e5c" /><Text style={styles.cardDetailsText}>{item.tanggal}</Text></View>
                                    <View style={styles.cardDetailsItem}><Icon name="time-outline" size={20} color="#5e5e5c" /><Text style={styles.cardDetailsText}>{item.waktu}</Text></View>
                                    <View style={styles.cardDetailsItem}>
                                    <Text style={[styles.konselingTypeText, { textTransform: 'uppercase',marginTop: 8 }]}>{item.type}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noDataText}>Tidak ada data</Text>
                )}
            </ScrollView>   
            <Modal onBackdropPress={() => closeModalApprove(modalIndex)} backdropOpacity={0.5} animationIn="slideInUp" animationOut="slideOutDown" isVisible={isModalApprove} onRequestClose={() => closeModalApprove(modalIndex)}>
                <FormApproveKonseling item={konseling[modalIndex]} closeModal={() => closeModalApprove(modalIndex)} user={user} />
            </Modal>
            {/* Modal */}
            <Modal onBackdropPress={() => closeRoomKonseling(roomKonselingIndex)} backdropOpacity={0.5} animationIn="slideInUp" animationOut="slideOutDown" isVisible={isRoomKonselingVisible} onRequestClose={() => closeRoomKonseling(roomKonselingIndex)} style={styles.modalContainer}>
                <RoomKonseling item={roomKonseling} closeModal={() => closeRoomKonseling(roomKonselingIndex)} user={user} />
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
        flexDirection: 'column',
    },
    headerContainer: {
        height: 50,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    addIconContainer: { 
        position: 'relative',
        borderWidth: 1,
        borderColor: '#2b8395',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    addIcon: {
        fontSize: 20,
        color: '#2b8395'
    },
    modalContainer: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    card: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    konselingItemName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    konselingContainer: {
        marginTop: 50,
        padding: 16,
        marginBottom: 15,
    },
    cardDetailsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    cardDetailsText: {
        fontSize: 14,
    },
    konselingTypeText: {
        fontSize: 14,
        color: '#2b8395',
        fontWeight: 'bold',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        paddingBottom : 8,
    },
    cardDetails: {
        marginTop: 8,
    },
    draft: {
        backgroundColor: '#FDF4D9',
        color: '#FFC107',
        padding : 5,
        borderRadius: 5,
    },
    approved: {
        backgroundColor: '#D9F8D9',
        color: '#4CAF50',
        padding : 5,
        borderRadius: 5,
    },
    rejected: {
        backgroundColor: '#FFD6D6',
        color: '#F44336',
        padding : 5,
        borderRadius: 5,
    },
    konselingText: {
        fontSize: 16,
        flexDirection: 'row',
        alignItems : 'center',
    },
    noDataText: {
        fontSize: 16,
        textAlign: 'center',
    }
});

export default ManageKonselingScreen;