import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	TextInput,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Constants from "expo-constants";
import DropDownPicker from "react-native-dropdown-picker";
import { useIsFocused } from "@react-navigation/native";

import CustomLayout from "../components/CustomLayout";
import {
	getData,
	getLang,
	makeSlice,
	showError,
	showSuccess,
	languages,
} from "../utils";

const FormCuti = () => {
	const [isExitModalVisible, setExitModalVisible] = useState(false);

	const [open, setOpen] = useState(false);
	const [open2, setOpen2] = useState(false);
	const [type, setType] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [selectedValue, setSelectedValue] = useState(null);
	const [dates, setDates] = useState({
		start: new Date(),
		end: new Date(),
	});
	const [showPicker, setShowPicker] = useState({ start: false, end: false });
	const [inputData, setInputData] = useState({
		type: "",
		tanggal_awal: "",
		tanggal_akhir: "",
		keterangan: "",
		cuti_khusus_id: "",
	});
	const [izinKhusus, setIzinKhusus] = useState([]);
	const items = [
		{ label: "Cuti", value: "cuti" },
		{ label: "Cuti Khusus", value: "cuti_khusus" },
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
	const handleDateChange = (type) => (event, selectedDate) => {
		if (event.type === "dismissed") {
			setShowPicker((prev) => ({ ...prev, [type]: false }));
			return;
		}

		setDates((prev) => ({ ...prev, [type]: selectedDate || prev[type] }));
		setShowPicker((prev) => ({ ...prev, [type]: false }));
	};
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

			if (inputData.type === "cuti") {
				const tanggalAwal = new Date(inputData.tanggal_awal);
				const tanggalAkhir = new Date(inputData.tanggal_akhir);

				if (
					isNaN(tanggalAwal.getTime()) ||
					isNaN(tanggalAkhir.getTime())
				) {
					showError("Tanggal awal dan tanggal akhir harus valid.");
					return;
				}

				const selisihHari =
					(tanggalAkhir - tanggalAwal) / (1000 * 60 * 60 * 24);
				const selisihIzin =
					(tanggalAwal - new Date()) / (1000 * 60 * 60 * 24);

				if (selisihHari === 3) {
					showError(
						"Selisih antara tanggal awal dan tanggal akhir tidak boleh 3 hari."
					);
					return;
				} else if (selisihIzin < 7) {
					showError(
						"Izin minimal harus 7 hari sebelum tanggal yang di ajukan."
					);
					return;
				} else if (tanggalAwal > new Date()) {
					showError(
						"Tanggal awal tidak boleh lebih besar dari tanggal sekarang."
					);
				}
			}

			const formData = new FormData();
			formData.append("user_id", user.id);
			formData.append("tanggal_awal", inputData.tanggal_awal);
			formData.append("tanggal_akhir", inputData.tanggal_akhir);
			formData.append("type", inputData.type);
			formData.append("keterangan", inputData.keterangan);
			formData.append("cuti_khusus_id", inputData.cuti_khusus_id);

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
			setExitModalVisible(false);

			if (data) {
				showSuccess(data.message || data.status || data);
				setInputData({
					type: "",
					tanggal_awal: "",
					tanggal_akhir: "",
					keterangan: "",
					cuti_khusus_id: "",
				});
				setDates({
					start: new Date(),
					end: new Date(),
				});
			}
		} catch (error) {
			console.error(error);
			showError(error.message || "Unknown error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	const getIzinKhusus = async () => {
		const user = JSON.parse(await getData("user"));

		try {
			const response = await fetch(
				`${Constants.expoConfig.env.API_URL}route`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"X-Slice": makeSlice("Izin", "getIzinKhusus"),
						token: user.token,
					},
					body: JSON.stringify({
						user_id: user.id,
					}),
				}
			);

			const data = await response.json();

			const dropdownItems = data[0].map((item) => ({
				label: item.keterangan,
				value: item.id,
			}));

			setIzinKhusus(dropdownItems);
		} catch (error) {
			console.error("Error:", error);
			showError(error.data?.message || "Unknown error occurred");
		}
	};

	useEffect(() => {
		if (isFocus) {
			getIzinKhusus();
		}
	}, [isFocus]);
	useEffect(() => {
		setInputData((prevState) => {
			const updatedData = {
				...prevState,
				tanggal_awal: formatDate(dates.start),
				tanggal_akhir: formatDate(dates.end),
				cuti_khusus_id: selectedValue,
				keterangan: inputData.keterangan,
			};

			return updatedData;
		});
	}, [dates, selectedValue]);

	useEffect(() => {
		console.log({ inputData });
	}, [inputData]);

	const handleShowDatePicker = (type) => {
		setShowPicker((prev) => ({ ...prev, [type]: true }));
	};

	console.log({ inputData });

	return (
		<CustomLayout title={languages[currentLang]?.cutititle}>
			{/* Tabs */}
			<View style={styles.tabContainer}>
				<View style={styles.modalContent}>
					{/* tyoe Input */}
					<View style={styles.inputContainer}>
						<View style={styles.select}>
							<Text style={styles.label}>
								{languages[currentLang].pilihType}
							</Text>
							<DropDownPicker
								open={open}
								value={inputData.type}
								items={items}
								setOpen={setOpen}
								style={{
									borderColor: "#ccc",
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
						{/* cuti khusus */}
						{inputData.type === "cuti_khusus" && (
							<View style={{ marginBottom: 10 }}>
								<Text style={styles.label}>
									{languages[currentLang].pilihCutiKusus}
								</Text>
								<DropDownPicker
									open={open2}
									value={selectedValue}
									items={izinKhusus}
									setOpen={setOpen2}
									setValue={setSelectedValue}
									setItems={setIzinKhusus}
									placeholder={`${languages[currentLang]?.pilihCutiKusus}`}
									zIndex={3000}
									zIndexInverse={1000}
									style={{
										borderColor: "#ccc",
										textAlign: "center",
										padding: 10,
									}}
								/>
							</View>
						)}
						{/* date */}
						<View>
							{[
								inputData.type !== "" && "start",
								inputData.type === "cuti" ? "end" : "",
							].map(
								(type, index) =>
									type && (
										<View key={type || index}>
											<Text style={{ marginBottom: 10 }}>
												{type === "end"
													? `${languages[currentLang]?.selesaiTanggal}`
													: inputData.type ===
													  "cuti_khusus"
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
						{/* keterangan */}
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

export default FormCuti;
