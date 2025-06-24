export function formatDate(dateString: string | undefined | Date): string {
    if (!dateString) {
        return "No date available";
    }
    const date = new Date(dateString);

    return `${formatTimeWith0(date.getHours())}:${formatTimeWith0(date.getMinutes())}:${formatTimeWith0(date.getSeconds())}`;
}

function formatTimeWith0(value: number) {
    return value < 10 ? `0${value}` : `${value}`;
}