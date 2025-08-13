import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { showError, showSuccess, showInfo } from '../../../utils/Popup';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Constants from 'expo-constants';
import { getData } from '../../../utils/database';
import makeSlice from '../../../utils/makeSlice';
import languages from '../../../utils/en8li';

const FormAjukanKonseling = ({closeModal}) => {
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
        {label: 'Nama', value: 'nama'},
        {label: 'Anonim', value: 'anonim'},
    ]);
    const [konselingTypeItems, setKonselingTypeItems] = useState([
        {label: 'Online', value: 'online'},
        {label: 'Offline', value: 'offline'},
    ]);

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
            closeModal();
            showSuccess(konseling.message);
        } else {
            showError(konseling.message);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>{languages[currentLang].dateTime}</Text>
            {/* Input Tanggal */}
            <TouchableOpacity style={styles.input} onPress={showDatepicker}>
                <Text>{formattedDate || languages[currentLang].chooseDate}</Text>
            </TouchableOpacity>

            {/* Input Waktu */}
            <TouchableOpacity style={styles.input} onPress={showTimepicker}>
                <Text>{formattedTime || languages[currentLang].chooseTime}</Text>
            </TouchableOpacity>

            {/* DateTimePicker */}
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

            {/* Input Keterangan */}
            <Text style={styles.text}>{languages[currentLang].description} ({languages[currentLang].optional})</Text>
            <TextInput placeholder={languages[currentLang].enterDescription} style={styles.input} value={keterangan} onChangeText={setketerangan} />
            <TouchableOpacity style={styles.buttonSubmit} onPress={handleAjukanKonseling}>
                <Text style={styles.buttonText}>{languages[currentLang].submit}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonCancel} onPress={closeModal}>
                <Text style={styles.buttonText}>{languages[currentLang].cancel}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#fff',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    buttonSubmit: {
        backgroundColor: '#2b8395',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    buttonCancel: {
        backgroundColor: '#d62d2d',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    buttonText: {
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

export default FormAjukanKonseling;
