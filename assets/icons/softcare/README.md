# SoftCare Icons — v0.1 experimental library

Generated **35 unique original SVG designs** (64×64 viewBox) for KAlarm.
Each icon is separate and has a transparent background; interface components supply light cards/tokens.

- Run `python3 generate_softcare.py` from this directory to rebuild the SVG and TS map.
- Use `components/softcare/SoftCareIcon.tsx` with `react-native-svg` after installing the dependency in Expo.
- Example: `<SoftCareIcon name="medicines" size={24} accessibilityLabel="Medicamentos" />`.
- Gallery is in `softcare-preview.png` at the root of the package.
- Editorial design: rounded outlines, pastel fills, no proprietary images/fonts.
- Accessibility: use 24dp icons only together with readable labels; if icon is decorative, omit accessibilityLabel.

**This is a proposed first batch, not a tested production asset pack.** It needs review on Android for 24dp recognizability and adaptative sizes.
