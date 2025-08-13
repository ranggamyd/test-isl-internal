import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, TextInput, Image, TouchableWithoutFeedback, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import Constants from 'expo-constants';
import * as ImagePicker from 'react-native-image-picker';
import { getData, getLang } from '../utils/database';
import makeSlice from '../utils/makeSlice';
import languages from '../utils/en8li';
import { showError, showSuccess } from '../utils/Popup';


const SupportScreen = ({ navigation }) => {
    const [userData, setUserData] = useState(null);
    const [currentLang, setCurrentLang] = useState('en-US');
    const [supportBelum, setSupportBelum] = useState([]);
    const [supportSudah, setSupportSudah] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [description, setDescription] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [isImageFullscreen, setIsImageFullscreen] = useState(false);
    const [fullscreenImage, setFullscreenImage] = useState(null);
    const [listSupport, setListSupport] = useState([]);
    const [activeTab, setActiveTab] = useState(null);
    const [tabs, setTabs] = useState([]);
    const [imagePop, setImagePop] = useState(null);

    const arrayCategory = languages[currentLang].arrayCategory;
    const arrayComplaint = languages[currentLang].arrayComplaint;
    const arrayReport = languages[currentLang].arrayReport;
    const arrayRequest = languages[currentLang].arrayRequest;

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibrary({
            mediaType: 'photo',
            includeBase64: true,
        }, (response) => {
            if (response.didCancel) {
                showError('User cancelled image picker');
            } else if (response.error) {
                showError('ImagePicker Error: ' + response.error);
            } else {
                const base64Image = response.assets[0].base64;
                const resizedBase64Image = resizeBase64Image(base64Image, 0.5);
                setAttachment(resizedBase64Image);
            }
        });
    };

    const resizeBase64Image = (base64, scale) => {
        return base64; // Implementasi resize base64 image tanpa menggunakan manipulator
    };

    useEffect(() => {
        const initialize = async () => {
            try {
                const userDataString = await getData('user');
                const user = JSON.parse(userDataString);
                const lang = await getLang();
                setUserData(user);
                setCurrentLang(lang);
                setTabs([languages[lang].arrayStatus[0], languages[lang].arrayStatus[1]]);
                setActiveTab(languages[lang].arrayStatus[0]);
            } catch (error) {
                console.error("Initialization error:", error);
            }
        };

        initialize();
    }, []);

    const fetchSupport = async () => {
        try {
            const response = await fetch(`${Constants.expoConfig.env.API_URL}route`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Slice': makeSlice('Support', 'getTicket'),
                    'token': userData.token,
                },
            });

            const result = await response.json();
            if (result.status === 'success') {
                setSupportBelum(result.ticket.unprocessed || []);
                setSupportSudah(result.ticket.processed || []);
                setListSupport(result.ticket.listSupport || []);
            } else {
                console.error("Failed to fetch tickets:", result.message);
            }
        } catch (error) {
            console.error("Error fetching tickets:", error);
        }
    };

    useEffect(() => {
        if (userData) {

            fetchSupport();
        }
    }, [userData]);

    const handleSubmit = async () => {
        if (!category || !subCategory || !description) {
            showError(languages[currentLang].fillRequiredFields); // Menampilkan pesan jika ada field kosong
            return;
        }

        try {
            const data = {
                category: category,
                subcategory: subCategory,
                description: description,
                attachment: attachment || null
            };

            const response = await fetch(`${Constants.expoConfig.env.API_URL}route`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Slice': makeSlice('Support', 'createTicket'),
                    'token': userData.token, // Pastikan token tersedia
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (result) {
                // Jika sukses
                setShowForm(false);
                setCategory('');
                setSubCategory('');
                setDescription('');
                setAttachment(null);
                fetchSupport(); // Memanggil getSupport untuk mendapatkan data terbaru
            }
        } catch (err) {
        }
    };

    const getSubCategories = (category) => {
        switch (category) {
            case languages[currentLang].arrayCategory[0]:
                return arrayComplaint;
            case languages[currentLang].arrayCategory[1]:
                return arrayReport;
            case languages[currentLang].arrayCategory[2]:
                return arrayRequest;
            default:
                return [];
        }
    };

    const handleTicketAction = async (id, status, slice, message) => {
        Alert.alert(message.title, message.confirmation, [
            { 
                text: 'Ya', 
                onPress: async () => {
                    try {
                        const response = await fetch(`${Constants.expoConfig.env.API_URL}route`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-Slice': makeSlice('Support', slice),
                                'token': userData.token,
                            },
                            body: JSON.stringify({ id, ...(status && { status }) }),
                        });
                        const result = await response.json();
                        if (result) {
                            fetchSupport();
                            showSuccess(result.message);
                        }
                    } catch (error) {
                        showError(error.message);
                    }
                }
            },
            { text: 'Batal', onPress: () => {} },
        ]);
    };
    
    const renderActionButtons = (item) => {
        const actions = [];
        if (item.status === 'Diajukan') {
            if (item.user_id === userData.id) {
                actions.push({
                    label: 'Batalkan',
                    color: '#FF0000',
                    onPress: () => handleTicketAction(item.id, null, 'cancelTicket', {
                        title: 'Batalkan Tiket',
                        confirmation: 'Apakah Anda yakin ingin membatalkan tiket ini?',
                    }),
                });
            }
            if (listSupport.includes(userData.id)) {
                actions.push(
                    {
                        label: 'Proses',
                        color: '#2b8395',
                        onPress: () => handleTicketAction(item.id, 'Diproses', 'updateStatus', {
                            title: 'Proses Tiket',
                            confirmation: 'Apakah Anda yakin ingin memproses tiket ini?',
                        }),
                    },
                    {
                        label: 'Tolak',
                        color: '#FF0000',
                        onPress: () => handleTicketAction(item.id, 'Ditolak', 'updateStatus', {
                            title: 'Tolak Tiket',
                            confirmation: 'Apakah Anda yakin ingin menolak tiket ini?',
                        }),
                    }
                );
            }
        } else if (item.status === 'Diproses' || item.status === 'Proses Ulang' && listSupport.includes(item.user_id)) {
            actions.push(
                {
                    label: 'Selesai',
                    color: '#2b8395',
                    onPress: () => handleTicketAction(item.id, 'Selesai', 'updateStatus', {
                        title: 'Selesai Tiket',
                        confirmation: 'Apakah Anda yakin ingin menyelesaikan tiket ini?',
                    }),
                },
                {
                    label: 'Pending',
                    color: '#FFA500',
                    onPress: () => handleTicketAction(item.id, 'Pending', 'updateStatus', {
                        title: 'Pending Tiket',
                        confirmation: 'Apakah Anda yakin ingin mempending tiket ini?',
                    }),
                },
                {
                    label: 'Tolak',
                    color: '#FF0000',
                    onPress: () => handleTicketAction(item.id, 'Ditolak', 'updateStatus', {
                        title: 'Tolak Tiket',
                        confirmation: 'Apakah Anda yakin ingin menolak tiket ini?',
                    }),
                }
            );
        } else if (item.status === 'Pending' && listSupport.includes(item.user_id)) {
            actions.push({
                label: 'Proses',
                color: '#2b8395',
                onPress: () => handleTicketAction(item.id, 'Proses Ulang', 'updateStatus', {
                    title: 'Proses Ulang Tiket',
                    confirmation: 'Apakah Anda yakin ingin memproses ulang tiket ini?',
                }),
            });
        } else if (item.status === 'Selesai' && item.user_id === userData.id) {
            actions.push({
                label: 'Konfirmasi',
                color: '#2b8395',
                onPress: () => handleTicketAction(item.id, 'Tuntas', 'updateStatus', {
                    title: 'Konfirmasi Tiket Selesai',
                    confirmation: 'Apakah Anda yakin ingin mengkonfirmasi tiket ini?',
                }),
            });
        }
    
        return actions.map((action, index) => (
            <TouchableOpacity
                key={index}
                onPress={action.onPress}
                style={{ backgroundColor: action.color, padding: 5, borderRadius: 5, marginLeft: 5 }}
            >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>{action.label}</Text>
            </TouchableOpacity>
        ));
    };
    
    const renderTabContent = () => {
        const data = activeTab === tabs[0] ? supportBelum : supportSudah;
    
        return (
            <FlatList
                data={data}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.ticketContainer}>
                        <View style={styles.ticketHeader}>
                            <Text style={styles.ticketNumber}>{item.number}</Text>
                            {item.created_at && (
                                <Text style={styles.ticketDate}>
                                    {new Date(item.created_at).toLocaleString()}
                                </Text>
                            )}
                        </View>
                        <View style={styles.ticketBody}>
                            <View style={styles.left}>
                                {item.attachment ? (
                                    <TouchableWithoutFeedback onPress={() => {
                                        setImagePop(item.attachment);
                                        setFullscreenImage(true);
                                    }}>
                                        <Image source={{ uri: `https://apps.intilab.com/v4/public/ticket/dokumentasi/${item.attachment}` }} style={styles.attachmentImage} />
                                    </TouchableWithoutFeedback>
                                ) : (
                                    <Icon name="image-off-outline" style={styles.noImageIcon} />
                                )}
                            </View>
                            <View style={styles.right}>
                                <Text style={styles.ticketUser}>{item.user.nama_lengkap}</Text>
                                <Text style={styles.ticketCategory}>{item.category} - {item.subcategory}</Text>
                                <Text style={styles.ticketDescription}>{item.description}</Text>
                            </View>
                        </View>
                        <View style={styles.ticketFooter}>
                            <View style={styles.left}>
                                <Text style={styles.ticketStatus}>
                                    {item.status === 'Diajukan' ? languages[currentLang].waittingProcess : item.status}
                                </Text>
                            </View>
                            <View style={[styles.right, { flexDirection: 'row', justifyContent: 'flex-end' }]}>
                                {renderActionButtons(item)}
                            </View>
                        </View>
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={styles.placeholder}>{languages[currentLang].noData}</Text>
                }
            />
        );
    };
    

    return (
        <>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="arrow-back-outline" size={20} color="#4A4A4A" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{languages[currentLang].support}</Text>
                    <View style={{ width: 20 }} />
                </View>
                <View style={styles.tabs}>
                    {tabs.map((tab, index) => (
                        <TouchableOpacity
                            key={index}
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
                {renderTabContent()}
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.addButton} onPress={() => setShowForm(true)}>
                        <Icon name="add" style={styles.addIcon} />
                    </TouchableOpacity>
                </View>
            </View>
            <Modal
                visible={showForm}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowForm(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{languages[currentLang].support}</Text>
                        <View style={styles.containerList}>
                            {/* Category Picker */}
                            <Picker
                                selectedValue={category}
                                onValueChange={(value) => setCategory(value)}
                                style={styles.picker}
                            >
                                <Picker.Item label={languages[currentLang].category} value="" />
                                {languages[currentLang].arrayCategory.map((item, index) => (
                                    <Picker.Item key={index} label={item} value={item} />
                                ))}
                            </Picker>

                            {/* Sub-Category Picker */}
                            {category && (
                                <Picker
                                    selectedValue={subCategory}
                                    onValueChange={(value) => setSubCategory(value)}
                                    style={styles.picker}
                                >
                                    <Picker.Item label={languages[currentLang].subCategory} value="" />
                                    {getSubCategories(category).map((item, index) => (
                                        <Picker.Item key={index} label={item} value={item} />
                                    ))}
                                </Picker>
                            )}

                            {/* Description Input */}
                            <TextInput
                                style={styles.textInput}
                                placeholder={languages[currentLang].description}
                                multiline
                                value={description}
                                onChangeText={setDescription}
                            />

                            {/* Attachment Input */}
                            <TouchableOpacity style={styles.attachmentButton} onPress={pickImage}>
                                <Text style={styles.attachmentText}>{languages[currentLang].attachment}</Text>
                            </TouchableOpacity>
                            {attachment && (
                                <TouchableWithoutFeedback onPress={() => setIsImageFullscreen(true)}>
                                    <Image source={{ uri: `data:image/jpeg;base64,${attachment}` }} style={styles.previewImage} />
                                </TouchableWithoutFeedback>
                            )}
                        </View>
                        {/* Modal Buttons */}
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.exitButton]}
                                onPress={() => setShowForm(false)}
                            >
                                <Text style={styles.exitText}>{languages[currentLang].close}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.confirmButton]}
                                onPress={handleSubmit}
                            >
                                <Text style={styles.exitText}>{languages[currentLang].confirm}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            {isImageFullscreen && (
                <Modal
                    visible={isImageFullscreen}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setIsImageFullscreen(false)}
                >
                    <TouchableWithoutFeedback onPress={() => setIsImageFullscreen(false)}>
                        <View style={styles.fullscreenImageContainer}>
                            <Image source={{ uri: `data:image/jpeg;base64,${attachment}` }} style={styles.fullscreenImage} />
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            )}
            {fullscreenImage && (
                <Modal visible={fullscreenImage} transparent={true}>
                    <TouchableWithoutFeedback onPress={() => setFullscreenImage(false)}>
                        <View style={styles.fullscreenImageContainer}>
                            <Image source={{ uri: `https://apps.intilab.com/v4/public/ticket/dokumentasi/${imagePop}` }} style={styles.fullscreenImage} />
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            )}
        </>
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
    headerList: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        marginBottom: 10,
        marginHorizontal: 10,
        borderBottomWidth: 0.3,
        borderBottomColor: '#ccc',
    },
    itemContainer: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        marginBottom: 10,
    },
    ticketContainer: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        marginBottom: 10,
    },
    ticketHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    ticketBody: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    left: {
        flex: 1,
    },
    right: {
        flex: 2,
    },
    ticketFooter: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    ticketNumber: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    ticketDate: {
        fontSize: 12,
        color: '#6C757D',
    },
    ticketUser: {
        fontSize: 16,
        color: '#6C757D',
    },
    ticketDescription: {
        fontSize: 12,
        color: '#6C757D',
    },
    ticketStatus: {
        fontSize: 12,
        color: '#6C757D',
    },
    attachmentImage: {
        width: 100,
        height: 100,
        marginTop: 8,
    },
    noImageIcon: {
        fontSize: 24,
        color: '#6C757D',
    },

    placeholder: {
        fontSize: 14,
        color: '#6C757D',
        textAlign: 'center',
        marginTop: 20,
    },
    footer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        paddingBottom: 20,
        position: 'absolute',
        bottom: 0,
        right: 0,
    },
    addButton: {
        right: 50,
        bottom: 20,
        backgroundColor: '#2b8395',
        borderRadius: 50,
        padding: 10,
    },
    addIcon: {
        fontSize: 30,
        color: '#fff',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    picker: { height: 50, marginVertical: 8, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, backgroundColor: '#f9f9f9', borderRadius: 8 },
    textInput: { height: 100, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, padding: 8, marginTop: 8, backgroundColor: '#f9f9f9' },
    attachmentButton: { backgroundColor: '#4A90E2', padding: 12, borderRadius: 8, marginTop: 8, alignItems: 'center' },
    attachmentText: { color: '#fff', fontSize: 16 },
    previewImage: { height: 100, width: 100, marginTop: 8 },
    containerList: {
        marginHorizontal: 5,
        marginBottom: 10,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        flex: 1,
        marginHorizontal: 5,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    confirmButton: {
        backgroundColor: '#2b8395',
    },
    confirmText: {
        color: 'white',
        fontWeight: 'bold',
    },
    exitButton: {
        backgroundColor: '#d9534f',
    },
    exitText: {
        color: 'white',
        fontWeight: 'bold',
    },
    fullscreenImageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    fullscreenImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
});

export default SupportScreen;