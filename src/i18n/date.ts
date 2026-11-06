import type {AppLanguage} from '../data/appPreferences';
import {parseLocalDate} from '../core/scheduling';
export function localizedDay(localDate:string,language:AppLanguage):string{
 const {year,month,day}=parseLocalDate(localDate);
 return new Intl.DateTimeFormat(language,{weekday:'short',day:'2-digit',month:'short',timeZone:'UTC'}).format(new Date(Date.UTC(year,month-1,day)));
}
