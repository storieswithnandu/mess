import { type DailyMenu, week1Menu, week2Menu, type DayOfWeek, commonItems } from '../data/menu';
import styles from './DailyMenuCard.module.css';

interface DailyMenuProps {
    day: DayOfWeek;
    weekParity: 'odd' | 'even';
}

export const DailyMenuCard = ({ day, weekParity }: DailyMenuProps) => {
    const menu = weekParity === 'odd' ? week1Menu : week2Menu;
    const todayMenu = menu[day];
    const mealOrder = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'];

    return (
        <div className={styles.grid}>
            {mealOrder.map((type) => {
                const items = todayMenu[type as keyof DailyMenu];
                const extras = commonItems[type as keyof typeof commonItems];

                return (
                    <div key={type} className={`bento-card ${styles.card}`}>
                        <div className={`${styles.header} ${styles[type.toLowerCase()]}`}>
                            <h3>{type}</h3>
                        </div>
                        <ul className={styles.list}>
                            {items.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                        {extras && extras.length > 0 && (
                            <div className={styles.extras}>
                                + {extras.join(", ")}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
