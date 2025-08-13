import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const CustomLayout = ({ children, title, action }) => {
	const navigation = useNavigation();

	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<TouchableOpacity onPress={() => navigation.goBack()}>
					<Icon name="arrow-back-outline" size={24} color="#2b8395" />
				</TouchableOpacity>

				<Text style={styles.headerText}>{title}</Text>
				<View style={styles.placeholder}>{action}</View>
			</View>

			<View style={styles.content}>{children}</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "white",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		height: 60,
		backgroundColor: "white",
		paddingHorizontal: 20,
		elevation: 4,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		borderBottomWidth: 1,
		borderBottomColor: "#e0e0e0",
	},
	headerText: {
		fontSize: 18,
		fontWeight: "600",
		color: "#4A4A4A",
	},
	placeholder: {
		width: 32,
	},
	content: {
		flex: 1,
		padding: 20,
	},
});

export default CustomLayout;
