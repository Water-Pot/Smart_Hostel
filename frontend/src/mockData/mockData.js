export const ENUMS = {
  ROLES: ["TENANT", "ADMIN"],
  PAYMENT_METHODS: ["BKASH", "NAGAD", "ROCKET", "ONLINE", "OFFLINE"],
  DAYS: ["SATURDAY", "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
  MEAL_TYPES: ["BREAKFAST", "LUNCH", "DINNER"],
  TRANSACTION_TYPES: ["DEBIT", "CREDIT"],
  PAYMENT_PURPOSES: ["ROOM_RENT", "MEAL_TOKEN"],
  COMPLAINT_STATUS: ["SUBMITTED", "IN_REVIEW", "RESOLVED", "REJECTED"],
};

export const users = [
  {
    id: "U-1001",
    fullName: "Arafat Hasan",
    email: "arafat.tenant@smarthostel.com",
    phone: "+8801712345601",
    role: "TENANT",
    isVerified: true,
    roomId: "R-201",
  },
  {
    id: "U-1002",
    fullName: "Nadia Rahman",
    email: "nadia.tenant@smarthostel.com",
    phone: "+8801712345602",
    role: "TENANT",
    isVerified: true,
    roomId: "R-203",
  },
  {
    id: "U-1003",
    fullName: "Sabbir Chowdhury",
    email: "sabbir.tenant@smarthostel.com",
    phone: "+8801712345603",
    role: "TENANT",
    isVerified: false,
    roomId: null,
  },
  {
    id: "U-9001",
    fullName: "Fatema Akter",
    email: "fatema.admin@smarthostel.com",
    phone: "+8801712000001",
    role: "ADMIN",
    isVerified: true,
    roomId: null,
  },
  {
    id: "U-9002",
    fullName: "Imran Hossain",
    email: "imran.staff@smarthostel.com",
    phone: "+8801712000002",
    role: "ADMIN",
    isVerified: true,
    roomId: null,
  },
];

export const rooms = [
  {
    id: "R-201",
    floor: "2ND_FLOOR",
    roomType: "DOUBLE",
    monthlyRent: 4500,
    capacity: 2,
    occupiedBeds: 1,
    available: true,
  },
  {
    id: "R-202",
    floor: "2ND_FLOOR",
    roomType: "DOUBLE",
    monthlyRent: 4500,
    capacity: 2,
    occupiedBeds: 2,
    available: false,
  },
  {
    id: "R-203",
    floor: "2ND_FLOOR",
    roomType: "SINGLE",
    monthlyRent: 6000,
    capacity: 1,
    occupiedBeds: 1,
    available: false,
  },
  {
    id: "R-301",
    floor: "3RD_FLOOR",
    roomType: "TRIPLE",
    monthlyRent: 3800,
    capacity: 3,
    occupiedBeds: 1,
    available: true,
  },
  {
    id: "R-302",
    floor: "3RD_FLOOR",
    roomType: "TRIPLE",
    monthlyRent: 3800,
    capacity: 3,
    occupiedBeds: 0,
    available: true,
  },
];

export const transactions = [
  {
    id: "TX-90001",
    userId: "U-1001",
    transactionType: "DEBIT",
    paymentPurpose: "ROOM_RENT",
    paymentMethod: "BKASH",
    amount: 4500,
    status: "SUCCESS",
    date: "2026-04-03T10:20:00Z",
  },
  {
    id: "TX-90002",
    userId: "U-1001",
    transactionType: "DEBIT",
    paymentPurpose: "MEAL_TOKEN",
    paymentMethod: "NAGAD",
    amount: 1200,
    status: "SUCCESS",
    date: "2026-04-05T13:10:00Z",
  },
  {
    id: "TX-90003",
    userId: "U-1002",
    transactionType: "DEBIT",
    paymentPurpose: "ROOM_RENT",
    paymentMethod: "ONLINE",
    amount: 6000,
    status: "PENDING",
    date: "2026-04-10T09:45:00Z",
  },
  {
    id: "TX-90004",
    userId: "U-1003",
    transactionType: "DEBIT",
    paymentPurpose: "MEAL_TOKEN",
    paymentMethod: "OFFLINE",
    amount: 800,
    status: "FAILED",
    date: "2026-04-14T19:05:00Z",
  },
  {
    id: "TX-90005",
    userId: "U-9001",
    transactionType: "CREDIT",
    paymentPurpose: "ROOM_RENT",
    paymentMethod: "ROCKET",
    amount: 4500,
    status: "SUCCESS",
    date: "2026-04-15T14:30:00Z",
  },
];

export const menus = [
  {
    id: "MENU-SUN",
    day: "SUNDAY",
    mealType: "BREAKFAST",
    items: ["Paratha", "Egg Curry", "Tea"],
    servingTime: "08:00 - 09:30",
  },
  {
    id: "MENU-MON",
    day: "MONDAY",
    mealType: "LUNCH",
    items: ["Rice", "Dal", "Chicken Roast", "Salad"],
    servingTime: "13:00 - 14:30",
  },
  {
    id: "MENU-TUE",
    day: "TUESDAY",
    mealType: "DINNER",
    items: ["Khichuri", "Beef Curry", "Yogurt"],
    servingTime: "20:00 - 21:30",
  },
  {
    id: "MENU-WED",
    day: "WEDNESDAY",
    mealType: "LUNCH",
    items: ["Rice", "Fish Curry", "Mixed Vegetables"],
    servingTime: "13:00 - 14:30",
  },
];

export const complaints = [
  {
    id: "CMP-301",
    userId: "U-1001",
    title: "Wi-Fi speed is very low",
    category: "INTERNET",
    description: "The internet becomes unusable in room R-201 after 8 PM.",
    complaintStatus: "IN_REVIEW",
    createdAt: "2026-04-12T18:00:00Z",
    updatedAt: "2026-04-13T09:00:00Z",
  },
  {
    id: "CMP-302",
    userId: "U-1002",
    title: "Water filter issue",
    category: "MAINTENANCE",
    description: "The water filter on 2nd floor needs replacement.",
    complaintStatus: "SUBMITTED",
    createdAt: "2026-04-14T11:25:00Z",
    updatedAt: "2026-04-14T11:25:00Z",
  },
  {
    id: "CMP-303",
    userId: "U-1003",
    title: "Meal served late",
    category: "MEAL",
    description: "Dinner was served 45 minutes late for two days.",
    complaintStatus: "RESOLVED",
    createdAt: "2026-04-09T20:15:00Z",
    updatedAt: "2026-04-11T10:10:00Z",
  },
];

export const tenantDashboardSummary = {
  tenantId: "U-1001",
  roomId: "R-201",
  currentDue: 4500,
  todayMenuDay: "SUNDAY",
  todaysMealMenu: ["Paratha", "Egg Curry", "Tea"],
  unpaidTransactions: ["TX-90003"],
};

export const adminDashboardSummary = {
  totalUsers: users.length,
  tenantCount: users.filter((user) => user.role === "TENANT").length,
  pendingComplaints: complaints.filter((complaint) => complaint.complaintStatus !== "RESOLVED").length,
  recentTransactionIds: transactions.slice(0, 3).map((transaction) => transaction.id),
  availableRooms: rooms.filter((room) => room.available).length,
};

const mockData = {
  ENUMS,
  users,
  rooms,
  transactions,
  menus,
  complaints,
  tenantDashboardSummary,
  adminDashboardSummary,
};

export default mockData;
