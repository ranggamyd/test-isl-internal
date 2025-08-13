import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Constants from 'expo-constants';
import makeSlice from '../../../utils/makeSlice';
import { showConfirm, showSuccess, showError } from '../../../utils/Popup';
import languages from '../../../utils/en8li';
import { getLang } from '../../../utils/database';
import DropDownPicker from 'react-native-dropdown-picker';
import { useIsFocused } from '@react-navigation/native';

const FormAjukanBarang = ({item, closeModal, user, reloadData}) => {
    const isFocused = useIsFocused();
    const [currentLang, setCurrentLang] = useState('en-US');
    const [barangID, setBarangID] = useState(0);
    const [barangIDIndex, setBarangIDIndex] = useState(7000);
    const [barangItems, setBarangItems] = useState([]);
    const [keterangan, setKeterangan] = useState('');
    const [formItem, setFormItem] = useState({
        [barangID]: {
            index: barangIDIndex,
            barang: 0,
            jumlah: 0,
            isOpen: false,
        },
    });
    
    const createKeyValueBarang = () => {
        const barangItems = item.map(item => ({
            value: item.id,
            label: item.nama_barang,
        }));
        
        setBarangItems(barangItems);
    }

    const updateFormItem = (barangID, updates) => {
        setFormItem((prevItems) => ({
            ...prevItems,
            [barangID]: {
                ...prevItems[barangID],
                ...updates,
            },
        }));
    };
    

    const templateFormItem = () => {
        const newBarangID = barangID + 1;
        const newIndex = barangIDIndex + 1000;
        setBarangID(newBarangID);
        setBarangIDIndex(newIndex);
    
        return {
            [newBarangID]: {
                index: newIndex,
                barang: 0,
                jumlah: 0,
                isOpen: false,
            },
        };
    };
    

    const generateFormItem = () => {
        setFormItem((prevItems) => ({
            ...prevItems,
            ...templateFormItem(),
        }));
        
    };

    const onChangeBarang = (value, barangID) => {
        updateFormItem(barangID, {barang: value});
    };    
    const onChangeJumlah = (value, index) => {
        const jumlah = parseInt(value);
        updateFormItem(index, {jumlah: jumlah});
    };

    const getLanguage = async () => {
        setCurrentLang(await getLang() || 'en-US');
    }

    const setOpenBarang = (key) => {
        updateFormItem(key, {isOpen: true});
    };
    
    const setCloseBarang = (key) => {
        updateFormItem(key, {isOpen: false});
    };
    
    const isOpenBarang = (key) => {
        return formItem[key]?.isOpen || false;
    };

    const handleSubmitRequest = async () => {
        const formItemArray = Object.values(formItem).map(item => ({
            id: item.barang,
            jumlah: item.jumlah,
        }));

        try {
            const payload = {
                user_id: user.id,
                barang: formItemArray,
                keterangan: keterangan,
            }
    
            const response = await fetch(`${Constants.expoConfig.env.API_URL}route`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Slice': makeSlice('AjukanBarang', 'savePengajuanBarang'),
                    'token' : user.token
                },
                body: JSON.stringify(payload),
            });
    
            const data = await response.json();
            if (response.status !== 200 && response.status !== 201) {
                showError(data.message);
                return;
            }
            showSuccess(data.message);
            closeModal();
            reloadData();
        } catch (error) {
            showError(error.message)
        }
    }

    useEffect(() => {
        if(isFocused) {
            createKeyValueBarang();
            getLanguage();
        }
    }, [isFocused,item]);

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
            <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>{languages[currentLang].formTakingAtk}</Text>
                {Object.keys(formItem).length > 1 ? (
                    <ScrollView style={{ maxHeight: 300 }} keyboardShouldPersistTaps="handled" id='formItem'>
                        {Object.keys(formItem).map((key) => (
                            <View key={key} style={styles.formItem}> 
                                <View style={styles.modalContent}>
                                <Text style={styles.modalLabel}>{languages[currentLang].itemName}</Text>
                                    <View style={styles.modalDropdown}>
                                    <DropDownPicker
                                            placeholder={languages[currentLang].chooseItem}
                                            key={formItem[key].barangID}
                                            items={barangItems}
                                            onBackPressed={true}
                                            zIndex={formItem[key].index}
                                            zIndexOffset={formItem.length > 1 ? 1000 : 0}
                                            listMode="MODAL"
                                            searchable={true}
                                            searchPlaceholder={languages[currentLang].chooseItem}
                                            setItems={setBarangItems}
                                            value={parseInt(formItem[key]?.barang)}
                                            onSelectItem={(selectedItem) => onChangeBarang(selectedItem.value, key)}
                                            open={isOpenBarang(key)}
                                            setOpen={() => setOpenBarang(key)}
                                            onClose={() => setCloseBarang(key)}
                                        />
                                    </View>
                                </View>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalLabel}>{languages[currentLang].quantity}</Text>
                                <View style={styles.modalAmountInput}>
                                    <TextInput style={styles.modalInputText} value={formItem[key].jumlah} onChangeText={(text) => onChangeJumlah(text, key)} keyboardType="numeric" placeholder={languages[currentLang].quantityPlaceholder} />
                                </View>
                            </View>
                            </View>
                        ))}
                    </ScrollView>
                ) : (
                    <View id='formItem'>
                        {Object.keys(formItem).map((key) => (
                            <View key={key} style={styles.formItem}> 
                                <View style={styles.modalContent}>
                                <Text style={styles.modalLabel}>{languages[currentLang].itemName}</Text>
                                    <View style={styles.modalDropdown}>
                                    <DropDownPicker
                                        placeholder={languages[currentLang].chooseItem}
                                        key={formItem[key].barangID}
                                        items={barangItems}
                                        closeOnBackPressed={true}
                                        zIndex={formItem[key].index}
                                        zIndexOffset={formItem.length > 1 ? 1000 : 0}
                                        listMode="MODAL"
                                        searchable={true}
                                        searchPlaceholder={languages[currentLang].searchItem}
                                        setItems={setBarangItems}
                                        value={parseInt(formItem[key]?.barang)}
                                        onSelectItem={(selectedItem) => onChangeBarang(selectedItem.value, key)}
                                        open={isOpenBarang(key)}
                                        setOpen={() => setOpenBarang(key)}
                                        onClose={() => setCloseBarang(key)}
                                    />
                                    </View>
                                </View>
                            <View style={styles.modalContent}>
                                <View style={styles.modalContent}>
                                    <Text style={styles.modalLabel}>{languages[currentLang].quantity}</Text>
                                    <View style={styles.modalAmountInput}>
                                        <TextInput
                                            style={styles.modalInputText}
                                            value={formItem[key].jumlah}
                                            onChangeText={(text) => {
                                                onChangeJumlah(text, key);
                                            }}
                                            keyboardType="numeric"
                                            placeholder={languages[currentLang].quantityPlaceholder}
                                        />
                                    </View>
                                </View>
                            </View>
                            </View>
                        ))}
                    </View>
                )}
                <TouchableOpacity style={styles.modalButtonAdd} onPress={generateFormItem}>
                    <Text style={styles.modalButtonAddText}>{languages[currentLang].addItem}</Text>
                </TouchableOpacity>
                <View>
                    <Text style={styles.modalLabel}>{languages[currentLang].description}</Text>
                    <View style={styles.modalInput}>
                        <TextInput numberOfLines={5} style={styles.modalInputText} value={keterangan} onChangeText={setKeterangan} placeholder={languages[currentLang].descriptionPlaceholder} />
                    </View>
                </View>
                <View style={styles.modalButtonContainer}>
                    <TouchableOpacity style={styles.modalButtonBack} onPress={closeModal}>
                        <Text style={styles.modalButtonBackText}>{languages[currentLang].cancel}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalButtonSubmit} onPress={handleSubmitRequest}>
                        <Text style={styles.modalButtonSubmitText}>{languages[currentLang].submit}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: '#fff',
        justifyContent: 'flex-end',
        margin: 0,
        padding : 10,
        width: '100%',
        position: 'absolute',
        bottom: 0,
        borderTopEndRadius: 10,
        borderTopStartRadius: 10,
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
    },
    modalContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
    },
    modalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
    },
    modalDropdown: {
        borderColor: '#ccc',
    },
    modalAmountInput: {
        // width: '50%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
    },
    modalInputText: {
        fontSize: 16,
    },
    modalButtonAdd: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 5,
    },
    modalButtonAddText: {
        color: '#555',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    modalButtonContainer: {
        marginTop: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    modalButtonBack: {
        width: '48%',
        backgroundColor: '#d9534f',
        padding: 10,
        borderRadius: 5,
    },
    modalButtonBackText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    modalButtonSubmit: {
        backgroundColor: '#2b8395',
        padding: 10,
        borderRadius: 5,
        width: '48%',
    },
    modalButtonSubmitText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    formItem: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        width: '100%',
        marginBottom: 10,
    },
    formItemText: {
        fontSize: 16,
    },
});

export default FormAjukanBarang;
