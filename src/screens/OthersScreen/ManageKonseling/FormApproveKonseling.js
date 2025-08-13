import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Constants from 'expo-constants';
import makeSlice from '../../../utils/makeSlice';
import { showConfirm, showSuccess, showError } from '../../../utils/Popup';
import languages from '../../../utils/en8li';
const FormApproveKonseling = ({item, closeModal, user}) => {
    const [currentLang, setCurrentLang] = useState('en-US');
    const [status, setStatus] = useState(item.status);

    const confirmApprove = () => {
        showConfirm('Info', languages[currentLang].approveConfirmConsulting, () => handleSubmitApprove(1));
    }

    const confirmReject = () => {
        showConfirm('Info', languages[currentLang].rejectConfirmConsulting, () => handleSubmitApprove(2));
    }

    const handleSubmitApprove = async (data_status) => {
        setStatus(data_status);
        try {
            const response = await fetch(`${Constants.expoConfig.env.API_URL}route`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Slice': makeSlice('Konsultasi', 'approveKonsultasi'),
                    'token' : user.token
                },
                body: JSON.stringify({
                    id: item.id,
                    status: status,
                    user_id: user.id,
                }),
            });
            const data = await response.json();
            if (response.status === 200) {
                showSuccess(languages[currentLang].success, data.message);
            } else {
                showError(languages[currentLang].error, data.message);
            }
        } catch (error) {
            console.error(error);
            if (error.message === 'Network request failed') {
                showError(languages[currentLang].error, languages[currentLang].networkConnectionError);
            } else {
                showError(languages[currentLang].error, error.message);
            }
        }
    }

    return (
        <View style={styles.modalDetailContainer}>
            <View>
                <View style={styles.cardHeader}>
                    <Text style={styles.konselingItemName}>{item.identitas !== null && item.identitas !== 'nama' && item.user_id !== user.id ? `Anonim${Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000}` : item.user.nama_lengkap}</Text>
                    <Text style={item.status == 0 ? styles.draft : item.status == 1 ? styles.approved : styles.rejected}>{item.status == 0 ? languages[currentLang].draft : item.status == 1 ? languages[currentLang].approved : languages[currentLang].rejected}</Text>
                </View>
                <View style={styles.cardDetails}>
                    <View style={{flexDirection: 'row', gap: 10,justifyContent: 'space-between'}}>
                        <View style={styles.cardDetailsItem}><Icon name="calendar" size={20} color="#5e5e5c" /><Text style={styles.cardDetailsText}>{item.tanggal}</Text></View>
                        <View style={styles.cardDetailsItem}><Icon name="time" size={20} color="#5e5e5c" /><Text style={styles.cardDetailsText}>{item.waktu}</Text></View>
                    </View>
                    <View style={styles.konselingTypeContainer}>
                        <Text style={[styles.konselingTypeText, { textTransform: 'uppercase' }]}>{item.type}</Text>
                        <View style={styles.konselingIdentitasContainer}>
                            <Icon name="person" size={20} color="#5e5e5c" />
                            <Text style={styles.konselingIdentitasText}>{item.identitas == 'anonim' ? languages[currentLang].anonymous : languages[currentLang].name}</Text>
                        </View>
                    </View>
                    <View style={styles.konselingKeteranganContainer}>
                        <Text style={styles.konselingKeteranganText}>{languages[currentLang].description} :</Text>
                        <Text style={styles.konselingKeteranganText}>{item.keterangan ? item.keterangan : '-'}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.modalButtonContainer}>
                {item.status !== 0 ? (
                    ""
                ) : (
                    <View style={styles.modalApproveRejectContainer}>
                        <TouchableOpacity style={styles.modalButtonReject} onPress={confirmReject}>
                            <Text style={styles.modalButtonText}>{languages[currentLang].reject}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButtonApprove} onPress={confirmApprove}>
                            <Text style={styles.modalButtonText}>{languages[currentLang].approve}</Text>
                        </TouchableOpacity>
                    </View>
                )}
                <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
                    <Text style={styles.modalButtonCancel}>{languages[currentLang].back}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    modalDetailContainer: {
        position: 'absolute',
        // bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 20,
    },
    modalButton: {
        backgroundColor: '#cccccc',
        color: '#fff',
        padding: 10,
        borderRadius: 5,
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
    konselingIdentitasText: {
        textTransform: 'capitalize',
        fontSize: 16,
        marginLeft: 5,
        fontWeight: 'bold',
        color: '#5e5e5c',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    cardDetails: {
        marginTop: 8,
    },
    draft: {
        backgroundColor: '#FDF4D9',
        color: '#FFC107',
        padding : 5,
        borderRadius: 5,
        marginBottom: 8,
    },
    approved: {
        backgroundColor: '#D9F8D9',
        color: '#4CAF50',
        padding : 5,
        borderRadius: 5,
        marginBottom: 8,
    },
    rejected: {
        backgroundColor: '#FFD6D6',
        color: '#F44336',
        padding : 5,
        borderRadius: 5,
        marginBottom: 8,
    },
    konselingText: {
        fontSize: 16,
        flexDirection: 'row',
        alignItems : 'center',
    },
    konselingTypeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 5,
        marginTop: 8,
    },
    konselingIdentitasContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    konselingKeteranganContainer: {
        marginTop: 8,
    },
    konselingKeteranganText: {
        fontSize: 14,
        color: '#5e5e5c',
        fontWeight: 'bold',
    },
    modalButtonCancel: {
        color: '#000',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalButtonText: {
        color: 'white',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalButtonApprove: {
        backgroundColor: '#2b8395',
        padding: 10,
        width: '50%',
        borderRadius: 5,
        marginBottom: 5,
    },
    modalButtonReject: {
        backgroundColor: '#ff0000',
        padding: 10,
        width: '50%',
        borderRadius: 5,
        marginBottom: 5,
    },
    modalApproveRejectContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 5,
    },
});

export default FormApproveKonseling;