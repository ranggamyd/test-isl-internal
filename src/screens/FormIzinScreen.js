import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Image,
	TextInput,
} from "react-native";
import CustomLayout from "../components/CustomLayout";
import DateTimePicker from "@react-native-community/datetimepicker";
import Constants from "expo-constants";
import DropDownPicker from "react-native-dropdown-picker";
import { useIsFocused } from "@react-navigation/native";
import { launchImageLibrary } from "react-native-image-picker";

import {
	getData,
	getLang,
	makeSlice,
	showError,
	showSuccess,
	languages,
} from "../utils";

const OthersScreen = () => {
	const [show, setShow] = useState({ start: false, end: false });
	const [open, setOpen] = useState(false);
	const [type, setType] = useState(null);
	const [image, setImage] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const [dates, setDates] = useState({
		start: new Date(),
		end: new Date(),
	});
	const [time, setTime] = useState({ start: new Date(), end: new Date() });
	const [showPicker, setShowPicker] = useState({ start: false, end: false });
	const [inputData, setInputData] = useState({
		type: "",
		tanggal_awal: "",
		tanggal_akhir: "",
		keterangan: "",
		izin_kegiatan_awal: "",
		izin_kegiatan_akhir: "",
		cuti_khusus_id: "",
	});

	const items = [
		{ label: "Kegiatan", value: "kegiatan" },
		{ label: "Datang Terlambat", value: "datang_terlambat" },
		{ label: "Sakit", value: "sakit" },
		{ label: "Unpaid Leave", value: "unpaid_leave" },
	];
	const isFocus = useIsFocused();
	const [currentLang, setCurrentLang] = useState("en-US");

	useEffect(() => {
		const getLanguage = async () => {
			setCurrentLang((await getLang()) || "en-US");
		};
		getLanguage();
	}, []);

	// fetch data
	const handleMonthView = (month) => {
		const monthInYear = [
			"Januari",
			"Februari",
			"Maret",
			"April",
			"Mei",
			"Juni",
			"Juli",
			"Agustus",
			"September",
			"Oktober",
			"November",
			"Desember",
		];
		return monthInYear[month];
	};

	const formatDateLayout = (date) => {
		return `${String(date.getDate()).padStart(2, "0")} ${handleMonthView(
			date.getMonth()
		)} ${date.getFullYear()}`;
	};
	const formatDate = (date) =>
		`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
			2,
			"0"
		)}-${String(date.getDate()).padStart(2, "0")}`;

	const formatTime = (date) =>
		date
			.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			})
			.replace(".", ":");

	const handleDateChange = (type) => (event, selectedDate) => {
		if (event.type === "dismissed") {
			setShowPicker((prev) => ({ ...prev, [type]: false }));
			return;
		}

		setDates((prev) => ({ ...prev, [type]: selectedDate || prev[type] }));
		setShowPicker((prev) => ({ ...prev, [type]: false }));
	};
	const handleTimeChange = (type, selectedDate) => {
		if (!selectedDate) return;
		setTime((prev) => ({ ...prev, [type]: selectedDate }));
		setShow((prev) => ({ ...prev, [type]: false }));
	};

	// Tab content handler
	const handleSubmit = async () => {
		const user = JSON.parse(await getData("user"));
		setIsLoading(true);
		try {
			// Validasi tipe izin
			if (!inputData.type) {
				showError("Tipe izin harus dipilih.");
				setIsLoading(false);
				return;
			}

			if (!image || !image.uri || !image.fileName) {
				showError("File gambar wajib diunggah untuk tipe izin ini.");
				return;
			}

			const formData = new FormData();
			formData.append("user_id", user.id);
			formData.append("tanggal_awal", inputData.tanggal_awal);
			formData.append("tanggal_akhir", inputData.tanggal_akhir);
			formData.append("waktu_kedatangan", inputData.izin_kegiatan_awal);
			formData.append("izin_kegiatan_awal", inputData.izin_kegiatan_awal);

			formData.append(
				"izin_kegiatan_akhir",
				inputData.izin_kegiatan_akhir
			);
			formData.append("type", inputData.type);
			formData.append("keterangan", inputData.keterangan);

			if (image && image.uri && image.fileName) {
				formData.append("file", {
					uri: image.uri,
					name: image.fileName,
					type: image.type || "image/jpeg",
				});
			}

			const response = await fetch(
				`${Constants.expoConfig.env.API_URL}route`,
				{
					method: "POST",
					headers: {
						"X-Slice": makeSlice("Izin", "formIzin"),
						token: user.token,
					},
					body: formData,
				}
			);

			const data = await response.json();

			if (data) {
				showSuccess(data.message || data.status || data);
				console.log({ data });
				setInputData({
					type: "",
					tanggal_awal: "",
					tanggal_akhir: "",
					keterangan: "",
					izin_kegiatan_awal: "",
					izin_kegiatan_akhir: "",
					file: "",
				});
				setDates({
					start: new Date(),
					end: new Date(),
				});
				setTime({
					start: new Date(),
					end: new Date(),
				});
				setImage(null);
			}
		} catch (error) {
			console.error(error);
			showError(error.message || "Unknown error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (image) {
			setInputData((prevState) => {
				const updatedData = {
					...prevState,
					tanggal_awal: formatDate(dates.start),
					tanggal_akhir: formatDate(dates.end),
					izin_kegiatan_awal: formatTime(time.start),
					izin_kegiatan_akhir: formatTime(time.end),
					file: image.fileName || "default.jpg",
				};

				return updatedData;
			});
		} else if (!image) {
			setInputData((prevState) => {
				const updatedData = {
					...prevState,
					tanggal_awal: formatDate(dates.start),
					tanggal_akhir: formatDate(dates.end),
					izin_kegiatan_awal: formatTime(time.start),
					izin_kegiatan_akhir: formatTime(time.end),
					file: "default.jpg",
				};

				console.log({ updatedData }); // Cetak data terbaru di sini
				return updatedData;
			});
		}
	}, [dates, image, time]);

	// useEffect(() => {
	// 	console.log({ inputData });
	// }, [inputData]);

	const handleShowDatePicker = (type) => {
		setShowPicker((prev) => ({ ...prev, [type]: true }));
	};

	// image picker
	const handleChooseImage = () => {
		launchImageLibrary({ mediaType: "photo" }, (response) => {
			if (!response.didCancel && !response.errorCode) {
				setImage(response.assets[0]);
			}
		});
	};

	return (
		<CustomLayout title={languages[currentLang]?.izinForm}>
			{/* Tabs */}
			<View style={styles.tabContainer}>
				<View style={styles.modalContent}>
					{/* tyoe Input */}
					<View style={styles.inputContainer}>
						<View style={styles.select}>
							<Text style={styles.label}>
								{" "}
								{languages[currentLang]?.pilihType}
							</Text>
							<DropDownPicker
								open={open}
								value={inputData.type}
								items={items}
								setOpen={setOpen}
								style={{
									borderColor: "#ccc",
									textAlign: "center",
								}}
								setValue={(callback) => {
									const newValue = callback(type);
									setType(newValue);

									setInputData({
										...inputData,
										type: newValue,
									});
								}}
							/>
						</View>
						{/* waktu  */}
						{inputData.type === "unpaid_leave" ||
						inputData.type === "sakit" ? (
							<></>
						) : (
							<View>
								{[
									inputData.type !== "" && "start",
									inputData.type === "kegiatan" ? "end" : "",
								].map(
									(type, index) =>
										type && (
											<View key={type || index}>
												<Text
													style={{ marginBottom: 10 }}
												>
													{type === "end"
														? `${languages[currentLang]?.selesaiWaktu}`
														: inputData.type ===
														  "datang_terlambat"
														? `${languages[currentLang]?.jam}`
														: `${languages[currentLang]?.mulaiWaktu}`}
												</Text>
												<TouchableOpacity
													style={{
														padding: 10,
														backgroundColor:
															"white",
														borderWidth: 1,
														borderRadius: 5,
														marginBottom: 10,
														borderColor: "#ccc",
													}}
													onPress={() =>
														setShow((prev) => ({
															...prev,
															[type]: true,
														}))
													}
												>
													<Text
														style={{
															textAlign: "center",
														}}
													>
														{time[type]
															? formatTime(
																	time[type]
															  )
															: `${languages[currentLang]?.pilihWaktu}`}
													</Text>
												</TouchableOpacity>
												{show[type] && (
													<DateTimePicker
														value={
															time[type] ||
															new Date()
														}
														mode="time"
														is24Hour={true}
														display="default"
														onChange={(
															event,
															selectedDate
														) =>
															handleTimeChange(
																type,
																selectedDate
															)
														}
													/>
												)}
											</View>
										)
								)}
							</View>
						)}
						{/* date */}
						<View>
							{[
								inputData.type !== "" && "start",

								inputData.type === "unpaid_leave" ? "end" : "",
							].map(
								(type, index) =>
									type && (
										<View key={type || index}>
											<Text style={{ marginBottom: 10 }}>
												{type === "end"
													? `${languages[currentLang]?.selesaiTanggal}`
													: inputData.type ===
															"datang_terlambat" ||
													  inputData.type ===
															"kegiatan" ||
													  inputData.type === "sakit"
													? `${languages[currentLang]?.tanggal}`
													: `${languages[currentLang]?.mulaiTanggal}`}
											</Text>
											<TouchableOpacity
												style={{
													padding: 10,
													backgroundColor: "white",
													borderWidth: 1,
													borderRadius: 5,
													marginBottom: 10,
													borderColor: "#ccc",
												}}
												onPress={() =>
													handleShowDatePicker(type)
												}
												disabled={isLoading}
											>
												<Text
													style={{
														textAlign: "center",
													}}
												>
													{dates[type]
														? formatDateLayout(
																dates[type]
														  )
														: `${languages[currentLang]?.pilihTanggal}`}
												</Text>
											</TouchableOpacity>
											{showPicker[type] && (
												<DateTimePicker
													value={
														dates[type] ||
														new Date()
													}
													mode="date"
													display="default"
													onChange={(
														event,
														selectedDate
													) =>
														handleDateChange(type)(
															event,
															selectedDate
														)
													}
												/>
											)}
										</View>
									)
							)}
						</View>

						{/* image  */}
						{inputData.type && (
							<View>
								<View>
									<Text style={{ marginBottom: 10 }}>
										{languages[currentLang].uploadImage}
									</Text>
									<TouchableOpacity
										style={{
											padding: 10,
											backgroundColor: "white",
											borderWidth: 1,
											borderRadius: 5,
											marginBottom: 10,
											borderColor: "#ccc",
										}}
										onPress={handleChooseImage}
									>
										<TouchableOpacity>
											<Text
												style={{
													textAlign: "center",
												}}
											>
												{
													languages[currentLang]
														?.pilihGambar
												}
											</Text>
										</TouchableOpacity>
									</TouchableOpacity>

									{image && (
										<Image
											source={{ uri: image.uri }}
											style={{
												width: 100,
												height: 100,
												borderRadius: 5,
											}}
										/>
									)}
								</View>
							</View>
						)}

						{inputData.type && (
							<>
								<View>
									<Text style={styles.label}>
										{languages[currentLang].keterangan}
									</Text>
									<TextInput
										style={styles.input}
										placeholder="Enter your reason"
										onChangeText={(text) =>
											setInputData({
												...inputData,
												keterangan: text,
											})
										}
									/>
								</View>
							</>
						)}
					</View>
					{inputData.type && (
						<View>
							<TouchableOpacity
								style={[styles.modalButtons]}
								onPress={handleSubmit}
								disabled={isLoading}
							>
								<Text style={styles.submitText}>
									{isLoading ? "Loading..." : "Submit"}
								</Text>
							</TouchableOpacity>
						</View>
					)}
				</View>
			</View>
		</CustomLayout>
	);
};

const styles = StyleSheet.create({
	// modal style

	modalContent: {
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
	},

	modalButtons: {
		backgroundColor: "#2b8390",

		padding: 15,
		borderRadius: 5,
		alignItems: "center",
	},
	divData: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
	},

	submitText: {
		color: "white",
		fontWeight: "bold",
	},
	inputContainer: {
		marginBottom: 20,
	},
	// end modal
	label: {
		marginVertical: 10,
	},
	input: {
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 5,
		padding: 10,
		marginBottom: 20,
		backgroundColor: "white",
	},
	select: {
		marginBottom: 10,
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
		backgroundColor: "#f76d8b",
		color: "#f01141",
	},
	cardDetails: {
		marginTop: 8,
	},
});

export default OthersScreen;
