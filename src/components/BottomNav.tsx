import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const TABS = [
  { label: 'Início',        href: '/' as const },
  { label: 'Proprietários', href: '/proprietario' as const },
  { label: 'Veículos',      href: '/veiculo' as const },
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={s.bar}>
      {TABS.map((tab) => {
        const active = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href));
        return (
          <Pressable key={tab.href} style={s.tab} onPress={() => router.push(tab.href)}>
            <View style={[s.indicator, active && s.indicatorActive]} />
            <Text style={[s.label, active && s.labelActive]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  bar:              { flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E6EAF0', paddingBottom: 8 },
  tab:              { flex: 1, alignItems: 'center', paddingTop: 8, gap: 4 },
  indicator:        { height: 3, width: 24, borderRadius: 2, backgroundColor: 'transparent' },
  indicatorActive:  { backgroundColor: '#1F5BD8' },
  label:            { fontSize: 11, fontWeight: '500', color: '#A9B3C1' },
  labelActive:      { color: '#1F5BD8', fontWeight: '700' },
});
