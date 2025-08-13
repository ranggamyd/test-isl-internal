import React, { useEffect, useState } from "react";
import {
	Alert,
	BackHandler,
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigationState, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import Modal from "react-native-modal";
import { getData, getLang } from "../utils/database";

import { checkLoginStatus } from "../utils/auth";


import CustomHeaderDashboard from '../components/CustomHeaderDashboard';
import CustomHeaderDocument from '../components/CustomHeaderDocument';
import DashboardScreen from '../screens/DashboardScreen';
import DocumentScreen from '../screens/DocumentScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MemberScreen from '../screens/MemberScreen';
import OtherScreen from '../screens/OtherScreen';
import languages from '../utils/en8li';

const Tab = createBottomTabNavigator();

const BottomTabsNavigators = () => {
	const navState = useNavigationState((state) => state);
	const navigation = useNavigation();
	const [isExitModalVisible, setExitModalVisible] = useState(false);
	const [userData, setUserData] = useState(null);
	const [notificationCount, setNotificationCount] = useState(0);
	const [currentLang, setCurrentLang] = useState("en-US");
	const [isAddDocumentModalVisible, setAddDocumentModalVisible] =useState(false);

	useEffect(() => {
		let backPressCount = 0;
		const handleBackPress = () => {
			const currentTab = navState?.routes[navState?.index]?.name || "";
			if (currentTab === "Main") {
				if (backPressCount === 0) {
					backPressCount += 1;
					setTimeout(() => {
						backPressCount = 0;
					}, 1000);
					return true;
				} else {
					setExitModalVisible(true);
					return true;
				}
			}
			return false; // Izinkan navigasi mundur di tab lain
		};

		BackHandler.addEventListener("hardwareBackPress", handleBackPress);
		return () =>
			BackHandler.removeEventListener(
				"hardwareBackPress",
				handleBackPress
			);
	}, [navState]);

	const handleExitApp = () => {
		setExitModalVisible(false);
		BackHandler.exitApp();
	};

	const getUserData = async () => {
		const response = await getData("user");
		setUserData(JSON.parse(response));
	};

	useEffect(() => {
		const notificationCount = async () => {
			const response = (await getData("notification")) || [];
			if (response.length > 0) {
				const unreadNotifications = response.filter(
					(notification) => !notification.is_read
				);
				setNotificationCount(unreadNotifications.length);
			} else {
				setNotificationCount(0);
			}
		};

		const getLanguage = async () => {
			setCurrentLang((await getLang()) || "en-US");
		};

		setInterval(async () => {
			getLanguage();
			notificationCount();
			getUserData();
		}, 1000);
	}, []);

	useEffect(() => {
		const unsubscribe = navigation.addListener("state", () => {
			checkLoginStatus(navigation);
		});

		return unsubscribe;
	}, [navigation]);

	return (
		<>
			<Tab.Navigator
				detachInactiveScreens={true}
				screenOptions={({ route }) => ({
					tabBarIcon: ({ focused, color, size }) => {
						let iconName;
						switch (route.name) {
							case languages[currentLang].dashboard:
								iconName = focused ? "home" : "home-outline";
								break;
							case languages[currentLang].document:
								iconName = focused
									? "document"
									: "document-outline";
								break;
							case languages[currentLang].member:
								iconName = focused
									? "people"
									: "people-outline";
								break;
							case languages[currentLang].other:
								iconName = focused ? "apps" : "apps-outline";
								break;
							case languages[currentLang].profile:
								iconName = focused
									? "person"
									: "person-outline";
								break;


                            default:
                                iconName = 'help-circle';
                        }
                        return <Icon name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: '#2b8395',
                    tabBarInactiveTintColor: 'gray',
                    tabBarStyle: { backgroundColor: '#ffffff' },
                })}
            >
                <Tab.Screen
                    name={languages[currentLang].dashboard}
                    component={DashboardScreen}
                    options={{
                        header: () => (
                            <CustomHeaderDashboard
                                profilePic={`https://apps.intilab.com/utc/apps/public/dokumentasi/karyawan/${userData?.image || 'no_image.jpg'}`}
                                name={userData?.nama_lengkap || 'Admin'}
                                role={userData?.jabatan || 'Advisor'}
                                notificationCount={notificationCount}
                                onNotificationPress={() => navigation.navigate('Notification')}
                            />
                        )
                    }}
                />
                <Tab.Screen
                    name={languages[currentLang].document}
                    component={DocumentScreen}
                    options={{
                        header: () => (
                            <CustomHeaderDocument
                                title={languages[currentLang].allDocument}
                                onAddDocumentPress={() => setAddDocumentModalVisible(true)}
                            />
                        )
                    }}
                />
                <Tab.Screen name={languages[currentLang].member} children={() => <MemberScreen />} />
                <Tab.Screen name={languages[currentLang].other} children={() => <OtherScreen />} />
                <Tab.Screen name={languages[currentLang].profile} children={() => <ProfileScreen />} />
            </Tab.Navigator>

			{/* Modal Konfirmasi Keluar */}
			<Modal
				isVisible={isExitModalVisible}
				onBackdropPress={() => setExitModalVisible(false)}
				style={styles.modalContainer}
			>
				<View style={styles.modalContent}>
					<Text style={styles.modalTitle}>Exit App</Text>
					<Text style={styles.modalMessage}>
						Are you sure you want to exit?
					</Text>
					<View style={styles.modalButtons}>
						<TouchableOpacity
							style={[styles.modalButton, styles.cancelButton]}
							onPress={() => setExitModalVisible(false)}
						>
							<Text style={styles.cancelText}>No</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[styles.modalButton, styles.exitButton]}
							onPress={handleExitApp}
						>
							<Text style={styles.exitText}>Yes</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>

			{/* Modal Add Document */}
			<Modal
				isVisible={isAddDocumentModalVisible}
				onBackdropPress={() => setAddDocumentModalVisible(false)}
				style={styles.modalContainer}
			>
				<View style={styles.modalContent}>
					<Text style={styles.modalTitle}>
						{languages[currentLang].addDocument}
					</Text>

                    <View style={styles.containerList}>
                        <TouchableOpacity style={[styles.primaryButton, {borderBottomWidth: 1}]} onPress={() => {setAddDocumentModalVisible(false); navigation.navigate('FormIzinScreen')}}>
                            <View style={styles.listItem}>
                                <Icon style={styles.icon} name="albums-outline" size={24} color="#000" />
                                <Text style={styles.name}>{languages[currentLang].formPermission}</Text>
                            </View>
                            <Icon name="chevron-forward-outline" size={24} color="#000" />
                        </TouchableOpacity>
                        {userData?.jabatan.toLowerCase().includes("supervisor") || userData?.jabatan.toLowerCase().includes("manager") ? 
                            <TouchableOpacity style={[styles.primaryButton, {borderBottomWidth: 1}]} onPress={() => {setAddDocumentModalVisible(false); navigation.navigate('FormLemburScreen')}}>
                                <View style={styles.listItem}>
                                    <Icon style={styles.icon} name="albums-outline" size={24} color="#000" />
                                    <Text style={styles.name}>{languages[currentLang].formOvertime}</Text>
                                </View>
                                <Icon name="chevron-forward-outline" size={24} color="#000" />
                            </TouchableOpacity>
                        : null}
                        <TouchableOpacity style={[styles.primaryButton, {borderBottomWidth: 1}]} onPress={() => {setAddDocumentModalVisible(false); navigation.navigate('FormCuti')}}>
                            <View style={styles.listItem}>
                                <Icon style={styles.icon} name="albums-outline" size={24} color="#000" />
                                <Text style={styles.name}>{languages[currentLang].formLeave}</Text>
                            </View>
                            <Icon name="chevron-forward-outline" size={24} color="#000" />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.primaryButton, {borderBottomWidth: 1}]} onPress={() => {setAddDocumentModalVisible(false); navigation.navigate('FormKonseling')}}>
                            <View style={styles.listItem}>
                                <Icon style={styles.icon} name="albums-outline" size={24} color="#000" />
                                <Text style={styles.name}>{languages[currentLang].formConsultation}</Text>
                            </View>
                            <Icon name="chevron-forward-outline" size={24} color="#000" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.primaryButton} onPress={() => setAddDocumentModalVisible(false)}>
                            <View style={styles.listItem}>
                                <Icon style={styles.icon} name="close-outline" size={24} color="#000" />
                                <Text style={styles.name}>{languages[currentLang].close}</Text>
                            </View>
                            <Icon name="chevron-forward-outline" size={24} color="#000" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal >
        </>
    );
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	text: {
		fontSize: 18,
	},
	modalContainer: {
		justifyContent: "flex-end",
		margin: 0,
	},
	modalContent: {
		backgroundColor: "white",
		padding: 20,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 10,
	},
	modalMessage: {
		fontSize: 16,
		color: "#555",
		marginBottom: 20,
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
	},
	cancelText: {
		color: "#555",
		fontWeight: "bold",
	},
	exitText: {
		color: "white",
		fontWeight: "bold",
	},
	containerList: {
		paddingBottom: 5,
	},
	primaryButton: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "#fff",
		padding: 16,
		borderRadius: 8,
		marginBottom: 8,

		borderBottomColor: "#ccc",
	},
	listItem: {
		flexDirection: "row",
		alignItems: "center",
	},
	icon: {
		marginRight: 16,
	},
	modalButtonText: {
		fontSize: 14,
		color: "#000",
		textAlign: "center",
	},
});

export default BottomTabsNavigators;
