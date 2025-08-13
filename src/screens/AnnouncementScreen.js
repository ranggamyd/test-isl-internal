import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    FlatList,
    Alert,
    Modal,
    Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { getData, saveData } from '../utils/database';
import moment from 'moment';

const AnnouncementScreen = ({ navigation }) => {
    const [data, setData] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const getResponse = async () => {
            const response = await getData('announcement');
            setData(response || []);
        };
        getResponse();
    }, []);

    const handlePress = async (id) => {
        const updatedData = data.map((item) => {
            if (item.id === id) {
                return { ...item, is_read: true };
            }
            return item;
        });
        setData(updatedData);
        await saveData('announcement', updatedData);
    };

    const handleLongPress = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleDelete = async () => {
        const updatedData = data.filter((item) => !selectedIds.includes(item.id));
        setData(updatedData);
        await saveData('announcement', updatedData);
        setSelectedIds([]);
    };

    const handleDeleteAll = async () => {
        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete all announcements?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete All',
                    style: 'destructive',
                    onPress: async () => {
                        setData([]);
                        await saveData('announcement', []);
                        setModalVisible(false);
                    },
                },
            ]
        );
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => handlePress(item.id)}
            onLongPress={() => handleLongPress(item.id)}
            style={[
                styles.notificationItem,
                item.is_read ? styles.read : styles.unread,
                selectedIds.includes(item.id) && styles.selected,
            ]}
        >
            <View style={styles.header}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.timestamp}>
                    {moment(item.timestamp).format('D-MMMM-YYYY H:mm:ss')}
                </Text>
                {!item.is_read && <View style={styles.unreadDot} />}
            </View>
            <Text style={styles.message}>{item.message}</Text>
        </TouchableOpacity>
    );

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="#2b8395" />
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Icon name="arrow-back" size={24} color="#2b8395" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Announcement</Text>
                <View style={{ flexDirection: 'row' }}>
                    {selectedIds.length > 0 && (
                        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
                            <Icon name="trash-outline" size={20} color="#2b8395" />
                        </TouchableOpacity>
                    )
                    }
                    <TouchableOpacity
                        onPress={() => setModalVisible(true)}
                        style={styles.moreButton}
                    >
                        <Icon name="ellipsis-vertical" size={20} color="#2b8395" />
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.container}
            />

            {/* Modal for Delete All */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity onPress={handleDeleteAll}>
                            <Text style={styles.modalText}>Delete All Announcements</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
};

export default AnnouncementScreen;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
    },
    notificationItem: {
        padding: 16,
        marginBottom: 8,
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    message: {
        fontSize: 14,
        color: '#555',
    },
    read: {
        backgroundColor: '#f9f9f9',
    },
    unread: {
        backgroundColor: '#ffffff',
    },
    selected: {
        borderColor: '#2b8395',
        borderWidth: 2,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    backButton: {
        padding: 8,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    deleteButton: {
        padding: 3
    },
    moreButton: {
        padding: 3
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        marginBottom: 5,
    },
    timestamp: {
        fontSize: 12,
        color: '#888',
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'red',
        marginLeft: 8,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        color: '#2b8395',
        alignSelf: 'center',
    },
});
