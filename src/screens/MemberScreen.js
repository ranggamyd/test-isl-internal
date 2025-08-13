import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import Constants from 'expo-constants';
import { getData, getLang } from '../utils/database';
import languages from '../utils/en8li';
import makeSlice from '../utils/makeSlice';
import { useIsFocused } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

const MemberScreen = () => {
    const [user, setUser] = useState(null);
    const [members, setMembers] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentLang, setCurrentLang] = useState('en-US');
    const isFocused = useIsFocused();
    const navigation = useNavigation();

    const getUser = async () => {
        const user = await getData('user');
        setUser(JSON.parse(user));
    }

    useEffect(() => {
        const fetchMembers = async () => {
            const response = await fetch(`${Constants.expoConfig.env.API_URL}route`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Slice': makeSlice('Profile', 'getLeaderboard'),
                    'token': JSON.parse(await getData('user')).token
                }
            });
            const data = await response.json();
            if (response.status === 200) {
                setMembers(data.data);
                setFilteredMembers(data.data);
            } else {
                Alert.alert(
                    languages[currentLang].error,
                    data.message
                );
            }
        };

        const getLanguage = async () => {
            const lang = await getLang();
            setCurrentLang(lang || 'en-US');
        };

        if (isFocused) {
            getLanguage();
            fetchMembers();
            getUser();
        }
    }, [isFocused]);

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query) {
            const filtered = members.filter(member =>
                member.nama_lengkap.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredMembers(filtered);
        } else {
            setFilteredMembers(members);
        }
    };

    const handleMemberPress = (member) => {
        if (user.grade === 'MANAGER' || (user.grade === 'SUPERVISOR' && member.grade === 'STAFF') || user.id === member.id) {
            navigation.navigate('ProfileMember', { member: member });
        } else {
            Alert.alert('Access Denied', 'You do not have permission to view this member\'s attendance.');
        }
    };

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => handleMemberPress(item)}>
                <View style={[styles.memberContainer, user?.id === item.id && { backgroundColor: 'rgba(0, 128, 0, 0.1)' }]}>
                    <Image source={{ uri: `https://apps.intilab.com/utc/apps/public/dokumentasi/karyawan/${item.image}` }} style={styles.memberImage} />
                    <View style={styles.memberInfo}>
                        <Text style={styles.memberName}>{item.nama_lengkap}</Text>
                        <Text style={styles.memberPosition}>{item.jabatan}</Text>
                        <Text style={styles.memberPosition}>{item.tgl_mulai_kerja}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchBar}
                placeholder={languages[currentLang].search}
                value={searchQuery}
                onChangeText={handleSearch}
            />
            {filteredMembers.length > 0 ? (
                <FlatList
                    data={filteredMembers}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                />
            ) : (
                <View style={styles.noDataContainer}>
                    <Text style={styles.noDataText}>{languages[currentLang].noData}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10
    },
    searchBar: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10
    },
    memberContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
        alignItems: 'center'
    },
    memberImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10
    },
    memberInfo: {
        flex: 1
    },
    memberName: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    memberPosition: {
        fontSize: 14,
        color: '#666'
    },
    noDataContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    noDataText: {
        fontSize: 16,
        color: '#666'
    }
});

export default MemberScreen;
