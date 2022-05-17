export const dateFormatShort = (d: Date) => {
    //return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
};
