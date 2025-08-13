import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const CustomHeaderDocument = ({ title, onAddDocumentPress }) => {
    return (
        <>
            {/* StatusBar */}
            <StatusBar
                barStyle="light-content"
                backgroundColor="#2b8395"
            />
            <View style={styles.headerContainer}>
                {/* Kiri: Title */}
                <View style={styles.leftSection}>
                    <View style={styles.titleText}>
                        <Text style={styles.name}>{title}</Text>
                    </View>
                </View>
                {/* Kanan: Icon Add Document */}
                <TouchableOpacity onPress={onAddDocumentPress} style={styles.notificationContainer}>
                    <Icon name="add" style={styles.addIcon}/>
                </TouchableOpacity>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
	headerContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 16,
		paddingVertical: 8,
		backgroundColor: "#ffffff",
		borderBottomWidth: 1,
		borderBottomColor: "#e0e0e0",
	},
	leftSection: {
		flexDirection: "row",
		alignItems: "center",
	},
	profileImage: {
		width: 50,
		height: 50,
		borderRadius: 30,
		marginRight: 8,
		elevation: 3,
		borderWidth: 1,
		borderColor: "#e0e0e0",
	},
	titleText: {
		height: 40,
		flexDirection: "column",
		justifyContent: "center",
	},
	name: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#000",
	},
	role: {
		fontSize: 12,
		color: "#000",
	},
	notificationContainer: {
		position: "relative",
		borderWidth: 1,
		borderColor: "#2b8395",
		borderRadius: 8,
		justifyContent: "center",
		alignItems: "center",
	},
	addIcon: {
		fontSize: 20,
		color: "#2b8395",
	},
});

export default CustomHeaderDocument;
