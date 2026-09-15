export type MealType = 'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner';
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface DailyMenu {
    Breakfast: string[];
    Lunch: string[];
    Snacks: string[];
    Dinner: string[];
}

export const commonItems = {
    Breakfast: ["Tea", "Coffee", "Milk", "Bournvita", "Cornflakes", "Oats", "Bread", "Butter", "Jam", "Sprouts", "Fruits", "Egg"],
    Lunch: ["Salad", "Pickle", "Papad", "Curd", "Pulka Roti", "Ghee Roti", "Steam Rice", "Kerala Rice"],
    Snacks: ["Tea", "Coffee", "Pay Snacks"],
    Dinner: ["Salad", "Pickle", "Papad", "Pulka Roti", "Steam Rice", "Kerala Rice"]
};

// Week 1 & 3
export const week1Menu: Record<DayOfWeek, DailyMenu> = {
    Monday: {
        Breakfast: ["Idli", "Wada", "Sambhar", "Chatni", "Boiled Egg / Banana", "Boiled Peanut", "Cornflakes"],
        Lunch: ["Padwal Chana Dry", "Aloo Tomato Raswala", "Jeera Rice", "Dal Makhani", "Sambhar", "Fresh Juice"],
        Snacks: ["Pay Snacks"],
        Dinner: ["Cabbage Thoran", "Gobi Mutter Masala", "Steam Rice", "Dal Fry", "Rasam", "Sweet: Seviya Kheer"]
    },
    Tuesday: {
        Breakfast: ["Poori Bhaji / Puttu", "Kadala Curry", "Boiled Egg / Watermelon", "Sprouted Moong", "Bournvita"],
        Lunch: ["Mixveg Dry", "Dal Khichdi", "Dahi Kadi Pakoda", "Sambhar", "Flavoured Juice"],
        Snacks: ["Pay Snacks"],
        Dinner: ["Paneer Mutter Masala", "Tomato Rice", "Dal Pancharatna", "Rasam", "Sweet: Ice Cream"]
    },
    Wednesday: {
        Breakfast: ["Podi Dosa", "Chatni", "Sambhar", "Boiled Egg / Banana", "Boiled Chana", "Oats"],
        Lunch: ["Aloo Bhindi Dry", "Rajma Masala", "Tadka Rice", "Dal Kolhapuri", "Sambhar", "Fresh Juice"],
        Snacks: ["Pay Snacks"],
        Dinner: ["Paneer Kadai / Chicken Kadai", "Dudhi Chana Dry", "Steam Rice", "Dal Methi", "Rasam", "Sweet: Gulab Jamun"]
    },
    Thursday: {
        Breakfast: ["Poha & Upma", "Chatni", "Omlette / Cut Fruits", "Mix Sprouts", "Cornflakes"],
        Lunch: ["Aloo Jeera Dry", "Chole Masala", "Poori", "Lemon Rice", "Dal Tadka", "More Curry", "Flavoured Juice"],
        Snacks: ["Pay Snacks"],
        Dinner: ["Tendli Chana (Kovaka) Dry", "Egg Curry / Corn Capsicum", "Mushroom Masala", "Steam Rice", "Dal Palak", "Rasam", "Sweet: Pineapple Sheera"]
    },
    Friday: {
        Breakfast: ["Pav Bhaji", "Vellappam with Veg Stew", "Boiled Egg / Banana", "Sprout", "Bournvita"],
        Lunch: ["Carrot Aloo Beans Dry", "Sprouted Mix Curry", "Steam Rice", "Dal Fry", "Methi Paratha", "Sambhar", "Fresh Juice"],
        Snacks: ["Pay Snacks"],
        Dinner: ["Cabbage Poriyal", "Paneer Kolhapuri / Chicken Kolhapuri", "Ghee Rice", "Mix Dal", "Sweet: Burfi / Laddu"]
    },
    Saturday: {
        Breakfast: ["Aloo Paratha / Seviya Upma", "Curd / Green Chatni", "Boiled Egg / Banana", "Oats", "Sprout"],
        Lunch: ["Chana Masala", "Veg Pulao", "Veg Raitha", "Dal Fry", "Buttermilk", "Rasam", "Flavoured Juice"],
        Snacks: ["Pay Snacks"],
        Dinner: ["Aloo Capsicum Dry", "Soyabean Mutter Masala", "Tadka Rice", "Yellow Dal Tadka", "Sambhar", "Sweet: Payasam"]
    },
    Sunday: {
        Breakfast: ["Masala Dosa", "Sambhar", "Chatni", "Boiled Egg / Banana", "Cornflakes", "Sprout"],
        Lunch: ["Veg with Paneer Biriyani / Chicken Biriyani", "Raitha", "Beetroot Dry", "Dal Tadka", "Lime Juice"],
        Snacks: ["Pay Snacks"],
        Dinner: ["Raw Banana Dry", "Aloo Mutter Gravy", "Steam Rice", "Dal Fry", "Triangle Paratha", "Sambhar", "Sweet: Fruit Custard"]
    }
};

