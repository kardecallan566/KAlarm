"""Generates original KAlarm SoftCare outline icons and RN-ready XML source map.

Each icon is hand-composed SVG geometry and shares the same rounded outline DNA.
Requires only the Python standard library. Does not depend on proprietary fonts.
"""
from pathlib import Path
from json import dumps

BASE=Path(__file__).parent
ROOT=BASE.parents[2]
COMPONENTS=ROOT/'components'/'softcare'
COMPONENTS.mkdir(parents=True, exist_ok=True)

outline={'nav':'#386B5C','form':'#427864','routine':'#6077A2','alarm':'#9A7254','action':'#427864','status':'#427864'}
soft={'nav':'#D7EDDF','form':'#BEE3D0','routine':'#DDE9FB','alarm':'#FBE3CC','action':'#D7EDDF','status':'#D8EFD9'}

# Each geometry is specifically authored for its named intent, rather than variants of a generic glyph.
ICONS={
'home':('nav','<path d="M10 31L32 12L54 31V52Q54 55 51 55H13Q10 55 10 52Z" fill="{f}"/><path d="M26 55V39Q26 36 29 36H35Q38 36 38 39V55" fill="white"/><path d="M10 32L32 12L54 32"/><path d="M48 14V20"/>'),
'medicines':('nav','<rect x="17" y="9" width="30" height="47" rx="11" fill="white"/><path d="M17 33H47V44Q47 56 35 56H29Q17 56 17 44Z" fill="{f}"/><path d="M17 33H47"/><path d="M23 17V23" stroke="{light}"/>'),
'calendar':('nav','<rect x="10" y="14" width="44" height="42" rx="9" fill="white"/><path d="M10 28H54V22Q54 14 46 14H18Q10 14 10 22Z" fill="{f}"/><path d="M10 28H54M22 9V20M42 9V20"/><rect x="18" y="35" width="12" height="12" rx="3" fill="{f}" stroke="none"/><path d="M37 41L41 45L48 37"/>'),
'history':('nav','<rect x="13" y="10" width="34" height="44" rx="8" fill="white"/><path d="M21 22H39M21 31H36M21 40H32"/><circle cx="46" cy="45" r="12" fill="{f}"/><path d="M46 37V45L51 48"/>'),
'settings':('nav','<circle cx="32" cy="32" r="20" fill="{f}"/><path d="M32 7V14M32 50V57M7 32H14M50 32H57M14 14L19 19M45 45L50 50M14 50L19 45M45 19L50 14"/><circle cx="32" cy="32" r="8" fill="white"/>'),
'pill':('form','<g transform="rotate(-38 32 32)"><rect x="20" y="8" width="24" height="48" rx="12" fill="white"/><path d="M20 32H44V44A12 12 0 0 1 20 44Z" fill="{f}"/><path d="M20 32H44"/><path d="M27 17V23" stroke="{light}"/></g><path d="M52 9V15M49 12H55" stroke="{light}"/>'),
'capsule':('form','<g transform="rotate(38 32 32)"><rect x="17" y="21" width="30" height="22" rx="11" fill="white"/><path d="M32 21H36A11 11 0 0 1 36 43H32Z" fill="{f}"/><path d="M32 21V43"/><path d="M24 26H27" stroke="{light}"/></g>'),
'drops':('form','<path d="M31 9C25 20 16 29 16 39A16 16 0 0 0 48 39C48 29 37 17 31 9Z" fill="{f}"/><path d="M24 41C24 46 28 49 32 49" stroke="{light}"/><circle cx="52" cy="17" r="3" fill="{light}" stroke="none"/>'),
'liquid':('form','<path d="M23 8H41V18L46 26V49Q46 55 40 55H24Q18 55 18 49V26L23 18Z" fill="white"/><path d="M18 33Q28 29 39 33L46 35V49Q46 55 40 55H24Q18 55 18 49Z" fill="{f}"/><path d="M22 15H42M26 25H38"/>'),
'blister':('form','<rect x="15" y="8" width="34" height="49" rx="8" fill="white"/><rect x="20" y="15" width="10" height="12" rx="5" fill="{f}"/><rect x="34" y="15" width="10" height="12" rx="5" fill="{f}"/><rect x="20" y="34" width="10" height="12" rx="5" fill="{f}"/><rect x="34" y="34" width="10" height="12" rx="5" fill="{f}"/>'),
'bottle':('form','<rect x="23" y="8" width="18" height="10" rx="3" fill="{f}"/><rect x="16" y="18" width="32" height="39" rx="8" fill="white"/><rect x="18" y="32" width="28" height="16" rx="3" fill="{f}" stroke="none"/><path d="M25 40H39M32 33V47"/>'),
'clock':('routine','<circle cx="32" cy="33" r="22" fill="white"/><circle cx="32" cy="33" r="16" fill="{f}" stroke="none"/><path d="M32 19V33L42 39"/><circle cx="32" cy="33" r="3" fill="{stroke}" stroke="none"/>'),
'daily':('routine','<circle cx="32" cy="32" r="21" fill="white"/><path d="M32 17V32L42 38"/><path d="M17 14L12 9M47 14L52 9"/><path d="M18 48Q32 56 46 48" stroke="{light}"/>'),
'weekday':('routine','<rect x="9" y="14" width="46" height="42" rx="9" fill="white"/><path d="M9 27H55V22Q55 14 47 14H17Q9 14 9 22Z" fill="{f}"/><path d="M21 9V19M42 9V19"/><circle cx="20" cy="37" r="4" fill="{f}"/><circle cx="32" cy="37" r="4" fill="{f}"/><circle cx="44" cy="37" r="4" fill="{f}"/><path d="M20 47H32"/>'),
'rotate':('routine','<path d="M49 25Q46 14 32 14Q18 14 13 27"/><path d="M13 17V28H24"/><path d="M15 39Q18 52 32 52Q47 52 51 38"/><path d="M51 48V37H40"/><rect x="27" y="23" width="10" height="19" rx="5" fill="{f}"/><path d="M27 32H37"/>'),
'repeat':('routine','<rect x="11" y="20" width="42" height="25" rx="12" fill="{f}"/><path d="M20 17L14 23L20 29M44 48L50 42L44 36"/><path d="M15 23Q19 14 33 14Q46 14 50 26M49 42Q45 52 31 52Q18 52 14 39"/>'),
'date':('routine','<rect x="12" y="13" width="40" height="43" rx="8" fill="white"/><path d="M12 27H52"/><path d="M23 9V19M41 9V19"/><path d="M21 39L29 46L43 34" stroke="#64A38B" strokeWidth="4"/>'),
'duration':('routine','<path d="M21 12H43M21 53H43"/><path d="M24 14V19Q24 25 32 32Q40 39 40 45V52M40 14V19Q40 25 32 32Q24 39 24 45V52" fill="{f}"/><path d="M24 49L32 43L40 49"/>'),
'bell':('alarm','<path d="M18 43L22 37V26Q22 16 32 16Q42 16 42 26V37L46 43Q48 46 44 46H20Q16 46 18 43Z" fill="{f}"/><path d="M27 50Q32 57 37 50"/><path d="M32 10V15"/>'),
'alarm':('alarm','<circle cx="32" cy="34" r="20" fill="white"/><path d="M32 22V34L42 39"/><path d="M14 11L7 19M50 11L57 19M23 53L20 59M41 53L44 59"/><circle cx="32" cy="34" r="3" fill="{f}"/>'),
'snooze':('alarm','<circle cx="28" cy="36" r="20" fill="white"/><path d="M28 25V36L37 42"/><path d="M42 13H55L43 25H55" stroke="{light}"/>'),
'silent':('alarm','<path d="M18 43L22 37V26Q22 16 32 16Q42 16 42 26V37L46 43H18Z" fill="{f}"/><path d="M27 50Q32 57 37 50"/><path d="M11 11L53 53" stroke="#A16464" strokeWidth="4"/>'),
'pending':('alarm','<circle cx="32" cy="32" r="22" fill="white"/><path d="M32 18V34"/><circle cx="32" cy="45" r="3" fill="{f}"/><path d="M17 18Q32 7 47 18" stroke="{light}"/>'),
'permission':('alarm','<path d="M32 7L51 15V30Q51 44 32 57Q13 44 13 30V15Z" fill="{f}"/><circle cx="32" cy="29" r="8" fill="white"/><path d="M32 25V30M32 35V36"/>'),
'plus':('action','<circle cx="32" cy="32" r="22" fill="{f}"/><path d="M32 20V44M20 32H44"/>'),
'edit':('action','<rect x="13" y="12" width="35" height="42" rx="8" fill="white"/><path d="M21 43L41 23L48 30L28 50L20 51Z" fill="{f}"/><path d="M37 27L44 34"/>'),
'delete':('action','<path d="M19 20H46L43 53Q43 56 40 56H25Q22 56 22 53Z" fill="{f}"/><path d="M16 19H49M26 18V12H39V18M29 28V46M38 28V46"/>'),
'confirm':('action','<circle cx="32" cy="32" r="22" fill="{f}"/><path d="M20 33L29 42L45 23" strokeWidth="4.6"/>'),
'pause':('action','<circle cx="32" cy="32" r="22" fill="{f}"/><rect x="22" y="20" width="7" height="24" rx="3" fill="white"/><rect x="35" y="20" width="7" height="24" rx="3" fill="white"/>'),
'copy':('action','<rect x="20" y="20" width="33" height="37" rx="7" fill="{f}"/><path d="M42 20V15Q42 10 37 10H16Q11 10 11 15V41Q11 46 16 46H20"/><path d="M29 33H44M29 42H41"/>'),
'save':('action','<path d="M13 10H45L52 18V54H13Z" fill="{f}"/><rect x="21" y="10" width="21" height="17" rx="2" fill="white"/><path d="M36 10V21"/><rect x="22" y="37" width="21" height="17" rx="3" fill="white"/>'),
'taken':('status','<path d="M32 55Q11 42 11 26Q11 13 23 13Q30 13 32 20Q34 13 41 13Q53 13 53 26Q53 42 32 55Z" fill="{f}"/><path d="M22 34L29 41L43 27" strokeWidth="4"/>'),
'unresolved':('status','<circle cx="32" cy="32" r="22" fill="white"/><path d="M24 24Q25 16 33 17Q42 17 42 25Q42 30 34 34V38"/><circle cx="33" cy="47" r="3" fill="{f}"/>'),
'overdue':('status','<circle cx="32" cy="33" r="21" fill="#FBE4CD"/><path d="M32 20V34L43 41"/><path d="M15 10L10 15M49 10L54 15" stroke="#B27853"/>'),
'empty':('status','<rect x="12" y="22" width="40" height="33" rx="8" fill="white"/><path d="M12 31Q32 38 52 31" stroke="{light}"/><path d="M23 17Q32 8 41 17" stroke="{light}"/><path d="M32 40V47M28.5 43.5H35.5"/>'),
}

