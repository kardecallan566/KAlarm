import React from 'react';
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
