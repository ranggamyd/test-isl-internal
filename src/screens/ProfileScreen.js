import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	Image,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
	Modal,
	Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { getData, deleteData, saveData, getLang } from "../utils/database";
import { useIsFocused } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { launchImageLibrary } from "react-native-image-picker";
import makeSlice from "../utils/makeSlice";
import Constants from "expo-constants";
import { showError } from "../utils/Popup";
import { Picker } from "@react-native-picker/picker";
import languages from "../utils/en8li";

const ProfileScreen = () => {
	const isFocused = useIsFocused();
	const [user, setUser] = useState(null);
	const navigation = useNavigation();
	const [modalLogoutVisible, setModalLogoutVisible] = useState(false);
	const [currentLang, setCurrentLang] = useState("en-US");
	const [modalLanguageVisible, setModalLanguageVisible] = useState(false);

	useEffect(() => {
		const getUser = async () => {
			const user = await getData("user");
			setUser(JSON.parse(user));
		};
		const getLanguage = async () => {
			setCurrentLang((await getLang()) || "en-US");
		};
		getUser();
		getLanguage();
	}, [isFocused]);

	const changeLanguage = async (lang) => {
		setCurrentLang(lang);
		await saveData("language", lang);
	};

	const handleChangePicture = async () => {
		Alert.alert(
			languages[currentLang].atention,
			languages[currentLang].atentionMessageChangePicture,
			[
				{
					text: languages[currentLang].cancel,
					style: "cancel",
				},
				{
					text: languages[currentLang].confirm,
					onPress: async () => {
						const options = {
							mediaType: "photo",
							quality: 1,
							selectionLimit: 1,
						};
						try {
							const response = await launchImageLibrary(options);
							if (response.didCancel) {
							} else if (response.errorMessage) {
								console.log(
									"Kesalahan Pemilih Gambar: ",
									response.errorMessage
								);
							} else if (
								response.assets &&
								response.assets.length > 0
							) {
								const selectedImage = response.assets[0];
								await uploadImage(selectedImage.uri);
							}
						} catch (error) {
							showError("Kesalahan saat memilih gambar: ", error);
						}
					},
				},
			]
		);
	};

	const uploadImage = async (imageUri) => {
		const formData = new FormData();
		formData.append("file", {
			uri: imageUri,
			name: "profile_picture.jpg",
			type: "image/jpeg",
		});

		try {
			const response = await fetch(
				`${Constants.expoConfig.env.API_URL}route`,
				{
					method: "POST",
					headers: {
						"Content-Type": "multipart/form-data",
						"X-Slice": makeSlice("Profile", "upload"),
						token: JSON.parse(await getData("user")).token,
					},
					body: formData,
				}
			);
			const result = await response.json();

			// Update user state dengan data gambar baru
			const updatedUser = {
				...user,
				image: result.image,
			};

			setUser(updatedUser);

			await saveData("user", JSON.stringify(updatedUser));
		} catch (error) {
			showError("Gagal mengupload foto:", error);
		}
	};

	return (
		<>
			<ScrollView contentContainerStyle={styles.container}>
				{/* Profile Section */}
				<View style={styles.profileSection}>
					<View style={styles.profileImageContainer}>
						<Image
							source={{
								uri: `https://apps.intilab.com/utc/apps/public/dokumentasi/karyawan/${
									user?.image || "no_image.jpg"
								}`,
							}}
							style={styles.profileImage}
						/>
						<TouchableOpacity
							style={styles.cameraIconContainer}
							onPress={handleChangePicture}
						>
							<Icon
								name="camera-outline"
								size={16}
								color="#fff"
							/>
						</TouchableOpacity>
					</View>
					<Text style={styles.name}>{user?.nama_lengkap}</Text>
					<Text style={styles.role}>{user?.jabatan}</Text>
				</View>
				<View style={styles.editProfileContainer}>
					<TouchableOpacity style={styles.editProfileButton}>
						<Text style={styles.editProfileText}>
							{languages[currentLang].editProfile}
						</Text>
					</TouchableOpacity>
				</View>

				{/* Options Section */}
				<View style={styles.optionsSection}>
					<OptionItem
						icon="person-outline"
						label={languages[currentLang].myProfile}
						onPress={() => navigation.navigate("MyProfile")}
					/>
					<OptionItem
						icon="lock-closed-outline"
						label={languages[currentLang].changePassword}
						onPress={() => navigation.navigate("ChangePassword")}
					/>
					<OptionItem
						icon="document-text-outline"
						label={languages[currentLang].termsConditions}
						onPress={() => navigation.navigate("TermCondition")}
					/>
					<OptionItem
						icon="globe-outline"
						label={languages[currentLang].changeLanguage}
						onPress={() => setModalLanguageVisible(true)}
					/>
					<OptionItem
						icon="log-out-outline"
						label={languages[currentLang].logout}
						onPress={() => setModalLogoutVisible(true)}
						borderBottom={false}
					/>
				</View>
			</ScrollView>
			<ModalLogout
				visible={modalLogoutVisible}
				onClose={() => setModalLogoutVisible(false)}
				onPress={async () => {
					await deleteData("user");
					await deleteData("deviceId");
					navigation.replace("Login");
				}}
				currentLang={currentLang}
			/>
			<Modal
				transparent={true}
				animationType="slide"
				visible={modalLanguageVisible}
				onRequestClose={() => setModalLanguageVisible(false)}
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>
							{languages[currentLang].changeLanguage}
						</Text>
						<Picker
							selectedValue={currentLang}
							onValueChange={(itemValue) =>
								changeLanguage(itemValue)
							}
						>
							<Picker.Item label="English" value="en-US" />
							<Picker.Item label="Indonesia" value="id-ID" />
							<Picker.Item label="Mandarin" value="zh-CN" />
						</Picker>
						<View style={styles.modalButtons}>
							<TouchableOpacity
								style={[styles.modalButton, styles.exitButton]}
								onPress={() => setModalLanguageVisible(false)}
							>
								<Text style={styles.exitText}>
									{languages[currentLang].close}
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		</>
	);
};

