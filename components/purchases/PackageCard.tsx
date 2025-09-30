import { ReactNode } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { PurchasesPackage } from 'react-native-purchases';

import { Text, useThemeColor } from '@/components/Themed';

type PackageCardProps = {
  pkg: PurchasesPackage;
  onPress: (pkg: PurchasesPackage) => void;
  disabled?: boolean;
  footer?: ReactNode;
};

export function PackageCard({ pkg, onPress, disabled, footer }: PackageCardProps) {
  const tint = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({}, 'text');

  const { product } = pkg;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled}
      onPress={() => onPress(pkg)}
      style={[styles.card, { borderColor: `${borderColor}33` }]}
    >
      <View style={styles.row}>
        <View style={styles.left}>
          <Text style={styles.title}>{product.title || pkg.packageType}</Text>
          {product.description ? <Text style={styles.description}>{product.description}</Text> : null}
        </View>
        <View style={styles.right}>
          <Text style={[styles.price, { color: tint }]}>{product.priceString}</Text>
          {product.subscriptionPeriod ? (
            <Text style={styles.period}>{formatPeriod(product.subscriptionPeriod)}</Text>
          ) : null}
        </View>
      </View>
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </TouchableOpacity>
  );
}

function formatPeriod(period: PurchasesPackage['product']['subscriptionPeriod']) {
  if (!period) return '';

  let value: number | null = null;
  let unit: string | null = null;

  if (typeof period === 'string') {
    const match = period.match(/P(\d+)([DWMY])/i);
    if (match) {
      value = Number(match[1]);
      unit = match[2];
    }
  } else if (typeof period === 'object') {
    const maybeValue = (period as { value?: number }).value;
    const maybeUnit = (period as { unit?: string }).unit;
    value = typeof maybeValue === 'number' ? maybeValue : null;
    unit = typeof maybeUnit === 'string' ? maybeUnit : null;
  }

  if (!value || !unit) {
    return '';
  }

  const normalizedUnit = normalizeUnit(unit);

  if (!normalizedUnit) {
    return '';
  }

  if (value === 1) {
    return `per ${normalizedUnit}`;
  }

  return `every ${value} ${normalizedUnit}${value > 1 ? 's' : ''}`;
}

function normalizeUnit(rawUnit: string) {
  const unit = rawUnit.toLowerCase();

  switch (unit) {
    case 'd':
    case 'day':
    case 'days':
      return 'day';
    case 'w':
    case 'week':
    case 'weeks':
      return 'week';
    case 'm':
    case 'month':
    case 'months':
      return 'month';
    case 'y':
    case 'year':
    case 'years':
      return 'year';
    default:
      return null;
  }
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  left: {
    flex: 1,
    paddingRight: 12,
    gap: 4,
  },
  right: {
    alignItems: 'flex-end',
    gap: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    opacity: 0.85,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
  },
  period: {
    fontSize: 14,
    opacity: 0.7,
  },
  footer: {
    marginTop: 12,
  },
});
