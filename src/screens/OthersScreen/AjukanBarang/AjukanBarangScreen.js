import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList,ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import FormAjukanBarang from './FormAjukanBarang';
import Constants from 'expo-constants';
import { getData,getLang } from '../../../utils/database';
import { showError } from '../../../utils/Popup';
import makeSlice from '../../../utils/makeSlice';
import DetailAjukanBarang from './DetailAjukanBarang';
import languages from '../../../utils/en8li';

const AjukanBarangScreen = () => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [userData, setUserData] = useState(null);
    const [modalIndex, setModalIndex] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [listPengajuanBarang, setListPengajuanBarang] = useState([]);
    const [displayData, setDisplayData] = useState([]);
    const [isDetailBarangVisible, setDetailBarangVisible] = useState(false);
    const [barang, setBarang] = useState([]);
    const [currentLang, setCurrentLang] = useState('en-US');
    const [itemsToShow, setItemsToShow] = useState(5);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    
    const fetchDataBarang = async () => {
        try {
            const user = JSON.parse(await getData('user'));
            setUserData(user);
            const response = await fetch(`${Constants.expoConfig.env.API_URL}route`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Slice': makeSlice('AjukanBarang', 'getBarang'),
                    'token' : user.token
                },
                body: JSON.stringify({
                    user_id: user.id
                })
            });
            const data = await response.json();
            setBarang(data.barang);
        } catch (error) {
            console.log(error);
        }
    }

    const fetchDataPengajuanBarang = async () => {
        try {
            setIsLoading(true);
            const user = JSON.parse(await getData('user'));
            const response = await fetch(`${Constants.expoConfig.env.API_URL}route`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Slice': makeSlice('AjukanBarang', 'index'),
                    'token' : JSON.parse(await getData('user')).token
                },
                body: JSON.stringify({
                    user_id: user.id
                })
            });
            const data = await response.json();
            setListPengajuanBarang(data.data);
            setDisplayData(data.data.slice(0, itemsToShow));
        } catch (error) {
            showError(error.message);
        }finally{
            setIsLoading(false);
        }
    }

    const loadMoreData = () => {
        if(isFetchingMore || displayData.length >= listPengajuanBarang.length) return;
        setIsFetchingMore(true);
        setItemsToShow(itemsToShow + 5);
        setDisplayData(listPengajuanBarang.slice(0, itemsToShow + 5));
        setIsFetchingMore(false);
    };


    const showDataBarang = (index) => {
        setModalIndex(index);
        setDetailBarangVisible(true);
    }

    const closeDetailBarang = (index) => {
        setModalIndex(index);
        setDetailBarangVisible(false);
    }

    const getLanguage = async () => {
        setCurrentLang(await getLang() || 'en-US');
    }

    const renderFooter = () => {
        if(isLoading) return <ActivityIndicator size="small" color="#2b8395" />;
        return null;
    }

    useEffect(() => {
        if(isFocused) {
            fetchDataPengajuanBarang();
            fetchDataBarang();
            getLanguage();
        }
    }, [isFocused]);

    return (
        <>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Icon name="arrow-back-outline" size={24} color="#2b8395" onPress={() => navigation.goBack()} />
                    <Text style={styles.titleText}>{languages[currentLang].takingAtk}</Text>
                    <TouchableOpacity style={styles.addIconContainer} onPress={() => setModalVisible(true)}>
                        <Icon name="add" style={styles.addIcon}/>
                    </TouchableOpacity>
                </View>
                <FlatList 
                    initialNumToRender={5}
                    style={styles.listContainer}
                    data={displayData}
                    onEndReached={loadMoreData}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={renderFooter}
                    keyExtractor={(item, index) => item.id.toString()}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity key={index} onPress={() => showDataBarang(index)} style={styles.card}>
                                <View style={styles.cardHeader}>
                                    <View style={styles.cardHeaderItem}>
                                        <Text style={styles.pengajuanBarangItemName}>{item.nama_barang}</Text>
                                        <Text>|</Text>
                                        <Text style={[styles.itemQty]}>{item.jumlah}</Text>
                                    </View>
                                    <Text style={item.status == 'waiting' ? styles.draft : item.status == 'process' ? styles.process : styles.void}>{item.status == 'waiting' ? languages[currentLang].waiting : item.status == 'process' ? languages[currentLang].process : languages[currentLang].void}</Text>
                                </View>
                                <View style={styles.cardDetails}>
                                    <View style={styles.cardDetailsItem}><Icon name="person-outline" size={20} color="#5e5e5c" /><Text style={styles.cardDetailsText}>{item.nama_karyawan}</Text></View>
                                    <View style={styles.cardDetailsItem}><Icon name="briefcase-outline" size={20} color="#5e5e5c" /><Text style={styles.cardDetailsText}>{item.divisi}</Text></View>
                                    <View style={styles.cardDetailsItem}><Icon name="barcode-outline" size={20} color="#5e5e5c" /><Text style={styles.cardDetailsText}>{item.kode_barang}</Text></View>
                                </View>
                        </TouchableOpacity>
                    )} 
                    ListEmptyComponent={
                        <Text style={styles.placeholder}>{isLoading ? languages[currentLang].loading : languages[currentLang].noData}</Text>
                    }
                    />
            </View>
            <Modal onBackdropPress={() => closeDetailBarang(modalIndex)} backdropOpacity={0.5} animationIn="bounceIn" animationOut="bounceOut" isVisible={isDetailBarangVisible && !modalVisible} onRequestClose={() => closeDetailBarang(modalIndex)}>
                <DetailAjukanBarang item={listPengajuanBarang[modalIndex]} closeModal={() => closeDetailBarang(modalIndex)} user={userData} />
            </Modal>
            <Modal onBackdropPress={() => setModalVisible(false)} backdropOpacity={0.5} animationIn="slideInUp" animationOut="slideOutDown" isVisible={modalVisible && !isDetailBarangVisible} onRequestClose={() => setModalVisible(false)} style={styles.modalContainer}>
                <FormAjukanBarang item={barang} closeModal={() => setModalVisible(false)} user={userData} reloadData={fetchDataPengajuanBarang}/>
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
    listContainer: {
        paddingHorizontal: 16,
    },
    headerContainer: {
        height: 50,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    addIconContainer: { 
        position: 'relative',
        borderWidth: 1,
        borderColor: '#2b8395',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholder: {
        fontSize: 14,
        color: '#6C757D',
        textAlign: 'center',
        marginTop: 20,
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
        borderRadius: 50,
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
    cardHeaderItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    pengajuanBarangItemName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    pengajuanBarangContainer: {
        marginTop: 50,
        padding: 16,
        marginBottom: 15,
    },
    noDataContainer: {
        flex: 1,
        backgroundColor: '#F9F9F9',
        height: '100%',
    },
    cardDetailsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    cardDetailsText: {
        fontSize: 14,
    },
    itemQty: {
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

export default AjukanBarangScreen;