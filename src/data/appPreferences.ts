import type {SQLiteDatabase} from 'expo-sqlite';
export type AppLanguage='pt-BR'|'en-US';
export async function getAppLanguage(db:SQLiteDatabase):Promise<AppLanguage>{
 const row=await db.getFirstAsync<{language:string}>('SELECT language FROM app_preferences WHERE id=1');
 return row?.language==='en-US'?'en-US':'pt-BR';
}
export async function setAppLanguage(db:SQLiteDatabase,language:AppLanguage):Promise<void>{
 await db.runAsync('UPDATE app_preferences SET language=? WHERE id=1',language);
}
