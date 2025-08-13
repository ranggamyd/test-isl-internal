import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList,
    ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import Constants from 'expo-constants';
import makeSlice from '../utils/makeSlice';
import { getData, getLang } from '../utils/database';
import languages from '../utils/en8li';

const ProfileMember = ({ navigation, route }) => {
    const [user, setUser] = useState(null);
    const [currentLang, setCurrentLang] = useState('en-US');
    const [activeTab, setActiveTab] = useState(null);
    const [attendanceData, setAttendanceData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getLanguage = async () => {
            const lang = await getLang();
            setCurrentLang(lang || 'en-US');
        }
        getLanguage();
        const fetchData = async () => {
            const user = route.params?.member
            setUser(user);
            setLoading(true); // Set loading true sebelum fetch
            const data = await fetchAttendanceData(user.id, selectedMonth, selectedYear);
            setAttendanceData(data);
            setLoading(false); // Set loading false setelah fetch selesai
        };

        fetchData();
    }, [selectedMonth, selectedYear, route.params]);

    useEffect(() => {
        if (currentLang) {
            setActiveTab(languages[currentLang].attendance);
        }
    }, [currentLang]);

    const LamaKerja = (tgl_mulai_kerja) => {
        const today = new Date();
        const startDate = new Date(tgl_mulai_kerja);
        const diffTime = Math.abs(today - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const years = Math.floor(diffDays / 365);
        const months = Math.floor((diffDays % 365) / 30);
        const days = diffDays % 30;
        return `${years} Year ${months} Month ${days} Day`;
    };

    const tabs = [
        languages[currentLang]?.attendance,
        languages[currentLang]?.personal,
        languages[currentLang]?.professional,
    ];

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

    const handleMonthChange = (month) => {
        setSelectedMonth(month);
    };

    const handleYearChange = (year) => {
        setSelectedYear(year);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case languages[currentLang].attendance:
                return <RenderAttendance attendanceData={attendanceData} loading={loading} currentLang={currentLang} selectedMonth={selectedMonth} selectedYear={selectedYear} handleMonthChange={handleMonthChange} handleYearChange={handleYearChange} />
            case languages[currentLang].personal:
                return (
                    <View style={styles.infoContainer}>
                        <InfoItem label={languages[currentLang].fullName} value={user?.nama_lengkap} />
                        <InfoItem label={languages[currentLang].religion} value={user?.agama} />
                        <InfoItem label={languages[currentLang].populationRestrationNumber} value={user?.no_identitas} />
                        <InfoItem label={languages[currentLang].statusMarriage} value={user?.status_pernikahan} />
                        <InfoItem label={languages[currentLang].phoneNumber} value={user?.no_telpon} />
                        <InfoItem label={languages[currentLang].address} value={user?.alamat} />
                    </View>
                );
            case languages[currentLang].professional:
                return (
                    <View style={styles.infoContainer}>
                        <InfoItem label={languages[currentLang].employeeId} value={user?.nik} />
                        <InfoItem label={languages[currentLang].designation} value={user?.jabatan} />
                        <InfoItem
                            label={languages[currentLang].companyEmail}
                            value={user?.email}
                        />
                        <InfoItem label={languages[currentLang].employeeType} value={user?.status_karyawan} />
                        <InfoItem label={languages[currentLang].department} value={user?.name_department} />
                        <InfoItem label={languages[currentLang].reportingManager} value={user?.nama_atasan} />
                        <InfoItem label={languages[currentLang].companyExperience} value={LamaKerja(user?.tgl_mulai_kerja)} />
                        <InfoItem label={languages[currentLang].salary} value={`Rp ${user?.salary.toLocaleString('id-ID')}`} />
                        <InfoItem label={languages[currentLang].officeTime} value="08:00 - 17:00" />
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back-outline" size={20} color="#4A4A4A" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{user?.nama_lengkap}</Text>
                <Image source={{ uri: `https://apps.intilab.com/utc/apps/public/dokumentasi/karyawan/${user?.image}` }} style={styles.memberImage} />
            </View>

            {/* Tabs */}
            <View style={styles.tabs}>
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[
                            styles.tab,
                            activeTab === tab && styles.activeTab,
                        ]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === tab && styles.activeTabText,
                            ]}
                        >
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Tab Content */}
            <FlatList
                data={[{ key: 'content' }]}
                renderItem={() => renderTabContent()}
                keyExtractor={(item) => item.key}
                contentContainerStyle={styles.contentContainer}
            />
        </View>
    );
};

const InfoItem = ({ label, value }) => {
    return (
        <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value}</Text>
        </View>
    );
};

const RenderAttendance = ({ attendanceData, loading, currentLang, selectedMonth, selectedYear, handleMonthChange, handleYearChange }) => {
    if (currentLang) {
        return (
            <View>
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
                {
                    loading ? ( // Menampilkan loading saat data sedang diambil
                        <ActivityIndicator size="large" style={styles.loadingIndicator} />
                    ) : (
                        <FlatList
                            data={attendanceData}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.date}
                        />
                    )
                }
            </View>
        );
    }
};

const renderItem = ({ item }) => {
    const isWeekend = item.day_name === 'Sabtu' || item.day_name === 'Minggu';
    return (
        <View style={[styles.itemContainer, isWeekend && { backgroundColor: 'rgba(255, 182, 193, 0.5)' }]}>
            <View style={styles.leftContainer}>
                <Text style={styles.dateText}>{item.date}</Text>
                <Text style={styles.dayText}>{item.day_name}</Text>
            </View>
            <View style={styles.rightContainer}>
                <Text style={styles.checkInText}>Check In: {item.checkin_time}</Text>
                <Text style={styles.checkOutText}>Check Out: {item.checkout_time}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
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
    memberImage: {
        width: 30,
        height: 30,
        borderRadius: 100,
    },
    tabs: {
        flexDirection: 'row',
        backgroundColor: '#F1F3F4',
        paddingHorizontal: 10,
        paddingVertical: 10,
        justifyContent: 'space-around',
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: '#2b8395',
    },
    tabText: {
        fontSize: 14,
        color: '#6C757D',
    },
    activeTabText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    contentContainer: {
        padding: 10,
    },
    placeholder: {
        fontSize: 16,
        color: '#6C757D',
        textAlign: 'center',
        marginTop: 20,
    },
    infoContainer: {
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 10,
    },
    infoItem: {
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        paddingBottom: 5,
    },
    infoLabel: {
        fontSize: 14,
        color: '#6C757D',
        marginBottom: 5,
    },
    infoValue: {
        fontSize: 16,
        color: '#4A4A4A',
        fontWeight: 'bold',
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

export default ProfileMember;
