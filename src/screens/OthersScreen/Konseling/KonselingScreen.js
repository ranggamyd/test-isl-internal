import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, StatusBar, Platform, KeyboardAvoidingView,ScrollView } from 'react-native';
import { showError, showSuccess, showInfo } from '../../../utils/Popup';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Constants from 'expo-constants';
import { getData,getLang } from '../../../utils/database';
import makeSlice from '../../../utils/makeSlice';
import languages from '../../../utils/en8li';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useIsFocused } from '@react-navigation/native';

const KonselingScreen = () => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [currentLang, setCurrentLang] = useState('en-US');
    const [date, setDate] = useState(new Date());
    const [formattedDate, setFormattedDate] = useState('');
    const [formattedTime, setFormattedTime] = useState('');
    const [keterangan, setketerangan] = useState('');
    const [identitas, setIdentitas] = useState(null);
    const [konselingType, setKonselingType] = useState('offline');
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [openKonselingType, setOpenKonselingType] = useState(false);
    const [openIdentitas, setOpenIdentitas] = useState(false);
    const [identitasItems, setIdentitasItems] = useState([
        {label: languages[currentLang].name, value: 'nama'},
        {label: languages[currentLang].anonim, value: 'anonim'},
    ]);
    const [konselingTypeItems, setKonselingTypeItems] = useState([
        {label: languages[currentLang].typeOnline, value: 'online'},
        {label: languages[currentLang].typeOffline, value: 'offline'},
    ]);

    const getLanguage = async () => {
        const lang = await getLang() || 'en-US';
        setCurrentLang(lang);
    };
    const onChangeDateTime = (event, selectedDate) => {
        setShow(false);
        if (selectedDate) {
            if (mode === 'date') {
                const year = selectedDate.getFullYear();
                const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0'); // Bulan dimulai dari 0
                const day = selectedDate.getDate().toString().padStart(2, '0');
                setFormattedDate(`${year}/${month}/${day}`);
            } else if (mode === 'time') {
                const hours = selectedDate.getHours().toString().padStart(2, '0');
                const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
                setFormattedTime(`${hours}:${minutes}`);         
            }
            setDate(selectedDate);
        }
    };

    const showDatepicker = () => {
        setMode('date');
        setShow(true);
    };

    const showTimepicker = () => {
        setMode('time');
        setShow(true);
    }

    const handleAjukanKonseling = async () => {
        const user = JSON.parse(await getData('user'));
        if(formattedDate === '' || formattedTime === '' || konselingType === '') {
            showInfo(languages[currentLang].dataNotComplete, languages[currentLang].dataNotCompleteMessage);
            return;
        }
        if(konselingType === 'online' && identitas === null) {
            showInfo(languages[currentLang].identityRequired, languages[currentLang].identityRequiredMessage);
            return;
        }
        const payload = {
            user_id: user.id,
            tanggal: formattedDate,
            waktu: formattedTime,
            type: konselingType,
            identitas: identitas !== '' ? identitas : null,
            ket: keterangan !== '' ? keterangan : null,
        }
        const response = await fetch(`${Constants.expoConfig.env.API_URL}route`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Slice': makeSlice('Konsultasi', 'ajukanKonsultasi'),
                'token' : user.token
            },
            body: JSON.stringify(payload)
        })
        const konseling = await response.json();
        if(response.status === 201) {
            navigation.goBack();
            showSuccess(konseling.message);
        } else {
            showError(konseling.message);
        }
    }

    useEffect(() => {
        if(isFocused) {
            setIdentitasItems([
                { label: languages[currentLang].name, value: 'nama' },
                { label: languages[currentLang].anonim, value: 'anonim' },
            ]);
            setKonselingTypeItems([
                { label: languages[currentLang].typeOnline, value: 'online' },
                { label: languages[currentLang].typeOffline, value: 'offline' },
            ]);
            getLanguage();
        }
    }, [isFocused,currentLang]);

    return (
        <>
            <StatusBar backgroundColor="#2b8395" barStyle="light-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back-outline" size={20} color="#4A4A4A" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{languages[currentLang].formConsultation}</Text>
                <View style={{ width: 20 }} />
            </View>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
                <View style={styles.container}>
                    <ScrollView keyboardShouldPersistTaps="handled" id='formItem' style={{height: '100%'}}>
                        <Text style={styles.text}>{languages[currentLang].chooseDateTime}</Text>
                        <TouchableOpacity style={styles.input} onPress={showDatepicker}>
                            <Text>{formattedDate || languages[currentLang].chooseDate}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.input} onPress={showTimepicker}>
                            <Text>{formattedTime || languages[currentLang].chooseTime}</Text>
                        </TouchableOpacity>

                        {show && (
                            <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode={mode}
                            is24Hour={true}
                            display="default"
                            onChange={onChangeDateTime}
                            />
                        )}
                        <Text style={styles.text}>{languages[currentLang].consultingType}</Text>
                        <DropDownPicker
                            dropDownDirection='TOP'
                            style={styles.input}
                            open={openKonselingType}
                            value={konselingType}
                            items={konselingTypeItems}
                            setOpen={setOpenKonselingType}
                            setValue={setKonselingType}
                            setItems={setKonselingTypeItems}
                            placeholder={languages[currentLang].chooseConsultingType}
                            testID='konselingType'
                        />
                        {konselingType === 'online' && (
                            <>
                                <Text style={styles.text}>{languages[currentLang].identity}</Text>
                                <DropDownPicker
                                    style={styles.input}
                                    open={openIdentitas}
                                    value={identitas}
                                    items={identitasItems}
                                    setOpen={setOpenIdentitas}
                                    setValue={setIdentitas}
                                    setItems={setIdentitasItems}
                                    placeholder={languages[currentLang].chooseIdentity}
                                    testID='identitas'
                                />
                            </>
                        )}

                        <Text style={styles.text}>{languages[currentLang].description} ({languages[currentLang].optional})</Text>
                        <TextInput numberOfLines={5} placeholder={languages[currentLang].descriptionPlaceholder} style={styles.input} value={keterangan} onChangeText={setketerangan} />
                    </ScrollView>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.buttonCancel} onPress={() => navigation.goBack()}>
                            <Text style={styles.buttonCancelText}>{languages[currentLang].cancel}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonSubmit} onPress={handleAjukanKonseling}>
                            <Text style={styles.buttonSubmitText}>{languages[currentLang].submit}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        paddingHorizontal: 20,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
        elevation: 2,
        justifyContent: 'space-between',
        borderBottomWidth: 1.5,
        borderBottomColor: '#ccc',
    },
    backIcon: {
        fontSize: 18,
        color: '#2b8395'
    },
    headerTitle: {
        fontSize: 18,
        color: '#4A4A4A',

    },
    headerContainer: {
        backgroundColor: '#3b5998',
        width: '100%',
        paddingVertical: 20,
        alignItems: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    buttonSubmit: {
        width: '48%',
        backgroundColor: '#2b8395',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 'auto',
        marginBottom: 20,
    },
    buttonCancel: {
        width: '48%',
        backgroundColor: '#d9534f',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    buttonCancelText: {
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold',
    },
    buttonSubmitText: {
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold',
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default KonselingScreen;