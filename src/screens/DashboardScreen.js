import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Animated,
    PanResponder,
    Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { WebView } from 'react-native-webview';
import { useIsFocused } from '@react-navigation/native';
import Constants from 'expo-constants';
import { getData, getLang } from '../utils/database';
import makeSlice from '../utils/makeSlice';
import moment from 'moment';
import languages from '../utils/en8li';



const DashboardScreen = ({ navigation }) => {
    const isFocused = useIsFocused();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isSwiped, setIsSwiped] = useState(false);
    const swipeX = new Animated.Value(0);
    const flatListRef = useRef(null);
    const screenWidth = Dimensions.get('window').width;
    const MAX_SWIPE_DISTANCE = screenWidth * 0.6;
    const [webViewHeight, setWebViewHeight] = useState(0);
    const [announcement, setAnnouncement] = useState('');
    const [attendance, setAttendance] = useState(null);
    const ITEM_WIDTH = screenWidth / 7;
    const [currentLang, setCurrentLang] = useState('en-US');
    

    useEffect(() => {
        const getLanguage = async () => {
            setCurrentLang(await getLang() || 'en-US');
        }
        
        if (isFocused) {
            fetchDataAttendance(new Date());
            getLanguage();
            setInterval(() => {
                getAnnouncement();
            }, 1000);

            const originalError = console.error;
            console.error = () => {};
            return () => {
                console.error = originalError;
            };
        }
    }, [isFocused]);

    const daysInWeek = languages[currentLang].shortDaysInWeek;
    const monthDates = generateMonthDates(currentDate, daysInWeek);

    useEffect(() => {
        const selectedIndex = monthDates.findIndex((item) => item.isSelected);
        if (selectedIndex !== -1) {
            setTimeout(() => {
                flatListRef.current?.scrollToIndex({
                    index: selectedIndex,
                    animated: true,
                    viewPosition: 0.5,
                });
            }, 300);
        }
    }, [monthDates]);

    const getAnnouncement = async () => {
        const announcement = await getData('announcement') || [];
        if(announcement.length > 0) {
            setAnnouncement(announcement[announcement.length - 1]);
        } else {
            setAnnouncement('');
        }
    }

    const handleSwipeToCheckIn = () => {
        navigation.navigate('Absen');
    };

    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: Animated.event([null, { dx: swipeX }], {
            useNativeDriver: false,
            listener: (_, gestureState) => {
                if (gestureState.dx > MAX_SWIPE_DISTANCE) {
                    swipeX.setValue(MAX_SWIPE_DISTANCE);
                }
            },
        }),
        onPanResponderRelease: (_, gestureState) => {
            if (gestureState.dx > MAX_SWIPE_DISTANCE) {
                setIsSwiped(true);
                Animated.spring(swipeX, {
                    toValue: 0,
                    useNativeDriver: false,
                }).start(() => {
                    setTimeout(handleSwipeToCheckIn, 150);
                });
            } else {
                Animated.spring(swipeX, {
                    toValue: 0,
                    useNativeDriver: false,
                }).start();
            }
        },
    });

    const getItemLayout = (data, index) => ({
        length: ITEM_WIDTH, // Lebar item dinamis
        offset: ITEM_WIDTH * index,
        index,
    });

    const onScrollToIndexFailed = (info) => {
        const wait = new Promise((resolve) => setTimeout(resolve, 500));
        wait.then(() => {
            flatListRef.current?.scrollToIndex({
                index: info.index,
                animated: true,
            });
        });
    };

    const handleDatePress = (date) => {
        setCurrentDate(date);
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + 1);
        fetchDataAttendance(newDate);
    }

    const fetchDataAttendance = async (date) => {
        const user = JSON.parse(await getData('user'));
        try {
            const response = await fetch(`${Constants.expoConfig.env.API_URL}route`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Slice': makeSlice('Attendance', 'get'),
                    'token' : JSON.parse(await getData('user')).token
                },
                body: JSON.stringify({
                    tgl: new Date(date).toISOString().split('T')[0],
                    user_id: user.id
                })
            });

            const data = await response.json();
            setAttendance(data.data);
        } catch (error) {
        }
    }
    if (currentLang) {
        return (
            <ScrollView style={styles.container}>
                <FlatList
                    ref={flatListRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={monthDates}
                    keyExtractor={(item) => item.date.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => handleDatePress(item.date)}
                            style={[
                                styles.dateBox,
                                item.isSelected && styles.selectedDate,
                            ]}
                        >
                            <Text style={[styles.day, { color: item.isSelected ? '#fff' : '#888' }]}>
                                {item.day}
                            </Text>
                            <Text style={[styles.date, { color: item.isSelected ? '#fff' : '#333' }]}>
                                {item.dateNumber}
                            </Text>
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={styles.dateList}
                    getItemLayout={getItemLayout}
                    onScrollToIndexFailed={onScrollToIndexFailed}
                />

                <View style={styles.attendanceSection}>
                    <View style={styles.activityHeader}>
                        <Text style={styles.activityTitle}>{languages[currentLang].todayAttendance}</Text>
                    </View>
                </View>

                <View style={styles.attendanceCard}>
                    <View style={styles.attendanceRow}>
                        <AttendanceItem title={languages[currentLang].checkIn} time={attendance?.checkin_time || '--:--:--'} status={attendance?.checkin_diff !== null && attendance?.checkin_diff !== undefined ? attendance.checkin_diff.toFixed(2) + ' ' + languages[currentLang].minute : '---------'} />
                        <View style={{width: 20}}></View>
                        <AttendanceItem title={languages[currentLang].checkOut} time={attendance?.checkout_time || '--:--:--'} status={attendance?.checkout_diff !== null && attendance?.checkout_diff !== undefined ? attendance.checkout_diff.toFixed(2) + ' ' + languages[currentLang].minute : '---------'} />
                    </View>

                    <View style={styles.swipeWrapper}>
                        <Text style={styles.swipePlaceholder}>{languages[currentLang].swipeToCheckIn}</Text>
                        <Animated.View
                            style={[
                                styles.swipeButton,
                                { transform: [{ translateX: swipeX }] },
                            ]}
                            {...panResponder.panHandlers}
                        >
                            <Icon name="arrow-forward" size={24} color="#fff" style={styles.swipeText}/>
                        </Animated.View>
                    </View>
                </View>

                <View style={styles.activitySection}>
                    <View style={styles.activityHeader}>
                        <Text style={styles.activityTitle}>{languages[currentLang].announcement}</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Announcement')}>
                            <Text style={styles.viewAllText}>{languages[currentLang].viewAll}</Text>
                        </TouchableOpacity>
                    </View>
                    {announcement && (
                        <View style={styles.activityList}>
                            <Text style={styles.activityName}>{moment(announcement.timestamp).format('DD MMMM YYYY HH:mm:ss')}</Text>
                            <WebView
                                originWhitelist={['*']}
                                source={{
                                    html: `
                                        <html>
                                        <head>
                                            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
                                            <style>body { font-family: Arial, sans-serif; }</style>
                                        </head>
                                        <style>p{margin: 0; padding: 0;}</style>
                                        <body>${announcement.message}</body>
                                        </html>
                                    `,
                                }}
                                javaScriptEnabled
                                domStorageEnabled
                                onMessage={(event) =>
                                    setWebViewHeight(Number(event.nativeEvent.data))
                                }
                                injectedJavaScript={`
                                    setTimeout(() => {
                                        window.ReactNativeWebView.postMessage(
                                            document.body.scrollHeight
                                        );
                                    }, 500);
                                `}
                                style={{ height: webViewHeight }}
                            />
                        </View>
                    )}
                </View>
            </ScrollView>
        );
    }
};

