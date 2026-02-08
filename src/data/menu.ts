export type MealType = 'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner';
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface DailyMenu {
    Breakfast: string[];
    Lunch: string[];
    Snacks: string[];
    Dinner: string[];
}

export const commonItems = {
    Breakfast: ["Bread", "Butter", "Jam", "Milk", "Tea", "Coffee"],
    Lunch: ["Pickle", "Papad", "Salad"],
    Snacks: ["Tea", "Coffee"],
    Dinner: ["Salad", "Pickle"]
};

// Week 1 & 3
export const week1Menu: Record<DayOfWeek, DailyMenu> = {
    Monday: {
        Breakfast: ["Aloo Paratha", "Ketchup", "Curd", "Mint Chutney"],
        Lunch: ["Phulka", "White Rice", "Kerala Rice", "Chana Masala", "Arhar Dal", "Sambar", "Chutney", "Curd"],
        Snacks: ["Onion Kachori", "Ketchup", "Fried Chilly"],
        Dinner: ["Fried Rice", "Phulka", "Dal Tadka", "Gobhi Manchurian"]
    },
    Tuesday: {
        Breakfast: ["Masala Dosa", "Tomato Chutney", "Sambar"],
        Lunch: ["Puri", "Aloo Palak", "Ridge Gourd", "White Rice", "Kerala Rice"],
        Snacks: ["Aloo Bonda", "Tomato Ketchup"],
        Dinner: ["Phulka", "Chole Masala", "Jeera Rice", "Dal", "Ice Cream"]
    },
    Wednesday: {
        Breakfast: ["Dal Kichdi", "Coconut Chutney", "Dahi Boondi", "Peanut Butter"],
        Lunch: ["Chapathi", "White Rice", "Greenpeas Masala", "Kerala Rice"],
        Snacks: ["Green Matar Chat"],
        Dinner: ["Hyderabadi Paneer/Chicken", "White Rice", "Moong Dal", "Paratha"]
    },
    Thursday: {
        Breakfast: ["Puri", "Chana Masala"],
        Lunch: ["Chapathi", "White Rice", "Mix Dal", "Malai Kofta", "Bottle Gourd"],
        Snacks: ["Tikki Chat"],
        Dinner: ["Spl Dal", "Sambar", "Masala Dosa", "Tomato Chutney"]
    },
    Friday: {
        Breakfast: ["Fried Idly", "Vada", "Sambar", "Coconut Chutney"],
        Lunch: ["Phulka", "White Rice", "Kadai Veg", "Sambar", "Potato Cabbage"],
        Snacks: ["Pungulu", "Coconut Chutney"],
        Dinner: ["Chicken Gravy / Paneer Butter Masala", "Mix Dal", "Chapathi"]
    },
    Saturday: {
        Breakfast: ["Gobi Mix Veg Paratha", "Ketchup", "Green Coriander Chutney"],
        Lunch: ["Chapathi", "White Rice", "Rajma Masala", "Green Veg", "Ginger Dal"],
        Snacks: ["Samosa", "Ketchup", "Cold Coffee"],
        Dinner: ["Phulka", "Green Peas Masala", "White Rice", "Raw Banana Poriyal"]
    },
    Sunday: {
        Breakfast: ["Onion Rava Dosa", "Tomato Chutney", "Sambar"],
        Lunch: ["Chicken Dum Biryani / Chilli Paneer", "Shorba Masala", "Raita"],
        Snacks: ["Vada Pav", "Fried Green Chilly"],
        Dinner: ["Arhar Dal Tadka", "Aloo Fry", "Kadhi Pakoda", "Rice", "Chapati", "Gulab Jamun"]
    }
};

// Week 2 & 4
export const week2Menu: Record<DayOfWeek, DailyMenu> = {
    Monday: {
        Breakfast: ["Aloo Paratha", "Ketchup", "Curd", "Mint Chutney"],
        Lunch: ["Phulka", "Ghee Rice", "Aloo Chana Masala", "Soya Chilly", "Sambar"],
        Snacks: ["Macaroni"],
        Dinner: ["Paneer/Egg Biryani", "Raita", "Mutter Masala", "Phulka"]
    },
    Tuesday: {
        Breakfast: ["Upma", "Vada", "Coriander Chutney", "Curd"],
        Lunch: ["Chola", "Bhatura", "Toor Dal Fry", "Green Mix Veg", "Lemon Rice"],
        Snacks: ["Dahi Papdi Chat"],
        Dinner: ["Phulka", "White Rice", "Methi Dal", "Mix Veg", "Ice Cream"]
    },
    Wednesday: {
        Breakfast: ["Puttu", "Kadal Curry", "Peanut Butter"],
        Lunch: ["Chapathi", "Methi Dal", "Drumstick Gravy", "Dondakaya Dry"],
        Snacks: ["Mysore Bonda"],
        Dinner: ["Kadai Chicken / Paneer", "Pulao", "Mix Dal", "Butter Naan"]
    },
    Thursday: {
        Breakfast: ["Mini Chola Bhatura", "Seasonal Fruit"],
        Lunch: ["Chapathi", "Mutter Paneer", "Coriander Rice", "Kollu Rasam"],
        Snacks: ["Cutlet", "Tomato Ketchup"],
        Dinner: ["Arhar Dal Tadka", "Aloo Fry", "Kadhi Pakoda", "White Rice"]
    },
    Friday: {
        Breakfast: ["Podi Dosa", "Sambar", "Tomato Chutney", "Peanut Butter"],
        Lunch: ["Phulka", "Navadhanya Masala", "Sambar", "Green Mix Veg"],
        Snacks: ["Pani Puri"],
        Dinner: ["Chicken Gravy / Paneer Butter Masala", "Mix Dal", "Chapathi", "Sheera"]
    },
    Saturday: {
        Breakfast: ["Mix-veg Paratha", "Mint Chutney", "Curd", "Ketchup"],
        Lunch: ["Chapathi", "Green Peas Pulav", "Spinach Dal", "Gobhi Capsicum"],
        Snacks: ["Samosa", "Ketchup", "Cold Coffee"],
        Dinner: ["Dal Makhani", "Aloo Brinjal", "Sambar", "Phulka", "Kheem"]
    },
    Sunday: {
        Breakfast: ["Andhra Kara Dosa", "Peanut Chutney", "Sambar"],
        Lunch: ["Puri", "Biryani Rice", "Chicken/Paneer Masala", "Chana Dal"],
        Snacks: ["Pav Bhaji"],
        Dinner: ["Phulka", "Baby Aloo Masala", "Soya Chilli", "White Rice"]
    }
};
