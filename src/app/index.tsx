import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import BottomNav from '../components/BottomNav';
import { apiBaseUrl } from '../lib/api';

type Veiculo = { id_veiculo: number; placa: string; ano: number; mensalidade: string | number; proprietario?: { nome: string } };

export default function Home() {
  const router = useRouter();
  const [counts, setCounts] = useState({ proprietarios: 0, veiculos: 0 });
  const [ultimosVeiculos, setUltimosVeiculos] = useState<Veiculo[]>([]);
  const [apiOk, setApiOk] = useState<boolean | null>(null);

  useEffect(() => {
    Promise.all([
      axios.get(`${apiBaseUrl}/proprietario`),
      axios.get(`${apiBaseUrl}/veiculo`),
    ])
      .then(([p, v]) => {
        setCounts({ proprietarios: p.data.length, veiculos: v.data.length });
        setUltimosVeiculos(v.data.slice(-3).reverse());
        setApiOk(true);
      })
      .catch(() => setApiOk(false));
  }, []);

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll}>

        {/* hero */}
        <View style={s.hero}>
          <Text style={s.title}>Estacionamento</Text>
          <View style={[s.badge, apiOk === false && s.badgeErr]}>
            <View style={[s.dot, apiOk === false ? s.dotErr : apiOk ? s.dotOk : s.dotWait]} />
            <Text style={[s.badgeText, apiOk === false && s.badgeTextErr]}>
              {apiOk === null ? 'Conectando...' : apiOk ? `API online · ${apiBaseUrl}` : 'Não foi possível conectar à API'}
            </Text>
          </View>
        </View>

        {/* painel do pátio */}
        <Text style={s.sectionLabel}>Painel do pátio</Text>
        <View style={s.statsRow}>
          <Pressable style={s.statCard} onPress={() => router.push('/proprietario')}>
            <Text style={s.statNum}>{counts.proprietarios}</Text>
            <Text style={s.statLabel}>Proprietários</Text>
          </Pressable>
          <Pressable style={s.statCard} onPress={() => router.push('/veiculo')}>
            <Text style={s.statNum}>{counts.veiculos}</Text>
            <Text style={s.statLabel}>No pátio</Text>
          </Pressable>
        </View>

        {/* ações rápidas */}
        <Text style={s.sectionLabel}>Ações rápidas</Text>
        <View style={s.actionsRow}>
          <Pressable style={[s.actionBtn, { backgroundColor: '#1F5BD8' }]} onPress={() => router.push('/proprietario/form')}>
            <Text style={s.actionBtnText}>+ Proprietário</Text>
          </Pressable>
          <Pressable style={[s.actionBtn, { backgroundColor: '#5B3FD1' }]} onPress={() => router.push('/veiculo/form')}>
            <Text style={s.actionBtnText}>+ Veículo</Text>
          </Pressable>
        </View>

        {/* últimos veículos */}
        {ultimosVeiculos.length > 0 && (
          <>
            <View style={s.sectionRow}>
              <Text style={s.sectionLabel}>Últimos veículos</Text>
              <Pressable onPress={() => router.push('/veiculo')}>
                <Text style={s.verTodos}>Ver todos</Text>
              </Pressable>
            </View>
            {ultimosVeiculos.map((v) => (
              <View key={v.id_veiculo} style={s.vehicleCard}>
                <View style={s.plateBadge}>
                  <Text style={s.plateText}>{v.placa}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.vehicleTitle}>Ano {v.ano}</Text>
                  <Text style={s.vehicleSub}>{v.proprietario?.nome ?? '—'}</Text>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      <BottomNav />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: '#FAF9F5' },
  scroll:       { padding: 20, paddingBottom: 8, gap: 8 },
  hero:         { marginBottom: 12, gap: 8 },
  title:        { fontSize: 28, fontWeight: '800', color: '#14181F' },
  badge:        { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', backgroundColor: '#E7F6EC', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 5 },
  badgeErr:     { backgroundColor: '#FDECEA' },
  dot:          { width: 7, height: 7, borderRadius: 4 },
  dotOk:        { backgroundColor: '#0F7B6C' },
  dotErr:       { backgroundColor: '#B42318' },
  dotWait:      { backgroundColor: '#A9B3C1' },
  badgeText:    { fontSize: 12, fontWeight: '600', color: '#0F7B6C' },
  badgeTextErr: { color: '#B42318' },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: '#A9B3C1', textTransform: 'uppercase', letterSpacing: 1, marginTop: 12, marginBottom: 8 },
  sectionRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, marginBottom: 8 },
  verTodos:     { fontSize: 13, fontWeight: '600', color: '#1F5BD8' },
  statsRow:     { flexDirection: 'row', gap: 12 },
  statCard:     { flex: 1, backgroundColor: '#fff', borderRadius: 8, padding: 16, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 3, shadowOffset: { width: 0, height: 1 }, elevation: 2 },
  statNum:      { fontSize: 36, fontWeight: '800', color: '#1F5BD8' },
  statLabel:    { fontSize: 12, color: '#5B6472', marginTop: 2 },
  actionsRow:   { flexDirection: 'row', gap: 12 },
  actionBtn:    { flex: 1, borderRadius: 8, paddingVertical: 14, alignItems: 'center' },
  actionBtnText:{ color: '#fff', fontWeight: '700', fontSize: 14 },
  vehicleCard:  { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', borderRadius: 8, padding: 14, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 2, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
  plateBadge:   { backgroundColor: '#E8EEFC', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 6, minWidth: 72, alignItems: 'center' },
  plateText:    { fontSize: 13, fontWeight: '800', color: '#1F5BD8', letterSpacing: 1 },
  vehicleTitle: { fontSize: 14, fontWeight: '600', color: '#14181F' },
  vehicleSub:   { fontSize: 12, color: '#5B6472', marginTop: 2 },
});
