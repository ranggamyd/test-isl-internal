import { Alert } from "react-native";

export const showToast = (type, text1, text2 = "") => {
	Alert.alert(
		type === "success" ? "Success" : type === "error" ? "Error" : "Info",
		`${text1}\n${text2}`,
		[{ text: "OK" }],
		{ cancelable: true }
	);
};


export const showConfirm = (title, message, onConfirm, onCancel) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: 'Cancel',
          onPress: onCancel,
          style: 'cancel', // Styling untuk menonjolkan opsi cancel
        },
        {
          text: 'Yes',
          onPress: onConfirm, // Aksi ketika Yes ditekan
        },
      ],
      { cancelable: true }
    );
  };

export const showSuccess = (message, description = '') => {
    showToast('success', message, description);

};

export const showError = (message, description = "") => {
	showToast("error", message, description);
};

export const showInfo = (message, description = "") => {
	showToast("info", message, description);
};
