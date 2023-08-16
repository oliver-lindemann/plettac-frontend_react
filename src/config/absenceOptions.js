export const absenceOptions = [
    { text: '-', value: '' },
    { text: 'Unentschuldigt fehlend', value: 'uf' },
    { text: 'Krank', value: 'k' },
    { text: 'Kind krank', value: 'Kind krank' },
    { text: 'Berufsschule', value: 'b' },
    { text: 'ÜLU', value: 'ül' },
    { text: 'Urlaub', value: 'u' },
    { text: 'Unbezahlt frei', value: 'unb' },
    { text: 'Feiertag', value: 'f' },
    { text: 'S-Kug', value: 's' }
];

export const absenceOptionsArray = {
    '': '-',
    'uf': 'Unentschuldigt fehlend',
    'k': 'Krank',
    'Kind krank': 'Kind krank',
    'b': 'Berufsschule',
    'ül': 'ÜLU',
    'u': 'Urlaub',
    'unb': 'Unbezahlt frei',
    'f': 'Feiertag',
    's': 'S-Kug'
}

export const getAbsenceOptionDescription = (value) => {
    return absenceOptions[value];
}