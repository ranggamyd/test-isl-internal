import React, { useState } from 'react';
import { View, Text, StyleSheet,TextInput,TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';
import makeSlice from '../../../utils/makeSlice';
import { showSuccess, showError } from '../../../utils/Popup';
import languages from '../../../utils/en8li';

const RoomKonseling = ({item, closeModal, user}) => {
    const [currentLang, setCurrentLang] = useState('en-US');
    const [keluhan, setKeluhan] = useState(item.keluhan);
    const [solusi, setSolusi] = useState(item.solusi);
    const [resume, setResume] = useState(item.resume);
    

    const handleSubmit = async () => {
        const response = await fetch(`${Constants.expoConfig.env.API_URL}route`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Slice': makeSlice('Konsultasi', 'approveKonsultasi'),
                'token' : user.token
            },
            body: JSON.stringify({
                id: item.id,
                user_id: user.id,
                keluhan: keluhan,
                solusi: solusi,
                resume: resume,
            }),
        });
        const data = await response.json();
        if (response.status === 200) {
            showSuccess('Success', data.message);
        } else {
            showError('Error', data.message);
        }
    }
    
    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>{languages[currentLang].roomConsulting}</Text>
            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{languages[currentLang].complaint}</Text>
                <TextInput style={styles.inputText} placeholder={languages[currentLang].insertComplaint} value={keluhan} onChangeText={setKeluhan} />
                <Text style={styles.inputLabel}>{languages[currentLang].solution}</Text>
                <TextInput style={styles.inputText} placeholder={languages[currentLang].insertSolution} value={solusi} onChangeText={setSolusi} />
                <Text style={styles.inputLabel}>{languages[currentLang].resume}</Text>
                <TextInput multiline={true} numberOfLines={6} style={styles.inputText} placeholder={languages[currentLang].insertResume} value={resume} onChangeText={setResume} />
            </View>
            <TouchableOpacity style={styles.buttonSubmit} onPress={handleSubmit}>
                <Text style={styles.buttonSubmitText}>{languages[currentLang].submit}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={closeModal}>
                <Text style={styles.buttonText}>{languages[currentLang].back}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        justifyContent: 'flex-end',
        margin: 0,
        padding : 10,
        borderTopEndRadius: 10,
        borderTopStartRadius: 10,
        height: 'auto',
    },
    titleText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    inputContainer: {
        marginTop: 20,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    inputText: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#cccccc',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        color: '#000',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    buttonSubmit: {
        backgroundColor: '#2b8395',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    buttonSubmitText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default RoomKonseling;
