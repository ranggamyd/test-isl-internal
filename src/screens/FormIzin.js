import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DocumentPicker from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { getLang } from '../utils/database';
import languages from '../utils/en8li';

const FormIzin = ({ navigation }) => {
    const [jenisIzin, setJenisIzin] = useState('');
    const [formData, setFormData] = useState({});
    const [showDatePicker, setShowDatePicker] = useState({ field: '', visible: false });
    const [selectedFile, setSelectedFile] = useState(null);
    const [currentLang, setCurrentLang] = useState('en-US');

    useEffect(() => {
        const getLanguage = async () => {
            setCurrentLang(await getLang() || 'en-US');
        }
        getLanguage();
    }, []);


    const handleDateChange = (event, selectedDate, field) => {
        setShowDatePicker({ field: '', visible: false });
        if (selectedDate) {
            setFormData((prevState) => ({
                ...prevState,
                [field]: selectedDate.toISOString().split('T')[0],
            }));
        }
    };

    const handleFilePicker = async () => {
        try {
            const result = await DocumentPicker.pickSingle({
                type: [DocumentPicker.types.allFiles],
            });
            setSelectedFile(result);
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log('User canceled file picker');
            } else {
                console.error('Unknown error:', err);
            }
        }
    };

    const renderFormFields = () => {
        switch (jenisIzin) {
            case 'Kegiatan':
                return (
                    <>
                        <FormField label="Jam Mulai" type="time" fieldName="jamMulai" />
                        <FormField label="Jam Selesai" type="time" fieldName="jamSelesai" />
                        <FormField label="Tanggal" type="date" fieldName="tanggal" />
                        <FormField label="Keterangan" type="text" fieldName="keterangan" />
                        <FileUploadField />
                    </>
                );
            // Tambahkan kasus lain sesuai kebutuhan
            default:
                return <Text>Pilih jenis izin untuk melanjutkan.</Text>;
        }
    };

    const FormField = ({ label, type, fieldName }) => {
        if (type === 'date') {
            return (
                <TouchableOpacity
                    onPress={() => setShowDatePicker({ field: fieldName, visible: true })}
                >
                    <View style={styles.input}>
                        <Text>{formData[fieldName] || label}</Text>
                    </View>
                </TouchableOpacity>
            );
        }
        return (
            <View style={styles.field}>
                <Text>{label}</Text>
                <TextInput
                    style={styles.input}
                    keyboardType={type === 'number' ? 'numeric' : 'default'}
                    onChangeText={(text) =>
                        setFormData((prevState) => ({ ...prevState, [fieldName]: text }))
                    }
                    value={formData[fieldName] || ''}
                />
            </View>
        );
    };

    const FileUploadField = () => (
        <TouchableOpacity onPress={handleFilePicker}>
            <View style={styles.input}>
                <Text>{selectedFile ? selectedFile.name : 'Upload Lampiran'}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back-outline" size={20} color="#4A4A4A" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{languages[currentLang].formPermission}</Text>
                <View style={{ width: 20 }} />
            </View>
            <ScrollView style={styles.container}>
                {/* <Text style={styles.title}>Form Izin</Text> */}
                <View style={styles.field}>
                    <Text>Pilih Jenis Izin</Text>
                    <TextInput
                        style={styles.input}
                        value={jenisIzin}
                        onChangeText={setJenisIzin}
                        placeholder="Kegiatan, Datang Terlambat, dll"
                    />
                </View>
                {renderFormFields()}
                {showDatePicker.visible && (
                    <DateTimePicker
                        value={new Date()}
                        mode="date"
                        display="default"
                        onChange={(event, date) =>
                            handleDateChange(event, date, showDatePicker.field)
                        }
                    />
                )}
                <Button title="Submit" onPress={() => console.log(formData)} />
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
    field: { marginBottom: 16 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 4 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: '#fff',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },

});

export default FormIzin;
