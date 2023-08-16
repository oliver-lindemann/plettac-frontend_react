
export const isDraftDismissIcon = (event) => {
    return event.target?.tagName === 'path'
        || event.target?.tagName === 'svg'
        || event.target?.tagName === 'BUTTON';
}