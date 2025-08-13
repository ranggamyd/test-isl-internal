import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getData } from '../utils/database';
import languages from '../utils/en8li';

const TermConditionScreen = ({ navigation }) => {
    const [currentLang, setCurrentLang] = useState('en-US');

    useEffect(() => {
        const getLang = async () => {
            const response = await getData('language');
            setCurrentLang(response || 'en-US');
        };
        getLang();
    }, []);


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
                <Text style={styles.headerText}>{languages[currentLang].termsConditions}</Text>
                <View style={{ width: 20 }} />
            </View>
            <ScrollView>
                <View style={styles.contentContainer}>
                    <Text style={styles.contentText}>{languages[currentLang].termsAndConditions}</Text>
                </View>
            </ScrollView>
        </>
    );
};

export default TermConditionScreen;

const styles = StyleSheet.create({
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
        color: '#000',
    },
    contentContainer: {
        padding: 16,
    },
    contentText: {
        fontSize: 14,
        color: '#000',
        textAlign: 'justify',
        lineHeight: 20,
        fontFamily: 'Poppins-Regular',
        
    },
});
