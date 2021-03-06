import { Aufstellung } from "models/Aufstellung";
import { Encounter } from "models/Encounter";
import { Raid } from "models/Raid";
import { OkPacket } from "mysql";
import * as db from "../../db/connector";

export { getForTermin, getRaidId, deleteBoss as delete, setSuccess, loadBlanko, copyElements, setCM };

async function getForTermin(termin: number): Promise<(Aufstellung & Encounter)[]> {
    const stmt = 'SELECT Aufstellung.id, Encounter.name, Encounter.abbr, Aufstellung.success, Aufstellung.report, Encounter.has_cm, Aufstellung.is_cm FROM Aufstellung JOIN Encounter ON Encounter.id = Aufstellung.fk_boss WHERE fk_termin = ? FOR UPDATE';
    try {
        return await db.queryV(stmt, termin);
    } catch(e) {
        throw e;
    }
}

async function getRaidId(aufstellung: number): Promise<Raid[]> {
    const stmt = 'SELECT Raid.id FROM Aufstellung JOIN Termin ON Termin.id = Aufstellung.fk_termin JOIN Raid ON Raid.id = Termin.fk_raid WHERE Aufstellung.id = ?';
    try {
        return await db.queryV(stmt, aufstellung);
    } catch(e) {
        throw e;
    }
}

async function deleteBoss(aufstellung: number): Promise<OkPacket> {
    const stmt = 'DELETE FROM Aufstellung WHERE id = ?';
    try {
        return await db.queryV(stmt, aufstellung);
    } catch(e) {
        throw e;
    }
}

async function setSuccess(aufstellung: number, success: boolean): Promise<OkPacket> {
    const stmt = 'UPDATE Aufstellung SET success = ? WHERE id = ?';
    try {
        const successValue = success ? 1 : 0;
        return await db.queryV(stmt, [successValue, aufstellung]);
    } catch(e) {
        throw e;
    }
}

async function loadBlanko(aufstellung: number): Promise<OkPacket> {
    const stmt = 'INSERT INTO AufstellungElement (fk_aufstellung, position, fk_spieler, fk_class, fk_role) ' +
        'SELECT ?, position, 0, fk_class, fk_role ' +
        'FROM BlankoElement ' +
        'WHERE fk_raid = (SELECT Raid.id FROM Raid JOIN Termin ON Termin.fk_raid = Raid.id JOIN Aufstellung ON Aufstellung.fk_termin = Termin.id WHERE Aufstellung.id = ?) ' +
        'AND fk_boss = (SELECT fk_boss FROM Aufstellung WHERE Aufstellung.id = ?)';
    try {
        return await db.queryV(stmt, [aufstellung, aufstellung, aufstellung]);
    } catch(e) {
        throw e;
    }
}

async function copyElements(from: number, to: number): Promise<OkPacket> {
    const stmt = 'INSERT INTO AufstellungElement (fk_aufstellung, position, fk_spieler, fk_class, fk_role) ' +
        'SELECT ?, position, f.fk_spieler, f.fk_class, f.fk_role ' +
        'FROM AufstellungElement f ' +
        'WHERE fk_aufstellung = ? ' +
        'ON DUPLICATE KEY UPDATE fk_spieler = f.fk_spieler, fk_class = f.fk_class, fk_role = f.fk_role';
    try {
        return await db.queryV(stmt, [to, from]);
    } catch(e) {
        throw e;
    }
}

async function setCM(aufstellung: number, cm: boolean): Promise<OkPacket> {
    const stmt = 'UPDATE Aufstellung SET is_cm = ? WHERE id = ?';
    try {
        const value = cm ? 1 : 0;
        return await db.queryV(stmt, [value, aufstellung]);
    } catch(e) {
        throw e;
    }
}