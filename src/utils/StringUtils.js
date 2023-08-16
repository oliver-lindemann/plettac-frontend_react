export const escapeRegExp = (text) => {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export const removeWhitespace = (text) => {
    return text?.toString().replace(/\s/g, '') || '';
}

export const trimToUpperCase = (text) => {
    return removeWhitespace(text).toUpperCase();
}

export const concatString = (str1, str2, join) => {
    if (str1 && str2) return str1 + join + str2
    if (str1) return str1;
    if (str2) return str2;
    return '';
}

export const formatDate = (date) => {
    return new Date(Date.parse(date)).toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
    })
}

export const getInitialsOf = (name) => {
    let initials = name?.split(' ').map(val => val[0]).join('');
    if (initials?.length > 2) {
        initials = initials[0] + initials[initials.length - 1]
    }
    return initials;
}

export const toCapitalCase = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}