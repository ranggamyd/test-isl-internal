import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import languages from '../utils/en8li';
import { getLang } from '../utils/database';

const OtherScreen = () => {
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentLang, setCurrentLang] = useState('en-US');
    const [menu, setMenu] = useState([]);
    const isFocused = useIsFocused();

    useEffect(() => {
        const getLanguage = async () => {
            const lang = await getLang();
            const menu_ = [
                { id: '0', name: languages[lang].calendar, icon: "albums-outline", screen: "KalenderPerusahaan" },
                { id: '1', name: languages[lang].attendance, icon: "albums-outline", screen: "Attendance" },
                { id: '2', name: languages[lang].shift, icon: "albums-outline", screen: "ShiftScreen" },
                { id: '3', name: languages[lang].support, icon: "albums-outline", screen: "SupportScreen" },
                { id: '4', name: languages[lang].takingAtk, icon: "albums-outline", screen: "AjukanBarangScreen" },
            ];
            setMenu(menu_);
        }
        if (isFocused) {
            getLanguage();
        }
    }, [isFocused]);

    const filteredMenu = menu.filter((menu) =>
        menu.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.itemContainer} onPress={() => navigation.navigate(item.screen)}>
            <View style={styles.listItem}>
                <Icon style={styles.icon} name={item.icon} size={24} color="#000" />
                <Text style={styles.name}>{item.name}</Text>
            </View>
            <Icon name="chevron-forward-outline" size={24} color="#000" />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>{languages[currentLang].menu}</Text>
            <View style={styles.searchContainer}>
                <Icon name="search-outline" size={20} color="#888" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>
            <FlatList
                data={filteredMenu}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
        padding: 16,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 5,
        marginBottom: 16,
        elevation: 2,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
    },
    listContainer: {
        paddingBottom: 16,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 16,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 8,
        elevation: 2,
    },
    name: {
        fontSize: 16,
    },
    email: {
        fontSize: 14,
        color: '#555',
    },
});

export default OtherScreen;