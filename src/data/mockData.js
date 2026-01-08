// Dữ liệu mẫu - Đã bổ sung nhiều trường hợp test

export const CURRENT_USER = {
  id: "NV-00128",
  department: "F.O.H",
  roles: ["Phục vụ", "Pha chế"], // User KHÔNG có vai trò Thu ngân/Bếp
  fullName: "Hoàng Đức Tùng",
  email: "tung.hoang@xinkfnb.com",
  dob: "20/10/2000",
  phone: "0905 123 456",
  address: "Q. Hải Châu, Đà Nẵng",
  joinDate: "15/06/2023",
  cccdNumber: "048200001234",
  cccdDate: "15/05/2021",
  cccdImageFront: "https://via.placeholder.com/300x180/e5e7eb/9ca3af?text=CCCD+Mat+Truoc",
  cccdImageBack: null,
  emergencyName: "Nguyễn Văn Ba (Bố)",
  emergencyPhone: "0905 999 888",
};

// --- CA CỦA TÔI (MY SHIFTS) ---
// Giả lập lịch làm việc dày đặc hơn trong tuần
export const INITIAL_MY_SHIFTS = [
  {
    date: "25", day: "T3",
    shifts: [
      { id: 101, time: "08:00 – 16:00", location: "CHÚ BI", role: "PHA CHẾ", transferFrom: null }
    ]
  },
  {
    date: "26", day: "T4",
    shifts: [
      { id: 102, time: "08:00 – 12:00", location: "CHÚ BI", role: "PHỤC VỤ", transferFrom: null },
    ]
  },
  {
    date: "27", day: "T5",
    shifts: [
      { id: 103, time: "18:00 – 22:00", location: "CHÚ BI", role: "PHA CHẾ", transferFrom: null }
    ]
  },
  {
    date: "29", day: "T7",
    shifts: [
      { id: 104, time: "14:00 – 22:00", location: "CHÚ BI", role: "PHỤC VỤ", transferFrom: "Lê Văn Hùng" } // Đã nhận từ người khác
    ]
  },
  {
    // CẤU HÌNH NGÀY HÔM NAY ĐỂ TEST
    date: "19", day: "T3",
    shifts: [
      {
        id: 999,
        // HÃY SỬA GIỜ Ở DÒNG DƯỚI ĐỂ TEST:
        // Nếu bây giờ là 18:15, để 19:00 sẽ bị KHÓA. Để 18:20 sẽ MỞ.
        time: "19:00 – 23:00",
        location: "CHÚ BI",
        role: "PHA CHẾ",
        transferFrom: null
      }
    ]
  },
];

// --- KHO CA LÀM (MARKET SHIFTS) ---
// Bao gồm các case: Hợp lệ, Trùng giờ, Sai vai trò
export const INITIAL_MARKET_SHIFTS = [
  // CASE 1: HỢP LỆ (Nhận được)
  {
    id: 'm1', role: "Phục vụ", date: "26/11", day: "T4", time: "18:00 - 22:00",
    owner: "Trần Thị B", location: "CHÚ BI", reason: "Bận học đột xuất"
  },

  // CASE 2: TRÙNG GIỜ (Ngày 27 T5 user đã có ca 18:00 - 22:00)
  // Ca này 19:00 - 23:00 -> Bị trùng đoạn 19:00-22:00
  {
    id: 'm2', role: "Pha chế", date: "27/11", day: "T5", time: "19:00 - 23:00",
    owner: "Nguyễn Văn A", location: "CHÚ BI", reason: "Ốm đau"
  },

  // CASE 3: SAI VAI TRÒ (User chỉ là Phục vụ/Pha chế)
  {
    id: 'm3', role: "Thu ngân", date: "28/11", day: "T6", time: "08:00 - 12:00",
    owner: "Lê Thị C", location: "CHÚ BI", reason: "Về quê ăn cưới"
  },

  // CASE 4: HỢP LỆ (Ngày trống)
  {
    id: 'm4', role: "Phục vụ", date: "28/11", day: "T6", time: "08:00 - 16:00",
    owner: "Phạm D", location: "CHÚ BI", reason: "Đổi ca"
  },

  // CASE 5: HỢP LỆ (Khác giờ ngày 26: User làm sáng, ca này tối muộn)
  {
    id: 'm5', role: "Pha chế", date: "26/11", day: "T4", time: "22:00 - 02:00",
    owner: "Vũ K", location: "CHÚ BI", reason: "Mệt mỏi"
  },

  // CASE 6: SAI VAI TRÒ (Bếp)
  {
    id: 'm6', role: "Bếp", date: "30/11", day: "CN", time: "10:00 - 14:00",
    owner: "Đầu bếp T", location: "CHÚ BI", reason: "Con ốm"
  }
];