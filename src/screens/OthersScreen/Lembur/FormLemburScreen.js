import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
  Keyboard,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import Modal from "react-native-modal";
import DateTimePicker from "@react-native-community/datetimepicker";
import Constants from "expo-constants";
import DropDownPicker from "react-native-dropdown-picker";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import makeSlice from "../../../utils/makeSlice";
import { getData, getLang } from "../../../utils/database";
import { showConfirm, showError, showSuccess } from "../../../utils/Popup";
import Icon from "react-native-vector-icons/Ionicons";
import { languages } from "../../../utils";
import { ScrollView } from "react-native-gesture-handler";
const FormLemburScreen = () => {
  const [userData, setUserData] = useState();
  const [isExitModalVisible, setExitModalVisible] = useState(false);
  const [modalLemburVisible, setModalLemburVisible] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [date, setDate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState("");
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  // const [lemburData, setLemburData] = useState([]);
  const [namaArray, setNamaArray] = useState({});
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLang, setCurrentLang] = useState('en-US');
  const [dataList, setDataList] = useState([]);
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  // fetch data
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const getLanguage = async () => {
        setCurrentLang(await getLang() || 'en-US');
    }
    
    if (isFocused) {
        getLanguage();

        const originalError = console.error;
        console.error = () => {};
        return () => {
            console.error = originalError;
        };
    }
  }, [isFocused]);

  // mengambil data lembur
  // const getLemburData = async () => {
  //   try {
  //     // setIsLoading(true);
  //     const response = await fetch(`${Constants.expoConfig.env.API_URL}route`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "X-Slice": makeSlice("Lembur", "getLembur"),
  //         token: userData.token,
  //       },
  //       body: JSON.stringify({
  //         user_id: userData.id,
  //       }),
  //     });
  //     const data =await response.json();

  //     console.log(data.data);

  //     // setLemburData(data.data); 
  //     // setIsLoading(false);
  //   } catch (error) {
  //     console.log(error);
  //     showError(error);
  //   }
  // };

  // handling cancel anggota
  // const handleCancelAnggota = async (id) => {
  //   try {
  //     setModalLemburVisible(false);
  //     setIsLoading(true);
  //     const response = await fetch(`${Constants.expoConfig.env.API_URL}route`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "X-Slice": makeSlice("Lembur", "cancelAnggota"),
  //         token: userData.token,
  //       },
  //       body: JSON.stringify({
  //         user_id: userData.id,
  //         id: id,
  //       }),
  //     });
  //     const data = await response.json();
  //     if(response.status >= 400){
  //       setIsLoading(false);
  //       return showError(data.message);
  //     }
  //     getLemburData();
  //     setIsLoading(false);
  //     showSuccess(data.message);
  //   } catch (error) {
  //     showError(error);
  //   }
  // }

  const fetchData = async () => {
    const user = JSON.parse(await getData("user"));
    setUserData(user);

    try {
      const response = await fetch(`${Constants.expoConfig.env.API_URL}route`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Slice": makeSlice("UserController", "devisi"),
          token: user.token,
        },
      });

      const data = await response.json();

      const result = data.data.map((item) => ({
        value: item.id,
        label: item.nama_lengkap,
      }));

      setDataList(result);
    } catch (error) {
      showError(error);
    }
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();
    try {
      setExitModalVisible(false);
      setIsLoading(true);
      console.log({
        tanggal: formattedDate,
        jam_mulai: startTime,
        jam_pulang: endTime,
        anggota: value,
        keterangan: textInput,
        user_id: userData.id,
      });
      const response = await fetch(`${Constants.expoConfig.env.API_URL}route`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Slice": makeSlice("Lembur", "formLembur"),
          "token": userData.token,
        },
        body: JSON.stringify({
          tanggal: formattedDate,
          jam_mulai: startTime,
          jam_pulang: endTime,
          anggota: value,
          keterangan: textInput,
          user_id: userData.id,
        }),
      });
      const data = await response.json();
      if(response.status >= 400){
        console.log('error : ' + data.message);
        Alert.alert(
          "Error",
          data.message,
          [
            {
              text: 'Ok',
              // onPress: setIsLoading(false), // Aksi ketika Yes ditekan
            },
          ],
        );
        return setIsLoading(false);
      }
      console.log(data);
      setIsLoading(false);
      resetForm();
      Alert.alert(
        "Success",
        data.message,
        [
          {
            text: 'Ok',
            // onPress: setIsLoading(false), // Aksi ketika Yes ditekan
          },
        ],
      );
    } catch (error) {
      setIsLoading(false);
      console.log("error : " + error);
      return Alert.alert(
        "Error",
        error,
        [
          {
            text: 'Ok',
            // onPress: setIsLoading(false), // Aksi ketika Yes ditekan
          },
        ],
      );
    } 
  };

  const resetForm = () => {
    setValue([]);
    setDate(new Date());
    setStartTime(null);
    setEndTime(null);
    setTextInput("");
  }

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0"); // Bulan dimulai dari 0
      const day = selectedDate.getDate().toString().padStart(2, "0");
      setFormattedDate(`${year}-${month}-${day}`);
    }
    setDate(selectedDate);
  };

  const handleStartTimeChange = (event, selectedTime) => {
    setShowStartTimePicker(false);
    setShowEndTimePicker(false);

    const date = new Date(selectedTime);

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // Menformat waktu dalam format HH:mm:ss
    const time = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    setStartTime(time);
  };

  const handleEndTimeChange = (event, selectedTime) => {
    setShowStartTimePicker(false);
    setShowEndTimePicker(false);

    const date = new Date(selectedTime);

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // Menformat waktu dalam format HH:mm:ss
    const time = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    setEndTime(time);
  };

  return (
    <View style={styles.containerHeader}>
        {isLoading ? (
          <View style={styles.overlay}>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#000" />
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          </View>
        ) : null}
        {/* Header */}
        <View style={styles.headerHeader}>
          <Text style={styles.headerTextHeader}>{languages[currentLang].formOvertime}</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back-outline" size={20} color="#4A4A4A" />
          </TouchableOpacity>
        </View>

      <KeyboardAvoidingView style={styles.contentHeader}>
        <ScrollView style={styles.tabContainer}>      
          <View style={styles.modalContent}>
            <View style={styles.inputContainer}>
              {/* Date Picker */}
              <View>
                <Text style={styles.label}>{languages[currentLang].pilihTanggal} :</Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => {
                    setShowDatePicker(true);
                  }}
                >
                  <Text style={styles.dateText}>{date.toDateString()}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                  />
                )}
              </View>

              {/* Select Input */}
              <View style={styles.select}>
                <Text style={styles.label}>{languages[currentLang].pilihAnggota} :</Text>
                <DropDownPicker
                  open={open}
                  value={value}
                  items={dataList}
                  multiple={true}
                  min={1}
                  setOpen={setOpen}
                  setValue={setValue}
                  style={{borderWidth: 1, borderColor: '#ccc'}}
                  // setItems={setItems}
                />
              </View>

              {/* Time Picker */}
              <View style={styles.timeContainer}>
                <Text style={styles.label}>{languages[currentLang].mulaiWaktu} - {languages[currentLang].selesaiWaktu} :</Text>
                <View style={styles.timePickerContainer}>
                  <TouchableOpacity
                    style={styles.timeButton}
                    onPress={() => {
                      setShowStartTimePicker(true);
                    }}
                  >
                    <Text style={styles.dateText}>
                      {startTime ? startTime : "hh:mm"}
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.separator}>-</Text>
                  <TouchableOpacity
                    style={styles.timeButton}
                    onPress={() => {
                      setShowEndTimePicker(true);
                    }}
                  >
                    <Text style={styles.dateText}>
                      {endTime ? endTime : "hh:mm"}
                    </Text>
                  </TouchableOpacity>
                </View>
                {showStartTimePicker && (
                  <DateTimePicker
                    value={date}
                    mode="time"
                    display="default"
                    onChange={handleStartTimeChange}
                  />
                )}
                {showEndTimePicker && (
                  <DateTimePicker
                    value={date}
                    mode="time"
                    display="default"
                    onChange={handleEndTimeChange}
                  />
                )}
              </View>

              <View style={styles.input}>
                <Text style={styles.labelKet}>{languages[currentLang].keterangan} :</Text>
                <TextInput
                  style={styles.input}
                  placeholder={languages[currentLang].masukkanKeterangan}
                  value={textInput}
                  multiline={true}
                  onChangeText={(text) => setTextInput(text)}
                />
              </View>
            </View>
          </View>
          
        </ScrollView>   
        <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setValue([]);
                    setDate(new Date());
                    setStartTime(null);
                    setEndTime(null);
                    setTextInput("");
                    setExitModalVisible(false);
                    navigation.goBack();
                  }}
                >
                  <Text style={styles.cancelText}>{languages[currentLang].cancel}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.exitButton]}
                  onPress={handleSubmit}
                >
                  <Text style={styles.exitText}>{languages[currentLang].save}</Text>
                </TouchableOpacity>
              </View>   
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 16,
  },
  row: {
    flexDirection: "row",
  },
  labelRow: {
    width: "25%",
  },
  colon: {
    marginRight: 5,
  },
  valueRowBold: {
    fontWeight: "bold",
  },
  valueRow: {
    width: 210,
  },

  timeContainer: {
  },
  timePickerContainer: {
    flexDirection: "row", // Menyusun elemen dalam satu baris
    alignItems: "center", // Menyelaraskan elemen secara vertikal
    gap: 10,
  },
  separator: {
    fontSize: 20,
    color: "#333",
    // fontWeight: "bold",
  },
  arrowDetail: {
    position: "absolute",
    right: 0,
    top: "45%",
    transform: [{ translateY: -15 }],
    width: 90,
    alignItems: "flex-end",
  },
  detailLemburContainer: {
    marginTop: 10,
  },
  modalTitleDetail: {
    fontSize: 18,
    fontWeight: "bold",
  
  },
  modalHeaderDetail: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLemburValue: {
    fontSize: 16,
  },
  detailLemburItem: {
    borderColor: "#ccc",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  // modal style
  modalContainer: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 15,
    height: "100%",
    // borderWidth: 2,
    // borderColor: "black",
    // borderTopRightRadius: 10,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalMessage: {
    fontSize: 16,
    color: "#555",
  },
  modalButtons: {
    marginTop: "auto",
    flexDirection: "row",
    paddingBottom: 15,
    paddingHorizontal: 10,
    justifyContent: "space-between",
    backgroundColor: "#fff"
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
    // borderWidth: 1,
    // borderColor: "#ccc",
  },
  exitButton: {
    backgroundColor: "#2b8395",
  },
  cancelText: {
    color: "#555",
    fontWeight: "bold",
  },
  exitText: {
    color: "white",
    fontWeight: "bold",
  },
  inputContainer: {
    // borderWidth: 1, 
    // borderColor: "#ccc",
    height: "100%",
    gap: 15,
    // marginBottom: 30,
    // backgroundColor: "white",
    // borderRadius: 10,
    // paddingHorizontal: 20,
  },
  // end modal
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  labelKet: {
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  select: {
    // marginBottom: 20,
  },
  option: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
  },
  selectedOption: {
    backgroundColor: "#d0e7ff",
  },
  optionText: {
    fontSize: 16,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
  },
  timeButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    flex: 1,
  },
  dateText: {
    fontSize: 16,
  },
  tabContainer: {
    // flex: 1,
    height: "100%",
    maxHeight: "100%",
    backgroundColor: "white",
    // borderWidth: 2,
    // borderColor: "red",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: "#ccc",
  },
  activeTabButton: {
    borderBottomColor: "#2b8395",
    backgroundColor: "#2b8395",
    borderRadius: 5,
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "bold",
  },
  tabContent: {
    flex: 1,
  },
  placeholderText: {
    textAlign: "center",
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  card: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    padding: 16,
    borderRadius: 8,
    marginVertical: 5,
  },
  addButton: {
    backgroundColor: "#2b8395",
    color: "white",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    padding: 16,
    borderRadius: 100,
    position: "absolute",
    right: 20,
    bottom: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingBottom: 8,
    alignItems: "center",
  },
  cardDate: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cardStatus: {
    fontSize: 14,
    padding: 4,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  approved: {
    backgroundColor: "#D9F8D9",
    color: "#4CAF50",
  },
  pending: {
    backgroundColor: "#FDF4D9",
    color: "#FFC107",
  },
  rejected: {
    backgroundColor: "#ffc2c2",
    color: "#ff6e6e",
  },
  cardDetails: {
    marginTop: 8,
    gap: 2,
  },

  containerHeader: {
    flex: 1,
  },
  headerHeader: {
    position: 'relative',
    height: 60,
    backgroundColor:  'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: "50%",
    transform: [{ translateY: -10 }],
  },
  addBtnNew: {
    position: 'absolute',
    right: 15,
    padding: 1,
    paddingLeft: 3,
    paddingTop: 3,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 10,
  },
  headerTextHeader: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  contentHeader: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    // backgroundColor:'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  loadingContainer: {
    backgroundColor: '#fff',
    padding: 20,
    paddingHorizontal: 35,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
  },
  loadingText: {
    color: '#000',
    marginTop: 10,
    fontSize: 16,
  },
});

export default FormLemburScreen;
