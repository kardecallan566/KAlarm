import React,{createContext,useCallback,useContext,useEffect,useMemo,useState,type ReactNode} from 'react';
import {useSQLiteContext} from 'expo-sqlite';
import {getAppLanguage,setAppLanguage,type AppLanguage} from '../data/appPreferences';
import {dictionaries,type TranslationKey} from './translations';
type LanguageContextValue={language:AppLanguage;setLanguage:(next:AppLanguage)=>Promise<void>;t:(key:TranslationKey,values?:Record<string,string|number>)=>string;ready:boolean};
const LanguageContext=createContext<LanguageContextValue|null>(null);
export function LanguageProvider({children}:{children:ReactNode}){
 const db=useSQLiteContext();const [language,setLanguageState]=useState<AppLanguage>('pt-BR');const [ready,setReady]=useState(false);
 useEffect(()=>{let active=true;getAppLanguage(db).then(value=>{if(active)setLanguageState(value)}).catch(()=>{}).finally(()=>{if(active)setReady(true)});return()=>{active=false}},[db]);
 const setLanguage=useCallback(async(next:AppLanguage)=>{await setAppLanguage(db,next);setLanguageState(next)},[db]);
 const t=useCallback((key:TranslationKey,values?:Record<string,string|number>)=>{
  let value=dictionaries[language][key]??dictionaries['pt-BR'][key]??key;
  if(values)for(const [name,replacement] of Object.entries(values))value=value.replaceAll(`{${name}}`,String(replacement));
  return value;
 },[language]);
 const value=useMemo(()=>({language,setLanguage,t,ready}),[language,setLanguage,t,ready]);
 return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
export function useLanguage(){const value=useContext(LanguageContext);if(!value)throw new Error('useLanguage must be used inside LanguageProvider');return value;}
