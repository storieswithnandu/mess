import { useEffect, useState } from 'react';
import { getCurrentMeal } from '../utils/timeUtils';
import { week1Menu, week2Menu, type DailyMenu, commonItems, type DayOfWeek } from '../data/menu';
import styles from './NextMealCard.module.css';

interface NextMealCardProps {
    day: DayOfWeek;
    weekParity: 'odd' | 'even';
}

export const NextMealCard = ({ day, weekParity }: NextMealCardProps) => {
    const [currentMeal, setCurrentMeal] = useState(getCurrentMeal());

    useEffect(() => {
        const timer = setInterval(() => setCurrentMeal(getCurrentMeal()), 60000);
        return () => clearInterval(timer);
    }, []);

    const daysList: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const currentDayIndex = daysList.indexOf(day);
    const targetDay = currentMeal.type === 'Next Day' ? daysList[currentDayIndex + 1] : day;

    const menu = weekParity === 'odd' ? week1Menu : week2Menu;
    const itemsMenu = menu[targetDay];

    let displayMealType = currentMeal.type;
    let label = "Next Meal";

    if (currentMeal.type === 'Next Day') {
        displayMealType = 'Breakfast';
        label = "Tomorrow Morning";
    }


    const items = itemsMenu[displayMealType as keyof DailyMenu] || [];
    const extras = commonItems[displayMealType as keyof typeof commonItems] || [];

    return (
        <div className={`bento-card ${styles.container} ${styles[displayMealType.toLowerCase()]}`}>
            <div className={styles.topRow}>
                <span className={styles.label}>{label}</span>
                <span className={styles.icon}>
                    {displayMealType === 'Breakfast' && '☕'}
                    {displayMealType === 'Lunch' && '🍲'}
                    {displayMealType === 'Snacks' && '🥨'}
                    {displayMealType === 'Dinner' && '🌙'}
                </span>
            </div>

            <h2 className={styles.activeMeal}>{displayMealType}</h2>

            <div className={styles.itemsWrapper}>
                {items.length > 0 ? (
                    items.map((item: string, id: number) => (
                        <span key={id} className={styles.foodTag}>{item}</span>
                    ))
                ) : (
                    <span className={styles.empty}>Nothing scheduled</span>
                )}
            </div>

            {extras.length > 0 && (
                <div className={styles.footer}>
                    + {extras.join(", ")}
                </div>
            )}
        </div>
    );
};
