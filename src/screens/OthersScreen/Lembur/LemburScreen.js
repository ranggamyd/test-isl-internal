import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Button
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getData } from '../../../utils/database';
import makeSlice from '../../../utils/makeSlice';

const LemburScreen = () => {
//   const [searchQuery, setSearchQuery] = useState('');
  const [lemburData, setLemburData] = useState([
    { id: '1', jumlah: 3, tanggal: "2023-01-01", waktu_mulai: "08:00", waktu_selesai: "12:00", ket: "Lorem ipsum dolor sit amet", status: 0, department: "HR" },
    { id: '2', jumlah: 3, tanggal: "2023-01-01", waktu_mulai: "08:00", waktu_selesai: "12:00", ket: "Lorem ipsum dolor sit amet", status: 1, department: "Finance" },
    { id: '3', jumlah: 3, tanggal: "2023-01-01", waktu_mulai: "08:00", waktu_selesai: "12:00", ket: "Lorem ipsum dolor sit amet", status: 0, department: "IT" },
    { id: '4', jumlah: 3, tanggal: "2023-01-01", waktu_mulai: "08:00", waktu_selesai: "12:00", ket: "Lorem ipsum dolor sit amet", status: 2, department: "Marketing" },
    { id: '5', jumlah: 3, tanggal: "2023-01-01", waktu_mulai: "08:00", waktu_selesai: "12:00", ket: "Lorem ipsum dolor sit amet", status: 0, department: "Operations" },
    { id: '6', jumlah: 3, tanggal: "2023-01-01", waktu_mulai: "08:00", waktu_selesai: "12:00", ket: "Lorem ipsum dolor sit amet", status: 1, department: "Sales" },
  ]);

  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    console.log('Input Value:', inputValue); // Proses data input di sini
    setModalVisible(false); // Tutup modal
    setInputValue(''); // Reset input
  };

  const fetchDataLembur = async () => {
      const user = JSON.parse(await getData('user'));
      // console.log(user.id);
      // try {
      //     const response = await fetch(`${Constants.expoConfig.env.API_URL}route`, {
      //         method: 'POST',
      //         headers: {
      //             'Content-Type': 'application/json',
      //             'X-Slice': makeSlice('Lembur', 'getLembur'),
      //             'token' : user.token
      //         },
      //         body: JSON.stringify({
      //             tgl: new Date(date).toISOString().split('T')[0],
      //             user_id: user.id
      //         })
      //     });

      //     const data = await response.json();
      //     setAttendance(data.data);
      // } catch (error) {
      // }
  }

  useEffect(() => {
    fetchDataLembur();
  }, [])

  const renderItem = ({ item }) => (
      <View style={styles.itemContainer}>
        <View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{fontSize: 16, fontWeight: 'bold'}}>Form Pengajuan Lembur</Text>
                <Text style={item.status === 0 ? styles.statusDraft : item.status === 1 ? styles.statusApproved : styles.statusRejected}>{item.status === 0 ? 'Draft' : item.status === 1 ? 'Approved' : 'Rejected'}</Text>
            </View>
            <View style={styles.separator} />
        </View>
        <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-between', gap: 3}}>
            <View style={{flexDirection: 'row'}}>
                <Text style={{width: 85}}>Jumlah</Text>
                <Text>:  </Text>
                <Text style={{fontWeight: 'bold'}}>{item.jumlah}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
                <Text style={{width: 85}}>Department</Text>
                <Text>:  </Text>
                <Text>{item.department}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
                <Text style={{width: 85}}>Tanggal</Text>
                <Text>:  {item.tanggal}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
                <Text style={{width: 85}}>Waktu</Text>
                <Text>:  {item.waktu_mulai} - {item.waktu_selesai} WIB</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
                <Text style={{width: 85}}>Keterangan</Text>
                <Text>:  {item.ket}</Text>
            </View>
        </View>
      </View>
  );

  return (
    <View style={{flex: 1}}>
      <View style={styles.headerContainer}>
        <Icon name="arrow-back-outline" size={24} color="#2b8395" style={{marginHorizontal: 15}} onPress={() => navigation.goBack()} />
        <Text style={styles.header}>Pengajuan Lembur</Text>
      </View>
      {/* <View style={styles.searchContainer}>
        <Icon name="search-outline" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View> */}
      <View style={styles.container}>
        <FlatList
          data={lemburData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      </View>
      
      {/* Button plus */}
      <View style={styles.containerBtn}>
        <TouchableOpacity style={styles.floatingButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.plusText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Pengajuan Lembur</Text>
            <View style={{height: 1, backgroundColor: '#ccc', marginVertical: 10}} />
            <View style={{marginTop: 5, marginBottom: 20, flexDirection: 'column', gap: 10}}>
              <View>
                <Text style={{marginBottom: 7}}>Tanggal</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Masukkan Tanggal"
                  value={inputValue}
                  onChangeText={setInputValue}
                />
              </View>
              <View>
                <Text style={{marginBottom: 7}}>Waktu</Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                  <TextInput
                    style={{borderWidth: 1,
                      borderColor: '#ccc',
                      borderRadius: 5,
                      padding: 10,
                      marginBottom: 0,
                      width: '48%'}}
                    placeholder="Jam Mulai"
                    value={inputValue}
                    onChangeText={setInputValue}
                  />
                  <TextInput
                    style={{borderWidth: 1,
                      borderColor: '#ccc',
                      borderRadius: 5,
                      padding: 10,
                      marginBottom: 0,
                      width: '48%'}}
                    placeholder="Jam Selesai"
                    value={inputValue}
                    onChangeText={setInputValue}
                  />
                </View>
              </View>
              <View>
                <Text style={{marginBottom: 7}}>Anggota</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Pilih Anggota yang Lembur"
                  value={inputValue}
                  onChangeText={setInputValue}
                />
              </View>
              <View>
                <Text style={{marginBottom: 7}}>Keterangan</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Masukkan Keterangan"
                  value={inputValue}
                  onChangeText={setInputValue}
                />
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <Button title="Batal" onPress={() => setModalVisible(false)} />
              <Button title="Simpan" onPress={handleAdd} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9F9F9',
    padding: 16,
    marginBottom: 30,
  },
  containerBtn: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    // borderColor: '#2b8395',
    // borderWidth: 2,
    paddingVertical: 15,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 8,
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
    
  },
  icon: {
    marginRight: 16,
  },
  itemContainer: {
    flexDirection: 'column',
    alignItems: 'start',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    color: '#555',
  },
   separator: {
    height: 1, // Ketebalan garis
    backgroundColor: '#ccc', // Warna garis
    marginVertical: 7, // Jarak atas dan bawah
  },
  statusDraft: {
    color: '#FF9632',
    textAlign: 'right',
    fontSize: 11,
    fontWeight: 'bold'
  },
  statusApproved: {
    color: 'green',
    textAlign: 'right',
    fontSize: 11,
    fontWeight: 'bold'
  },
  statusRejected: {
    color: 'red',
    textAlign: 'right',
    fontSize: 11,
    fontWeight: 'bold',
  },
  floatingButton: {
    position: 'absolute', // Posisi absolut
    bottom: 95, // Jarak dari bawah layar
    right: 20, // Jarak dari kanan layar
    backgroundColor: '#2b8395', // Warna latar belakang tombol
    width: 60, // Lebar tombol
    height: 60, // Tinggi tombol
    borderRadius: 30, // Membuat tombol menjadi lingkaran
    justifyContent: 'center', // Memusatkan konten secara vertikal
    alignItems: 'center', // Memusatkan konten secara horizontal
    elevation: 5, // Memberikan efek bayangan pada Android
    shadowColor: '#000', // Warna bayangan pada iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  plusText: {
    color: 'white', // Warna teks
    fontSize: 30, // Ukuran teks
    fontWeight: 'bold', // Ketebalan teks
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Background transparan
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 0,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default LemburScreen;