NORMAL_SVGS={}
for i,(name,(category,geometry)) in enumerate(ICONS.items()):
    c=outline[category];f=soft[category];light='#A6D6C2' if category in ('nav','form','action','status') else ('#B6C8EC' if category=='routine' else '#EDBA96')
    inner=geometry.format(f=f,stroke=c,light=light)
    svg=(f'<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" '
         f'fill="none" stroke="{c}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">'
         +inner+'</svg>')
    NORMAL_SVGS[name]=svg
    (BASE/f'{name}.svg').write_text(svg,encoding='utf-8')

# Src map makes SVGs usable in Expo without an additional Metro .svg transformer.
lines=['// Auto-generated by assets/icons/softcare/generate_softcare.py; do not edit by hand.',
       '// SVG XML is rendered by react-native-svg SvgXml; original geometry, no external image dependencies.',
       'export const softcareIconXml = {']
for name,svg in NORMAL_SVGS.items():
    lines.append(f'  {dumps(name)}: {dumps(svg,ensure_ascii=False)},')
lines.append('} as const;')
lines.append('export type SoftCareIconName = keyof typeof softcareIconXml;')
(COMPONENTS/'softcareIconXml.ts').write_text('\n'.join(lines)+'\n',encoding='utf-8')
(COMPONENTS/'SoftCareIcon.tsx').write_text('''import React from 'react';
import { SvgXml } from 'react-native-svg';
import { softcareIconXml, type SoftCareIconName } from './softcareIconXml';

export type SoftCareIconProps = {
  name: SoftCareIconName;
  size?: number;
  accessibilityLabel?: string;
};

/** Presentational by default; accessible when a semantic label is passed. */
export function SoftCareIcon({ name, size = 32, accessibilityLabel }: SoftCareIconProps) {
  return <SvgXml
    xml={softcareIconXml[name]}
    width={size}
    height={size}
    accessible={Boolean(accessibilityLabel)}
    accessibilityLabel={accessibilityLabel}
  />;
}
''',encoding='utf-8')
(BASE/'README.md').write_text(f'''# SoftCare Icons — v0.1 experimental library

Generated **{len(ICONS)} unique original SVG designs** (64×64 viewBox) for KAlarm.
Each icon is separate and has a transparent background; interface components supply light cards/tokens.

- Run `python3 generate_softcare.py` from this directory to rebuild the SVG and TS map.
- Use `components/softcare/SoftCareIcon.tsx` with `react-native-svg` after installing the dependency in Expo.
- Example: `<SoftCareIcon name="medicines" size={{24}} accessibilityLabel="Medicamentos" />` (replace `{{24}}` with a numeric expression in JSX).
- Gallery is in `softcare-preview.png` at the root of the package.
- Editorial design: rounded outlines, pastel fills, no proprietary images/fonts.
- Accessibility: use 24dp icons only together with readable labels; if icon is decorative, omit accessibilityLabel.

**This is a proposed first batch, not a tested production asset pack.** It needs review on Android for 24dp recognizability and adaptative sizes.
''',encoding='utf-8')
print('Generated',len(ICONS),'icons')
