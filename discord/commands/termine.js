const _termine = require('../services/endpoints/termine');
const _aufstellungen = require('../services/endpoints/aufstellungen');
const _embeds = require('../services/embedProvider');
const _icons = require('../services/icons');

exports.run = async (client, message, args) => {
    if (!message.raid) {
        message.channel.send('Für diesen Channel wurde kein Raid verlinkt.');
        return;
    }
    const pickedTermin = args[0];
    const pickedAufstellung = args[1];

    const termine = await _termine.getTermine(message);
    if (termine.length === 0) {
        message.channel.send('Es gibt keine kommenden Termine oder dir fehlt die Berechtigung, diese anzuzeigen.');
    } else {
        if (pickedTermin && pickedTermin <= termine.length) {
            const termin = termine[pickedTermin - 1];
            const aufstellungen = await _aufstellungen.getAufstellungen(message, termin.id);
            if (pickedAufstellung && pickedAufstellung <= aufstellungen.length) {
                /*
                    Embed: 1 Aufstellung
                 */
                const aufstellung = aufstellungen[pickedAufstellung - 1];
                const elements = await _aufstellungen.getElements(message, aufstellung.id);
                let aufstellungString = '';
                const empty = client.emojis.find(emoji => emoji.name === 'empty');
                for (let i = 0; i < elements.length; i++) {
                    const element = elements[i];
                    const clss = client.emojis.find(emoji => emoji.name === element.class.toLowerCase());
                    const role = client.emojis.find(emoji => emoji.name === element.role.toLowerCase() + '_');
                    aufstellungString += `${clss? clss : empty} ${role? role: empty} - ${element.name}\n`
                }
                let embed = _embeds.defaultEmbed().setTitle(`${message.raid.name} - Aufstellung`)
                    .addField('Datum', termin.date)
                    .addField('Uhrzeit', termin.time)
                    .addField('Boss', `(${pickedAufstellung}) ${aufstellung.name}`)
                    .addField('Aufstellung', aufstellungString)
                    .setThumbnail(_icons.encIcon(aufstellung.abbr));
                message.channel.send(embed);
            } else {
                /*
                    Embed: 1 Termin
                 */
                const allBosses = aufstellungen.map((a, index) => `(${index + 1}) ${a.name}`).join('\n');
                let embed = _embeds.defaultEmbed().setTitle(`${message.raid.name} - Kommender Termin`)
                    .addField('Datum', termin.date)
                    .addField('Uhrzeit', termin.time)
                    .addField('Geplante Bosse', allBosses);
                message.channel.send(embed);
            }
        } else {
            /*
                Embed: Alle Termine
             */
            let embed = _embeds.defaultEmbed().setTitle(`${message.raid.name} - Alle Termine`);
            for (let i = 0; i < termine.length; i++) {
                const termin = termine[i];
                embed = embed.addField(`(${i + 1}) ${termin.date}`, termin.time);
            }
            message.channel.send(embed);
        }
    }
};

exports.help = {
    usage: '!orga link',
    desc: 'Verknüpft einen Raid mit einem Discord-Channel.'
};
