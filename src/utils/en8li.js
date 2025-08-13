const languages = {
	"en-US": {
		greeting: "Hello",
		farewell: "Goodbye",
		thankYou: "Thank you",
		waittingProcess: "Waiting for processing",
		processed: "Processed",
		pending: "Pending",
		rejected: "Rejected",
		cancelled: "Cancelled",
		yes: "Yes",
		no: "No",
		close: "Close",
		back: "Back",
		please: "Please",
		welcome: "Welcome",
		sorry: "Sorry",
		error: "An error occurred",
		success: "Operation successful",
		noData: "No data found",
		loading: "Loading...",
		offline: "You are offline",
		retry: "Retry",
		cancel: "Cancel",
		confirm: "Confirm",
		save: "Save",
		delete: "Delete",
		edit: "Edit",
		update: "Update",
		login: "Login",
		email: "Email",
        submit : "Submit",
		oldPassword: "Old Password",
		newPassword: "New Password",
		confirmPassword: "Confirm Password",
		password: "Password",
		logout: "Logout",
		profile: "Profile",
		settings: "Settings",
		language: "Language",
		editProfile: "Edit Profile",
		changeLanguage: "Change Language",
		termsConditions: "Terms & Conditions",
		privacyPolicy: "Privacy Policy",
		contactUs: "Contact Us",
		aboutUs: "About Us",
		help: "Help",
		home: "Home",
		search: "Search",
		notifications: "Notifications",
		deleteAll: "Delete All",
		confirmDelete: "Confirm Delete",
		confirmDeleteMessage:
			"Are you sure you want to delete all notifications?",
		deleteAllNotification: "Delete All",
		allDocument: "All Document",
		messages: "Messages",
		checkIn: "Check In",
		checkOut: "Check Out",
		location: "Location",
		distance: "Distance",
		meter: "meter",
		kilometer: "kilometer",
		hour: "hour",
		minute: "minute",
		second: "second",
		office: "Office",
		monday: "Monday",
		tuesday: "Tuesday",
		wednesday: "Wednesday",
		thursday: "Thursday",
		friday: "Friday",
		saturday: "Saturday",
		sunday: "Sunday",
		shortDaysInWeek: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
		monthInYear: [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		],
		arrayCategory: ["Complaint", "Report", "Request"],
		arrayComplaint: ["Network", "Computer", "Printer", "Server"],
		arrayReport: ["Electricity", "AC", "Door Access", "Internet"],
		arrayRequest: ["Borrowing Equipment", "Other"],
		arrayStatus: ["Unprocessed", "Processed"],
		personal: "Personal",
		professional: "Professional",
		documents: "Documents",
		atention: "Attention",
		atentionMessageChangePicture:
			"Please ensure that the profile picture meets the following criteria:\n\n" +
			"• Displays the full face\n" +
			"• Half-body photo\n" +
			"• No mask\n\n" +
			"Do you want to proceed?",
		// area my profile
		//area personal
		fullName: "Full Name",
		religion: "Religion",
		populationRestrationNumber: "Population Restration Number",
		statusMarriage: "Status Marriage",
		phoneNumber: "Phone Number",
		address: "Address",
		// end area personal
        // area taking ATK
        itemName : "Item Name",
        chooseItem : "Choose Item",
        quantity : "Quantity",
        description : "Description",
        quantityPlaceholder : "Enter Quantity",
        descriptionPlaceholder : "Enter Description",
        addItem : "Add Item",
        // end area taking ATK
        // area status badge
        approve : "Approve",
        approved : "Approved",
        reject : "Reject",
        rejected : "Rejected",
        draft : "Draft",
        process : "Process",
        void : "Void",
        waiting : "Waiting",
        // end area status badge
        // area konsulting
        chooseDate : "Choose Date",
        date : "Date",
        time : "Time",
        chooseTime : "Choose Time",
        chooseDateTime : "Choose Date & Time",
        consultingType : "Consulting Type",
        chooseConsultingType : "Choose Consulting Type",
        identity : "Identity",
        chooseIdentity : "Choose Identity",
        name : "Name",
        anonim : "Anonymous",
        typeOffline : "Offline",
        typeOnline : "Online",
        optional : "Optional",
        // end area konsulting
		//area professional
		employeeId: "Employee ID",
		designation: "Designation",
		companyEmail: "Company Email Address",
		employeeType: "Employee Type",
		department: "Department",
		reportingManager: "Reporting Manager",
		companyExperience: "Company Experience",
		officeTime: "Office Time",

		// end area my profile
		// deretan menu
		calendar: "Calendar Office",
		menu: "Menu",
		support: "Technical Support Assistance",
		takingAtk: "Taking ATK",
		dashboard: "Dashboard",
		document: "Document",
		addDocument: "Add Document",
		member: "Member",
		other: "Other",
		myProfile: "My Profile",
		changePassword: "Change Password",
		passwordMismatch: "Password mismatch",
		logout: "Logout",
		//end deretan menu
		formLeave: "Form Leave",
		formOvertime: "Form Overtime",
		formConsultation: "Form Consultation",
		formPermission: "Form Permission",
        formTakingAtk : "Form Taking ATK",
		category: "Select Category",
		subCategory: "Select Sub Category",
		description: "Description",
		attachment: "Attachment",
		swipeToCheckIn: "Swipe to Check In",
		todayAttendance: "Today Attendance",
		attendance: "Attendance",
		shift: "Shift",
		salary: "Salary",
		announcement: "Announcement",
		viewAll: "View All",
		emailDomain: "Email must use the domain @intilab.com",
		aroundOffice: "You are around the Office",
		metersFromOffice: "meters from the Office",
		kilometersFromOffice: "kilometers from the Office",
		unauthorized: "Unauthorized: 401",
		internalServerError: "Internal Server Error: 500",
		networkError: "Network response was not ok",
		offlineMessage:
			"You are offline. Data will be sent when you are back online.",
		unauthorizedMessage: "Unauthorized. Please check your credentials.",
		serverErrorMessage:
			"There was an error on the server. Please try again later.",
		generalErrorMessage: "An error occurred. Please try again.",
		photoLocationUnavailable: "Photo or location not available",
		termsAndConditions: `Welcome to the Internal Application of Inti Surya Laboratorium. This application is specifically designed to meet internal administrative needs, including but not limited to managing attendance, leave, overtime, work calendar, and internal notifications. By using this application, you agree to the following terms and conditions:

1. Internal Use Only
This application is exclusively intended for employees and authorized personnel of Inti Surya Laboratorium. Any use outside of company-related purposes or by unauthorized individuals is strictly prohibited.

2. Confidentiality of Information
All data, information, and materials within this application are company confidential. Users are prohibited from disclosing, sharing, or distributing  any information contained in this application to external parties without written permission from management.

3. Compliance with Company Policies
Users must comply with company policies and regulations related to the use of this application. Violations of this policy may result in disciplinary actions in accordance with company provisions.

4. Copyright and Ownership
This application and all its content, including design, features, and code, are the exclusive property of Inti Surya Laboratorium. Any form of reproduction, modification, distribution, or use outside these terms without written permission is strictly prohibited and subject to legal action.

5. Account Security
Users are responsible for maintaining the confidentiality of account information, including usernames and passwords. All activities under the user's account are the responsibility of the account owner. In case of security breaches or unauthorized access, users must immediately report it to the relevant company personnel.

6. Maintenance and Application Changes
Inti Surya Laboratorium reserves the right to maintain, update, or modify this application at any time without prior notice. These changes may include features, services, or terms of use.

7. Limitation of Liability
Inti Surya Laboratorium is not responsible for any direct or indirect losses arising from the use of this application, including data loss, access delays, or other technical disruptions.

8. Violations and Penalties
Any violation of these terms and conditions may result in access restrictions, termination of employment, or legal action in accordance with company policies and applicable laws.

By using this application, you are deemed to have read, understood, and agreed to all the terms and conditions above. If you have questions or need 
further information, please contact the application management team at Inti Surya Laboratorium.

Copyright © 2024 Inti Surya Laboratorium. All rights reserved.
        `,
		izinForm: "Form Permission",
		cutititle: "Form Leave",
		tanggal: "Date",
		jam: "Time",
		mulaiTanggal: "Start Date",
		selesaiTanggal: "End Date",
		mulaiWaktu: "Start Time",
		selesaiWaktu: "End Time",
		mulai: "Start",
		selesai: "End",
		keterangan: "information",
        masukkanKeterangan: 'Enter a clear description',
		cutiKusus: "Special Leave",
		pilihCutiKusus: "Select Special Leave",
		cuti: "Leave",
		pilihTanggal: "Select Date",
		pilihWaktu: "Select Time",
		loading: "Loading",
		pilihType: "Select Type",
		pilihGambar: "Select Image",
		sakit: "Sick",
		kegiatan: "Activities",
		datangTerlambat: "Come Late",
		uploadImage: "Upload Image",
        uploadImage: "Upload Image",
        pilihAnggota: "Select Members",
	},
	"id-ID": {
		greeting: "Halo",
		farewell: "Selamat tinggal",
		thankYou: "Terima kasih",
		waittingProcess: "Menunggu proses",
		processed: "Diproses",
		pending: "Ditunda",
		rejected: "Ditolak",
		cancelled: "Dibatalkan",
		yes: "Ya",
		no: "Tidak",
		close: "Tutup",
		back: "Kembali",
		please: "Silakan",
		welcome: "Selamat datang",
		sorry: "Maaf",
		error: "Terjadi kesalahan",
		success: "Operasi berhasil",
		noData: "Tidak ada data",
		loading: "Memuat...",
		offline: "Anda sedang offline",
		retry: "Coba lagi",
		cancel: "Batal",
		confirm: "Konfirmasi",
		save: "Simpan",
		delete: "Hapus",
		edit: "Edit",
		update: "Perbarui",
		login: "Masuk",
		email: "Email",
        submit : "Kirim",
		oldPassword: "Kata Sandi Lama",
		newPassword: "Kata Sandi Baru",
		confirmPassword: "Konfirmasi Kata Sandi",
		password: "Kata Sandi",
		logout: "Keluar",
		profile: "Profil",
		settings: "Pengaturan",
		language: "Bahasa",
		editProfile: "Edit Profil",
		changeLanguage: "Ubah Bahasa",
		termsConditions: "Syarat & Ketentuan",
		privacyPolicy: "Kebijakan Privasi",
		contactUs: "Hubungi Kami",
		aboutUs: "Tentang Kami",
		help: "Bantuan",
		home: "Beranda",
		search: "Cari",
		notifications: "Notifikasi",
		deleteAll: "Hapus Semua",
		confirmDelete: "Konfirmasi Hapus",
		confirmDeleteMessage:
			"Apakah Anda yakin ingin menghapus semua notifikasi?",
		deleteAllNotification: "Hapus Semua Notifikasi",
		allDocument: "Semua Dokumen",
		messages: "Pesan",
		checkIn: "Masuk",
		checkOut: "Keluar",
		location: "Lokasi",
		distance: "Jarak",
		meter: "meter",
		kilometer: "kilometer",
		hour: "jam",
		minute: "menit",
		second: "detik",
		office: "Kantor",
		monday: "Senin",
		tuesday: "Selasa",
		wednesday: "Rabu",
		thursday: "Kamis",
		friday: "Jumat",
		saturday: "Sabtu",
		sunday: "Minggu",
		shortDaysInWeek: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"],
		monthInYear: [
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
		],
		arrayCategory: ["Keluhan", "Laporan", "Permintaan"],
		arrayComplaint: ["Jaringan", "Komputer", "Printer", "Server"],
		arrayReport: ["Listrik", "AC", "Akses Pintu", "Internet"],
		arrayRequest: ["Meminjam Peralatan", "Lainnya"],
		arrayStatus: ["Belum Diproses", "Sudah Diproses"],
		personal: "Pribadi",
		professional: "Profesional",
		documents: "Berkas",
		atention: "Perhatian",
		atentionMessageChangePicture:
			"Pastikan foto profil memenuhi kriteria berikut:\n\n" +
			"• Memperlihatkan wajah secara penuh\n" +
			"• Foto setengah badan\n" +
			"• Tidak menggunakan masker\n\n" +
			"Apakah Anda ingin melanjutkan?",
		// area myppofile
		//area personal
		fullName: "Nama Lengkap",
		religion: "Agama",
		populationRestrationNumber: "Nomor Registrasi Penduduk",
		statusMarriage: "Status Pernikahan",
		phoneNumber: "Nomor Telepon",
		address: "Alamat",
		// end area personal
        // area pengambilan ATK
        itemName: "Nama Barang",
        chooseItem: "Pilih Barang",
        quantity: "Jumlah",
        description: "Deskripsi",
        quantityPlaceholder: "Masukkan Jumlah",
        descriptionPlaceholder: "Masukkan Deskripsi",
        addItem: "Tambah Barang",
        // akhir area pengambilan ATK

        // area status badge
        approve: "Setujui",
        approved: "Disetujui",
        reject: "Tolak",
        rejected: "Ditolak",
        draft: "Draf",
        process: "Proses",
        void: "Batal",
        waiting: "Menunggu",
        // akhir area status badge
        chooseDate: "Pilih Tanggal",
        date: "Tanggal",
        time: "Waktu",
        chooseTime: "Pilih Waktu",
        chooseDateTime: "Pilih Tanggal & Waktu",
        consultingType: "Jenis Konseling",
        chooseConsultingType: "Pilih Jenis Konseling",
        identity: "Identitas",
        chooseIdentity: "Pilih Identitas",
        name : "Nama",
        anonim : "Anonim",
        typeOffline: "Luring",
        typeOnline: "Daring",
        optional: "Opsional",        
		//area professional
		employeeId: "ID Karyawan",
		designation: "Jabatan",
		companyEmail: "Alamat Email Perusahaan",
		employeeType: "Tipe Karyawan",
		department: "Departemen",
		reportingManager: "Manajer Atasan",
		companyExperience: "Lama Bekerja",
		officeTime: "Waktu Kantor",

		// end area my profile
		// deretan menu
		calendar: "Kalender Kantor",
		menu: "Menu",
		support: "Bantuan IT Support",
		takingAtk: "Pengambilan Barang",
		dashboard: "Dashboard",
		document: "Dokumen",
		addDocument: "Tambah Dokumen",
		member: "Anggota",
		other: "Lainnya",
		myProfile: "Profil Saya",
		changePassword: "Ubah Kata Sandi",
		passwordMismatch:
			"Kata sandi baru dan konfirmasi kata sandi tidak cocok.",
		logout: "Keluar",
		//end deretan menu
		formLeave: "Formulir Cuti",
		formOvertime: "Formulir Lembur",
		formConsultation: "Formulir Konsultasi",
		formPermission: "Formulir Izin",
		category: "Pilih Kategori",
		subCategory: "Pilih Sub Kategori",
		description: "Deskripsi",
		attachment: "Lampiran",
		swipeToCheckIn: "Geser untuk Absen",
		todayAttendance: "Kehadiran Hari Ini",
		attendance: "Absensi",
		shift: "Shift",
		salary: "Gaji",
		announcement: "Pengumuman",
		viewAll: "Lihat Semua",
		emailDomain: "Email harus menggunakan domain @intilab.com",
		aroundOffice: "Anda berada di sekitar Kantor",
		metersFromOffice: "meter dari Kantor",
		kilometersFromOffice: "kilometer dari Kantor",
		unauthorized: "Tidak diizinkan: 401",
		internalServerError: "Kesalahan Server Internal: 500",
		networkError: "Respon jaringan tidak ok",
		offlineMessage:
			"Anda sedang offline. Data akan dikirim saat Anda kembali online.",
		unauthorizedMessage:
			"Tidak diizinkan. Silakan periksa kredensial Anda.",
		serverErrorMessage:
			"Terjadi kesalahan pada server. Silakan coba lagi nanti.",
		generalErrorMessage: "Terjadi kesalahan. Silakan coba lagi.",
		photoLocationUnavailable: "Foto atau lokasi tidak tersedia",
		termsAndConditions: `Selamat datang di Aplikasi Internal Inti Surya Laboratorium. Aplikasi ini dirancang khusus untuk memenuhi kebutuhan administrasi internal, termasuk namun tidak terbatas pada manajemen absensi, cuti, lembur, kalender kerja, dan pemberitahuan internal. Dengan menggunakan aplikasi ini, Anda setuju dengan syarat dan ketentuan berikut:

1. Hanya untuk Penggunaan Internal
Aplikasi ini hanya diperuntukkan bagi karyawan dan personel yang berwenang dari Inti Surya Laboratorium. Segala penggunaan di luar keperluan perusahaan atau oleh pihak yang tidak berwenang sangat dilarang.

2. Kerahasiaan Informasi
Semua data, informasi, dan materi dalam aplikasi ini bersifat rahasia perusahaan. Pengguna dilarang mengungkapkan, membagikan, atau mendistribusikan informasi yang terdapat dalam aplikasi ini kepada pihak luar tanpa izin tertulis dari manajemen.

3. Kepatuhan terhadap Kebijakan Perusahaan
Pengguna harus mematuhi kebijakan dan peraturan perusahaan yang terkait dengan penggunaan aplikasi ini. Pelanggaran terhadap kebijakan ini dapat mengakibatkan tindakan disipliner sesuai dengan ketentuan perusahaan.

4. Hak Cipta dan Kepemilikan
Aplikasi ini beserta seluruh isinya, termasuk desain, fitur, dan kode, adalah milik eksklusif Inti Surya Laboratorium. Segala bentuk reproduksi, modifikasi, distribusi, atau penggunaan di luar ketentuan ini tanpa izin tertulis dilarang keras dan akan dikenakan tindakan hukum.

5. Keamanan Akun
Pengguna bertanggung jawab untuk menjaga kerahasiaan informasi akun, termasuk nama pengguna dan kata sandi. Segala aktivitas di bawah akun pengguna adalah tanggung jawab pemilik akun. Jika terjadi pelanggaran keamanan atau akses tidak sah, pengguna harus segera melaporkannya kepada personel perusahaan terkait.

6. Pemeliharaan dan Perubahan Aplikasi
Inti Surya Laboratorium berhak untuk memelihara, memperbarui, atau mengubah aplikasi ini kapan saja tanpa pemberitahuan sebelumnya. Perubahan ini dapat mencakup fitur, layanan, atau syarat penggunaan.

7. Batasan Tanggung Jawab
Inti Surya Laboratorium tidak bertanggung jawab atas kerugian langsung atau tidak langsung yang timbul dari penggunaan aplikasi ini, termasuk kehilangan data, keterlambatan akses, atau gangguan teknis lainnya.

8. Pelanggaran dan Sanksi
Setiap pelanggaran terhadap syarat dan ketentuan ini dapat mengakibatkan pembatasan akses, pemutusan hubungan kerja, atau tindakan hukum sesuai dengan kebijakan perusahaan dan hukum yang berlaku.

Dengan menggunakan aplikasi ini, Anda dianggap telah membaca, memahami, dan menyetujui semua syarat dan ketentuan di atas. Jika Anda memiliki pertanyaan atau memerlukan informasi lebih lanjut, silakan hubungi tim pengelola aplikasi di Inti Surya Laboratorium.

Hak Cipta © 2024 Inti Surya Laboratorium. Seluruh hak cipta dilindungi.
        `,
		// izin form
		izinForm: "Form Izin",
		cutititle: "Form Cuti",
		tanggal: "Tanggal",
		jam: "Jam",
		mulaiTanggal: "Mulai Tanggal",
		selesaiTanggal: "Sampai Tanggal",
		mulaiWaktu: "Mulai Jam",
		selesaiWaktu: "Sampai Jam",
		mulai: "Mulai",
		selesai: "Selesai",
		keterangan: "Keterangan",
		cutiKusus: "Cuti Khusus",
		pilihCutiKusus: "Pilih Cuti Khusus",
		cuti: "cuti",
		pilihTanggal: "pilih Tanggal",
		pilihWaktu: "Pilih Waktu",
		loading: "Memuat",
		pilihType: "Pilih Type",
		pilihGambar: "Pilih Gambar",
		sakit: "Sakit",
		kegiatan: "Kegiatan",
		datangTerlambat: "Datang Terlambat",
		uploadImage: "Unggah Gambar",
	},
	"zh-CN": {
		pilihAnggota: '选择成员',
        masukkanKeterangan: '插入明确说明',
        greeting: '你好',
		farewell: "再见",
		thankYou: "谢谢",
		waittingProcess: "等待处理",
		processed: "已处理",
		pending: "待处理",
		rejected: "已拒绝",
		cancelled: "已取消",
		yes: "是",
		no: "不",
		close: "关闭",
		back: "返回",
		please: "请",
		welcome: "欢迎",
		sorry: "对不起",
		error: "发生错误",
		success: "操作成功",
		noData: "没有数据",
		loading: "加载中...",
		offline: "您处于离线状态",
		retry: "重试",
		cancel: "取消",
		confirm: "确认",
		save: "保存",
		delete: "删除",
		edit: "编辑",
		update: "更新",
		login: "登录",
		email: "电子邮件",
        submit : "提交",
		oldPassword: "旧密码",
		newPassword: "新密码",
		confirmPassword: "确认密码",
		password: "密码",
		logout: "登出",
		profile: "个人资料",
		settings: "设置",
		language: "语言",
		editProfile: "编辑个人资料",
		changeLanguage: "更改语言",
		termsConditions: "条款和条件",
		privacyPolicy: "隐私政策",
		contactUs: "联系我们",
		aboutUs: "关于我们",
		help: "帮助",
		home: "首页",
		search: "搜索",
		deleteAll: "全部删除",
		confirmDelete: "确认删除",
		confirmDeleteMessage: "您确定要删除所有通知吗？",
		deleteAllNotification: "删除所有通知",
		notifications: "通知",
		allDocument: "所有文档",
		messages: "消息",
		checkIn: "打卡",
		checkOut: "签退",
		location: "位置",
		distance: "距离",
		meter: "米",
		kilometer: "公里",
		hour: "小时",
		minute: "分钟",
		second: "秒",
		office: "办公室",
		monday: "周一",
		tuesday: "周二",
		wednesday: "周三",
		thursday: "周四",
		friday: "周五",
		saturday: "周六",
		sunday: "周日",
		shortDaysInWeek: [
			"周日",
			"周一",
			"周二",
			"周三",
			"周四",
			"周五",
			"周六",
		],
		monthInYear: [
			"一月",
			"二月",
			"三月",
			"四月",
			"五月",
			"六月",
			"七月",
			"八月",
			"九月",
			"十月",
			"十一月",
			"十二月",
		],
		arrayCategory: ["投诉", "报告", "请求"],
		arrayComplaint: ["网络", "电脑", "打印机", "服务器"],
		arrayReport: ["电力", "空调", "门禁", "互联网"],
		arrayRequest: ["借用设备", "其他"],
		arrayStatus: ["未处理", "已处理"],
		personal: "个人",
		professional: "专业",
		documents: "文件",
		atention: "警告",
		atentionMessageChangePicture:
			"请确保个人资料照片符合以下标准：\n\n" +
			"• 显示完整的面部\n" +
			"• 半身照片\n" +
			"• 不戴口罩\n\n" +
			"您想继续吗？",

		// area myppofile
		//area personal
		fullName: "全名",
		religion: "宗教",
		populationRestrationNumber: "居民注册号",
		statusMarriage: "婚姻状况",
		phoneNumber: "电话号码",
		address: "地址",
		// end area personal
        // 区域：领取文具
        itemName: "物品名称",
        chooseItem: "选择物品",
        quantity: "数量",
        description: "描述",
        quantityPlaceholder: "输入数量",
        descriptionPlaceholder: "输入描述",
        addItem: "添加物品",
        // 结束区域：领取文具
        // 区域：状态徽章
        approve: "批准",
        approved: "已批准",
        reject: "拒绝",
        rejected: "已拒绝",
        draft: "草稿",
        process: "处理中",
        void: "无效",
        waiting: "等待",
        // 结束区域：状态徽章
        chooseDate : "选择日期",
        date : "日期",
        time : "时间",
        chooseTime : "选择时间",
        chooseDateTime : "选择日期和时间",
        consultingType : "咨询类型",
        chooseConsultingType : "选择咨询类型",
        identity : "身份",
        chooseIdentity : "选择身份",
        name : "姓名",
        anonim : "匿名",
        typeOffline : "线下",
        typeOnline : "线上",
        optional : "可选",

		//area professional
		employeeId: "员工ID",
		designation: "职位",
		companyEmail: "公司电子邮件地址",
		employeeType: "员工类型",
		department: "部门",
		reportingManager: "上级经理",
		companyExperience: "公司经验",
		officeTime: "办公室时间",

		// end area my profile
		// deretan menu
		calendar: "办公室日历",
		menu: "菜单",
		support: "技術支援協助",
		takingAtk: "拿貨",
		dashboard: "仪表板",
		document: "文档",
		addDocument: "添加文档",
		member: "成员",
		other: "连连",
		myProfile: "我的个人资料",
		changePassword: "更改密码",
		passwordMismatch: "新密码和确认密码不匹配。",
		logout: "登出",
		//end deretan menu
		formLeave: "请假表单",
		formOvertime: "加班表单",
		formConsultation: "咨询表单",
		formPermission: "请假表单",
		category: "选择类别",
		subCategory: "选择子类别",
		description: "描述",
		attachment: "附件",
		swipeToCheckIn: "滑動即可簽到",
		todayAttendance: "今日考勤",
		attendance: "考勤",
		shift: "轮班",
		salary: "工资",
		announcement: "公告",
		viewAll: "查看全部",
		emailDomain: "电子邮件必须使用域名 @intilab.com",
		aroundOffice: "您在办公室附近",
		metersFromOffice: "米离办公室",
		kilometersFromOffice: "公里离办公室",
		unauthorized: "未经授权：401",
		internalServerError: "内部服务器错误：500",
		networkError: "网络响应不正常",
		offlineMessage: "您处于离线状态。数据将在您重新上线时发送。",
		unauthorizedMessage: "未经授权。请检查您的凭据。",
		serverErrorMessage: "服务器发生错误。请稍后再试。",
		generalErrorMessage: "发生错误。请再试一次。",
		photoLocationUnavailable: "照片或位置不可用",
		termsAndConditions: `欢迎使用 Inti Surya 实验室内部应用程序。 此应用程序专为满足内部行政需求而设计，包括但不限于管理出勤、请假、加班、工作日历和内部通知。 使用此应用程序即表示您同意以下条款和条件：

1. 仅限内部使用
本应用程序仅供 Inti Surya 实验室的员工和授权人员使用。 严禁出于公司相关目的之外的任何用途或未经授权的个人使用。

2. 信息保密
此应用程序中的所有数据、信息和材料均为公司机密。 用户不得在未经管理层书面许可的情况下向外部方披露、分享或分发本应用程序中的任何信息。

3. 遵守公司政策
用户必须遵守与使用本应用程序相关的公司政策和规定。 违反本政策可能会导致根据公司规定采取纪律处分。

4. 版权和所有权
本应用程序及其所有内容，包括设计、功能和代码，均为 Inti Surya 实验室的专有财产。 未经书面许可，严禁以任何形式复制、修改、分发或在本条款之外使用，否则将面临法律诉讼。

5. 帐户安全
用户有责任维护帐户信息的机密性，包括用户名和密码。 用户帐户下的所有活动均由帐户所有者负责。 如果发生安全漏洞或未经授权的访问，用户必须立即向相关公司人员报告。

6. 应用程序的维护和更改
Inti Surya 实验室保留随时维护、更新或修改本应用程序的权利，恕不另行通知。 这些更改可能包括功能、服务或使用条款。

7. 责任限制
Inti Surya 实验室不对因使用本应用程序而导致的任何直接或间接损失负责，包括数据丢失、访问延迟或其他技术中断。

8. 违规和处罚
任何违反这些条款和条件的行为可能会导致访问限制、终止雇佣关系或根据公司政策和适用法律采取法律行动。

使用本应用程序即表示您已阅读、理解并同意上述所有条款和条件。 如果您有任何疑问或需要更多信息，请联系 Inti Surya 实验室的应用程序管理团队。

版权所有 © 2024 Inti Surya Laboratorium。 保留所有权利。
        `,
		izinForm: "许可表",
		cutititle: "请假单",
		tanggal: "日期",
		jam: "时钟",
		mulaiTanggal: "开始日期",
		selesaiTanggal: "截止日期",
		mulaiWaktu: "开始时间",
		selesaiWaktu: "直到小时",
		mulai: "开始",
		selesai: "完成",
		keterangan: "描述",
		cutiKusus: "特别假",
		pilihCutiKusus: "选择特别假",
		cuti: "离开",
		pilihTanggal: "选择日期",
		pilihWaktu: "选择时间",
		loading: "加载中",
		pilihType: "选择类型",
		pilihGambar: "皮利甘巴尔",
		sakit: "萨基特",
		kegiatan: "凯吉亚坦",
		datangTerlambat: "大唐土兰巴特",
		uploadImage: "上传图片",
	},
};

export default languages;
