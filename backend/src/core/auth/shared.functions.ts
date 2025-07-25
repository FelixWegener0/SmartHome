export function getClientIp(request: any): string {
    const forwarded = request.headers['x-forwarded-for'];
    if (forwarded) {
      return Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0].trim();
    }
    return request.connection.remoteAddress || request.ip;
}

function formatNumberToString(value: number) {
    return value < 10 ? `0${value}` : value;
}

export function formatDate(date: Date) {
    return `${
        formatNumberToString(date.getHours())}:${
        formatNumberToString(date.getMinutes())}:${
        formatNumberToString(date.getSeconds())}-${
        formatNumberToString(date.getDate())}:${
        formatNumberToString(date.getMonth() + 1)}:${
        formatNumberToString(date.getFullYear()
    )}`;
}
