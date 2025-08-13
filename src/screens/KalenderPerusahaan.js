import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, SafeAreaView, TouchableOpacity } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/Ionicons';
import Constants from 'expo-constants';
import { showError } from '../utils/Popup';
import languages from '../utils/en8li';
import makeSlice from '../utils/makeSlice';
import { getData, getLang } from '../utils/database';

LocaleConfig.locales['id'] = {
    monthNames: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
    monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
    dayNames: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
    dayNamesShort: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
    today: 'Hari ini'
};

LocaleConfig.defaultLocale = 'id';

const KalenderPerusahaan = ({ navigation }) => {
    const [items, setItems] = useState({});
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedItem, setSelectedItem] = useState({});
    const [currentMark, setCurrentMark] = useState({});
    const [currentLang, setCurrentLang] = useState('en-US');

    useEffect(() => {
        const getLanguage = async () => {
            const lang = await getLang();
            setCurrentLang(lang);
        }
        getLanguage();
    }, []);

    useEffect(() => {
        fetchAgendaData(selectedDate);
    }, [selectedDate]);

    const replaceHolidayWithCompanyDate = (tglIndonesia, tglPerusahaan) => {
        tglPerusahaan.forEach((perusahaan) => {
            const tanggalPengganti = perusahaan.tgl_ganti;
            const newTanggal = perusahaan.tanggal;
            tglIndonesia = tglIndonesia.map((indonesia) => {
                if (indonesia.tanggal === tanggalPengganti) {
                    return {
                        ...indonesia,
                        tanggal: newTanggal,
                        keterangan: perusahaan.keterangan,
                        is_cuti: perusahaan.is_cuti === '1' || perusahaan.is_cuti === true
                    };
                }
                return indonesia;
            });
        });
        return tglIndonesia;
    }

    const fetchAgendaData = async (date) => {
        try {
            const response = await fetch(`${Constants.expoConfig.env.API_URL}route`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Slice': makeSlice('Attendance', 'liburPerusahaan'),
                    'token': JSON.parse(await getData('user')).token
                }
            });

            const data = await response.json();

            const responseApi = await fetch(`https://dayoffapi.vercel.app/api?year=` + date.split('-')[0]);
            const dataApi = await responseApi.json();
            const combine = replaceHolidayWithCompanyDate(dataApi, data)
            
            const newItems = combine.reduce((acc, item) => {
                const date = item.tanggal;
                if (!acc[date]) {
                    acc[date] = [];
                }
                acc[date].push({ name: item.keterangan, description: item.is_cuti ? 'Cuti' : 'Hari Libur' });
                return acc;
            }, {});
            setItems(newItems);

            const currentMonth = new Date().getMonth() + 1;
            const filteredItems = Object.keys(newItems).reduce((acc, date) => {
                const itemMonth = new Date(date).getMonth() + 1;
                if (itemMonth === currentMonth) {
                    acc[date] = newItems[date];
                }
                return acc;
            }, {});
            setSelectedItem(filteredItems);

            const markedDates = Object.keys(newItems).reduce((acc, date) => {
                acc[date] = { selected: true, marked: false, selectedColor: 'red' };
                return acc;
            }, {});
            const today = new Date();
            const selectedMonth = new Date(selectedDate).getMonth() + 1;
            const selectedYear = new Date(selectedDate).getFullYear();

            if (selectedMonth === today.getMonth() + 1 && selectedYear === today.getFullYear()) {
                const currentDate = today.toISOString().split('T')[0];
                markedDates[currentDate] = { selected: true, marked: true, selectedColor: 'blue' };
            } else {
                const currentDate = today.toISOString().split('T')[0];
                if (markedDates[currentDate]) {
                    delete markedDates[currentDate];
                }
            }
            setCurrentMark(markedDates);
        } catch (error) {
            showError('Error fetching agenda data:', error.message);
        }
    };

    const handleChangeDate = async (date) => {
        const currentYear = date.year;
        const currentMonth = date.month;
        const filteredItems = Object.keys(items).reduce((acc, date) => {
            const itemDate = new Date(date);
            const itemYear = itemDate.getFullYear();
            const itemMonth = itemDate.getMonth() + 1;
            if (itemYear === currentYear && itemMonth === currentMonth) {
                acc[date] = items[date];
            }
            return acc;
        }, {});
        setSelectedItem(filteredItems);
        const markedDates = Object.keys(filteredItems).reduce((acc, date) => {
            acc[date] = { selected: true, marked: false, selectedColor: 'red' };
            return acc;
        }, {});
        const today = new Date();
        const selectedMonth = date.month;
        const selectedYear = date.year;

        if (selectedMonth === today.getMonth() + 1 && selectedYear === today.getFullYear()) {
            const currentDate = today.toISOString().split('T')[0];
            markedDates[currentDate] = { selected: true, marked: true, selectedColor: 'blue' };
        } else {
            const currentDate = today.toISOString().split('T')[0];
            if (markedDates[currentDate]) {
                delete markedDates[currentDate];
            }
        }
        setCurrentMark(markedDates);
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#2b8395" barStyle="light-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back-outline" size={20} color="#4A4A4A" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{languages[currentLang].calendar}</Text>
                <View style={{ width: 20 }} />
            </View>

            <View style={styles.container}>
                <Calendar
                    style={{ top: 10 }}
                    onMonthChange={month => {
                        handleChangeDate(month)
                    }}
                    markedDates={currentMark}
                />
                <Text style={styles.textCatatan}>Catatan: Data yang ditampilkan merupakan data generate otomatis dari system, silahkan pastikan hari libur nasional dengan kalender resmi dari pemerintah Indonesia.</Text>
                <Text style={styles.dateText}>Keterangan Kalender</Text>
                <View style={{ marginTop: 5 }}>
                    {Object.keys(selectedItem).map((date) => (
                        <View key={date} style={styles.containerDetail}>
                            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: 'black', marginRight: 10 }} />
                            <Text style={{ flex: 1, flexWrap: 'wrap' }}>{date}: {items[date].map(item => item.name).join(', ')}</Text>
                        </View>
                    ))}
                </View>
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
    textCatatan: {
        fontSize: 12,
        textAlign: 'center',
        marginTop: 20
    },
    dateText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'
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
    backButton: {
        position: 'absolute',
        bottom: 30,
        left: '50%',
        transform: [{ translateX: -30 }],
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#3b5998',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5, // Memberikan efek bayangan pada tombol
    },
});

export default KalenderPerusahaan;

