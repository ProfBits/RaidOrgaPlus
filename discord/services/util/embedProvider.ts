import { MessageEmbed } from "discord.js";
import * as _icons from "../icons";
import * as _kalender from "../endpoints/kalender";
import { DiscordClient } from "../../models/DiscordClient";

export function defaultEmbed() {
    return new MessageEmbed()
        .setColor('#F55535')
        .setTimestamp()
        .setFooter('RaidOrga+', _icons.miscIcon('raid'));
}

export function terminEmbed(client: DiscordClient, raidName: string, termin: any, aufstellungen: any[], anmeldungen: any[]) {
    const emojis = getAnmeldeEmojis(client);
    let allBosses = aufstellungen.map((a, index) => `(${index + 1}) ${a.name}${a.is_cm? ' CM' : ''}`).join('\n');
    if (allBosses === '') allBosses = 'Keine';
    let anmeldungenString = anmeldungen.filter(a => a.type < 3).map(a => `${emojis[a.type]} ${a.name}`).join('\n');
    if (anmeldungenString === '') anmeldungenString = 'Keine';
    return defaultEmbed().setTitle(`${raidName} - Kommender Termin`)
        .addField('Datum', termin.date)
        .addField('Uhrzeit', `${termin.time} - ${termin.endtime}`)
        .addField('Geplante Bosse', allBosses)
        .addField('Anmeldungen', anmeldungenString);
}

function getAnmeldeEmojis(client: DiscordClient) {
    const emojiYes = client.emojis.cache.find(emoji => emoji.name === 'yes');
    const emojiMaybe = client.emojis.cache.find(emoji => emoji.name === 'maybe');
    const emojiNo = client.emojis.cache.find(emoji => emoji.name === 'no');
    return [emojiYes, emojiMaybe, emojiNo];
}

export async function kalenderEmbed() {
    const week = await getTermine();
    let embed = defaultEmbed().setTitle(`Rising Light Kalender`)
        .setThumbnail(_icons.miscIcon('raid'));
    for (const day of week) {
        let dayString = '';
        for (const termin of day.termine) {
            dayString += terminToString(termin);
        }
        if (dayString === '') dayString = 'Keine Termine';
        dayString = `\`\`\`${dayString}\`\`\``;
        embed.addField(day.date, dayString);
    }
    return embed;
}

async function getTermine() {
    const termine = await _kalender.getKalenderTermine();
    const mapped_termine = termine.map(mapTermin);
    const weekdays = [];
    for (let i = 0; i < 7; i++) {
        weekdays[i] = mapped_termine.filter(t => t.date.getDay() === i);
    }
    const today_weekday = (new Date()).getDay();
    const weekdays_shifted = [];
    for (let i = 0; i < 7; i++) {
        const shifted_termine = weekdays[(today_weekday + i) % 7];
        const date = new Date();
        date.setDate(date.getDate() + i);
        const dateString = formatDate(date);
        weekdays_shifted[i] = {date: dateString, termine: shifted_termine};
    }
    return weekdays_shifted;
}

function formatDate(date: any) {
    let day = date.getDate();
    day = day < 10 ? `0${day}` : day;
    let month = date.getMonth();
    const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
    const weekday = date.getDay();
    const weekdays = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
    return `**${weekdays[weekday]}** - ${day}. ${months[month]}`;

}

function mapTermin(termin: any) {
    return {
        id: termin.id,
        date: new Date(termin.date),
        time: termin.time.slice(0,5),
        endtime: termin.endtime? termin.endtime.slice(0,5) : null,
        raid: termin.name
    };
}

function terminToString(termin: any) {
    if (termin.endtime) {
        return `${termin.time} - ${termin.endtime} | ${termin.raid}\n`;
    } else {
        return `${termin.time}         | ${termin.raid}\n`;
    }
}