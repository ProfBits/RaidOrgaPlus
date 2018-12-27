const sf = require('snekfetch');

exports.fetchProgress = fetchProgress;
exports.accName = getAccname;
exports.permissions = getPermissions;

async function fetchProgress(key) {
    const options = {
        "headers": {
            "Authorization": "Bearer " + key
        }
    };
    const url = 'https://api.guildwars2.com/v2/account/raids';
    const response = await sf.get(url, options);
    return response.body;
}

async function getAccname(key) {
    const options = {
        "headers": {
            "Authorization": "Bearer " + key
        }
    };
    const url = 'https://api.guildwars2.com/v2/account';
    const response = await sf.get(url, options);
    return response.body.name;
}

async function getPermissions(key){
    const options = {
        "headers": {
            "Authorization": "Bearer " + key
        }
    };
    const url = 'https://api.guildwars2.com/v2/tokeninfo';
    const response = await sf.get(url, options);
    return response.body.permissions;
}