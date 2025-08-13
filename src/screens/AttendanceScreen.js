import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { getData, getLang } from '../utils/database';
import makeSlice from '../utils/makeSlice';
import Constants from 'expo-constants';
import languages from '../utils/en8li';
import { useNavigation } from '@react-navigation/native';

const AttendanceScreen = ({ route }) => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [showPicker, setShowPicker] = useState(false);
    const [member, setMember] = useState([]);
    const [currentLang, setCurrentLang] = useState('en-US');
    const [loading, setLoading] = useState(true); // State untuk loading
    const navigation = useNavigation();

    const fetchAttendanceData = async (userId, month, year) => {
        try {
            const response = await fetch(`${Constants.expoConfig.env.API_URL}route`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': JSON.parse(await getData('user')).token,
                    'X-Slice': makeSlice('Attendance', 'getAttendance'),
                },
                body: JSON.stringify({
                    user_id: userId,
                    month: month, // Kirim bulan
                    year: year,   // Kirim tahun
                }),
            });
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error fetching attendance data:', error);
            return [];
        }
    };

    // Mengambil data absensi ketika bulan atau tahun berubah
    useEffect(() => {
        const getLanguage = async () => {
            const lang = await getLang();
            setCurrentLang(lang || 'en-US');
        }
        getLanguage();
        const fetchData = async () => {
            const user = route.params?.member || JSON.parse(await getData('user'));
            setMember(user);
            setLoading(true); // Set loading true sebelum fetch
            const data = await fetchAttendanceData(user.id, selectedMonth, selectedYear);
            setAttendanceData(data);
            setLoading(false); // Set loading false setelah fetch selesai
        };

        fetchData();
    }, [selectedMonth, selectedYear, route.params]);

    const handleMonthChange = (itemValue) => {
        setSelectedMonth(itemValue);
    };

    const handleYearChange = (itemValue) => {
        setSelectedYear(itemValue);
    };

    const renderItem = ({ item }) => {
        const isWeekend = item.day_name === 'Sabtu' || item.day_name === 'Minggu';
        return (
            <View style={[styles.itemContainer, isWeekend && { backgroundColor: 'rgba(255, 182, 193, 0.5)' }]}>
                <View style={styles.leftContainer}>
                    <Text style={styles.dateText}>{item.date}</Text>
                    {/* <Text style={styles.shiftText}>{item.shift}</Text> */}
                    <Text style={styles.dayText}>{item.day_name}</Text>
                </View>
                <View style={styles.rightContainer}>
                    <Text style={styles.checkInText}>Check In: {item.checkin_time}</Text>
                    <Text style={styles.checkOutText}>Check Out: {item.checkout_time}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back-outline" size={20} color="#4A4A4A" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{member.nama_lengkap}</Text>
                <Image source={{ uri: `https://apps.intilab.com/utc/apps/public/dokumentasi/karyawan/${member.image}` }} style={styles.memberImage} />
            </View>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={selectedMonth}
                    style={styles.picker}
                    onValueChange={handleMonthChange}
                >
                    {languages[currentLang].monthInYear.map((month, index) => (
                        <Picker.Item key={index} label={month} value={index + 1} />
                    ))}
                </Picker>
                <Picker
                    selectedValue={selectedYear}
                    style={styles.picker}
                    onValueChange={handleYearChange}
                >
                    {Array.from({ length: 49 }, (_, i) => i + 2012).map(year => (
                        <Picker.Item key={year} label={`${year}`} value={year} />
                    ))}
                </Picker>
            </View>
            {loading ? ( // Menampilkan loading saat data sedang diambil
                <ActivityIndicator size="large" style={styles.loadingIndicator} />
            ) : (
                <FlatList
                    data={attendanceData}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.date}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        fontSize: 16,
        color: '#4A4A4A',
        fontWeight: 'bold',
    },
    memberImage: {
        width: 30,
        height: 30,
        borderRadius: 15,
    },
    pickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        paddingHorizontal: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 5,
        elevation: 2,
    },
    picker: {
        flex: 1,
    },
    itemContainer: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    leftContainer: {
        flex: 1,
    },
    rightContainer: {
        flex: 1,
    },
    dateText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    dayText: {
        fontSize: 14,
        color: '#666',
    },
    checkInText: {
        fontSize: 14,
        color: '#4CAF50',
    },
    checkOutText: {
        fontSize: 14,
        color: '#F44336',
    },
    shiftText: {
        fontSize: 14,
        color: '#007BFF',
        marginTop: 5,
    },
    checkInDiffText: {
        fontSize: 14,
        color: '#FFA500',
        marginTop: 5,
    },
    checkOutDiffText: {
        fontSize: 14,
        color: '#800080',
        marginTop: 5,
    },
    loadingIndicator: {
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        color: '#0000ff',
    },
});

export default AttendanceScreen;