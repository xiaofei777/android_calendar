import { Lunar } from 'lunar-javascript';

export const getLunarText = (date) => {
    try {
        const lunar = Lunar.fromDate(date);
        const festivals = lunar.getFestivals();
        const jieQi = lunar.getJieQi();

        if (festivals.length > 0) return festivals[0];
        if (jieQi) return jieQi;
        if (lunar.getDay() === 1) return lunar.getMonthInChinese() + '月';
        return lunar.getDayInChinese();
    } catch (e) {
        return '';
    }
};

export const getLunarDateString = (date) => {
    try {
        const lunar = Lunar.fromDate(date);
        return `${lunar.getYearInGanZhi()}年 ${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`;
    } catch(e) { return '' }
};