// Week 2 & 4
export const week2Menu: Record<DayOfWeek, DailyMenu> = {
    Monday: {
        Breakfast: ["Idli", "Wada", "Sambhar", "Chatni", "Boiled Egg / Banana", "Boiled Black Chana", "Cornflakes"],
        Lunch: ["Whole Pulses Dry", "Dahi Bhindi Masala", "Dal Pappu", "Sambhar", "Fresh Juice"],
        Snacks: ["Pay Snacks"],
        Dinner: ["Cabbage Mutter Dry", "Veg Kofta Curry", "Chana Dal Masala", "Rasam", "Sweet: Seviya Kheer"]
    },
    Tuesday: {
        Breakfast: ["Poori Bhaji / Nool Puttu", "Kadala Curry", "Boiled Egg / Watermelon", "Sprouted Moong", "Bournvita"],
        Lunch: ["Veg Kolhapuri", "Tomato Rice", "Raita", "Dal Tadka", "Sambhar", "Flavoured Juice"],
        Snacks: ["Pay Snacks"],
        Dinner: ["Aloo Green Chawli Dry", "Mutter Paneer", "Rice", "Dal Fry", "Rasam", "Sweet: Ice Cream"]
    },
    Wednesday: {
        Breakfast: ["Set Dosa", "Red Chatni", "Sambhar", "Boiled Egg / Banana", "Sprout", "Oats"],
        Lunch: ["Mix Veg Dry", "Methi Malai Mutter", "Triangle Paratha", "Steam Rice", "Dal", "Sambhar", "Jaljeera"],
        Snacks: ["Pay Snacks"],
        Dinner: ["Beetroot Poriyal", "Paneer Kolhapuri / Chicken Kolhapuri", "Green Peas Pulao", "Dal", "Rasam", "Sweet: Gulab Jamun"]
    },
    Thursday: {
        Breakfast: ["Poha & Upma", "Chatni", "Omlette / Cut Fruits", "Sprout", "Cornflakes"],
        Lunch: ["Aloo Methi / Aloo Jeera", "Chole Masala", "Poori", "Dal Fry", "Lemon Rice", "More Curry", "Dal", "Rasam", "Flavoured Juice"],
        Snacks: ["Pay Snacks"],
        Dinner: ["Padwal Chana Dry", "Egg Masala / Corn Capsicum", "Mushroom Masala", "Snake Gourd Dry", "Sweet: Pineapple Sheera"]
    },
    Friday: {
        Breakfast: ["Pav Bhaji", "Vellappam with Veg Stew", "Boiled Egg / Banana", "Boiled Black Chana", "Bournvita"],
        Lunch: ["Veg Soya Chunk", "Rajma Masala", "Jeera Rice", "Dal Palak", "Sambhar", "Fresh Juice"],
        Snacks: ["Pay Snacks"],
        Dinner: ["Cabbage Poriyal", "Chicken Kebab with Curry / Paneer Tikka Masala", "Dal Lasooni Tadka", "Sweet: Burfi / Laddu"]
    },
    Saturday: {
        Breakfast: ["Aloo Paratha / Green Peas Upma", "Curd / Green Chatni", "Boiled Egg / Banana", "Oats", "Sprout"],
        Lunch: ["Mix Veg Semi Dry", "Besan Gatte Masala", "Dal Fry", "Steam Rice", "Rasam", "Flavoured Juice"],
        Snacks: ["Pay Snacks"],
        Dinner: ["Veg Fried Rice / Veg Noodles", "Veg Manchurian Gravy", "Aloo Capsicum", "Dal Adraki", "Rasam", "Sweet: Payasam"]
    },
    Sunday: {
        Breakfast: ["Masala Dosa", "Sambhar", "Chatni", "Boiled Egg / Banana", "Cornflakes", "Boiled Peanut"],
        Lunch: ["Mandi Rice", "Chicken Masala / Paneer Masala", "Beetroot Dry", "Dal Tadka", "Lime Juice"],
        Snacks: ["Pay Snacks"],
        Dinner: ["Aloo Mutter Dry", "Brinjal Curry", "Triangle Paratha", "Sambhar", "Sweet: Fruit Custard"]
    }
};
