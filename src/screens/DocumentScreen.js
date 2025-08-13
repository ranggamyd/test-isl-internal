import React, { useState,useEffect,useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { getData,getLang } from '../utils/database';  //setMulti Language getLang
import Constants from 'expo-constants';
import makeSlice from '../utils/makeSlice';
import languages from '../utils/en8li';
import { showError } from '../utils/Popup';

const DocumentScreen = () => {
    const [activeTab, setActiveTab] = useState('Approved');
    const [dataList, setDataList] = useState({});
    const [summary, setSummary] = useState({});
    const isFocused = useIsFocused();
    const [currentLang, setCurrentLang] = useState('en-US');
    
    useEffect(() => {
        if (isFocused) {
            setTimeout(() => {
                fetchData();
                console.log({dataList})
            }, 5000);

            const getLanguage = async () => {
                setCurrentLang(await getLang() || 'en-US');
            }
            getLanguage();
        }
    }, [isFocused]);

    useEffect(() => {
        if(activeTab === 'approved') fetchData();
    }, [activeTab]);
    

    // rapikan isi card list
    const TextRow = ({ label, value }) => (
        <View style={styles.row}>
          <Text style={styles.labelRow}>{label}</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={styles.valueRow}>{value}</Text>
        </View>
    );

    //callData
    const fetchData = async () => {
        console.log('Updated dataList:sss');
        const user = JSON.parse(await getData('user'));
        try {
            const response = await fetch(`${Constants.expoConfig.env.API_URL}route`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Slice': makeSlice('Izin', 'counter'),
                    'token' : user.token
                },
                body: JSON.stringify({
                    user_id: user.id
                })
            });

            const data = await response.json();
            setDataList(data.data);
            console.log(data.data)
        } catch (error) {
            console.log('Err dataList:', error);
            showError(error);
        }
    }

    // get data lembur untuk user selain spv/manager
    const getDataLemburUser = async () => {
        const user = JSON.parse(await getData('user'));
        try {
            const response = await fetch(`${Constants.expoConfig.env.API_URL}route`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Slice": makeSlice("Lembur", "getLembur"),
                    token: user.token,
                },
                body: JSON.stringify({
                    user_id: user.id,
                    type:"getUserLembur"
                }),
            });
            const data =await response.json();
        
            // console.log(data.data);
        
            setDataList(data.data); 
        } catch (error) {
            console.log(error);
            showError(error);
        }
    }


    // Data untuk Leave Summary
    const leaveSummary = [
        { title: languages[currentLang].remainingleave, value: 12, bgColor: '#D9F2F8' },
        { title: languages[currentLang].overtime, value: 2, bgColor: '#E9F8D9' },
        { title: languages[currentLang].leaverequest, value: 4, bgColor: '#D9F2F8' },
        { title: 'Leave Cancelled', value: 10, bgColor: '#F8D9D9' },
    ];

    // Data untuk Leave Details
    const leaveDetails = [
        {
            id: '1',
            dateRange: 'Apr 15, 2023 - Apr 18, 2023',
            status: 'Approved',
            applyDays: 3,
            leaveBalance: 16,
            approvedBy: 'Martin Deo',
        },
        {
            id: '2',
            dateRange: 'May 01, 2023 - May 05, 2023',
            status: 'Pending',
            applyDays: 5,
            leaveBalance: 11,
            approvedBy: 'N/A',
        },
        {
            id: '3',
            dateRange: 'May 01, 2023 - May 05, 2023',
            status: 'Pending',
            applyDays: 5,
            leaveBalance: 11,
            approvedBy: 'N/A',
        },
        {
            id: '4',
            dateRange: 'May 01, 2023 - May 05, 2023',
            status: 'Pending',
            applyDays: 5,
            leaveBalance: 11,
            approvedBy: 'N/A',
        },
    ];

    // Tab content handler
    const renderTabContent = () => {
        if (activeTab === 'approved') {
            return (
                <FlatList
                    data={dataList}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardDate}>Form Permohonan Lembur</Text>
                                <Text style={[styles.cardStatus, styles[item.is_approve === 0 ? 'pending' : item.is_approve === 1 ? 'approved' : 'rejected']]}>
                                    {item.is_approve === 0 ? 'Draft' : item.is_approve === 1 ? 'Approved' : 'Rejected' }
                                </Text>
                            </View>
                            <View style={styles.cardDetails}>
                                <TextRow label="Nama" value={item.nama_lengkap} />
                                <TextRow label="Tanggal" value={item.tanggal} />
                                <TextRow
                                label="Waktu"
                                value={item.jam_mulai.split(":")[0] + ":" + item.jam_mulai.split(":")[1] + " - " + item.jam_pulang.split(":")[0] + ":" + item.jam_pulang.split(":")[1] + ' WIB'}
                                />
                                <TextRow label="Keterangan" value={item.ket} />
                            </View>
                        </View>
                    )}
                />
            );
        }else if(activeTab === 'processing'){
            return <Text style={styles.placeholderText}>No Data Available</Text>;
        }else if(activeTab === 'rejected'){
            return (
                <FlatList
                    data={leaveDetails}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardDate}>{item.dateRange}</Text>
                                <Text style={[styles.cardStatus, styles[item.status.toLowerCase()]]}>
                                    {item.status}
                                </Text>
                            </View>
                            <View style={styles.cardDetails}>
                                <Text>Apply Days: {item.applyDays}</Text>
                                <Text>Leave Balance: {item.leaveBalance}</Text>
                                <Text>Approved By: {item.approvedBy}</Text>
                            </View>
                        </View>
                    )}
                />
            );
        }
    };

    return (
        <View style={styles.container}>
            {/* Leave Summary */}
            <View style={styles.summaryContainer}>
                {leaveSummary.map((item, index) => (
                    <View key={index} style={[styles.summaryBox, { backgroundColor: item.bgColor }]}>
                        <Text style={styles.summaryTitle}>{item.title}</Text>
                        <Text style={styles.summaryValue}>{item.value}</Text>
                    </View>
                ))}
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                {['approved', 'processing', 'rejected'].map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[
                            styles.tabButton,
                            activeTab === tab && styles.activeTabButton,
                        ]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === tab && styles.activeTabText,
                            ]}
                        >
                            {(tab)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Tab Content */}
            <View style={styles.tabContent}>{renderTabContent()}</View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        padding: 16,
    },
    summaryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 0,
    },
    summaryBox: {
        width: Dimensions.get('window').width / 2 - 20,
        height: 100,
        borderRadius: 8,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    summaryTitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 8,
    },
    summaryValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
        backgroundColor: '#f1f1f1',
        borderRadius: 5,
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical:8,
        borderBottomWidth: 2,
        borderBottomColor: '#ccc',
    },
    activeTabButton: {
        borderBottomColor: '#2b8395',
        backgroundColor: '#2b8395',
        borderRadius: 5,
    },
    tabText: {
        fontSize: 16,
        color: '#666',
    },
    activeTabText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    tabContent: {
        flex: 1,
    },
    placeholderText: {
        textAlign: 'center',
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
    card: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    cardDate: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    cardStatus: {
        fontSize: 14,
        marginBottom: 8,
        padding: 4,
        borderRadius: 4,
        alignSelf: 'flex-start',
    },
    approved: {
        backgroundColor: '#D9F8D9',
        color: '#4CAF50',
    },
    pending: {
        backgroundColor: '#FDF4D9',
        color: '#FFC107',
    },
    rejected: {
        backgroundColor: "#ffc2c2",
        color: "#ff6e6e",
    },
    cardDetails: {
        marginTop: 8,
        gap: 1,
    },
    row: {
        flexDirection: "row",
    },
    labelRow: {
    width: "25%",
    },
    colon: {
    marginRight: 5,
    },
    valueRow: {
        width: "70%",
    },
});

export default DocumentScreen;
