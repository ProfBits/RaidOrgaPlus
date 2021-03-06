import { Raid } from 'models/Raid';
import { SpielerTermin } from 'models/Spieler';
import { Termin } from 'models/Termin';
import { OkPacket } from 'mysql';
import * as db from '../../db/connector';
import * as dateMapper from './dateMapper';

export {
	isArchived, listActive, listArchived, listAllIds, getRaidId, newTermin, newTerminWithEndTime, archive, addBoss, addWing,
	isLocked, setLocked, deleteTermin as delete, getText, saveText, doesTerminExist
};

async function isArchived(terminId: number): Promise<boolean> {
    const stmt = 'SELECT isArchived FROM Termin WHERE id = ?';
    try {
        const response: Termin[] = await db.queryV(stmt, terminId);
        return (response[0] && response[0].isArchived);
    } catch(e) {
        throw e;
    }
}

async function isLocked(terminId: number): Promise<boolean> {
    const stmt = 'SELECT isLocked FROM Termin WHERE id = ?';
    try {
        const response: Termin[] = await db.queryV(stmt, terminId);
        return (response[0] && response[0].isLocked);
    } catch(e) {
        throw e;
    }
}

async function setLocked(terminId: number, locked: boolean): Promise<OkPacket> {
    const stmt = 'UPDATE Termin SET isLocked = ? WHERE id = ?';
	const isLocked = locked ? 1 : 0;
    try {
        return await db.queryV(stmt, [isLocked, terminId]);
    } catch(e) {
        throw e;
    }
}

async function getRaidId(terminId: number): Promise<Raid[]> {
    const stmt = 'SELECT Raid.id FROM Raid JOIN Termin ON Termin.fk_raid = Raid.id WHERE Termin.id = ?';
    try {
        return (await db.queryV(stmt, terminId));
    } catch(e) {
        throw e;
    }
}

async function listAllIds(raidId: number): Promise<number[]> {
    const stmt = 'SELECT Termin.id FROM Termin JOIN Raid ON Termin.fk_raid = Raid.id WHERE Raid.id = ?';
    try {
		const response: { id: number }[] = (await db.queryV(stmt, raidId));
		return response.map(r => r.id);
    } catch(e) {
        throw e;
    }
}

async function listActive(userId: number, raidId: number): Promise<(Termin & SpielerTermin)[]> {
    const stmt = 'SELECT Termin.id, Termin.date, Termin.time, Termin.endtime, Spieler_Termin.type ' +
        'FROM Termin ' +
        'JOIN Raid ON Termin.fk_raid = Raid.id ' +
        'LEFT JOIN Spieler_Termin ON Spieler_Termin.fk_spieler = ? AND Spieler_Termin.fk_termin = Termin.id ' +
        'WHERE Raid.id = ? AND Termin.isArchived = 0 ' +
        'ORDER BY Termin.date, Termin.time';
    try {
		const result: (Termin & SpielerTermin)[] = await db.queryV(stmt, [userId, raidId]);
        return result.map(dateMapper.map);
    } catch(e) {
        throw e;
    }
}

async function listArchived(raidId: number): Promise<Termin[]> {
    const stmt = 'SELECT Termin.id, Termin.date, Termin.time, Termin.endtime FROM Termin JOIN Raid ON Termin.fk_raid = Raid.id WHERE Raid.id = ? AND Termin.isArchived = 1 ORDER BY Termin.date DESC, Termin.time DESC';
    try {
		const result: Termin[] = await db.queryV(stmt, raidId);
        return result.map(dateMapper.map);
    } catch(e) {
        throw e;
    }
}

async function newTermin(raid: number, date: any, time: any): Promise<OkPacket> {
    const stmt = 'INSERT INTO Termin (fk_raid, date, time) VALUES (?,?,?)';
    try {
        return await db.queryV(stmt, [raid, date, time]);
    } catch(e) {
        throw e;
    }
}

async function newTerminWithEndTime(raid: number, date: any, time: any, endtime: any): Promise<OkPacket> {
    const stmt = 'INSERT INTO Termin (fk_raid, date, time, endtime) VALUES (?,?,?,?)';
    try {
        return await db.queryV(stmt, [raid, date, time, endtime]);
    } catch(e) {
        throw e;
    }
}


async function archive(termin: number): Promise<OkPacket> {
    const stmt = 'UPDATE Termin SET isArchived = 1, isLocked = 0, preview = 0 WHERE id = ?';
    try {
        return await db.queryV(stmt, termin);
    } catch(e) {
        throw e;
    }
}

async function addBoss(termin: number, boss: number): Promise<OkPacket> {
    const stmt = 'INSERT INTO Aufstellung (fk_termin, fk_boss) VALUES (?,?)';
    try {
        return await db.queryV(stmt, [termin, boss]);
    } catch(e) {
        throw e;
    }
}

async function addWing(termin: number, wing: number): Promise<OkPacket> {
    const stmt = 'INSERT INTO Aufstellung (fk_termin, fk_boss) SELECT ?, id FROM Encounter WHERE wing = ?';
    try {
        return await db.queryV(stmt, [termin, wing]);
    } catch(e) {
        throw e;
    }
}

async function deleteTermin(termin: number): Promise<OkPacket> {
    const stmt = 'DELETE FROM Termin WHERE id = ?';
    try {
        return await db.queryV(stmt, termin);
    } catch(e) {
        throw e;
    }
}

async function getText(termin: number): Promise<string[]> {
    const stmt = 'SELECT text FROM Termin WHERE id = ?';
    try {
		const response: { text: string }[] = await db.queryV(stmt, termin);
		return response.map(r => r.text);
    } catch(e) {
        throw e;
    }
}

async function saveText(termin: number, text: string): Promise<OkPacket> {
    const stmt = 'UPDATE Termin SET text = ? WHERE id = ?';
    try {
        return await db.queryV(stmt, [text, termin]);
    } catch(e) {
        throw e;
    }
}

async function doesTerminExist(termin: number): Promise<boolean> {
    const stmt = 'SELECT count(*) AS count FROM Termin WHERE id = ?';
    const terminExists: { count: number }[] = await db.queryV(stmt, [termin]);
    return !(terminExists[0].count === 0);
}