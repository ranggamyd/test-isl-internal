import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import languages from '../../../utils/en8li';
import { getLang } from '../../../utils/database';
import { useIsFocused } from '@react-navigation/native';

const DetailAjukanBarang = ({item, closeModal, user}) => {
    const [currentLang, setCurrentLang] = useState('en-US');
    const isFocused = useIsFocused();
    const getLanguage = async () => {
        setCurrentLang(await getLang() || 'en-US');
    }

    useEffect(() => {
        getLanguage();
    }, [isFocused]);

    return (
        <View style={styles.modalDetailContainer}>
            <View>
            <View style={styles.cardHeader}>
                    <View style={styles.cardHeaderItem}>
                        <Text style={styles.pengajuanBarangItemName}>{item.nama_barang}</Text>
                    </View>
                    <Text style={item.status == 'waiting' ? styles.draft : item.status == 'process' ? styles.process : styles.void}>{item.status == 'waiting' ? languages[currentLang].waiting : item.status == 'process' ? languages[currentLang].process : languages[currentLang].void}</Text>
                </View>
                <View style={styles.cardDetails}>
                    <View style={styles.cardDetailsItem}><Icon name="person-outline" size={20} color="#5e5e5c" /><Text style={styles.cardDetailsText}>{item.nama_karyawan}</Text></View>
                    <View style={styles.cardDetailsItem}><Icon name="briefcase-outline" size={20} color="#5e5e5c" /><Text style={styles.cardDetailsText}>{item.divisi}</Text></View>
                    <View style={styles.cardDetailsItem}><Icon name="barcode-outline" size={20} color="#5e5e5c" /><Text style={styles.cardDetailsText}>{item.kode_barang}</Text></View>
                    <View style={styles.cardDetailsItem}><Icon name="stats-chart-outline" size={20} color="#5e5e5c" /><Text style={styles.cardDetailsText}>{item.jumlah}</Text></View>
                    <View style={styles.konselingKeteranganContainer}>
                        <Text style={styles.konselingKeteranganText}>{languages[currentLang].description} :</Text>
                        <Text style={styles.konselingKeteranganText}>{item.keterangan ? item.keterangan : '-'}</Text>
                    </View>
                </View>
            </View>
            <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
                <Text style={styles.modalButtonText}>{languages[currentLang].back}</Text>
            </TouchableOpacity>
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
    modalButtonText: {
        color: '#000',
        fontWeight: 'bold',
        textAlign: 'center',
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
});

export default DetailAjukanBarang;