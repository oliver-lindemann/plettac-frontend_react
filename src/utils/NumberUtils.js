export const formatWeight = (weight) => {
    const formattedNumber = formatNumber(weight);
    if (isNaN(formattedNumber)) {
        return '-';
    }
    return formattedNumber + " kg";
}

// Formatiere den gegebenen Wert als Zahl mit 2 Nachkommastellen
// Sollte es sich bei dem gegebenen Wert nicht um eine Zahl handeln,
// wird der Wert unverändert zurückgegeben.
export const formatNumber = (valueToFormat) => {
    let correctedNumber = valueToFormat;
    // Prüfe, ob der Wert eine Zahl repräsentiert (bspw: 1 | 3.8 | 32.32)
    if (!isNaN(valueToFormat)) {
        // Gebe Wert mit zwei Nachkommastellen zurück
        return parseFloat(correctedNumber).toFixed(2)
    }

    // Gegebener Wert ist keine Zahl, prüfe, ob es ein String ist
    if (typeof valueToFormat === 'string' || valueToFormat instanceof String) {
        // Wert ist keine Zahl, aber bspw. 1,5 | 3,93 
        // Ersetze das Komma durch einen Punkt und versuche es erneut
        correctedNumber = valueToFormat?.replace(/,/g, '.');
        if (isNaN(correctedNumber)) {
            // Es handelt sich hierbei nicht um eine Zahl,
            // gebe Wert unformatiert zurück.
            return valueToFormat;
        }
    }

    // Wert ist keine Zahl und kein String, gebe diesen unformatiert zurück
    return valueToFormat;
}

export const prependZero = (digit) => {
    return digit.toLocaleString('de-DE', {
        minimumIntegerDigits: 2,
        useGrouping: false
    })
}
