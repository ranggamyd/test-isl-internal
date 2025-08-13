import AsyncStorage from '@react-native-async-storage/async-storage';

// Inisialisasi database (dalam hal ini, hanya untuk konsistensi dengan versi SQLite)
export const initDatabase = async () => {
    try {
        await AsyncStorage.setItem('databaseInitialized', 'true');
        return true;
    } catch (error) {
        console.error('Error initializing database:', error);
        return false;
    }
};

// Menyimpan data
export const saveData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error('Error saving data:', error);
        return false;
    }
};

// Mengambil data
export const getData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        return value != null ? JSON.parse(value) : null;
    } catch (error) {
        console.error('Error getting data:', error);
        return null;
    }
};

// Menghapus data
export const deleteData = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Error deleting data:', error);
        return false;
    }
};

// Mengambil semua kunci
export const getAllKeys = async () => {
    try {
        return await AsyncStorage.getAllKeys();
    } catch (error) {
        console.error('Error getting all keys:', error);
        return [];
    }
};

// Menghapus semua data
export const clearAllData = async () => {
    try {
        await AsyncStorage.clear();
        return true;
    } catch (error) {
        console.error('Error clearing all data:', error);
        return false;
    }
};

export const getLang = async () => {
    try {
        const value = await AsyncStorage.getItem('language');
        return value != null ? JSON.parse(value) : null;
    } catch (error) {
        console.error('Error getting language:', error);
        return null;
    }
}
