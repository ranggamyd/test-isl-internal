import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getData, getLang } from '../utils/database';
import languages from '../utils/en8li';

const MyProfileScreen = ({ navigation }) => {
    const [user, setUser] = useState(null);
    const [currentLang, setCurrentLang] = useState('en-US');
    const [activeTab, setActiveTab] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            const user = await getData('user');
            setUser(JSON.parse(user));
        };

        const getLanguages = async () => {
            const lang = await getLang();
            setCurrentLang(lang || 'en-US');
        };

        getLanguages();
        getUser();
    }, []);

    useEffect(() => {
        if (currentLang) {
            setActiveTab(languages[currentLang].personal);
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
        languages[currentLang]?.personal,
        languages[currentLang]?.professional,
        languages[currentLang]?.documents,
    ];

    const renderTabContent = () => {
        switch (activeTab) {
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
                        <InfoItem label={languages[currentLang].department} value={user?.cost_center} />
                        <InfoItem label={languages[currentLang].reportingManager} value={user?.manager} />
                        <InfoItem label={languages[currentLang].companyExperience} value={LamaKerja(user?.tgl_mulai_kerja)} />
                        <InfoItem label={languages[currentLang].officeTime} value="08:00 - 17:00" />
                    </View>
                );
            case languages[currentLang].documents:
                return <Text style={styles.placeholder}>Uploaded Documents</Text>;
            default:
                return null;
        }
    };

    if (currentLang) {


        return (
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="arrow-back-outline" size={20} color="#4A4A4A" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{languages[currentLang].myProfile}</Text>
                    <View style={{ width: 20 }} />
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
                <ScrollView style={styles.contentContainer}>
                    {renderTabContent()}
                </ScrollView>
            </View>
        );
    }
};

const InfoItem = ({ label, value }) => {
    return (
        <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value}</Text>
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
});

export default MyProfileScreen;
