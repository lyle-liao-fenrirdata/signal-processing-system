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

export const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    if (size < 1024 * 1024 * 1024) return `${(size / 1024 / 1024).toFixed(1)} MB`;
    return `${(size / 1024 / 1024 / 1024).toFixed(2)} GB`;
}


