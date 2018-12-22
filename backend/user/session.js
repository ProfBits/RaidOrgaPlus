const db = require('../db/connector.js');

exports.start = startSession;
exports.getUser = getUserId;

async function startSession(id, uuid) {
    invalidate(id);
    const stmt = `INSERT INTO Session (user, uuid) VALUES (${id}, '${uuid}')`;
    try {
        return await db.query(stmt);
    } catch(e) {
        throw e;
    }
}

async function getUserId(uuid) {
    const stmt = `SELECT user FROM Session WHERE uuid = '${uuid}'`;
    try {
        return await db.query(stmt);
    } catch(e) {
        throw e;
    }
}

async function invalidate(id) {
    const stmt = `DELETE FROM Session WHERE user = ${id}`;
    try {
        return await db.query(stmt);
    } catch(e) {
        throw e;
    }
}