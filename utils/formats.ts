export const formatDateTime = new Intl.DateTimeFormat("zh-TW", {
    hour12: false,
    dateStyle: "long",
    timeStyle: "medium",
});

export const formatDate = (date?: Date | number) => {
    if (!date) date = Date.now();
    if (typeof date === "number") date = new Date(date);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`
};