const AttendanceItem = ({ title, time, status }) => (
    <View style={styles.attendanceItem}>
        <View style={styles.attendanceHeader}>
            <Icon name="time" size={24} color="#2b8395" style={styles.attendanceIcon} />
            <Text style={styles.attendanceTitle}>{title}</Text>
        </View>
        <Text style={styles.attendanceTime}>{time}</Text>
        <Text style={styles.attendanceStatus}>{status}</Text>
    </View>
);

const generateMonthDates = (currentDate, daysInWeek) => {
    const monthDates = [];
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    for (let i = startOfMonth.getDate(); i <= endOfMonth.getDate(); i++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
        monthDates.push({
            date,
            day: daysInWeek[date.getDay()],
            dateNumber: i,
            isSelected: currentDate.getDate() === i,
        });
    }

    return monthDates;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#f9f9f9',
    },
    dateList: {
        paddingVertical: 10,
    },
    dateBox: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5,
        borderRadius: 6,
        backgroundColor: '#ffffff',
        height: 50,
    },
    selectedDate: {
        backgroundColor: '#2b8395',
    },
    day: {
        fontSize: 14,
        color: '#888',
    },
    date: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    attendanceSection: {
        flex: 1,
    },
    attendanceCard: {
        marginVertical: 5,
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 5,
        elevation: 1,
    },
    attendanceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    attendanceItem: {
        flex: 1, // Menjadikan elemen fleksibel
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2b8395',
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#fff',
        marginBottom: 20, // Jarak antar komponen Check In dan Check Out
    },
    attendanceHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    attendanceIcon: {
        marginRight: 8,
    },
    attendanceTitle: {
        fontSize: 16,
        color: '#555',
    },
    attendanceTime: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 5,
    },
    attendanceStatus: {
        fontSize: 12,
        color: '#888',
        marginTop: 5,
    },
    swipeWrapper: {
        height: 40,
        backgroundColor: '#2b8395',
        borderRadius: 10,
        overflow: 'hidden',
        justifyContent: 'center',
    },
    swipePlaceholder: {
        position: 'absolute',
        textAlign: 'center',
        color: '#fff',
        fontSize: 16,
        width: '100%',
        fontWeight: 'bold',
    },
    swipeButton: {
        width: '20%',
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    swipeText: {
        color: '#2b8395',
        fontSize: 16,
        fontWeight: 'bold',
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 10,
    },
    checkInButton: {
        backgroundColor: '#2b8395',
        padding: 15,
        borderRadius: 50,
        alignItems: 'center',
    },
    checkInButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    activitySection: {
        flex: 1,
        top: 0
    },
    activityHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    activityTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    viewAllText: {
        fontSize: 14,
        color: '#2b8395',
    },
    activityList: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 10,
        elevation: 3,
        marginBottom: 10

    },
    activityItem: {
        marginBottom: 15,
    },
    activityName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        borderBottomWidth: 0.3,
        borderBottomColor: '#2b8395',
    },
    activityDetail: {
        fontSize: 12,
        color: '#888',
    },
    webview: {
        flex: 1,
    },
    activityStatus: {
        fontSize: 12,
        color: '#2b8395',
    },
});

export default DashboardScreen;