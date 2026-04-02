export const sanitizeString = (str: string) => {
    return str.trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
}