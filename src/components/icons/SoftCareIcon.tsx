import { Image, type ImageSourcePropType } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { softcareIconXml, type SoftCareIconName } from './softcareIconXml';

/** Hand-drawn SoftCare PNG illustrations from the KAlarm visual identity. */
export type IllustratedIconName =
  'add' |
  'alarm' |
  'bell' |
  'calendar' |
  'capsule' |
  'clock' |
  'completed' |
  'confirm' |
  'day-plan' |
  'delete' |
  'drops' |
  'duration' |
  'edit' |
  'empty' |
  'history' |
  'home' |
  'liquid' |
  'medicines' |
  'muted' |
  'overdue' |
  'package' |
  'pause' |
  'pending' |
  'repeat-cycle' |
  'settings' |
  'snooze' |
  'tablet' |
  'taken' |
  'unconfirmed' |
  'weekly';
export type IconName = SoftCareIconName | IllustratedIconName;

/** Static require() paths are intentional: Metro needs to see every asset. */
const images: Partial<Record<IconName, ImageSourcePropType>> = {
  'add': require('../../../assets/softcare/icons/add.png'),
  'alarm': require('../../../assets/softcare/icons/alarm.png'),
  'bell': require('../../../assets/softcare/icons/bell.png'),
  'blister': require('../../../assets/softcare/icons/package.png'),
  'bottle': require('../../../assets/softcare/icons/liquid.png'),
  'calendar': require('../../../assets/softcare/icons/calendar.png'),
  'capsule': require('../../../assets/softcare/icons/capsule.png'),
  'clock': require('../../../assets/softcare/icons/clock.png'),
  'completed': require('../../../assets/softcare/icons/completed.png'),
  'confirm': require('../../../assets/softcare/icons/confirm.png'),
  'daily': require('../../../assets/softcare/icons/day-plan.png'),
  'date': require('../../../assets/softcare/icons/duration.png'),
  'day-plan': require('../../../assets/softcare/icons/day-plan.png'),
  'delete': require('../../../assets/softcare/icons/delete.png'),
  'drops': require('../../../assets/softcare/icons/drops.png'),
  'duration': require('../../../assets/softcare/icons/duration.png'),
  'edit': require('../../../assets/softcare/icons/edit.png'),
  'empty': require('../../../assets/softcare/icons/empty.png'),
  'history': require('../../../assets/softcare/icons/history.png'),
  'home': require('../../../assets/softcare/icons/home.png'),
  'liquid': require('../../../assets/softcare/icons/liquid.png'),
  'medicines': require('../../../assets/softcare/icons/medicines.png'),
  'muted': require('../../../assets/softcare/icons/muted.png'),
  'overdue': require('../../../assets/softcare/icons/overdue.png'),
  'package': require('../../../assets/softcare/icons/package.png'),
  'pause': require('../../../assets/softcare/icons/pause.png'),
  'pending': require('../../../assets/softcare/icons/pending.png'),
  'pill': require('../../../assets/softcare/icons/tablet.png'),
  'plus': require('../../../assets/softcare/icons/add.png'),
  'repeat': require('../../../assets/softcare/icons/repeat-cycle.png'),
  'repeat-cycle': require('../../../assets/softcare/icons/repeat-cycle.png'),
  'rotate': require('../../../assets/softcare/icons/repeat-cycle.png'),
  'settings': require('../../../assets/softcare/icons/settings.png'),
  'silent': require('../../../assets/softcare/icons/muted.png'),
  'snooze': require('../../../assets/softcare/icons/snooze.png'),
  'tablet': require('../../../assets/softcare/icons/tablet.png'),
  'taken': require('../../../assets/softcare/icons/taken.png'),
  'unconfirmed': require('../../../assets/softcare/icons/unconfirmed.png'),
  'unresolved': require('../../../assets/softcare/icons/unconfirmed.png'),
  'weekday': require('../../../assets/softcare/icons/weekly.png'),
  'weekly': require('../../../assets/softcare/icons/weekly.png'),
};

export function SoftCareIcon({ name, size = 32, label }: { name: IconName; size?: number; label?: string }) {
  const image = images[name];
  if (image) {
    return <Image source={image} resizeMode="contain" style={{ width:size, height:size }}
      accessible={Boolean(label)} accessibilityLabel={label} />;
  }
  // The original 35 SVGs are kept for small utility glyphs without PNG variants.
  return <SvgXml xml={softcareIconXml[name as SoftCareIconName]}
    width={size} height={size} accessible={Boolean(label)} accessibilityLabel={label} />;
}
