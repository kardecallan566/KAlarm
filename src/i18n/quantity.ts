import type {Unit} from '../core/scheduling';
import type {AppLanguage} from '../data/appPreferences';
import {dictionaries,type TranslationKey} from './translations';
export function localizedQuantity(quantity:string,unit:Unit,language:AppLanguage):string{
 const singular=quantity==='1';
 const key:TranslationKey=unit==='tablet'?(singular?'quantity.tablet':'quantity.tablets')
  :unit==='capsule'?(singular?'quantity.capsule':'quantity.capsules')
  :unit==='drop'?(singular?'quantity.drop':'quantity.drops')
  :unit==='ml'?'quantity.ml':(singular?'quantity.unit':'quantity.units');
 const amount=language==='pt-BR'?quantity.replace('.',','):quantity.replace(',','.');
 return `${amount} ${dictionaries[language][key]}`;
}