// Option Item Component
const OptionItem = ({ icon, label, onPress, borderBottom = true }) => {
	return (
		<TouchableOpacity
			style={[
				styles.optionItem,
				borderBottom
					? { borderBottomWidth: 1, borderBottomColor: "#E0E0E0" }
					: {},
			]}
			onPress={onPress}
		>
			<View style={styles.optionIconContainer}>
				<Icon name={icon} size={24} color="#4A4A4A" />
			</View>
			<Text style={styles.optionLabel}>{label}</Text>
			<Icon name="chevron-forward-outline" size={24} color="#B0B0B0" />
		</TouchableOpacity>
	);
};

const ModalLogout = ({ visible, onClose, onPress, currentLang }) => {
	return (
		<Modal
			transparent={true}
			animationType="slide"
			visible={visible}
			onRequestClose={() => onClose()}
		>
			<View style={styles.modalOverlay}>
				<View style={styles.modalContent}>
					<Text style={styles.modalTitle}>
						{languages[currentLang].logout}
					</Text>
					<Text style={styles.modalMessage}>
						{languages[currentLang].logoutMessage}
					</Text>
					<View style={styles.modalButtons}>
						<TouchableOpacity
							style={[styles.modalButton, styles.cancelButton]}
							onPress={() => onClose()}
						>
							<Text style={styles.cancelText}>
								{languages[currentLang].no}
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[styles.modalButton, styles.exitButton]}
							onPress={onPress}
						>
							<Text style={styles.exitText}>
								{languages[currentLang].yes}
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		backgroundColor: "#F8F9FA",
		paddingVertical: 20,
	},
	profileSection: {
		alignItems: "center",
		marginBottom: 20,
	},
	profileImageContainer: {
		position: "relative",
	},
	profileImage: {
		width: 150,
		height: 150,
		borderRadius: 70,
	},
	cameraIconContainer: {
		position: "absolute",
		bottom: 0,
		right: 0,
		backgroundColor: "#2b8395",
		padding: 6,
		borderRadius: 20,
		borderWidth: 2,
		borderColor: "#fff",
	},
	name: {
		fontSize: 20,
		fontWeight: "bold",
		marginTop: 10,
	},
	role: {
		fontSize: 14,
		color: "#6C757D",
	},
	editProfileContainer: {
		marginHorizontal: 10,
		marginBottom: 10,
	},
	editProfileButton: {
		backgroundColor: "#2b8395",
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 8,
	},
	editProfileText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
		textAlign: "center",
	},
	optionsSection: {
		backgroundColor: "#fff",
		borderRadius: 10,
		marginHorizontal: 10,
		paddingVertical: 10,
		elevation: 3,
	},
	optionItem: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 15,
		paddingVertical: 15,
	},
	optionIconContainer: {
		marginRight: 15,
	},
	optionLabel: {
		flex: 1,
		fontSize: 16,
		color: "#4A4A4A",
	},
	modalOverlay: {
		flex: 1,
		justifyContent: "flex-end",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalContent: {
		backgroundColor: "white",
		padding: 20,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		elevation: 5,
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 10,
		textAlign: "center",
	},
	modalMessage: {
		fontSize: 16,
		color: "#555",
		marginBottom: 20,
		textAlign: "center",
	},
	modalButtons: {
		flexDirection: "row",
		justifyContent: "space-between",
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
	},
	exitButton: {
		backgroundColor: "#d9534f",
		paddingVertical: 10,
	},
	cancelText: {
		color: "#555",
		fontWeight: "bold",
	},
	exitText: {
		color: "white",
		fontWeight: "bold",
	},
});

export default ProfileScreen;
