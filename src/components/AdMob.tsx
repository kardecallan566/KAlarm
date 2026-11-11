import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Text, View } from 'react-native';
import Constants from 'expo-constants';
import { colors } from '../theme';

type AdsState = { ready: boolean; showBanner: boolean };
const AdsContext = createContext<AdsState>({ ready: false, showBanner: false });
const expoGo = Constants.appOwnership === 'expo';
// Decide once per JS session: a banner is shown in only a minority of sessions.
const showBannerThisSession = Math.random() < 0.4;

export function AdMobProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (expoGo || process.env.EXPO_PUBLIC_KALARM_GO_SAFE === '1') return;
    let mounted = true;

    async function initializeAds() {
      try {
        // Lazy loading keeps Expo Go safe: its binary does not contain this native module.
        const ads = require('react-native-google-mobile-ads');
        const consent = await ads.AdsConsent.gatherConsent();
        if (!mounted || !consent.canRequestAds) return;
        await ads.default().initialize();
        if (mounted) setReady(true);
      } catch (error) {
        // Ads are optional. Any SDK/consent failure must never affect medication features.
        console.warn('[KAlarm] AdMob indisponível nesta sessão:', error);
      }
    }

    void initializeAds();
    return () => { mounted = false; };
  }, []);

  return <AdsContext.Provider value={{ ready, showBanner: showBannerThisSession }}>{children}</AdsContext.Provider>;
}

export function SafeAdBanner() {
  const { ready, showBanner } = useContext(AdsContext);
  if (!ready || !showBanner || expoGo || process.env.EXPO_PUBLIC_KALARM_GO_SAFE === '1') return null;

  try {
    const { BannerAd, BannerAdSize, TestIds } = require('react-native-google-mobile-ads');
    return <View accessibilityLabel="Publicidade" style={{ alignItems: 'center', marginTop: 8, marginBottom: 18 }}>
      <Text style={{ fontSize: 11, color: colors.muted, marginBottom: 4 }}>Publicidade</Text>
      <BannerAd
        unitId={TestIds.BANNER}
        size={BannerAdSize.INLINE_ADAPTIVE_BANNER}
        maxHeight={100}
        onAdFailedToLoad={(error: unknown) => console.warn('[KAlarm] Banner não carregado:', error)}
      />
    </View>;
  } catch {
    return null;
  }
}
