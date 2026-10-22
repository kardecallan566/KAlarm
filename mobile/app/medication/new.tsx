import { useLocalSearchParams } from 'expo-router';
import { MedicationForm } from '../../src/features/MedicationForm';
export default function NewMedication(){const {id}=useLocalSearchParams<{id?:string}>();return <MedicationForm id={typeof id==='string'?id:undefined}/>}
