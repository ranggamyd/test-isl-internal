import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Splash from '../components/Splash';
import Login from '../components/Login';
import Register from '../components/Register';
import BottomTabsNavigators from './BottomTabsNavigators';
import NotificationHandler from '../components/NotificationHandler';
import NotificationScreen from '../screens/NotificationScreen';
import KonselingScreen from '../screens/OthersScreen/Konseling/KonselingScreen';
import AnnouncementScreen from '../screens/AnnouncementScreen';
import MyProfileScreen from '../screens/MyProfileScreen';
import AbsenScreen from '../screens/AbsenScreen';
import GetLocationScreen from '../screens/GetLocationScreen';
import TermConditionScreen from '../screens/TermConditionScreen';
import FormLemburScreen from '../screens/OthersScreen/Lembur/FormLemburScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import ProfileMember from '../screens/ProfileMember';
import AttendanceScreen from '../screens/AttendanceScreen';
import FormIzin from '../screens/FormIzin';
import KalenderPerusahaan from '../screens/KalenderPerusahaan';
import ShiftScreen from '../screens/ShiftScreen';
import SupportScreen from '../screens/SupportScreen';
import { FormCuti, FormIzinScreen } from "../screens";
import ManageKonselingScreen from "../screens/OthersScreen/ManageKonseling/ManageKonselingScreen";
import AjukanBarangScreen from "../screens/OthersScreen/AjukanBarang/AjukanBarangScreen";

const Stack = createStackNavigator();

const AppNavigators = () => {
	return (
		<>
			<Stack.Navigator
				initialRouteName="Splash"
				screenOptions={{ headerShown: false }}
			>
				<Stack.Screen name="Splash" component={Splash} />
				<Stack.Screen name="Login" component={Login} />
				<Stack.Screen name="Register" component={Register} />
				<Stack.Screen name="Main" component={BottomTabsNavigators} />
				<Stack.Screen
					name="Notification"
					component={NotificationScreen}
				/>

				<Stack.Screen
					name="Announcement"
					component={AnnouncementScreen}
				/>
				<Stack.Screen name="MyProfile" component={MyProfileScreen} />
				<Stack.Screen
					name="FormIzinScreen"
					component={FormIzinScreen}
				/>
				<Stack.Screen name="FormCuti" component={FormCuti} />
				<Stack.Screen
					name="FormKonseling"
					component={KonselingScreen}
				/>
				<Stack.Screen name="Absen" component={AbsenScreen} />
				<Stack.Screen
					name="GetLocation"
					component={GetLocationScreen}
				/>
				<Stack.Screen
					name="TermCondition"
					component={TermConditionScreen}
				/>
				<Stack.Screen
					name="ChangePassword"
					component={ChangePasswordScreen}
				/>
				<Stack.Screen name="ProfileMember" component={ProfileMember} />
				<Stack.Screen name="Attendance" component={AttendanceScreen} />
				<Stack.Screen name="FormIzin" component={FormIzin} />
				<Stack.Screen
					name="ManageKonseling"
					component={ManageKonselingScreen}
				/>
				<Stack.Screen
					name="AjukanBarangScreen"
					component={AjukanBarangScreen}
				/>
				<Stack.Screen
					name="KalenderPerusahaan"
					component={KalenderPerusahaan}
				/>
				<Stack.Screen name="ShiftScreen" component={ShiftScreen} />
				<Stack.Screen name="SupportScreen" component={SupportScreen} />
				<Stack.Screen
					name="FormLemburScreen"
					component={FormLemburScreen}
				/>
			</Stack.Navigator>

			<NotificationHandler />
		</>
	);
};

export default AppNavigators;
