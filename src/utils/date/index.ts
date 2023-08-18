export default class DateUtil {
  public static convertTimestampToSeconds(timestamp: number): number {
    return parseInt(Math.ceil(timestamp).toString().substring(0, 10), 10);
  }

  public static getDateNowInSeconds() {
    return DateUtil.convertTimestampToSeconds(DateUtil.now());
  }

  public static getUtcTimestamp(date: Date | number): number {
    if (typeof date === "number") {
      date = new Date(DateUtil.convertTimestampToSeconds(date) * 1000);
    }
    return date.getTime() - date.getTimezoneOffset() * 60000;
  }

  public static now(): number {
    return DateUtil.getUtcTimestamp(Date.now());
  }
}
