export interface BusEntry {
    time: string;
    isMultiple?: boolean;
}

export interface ExtraBusEntry {
    time: string;
    label: string;
    route: string;
}

export interface BusRoute {
    nilaToSahyadri: BusEntry[];
    sahyadriToNila: BusEntry[];
    extraBuses?: ExtraBusEntry[];
}

export interface BusSchedule {
    workingDays: BusRoute;
    saturdays: BusRoute;
    sundays: BusRoute;
}

export const busSchedule: BusSchedule = {
    workingDays: {
        nilaToSahyadri: [
            { time: '7:45' }, // User added
            { time: '8:30', isMultiple: true },
            { time: '9:25' },
            { time: '9:45' },
            { time: '10:20' },
            { time: '10:45' },
            { time: '11:15' },
            { time: '11:50', isMultiple: true },
            { time: '12:15' },
            { time: '12:30', isMultiple: true },
            { time: '1:00', isMultiple: true },
            { time: '1:30', isMultiple: true },
            { time: '1:45', isMultiple: true },
            { time: '2:15' },
            { time: '2:45' },
            { time: '3:20' },
            { time: '3:45' },
            { time: '4:30' },
            { time: '5:00' },
            { time: '5:15', isMultiple: true },
            { time: '5:45' },
            { time: '6:00' },
            { time: '6:30' },
            { time: '7:00' },
            { time: '7:30' },
            { time: '8:00', isMultiple: true },
            { time: '8:30' },
            { time: '9:00' },
            { time: '10:00' },
            { time: '11:00' },
            { time: '12:00' },
        ],
        sahyadriToNila: [
            { time: '7:45' }, // User added
            { time: '8:15' },
            { time: '8:30', isMultiple: true },
            { time: '8:45' },
            { time: '9:00', isMultiple: true },
            { time: '9:25' },
            { time: '9:45' },
            { time: '10:20', isMultiple: true },
            { time: '10:45' },
            { time: '11:15' },
            { time: '11:50', isMultiple: true },
            { time: '12:15' },
            { time: '12:30', isMultiple: true },
            { time: '1:00', isMultiple: true },
            { time: '1:30', isMultiple: true },
            { time: '1:45', isMultiple: true },
            { time: '2:15' },
            { time: '2:45' },
            { time: '3:20' },
            { time: '3:45' },
            { time: '4:30' },
            { time: '5:00' },
            { time: '5:15', isMultiple: true },
            { time: '5:45' },
            { time: '6:00' },
            { time: '6:30' },
            { time: '7:00' },
            { time: '7:30' },
            { time: '8:00' },
            { time: '9:15' },
            { time: '10:15' },
            { time: '11:15' },
        ],
        extraBuses: [
            { time: '7:40 AM', label: 'Nila Gate -> Palakkad -> Sahyadri', route: 'Via Palakkad Town, Kadamkode, Manapullykavu, Maidaan (Govt. Hospital), Stadium Bus Stand, Kalmandapam, Chandranagar, Pudussery' },
            { time: '7:55 AM', label: 'Nila Gate -> Kalleppulley -> Sahyadri', route: 'Via Kalleppulley, Koppam, Sekharipuram, Mattumantha, Malampuzha' },
            { time: '8:00 AM', label: 'Palakkad -> Nila -> Sahyadri', route: 'Via Kadamkode, Manapullykavu, Maidaan (Govt. Hospital), Stadium Bus Stand, Kalmandapam, Chandranagar, Pudussery' },
            { time: '5:10 PM', label: 'Sahyadri -> Nila -> Palakkad', route: 'Via Pudussery, Kadamkode, Manapullykavu, Maidaan, Stadium Bus Stand. (On Fridays: to Kinar Stop)' },
            { time: '5:20 PM', label: 'Sahyadri -> Nila -> Kalleppulley', route: 'Via Nila Manogata, Malampuzha Road, Mattumantha, Sekharipuram, Koppam' },
            { time: '8:15 AM', label: 'Nila -> Wise Park -> Sahyadri', route: 'Nila 8:15 -> Wise Park 8:30 -> Nila Manogata 8:45 -> Sahyadri 9:00 (Service roads only)' },
            { time: '6:15 PM', label: 'Sahyadri -> Nila -> Wise Park', route: 'Sahyadri 6:15 -> Nila Gate -> Wise Park 6:45 -> Nila Manogata 7:00 (Service roads only)' }
        ]
    },
    saturdays: {
        nilaToSahyadri: [
            { time: '7:45' }, // Added for consistency
            { time: '8:30' },
            { time: '9:00' },
            { time: '9:30' },
            { time: '10:00' },
            { time: '10:30' },
            { time: '11:00' },
            { time: '11:30' },
            { time: '12:00' },
            { time: '12:30' },
            { time: '1:00' },
            { time: '1:30' },
            { time: '2:00' },
            { time: '2:30' },
            { time: '3:00' },
            { time: '3:30' },
            { time: '4:00' },
            { time: '4:30' },
            { time: '5:00' },
            { time: '5.15' },
            { time: '5:30' },
            { time: '6:00' },
            { time: '6:30' },
            { time: '7:00' },
            { time: '7:30' },
            { time: '8:00', isMultiple: true },
            { time: '8:30' },
            { time: '9:00' },
            { time: '10:00' },
            { time: '11:00' },
            { time: '12:00' },
        ],
        sahyadriToNila: [
            { time: '7:30' },
            { time: '7:45' }, // User added
            { time: '8:00' },
            { time: '8:30' },
            { time: '9:00' },
            { time: '9:30' },
            { time: '10:00' },
            { time: '10:30' },
            { time: '11:00' },
            { time: '11:30' },
            { time: '12:00' },
            { time: '12:30' },
            { time: '1:00' },
            { time: '1:30' },
            { time: '2:00' },
            { time: '2:30' },
            { time: '3:00' },
            { time: '3:30' },
            { time: '4:00' },
            { time: '4:30' },
            { time: '5:00' },
            { time: '5:30' },
            { time: '6:00' },
            { time: '6:30' },
            { time: '7:00' },
            { time: '7:30' },
            { time: '8:15' },
            { time: '9:15' },
            { time: '10:15' },
            { time: '11:15' },
        ],
        extraBuses: [
            { time: '7:40 AM', label: 'Working Day Route 1', route: 'Nila Gate -> Palakkad -> Sahyadri via Pudussery' },
            { time: '7:55 AM', label: 'Working Day Route 2', route: 'Nila Gate -> Kalleppulley -> Sahyadri via Malampuzha' },
            { time: '5:10 PM', label: 'Working Day Route 4', route: 'Sahyadri -> Nila -> Palakkad via Stadium' },
            { time: '1:00 PM', label: 'Sahyadri -> Palakkad', route: 'Sahyadri 1:00 -> Nila -> Stadium 1:30' },
            { time: '1:30 PM', label: 'Stadium -> Saraswati', route: 'Stadium 1:30 -> Nila -> Saraswati 2:00' },
            { time: '8:45 AM', label: 'Nila -> Wise Park -> Sahyadri', route: 'Nila 8:45 -> Wise Park 9:00 -> Nila Manogata 9:15 -> Sahyadri 9:30 (Service roads only)' },
            { time: '6:15 PM', label: 'Sahyadri -> Nila -> Wise Park', route: 'Sahyadri 6:15 -> Nila Gate -> Wise Park 6:45 -> Nila Manogata 7:00' }
        ]
    },
    sundays: {
        nilaToSahyadri: [
            { time: '7:45' }, // Added for consistency
            { time: '8:45' },
            { time: '9.15' },
            { time: '10:00' },
            { time: '11:00' },
            { time: '12:00' },
            { time: '12:30' },
            { time: '1:15' },
            { time: '2:00' },
            { time: '3:00' },
            { time: '4:00' },
            { time: '5:00' },
            { time: '6:00' },
            { time: '6:30' },
            { time: '7:00' },
            { time: '7:30' },
            { time: '8:00' },
            { time: '8:30' },
            { time: '9:00' },
            { time: '10:00' },
            { time: '11:00' },
            { time: '12:00' },
        ],
        sahyadriToNila: [
            { time: '7:45' }, // User added
            { time: '8:00' },
            { time: '8:30' },
            { time: '9:00' },
            { time: '9.30' },
            { time: '10:15' },
            { time: '11:15' },
            { time: '12:15' },
            { time: '12:45' },
            { time: '1:30' },
            { time: '2:15' },
            { time: '3:15' },
            { time: '4:15' },
            { time: '5:15' },
            { time: '6:00' },
            { time: '6:30' },
            { time: '7:00' },
            { time: '7:30' },
            { time: '8:15' },
            { time: '9:15' },
            { time: '10:15' },
            { time: '11:15' },
        ],
        extraBuses: []
    },
};
