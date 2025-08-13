import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Constants from 'expo-constants';
import makeSlice from '../utils/makeSlice';
import { getData, getLang } from '../utils/database';
import { showError } from '../utils/Popup';
import MonthYear from '../components/MonthYear';
import languages from '../utils/en8li';

const ShiftScreen = ({ navigation }) => {
    const [show, setShow] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [dataShift, setDataShift] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [currentLang, setCurrentLang] = useState('en-US');

    useEffect(() => {
        getLang().then(lang => setCurrentLang(lang));
    }, []);

    const handleSearch = async () => {
        try {
            const userDataString = await getData('user');
            const userData = JSON.parse(userDataString);
            const response = await fetch(`${Constants.expoConfig.env.API_URL}route`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Slice': makeSlice('Attendance', 'shift'),
                    'token': userData.token
                },
                body: JSON.stringify({
                    year: selectedYear,
                    month: selectedMonth,
                    userid: userData.id
                }),
            });

            const result = await response.json();
            if (result.status === 'success') {
                setDataShift(result.data);
                setRefresh(!refresh); // Update state to trigger re-render
            } else {
                showError('Gagal mengambil data shift', result.message);
            }
        } catch (err) {
            showError('Ooops...', 'Terjadi kesalahan saat mengambil data shift');
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#2b8395" barStyle="light-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back-outline" size={20} color="#4A4A4A" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{languages[currentLang].shift}</Text>
                <View style={{ width: 20 }} />
            </View>
            <View style={styles.container}>
                <View style={styles.searchContainer}>
                    <TouchableOpacity style={styles.searchInput} onPress={() => setShow(true)}>
                        <Text>{selectedDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                        <Icon name="search" size={24} color="white" />
                    </TouchableOpacity>
                    <MonthYear
                        isShow={show}
                        close={() => setShow(false)}
                        onChangeYear={(year) => {
                            const newDate = new Date(selectedDate.setFullYear(year));
                            setSelectedDate(newDate);
                            setSelectedYear(year);
                        }}
                        onChangeMonth={(month) => {
                            const newDate = new Date(selectedDate.setMonth(month.key - 1));
                            setSelectedDate(newDate);
                            setSelectedMonth(month.key);
                            setShow(false);
                        }}
                    />
                </View>
                <FlatList
                    data={dataShift}
                    extraData={refresh} // Add this line to ensure FlatList re-renders when refresh state changes
                    renderItem={({ item }) => (
                        <View style={styles.shiftItem}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{
                                    width: 10,
                                    height: '100%',
                                    backgroundColor: item.shift === 'off' ? 'red' : item.shift === '24jam' ? 'orange' : 'green',
                                    marginRight: 10,
                                    borderRadius: 5
                                }} />
                                <View>
                                    <Text style={styles.date}>{item.tanggal} ({item.hari})</Text>
                                    <Text style={[styles.shift, (item.shift === 'off' || item.shift === '24jam') && { fontWeight: 'bold', color: 'red' }]}>Shift: {item.shift}</Text>
                                    {item.time_in && item.time_out && (
                                        <Text style={styles.time}>
                                            {item.time_in} - {item.time_out}
                                        </Text>
                                    )}
                                </View>
                            </View>
                        </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={[styles.scrollContainer]}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
        elevation: 2,
        justifyContent: 'space-between',
    },
    backIcon: {
        fontSize: 18,
        color: '#2b8395'
    },
    headerTitle: {
        fontSize: 18,
        color: '#4A4A4A',

    },
    headerContainer: {
        backgroundColor: '#3b5998',
        width: '100%',
        paddingVertical: 20,
        alignItems: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 10,
        marginTop: 10,
    },
    searchInput: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderLeftWidth: 1,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#2b8395',
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        padding: 10,
        width: '85%',
        alignSelf: 'center'
    },
    searchButton: {
        borderRightWidth: 1,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#2b8395',
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        padding: 6,
        width: '15%',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2b8395',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    item: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17
    },
    dateText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        top: 15
    },
    containerDetail: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        padding: 10,
        width: '90%',
        alignSelf: 'center'
    },
    dataContainer: {
        flex: 1,
        padding: 20,
        top: -10
    },
    scrollContainer: {
        top: 5,
        paddingBottom: 100
    },
    shiftItem: {
        backgroundColor: '#fff',
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    date: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    shift: {
        fontSize: 16,
        marginTop: 4,
    },
});

export default ShiftScreen;

