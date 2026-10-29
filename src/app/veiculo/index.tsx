import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, SafeAreaView, Text, TextInput, View } from 'react-native';
import BottomNav from '../../components/BottomNav';
import { apiBaseUrl } from '../../lib/api';
import styles from './styles';

type Veiculo = {
  id_veiculo: number;
  placa: string;
  ano: number;
  mensalidade: string | number;
  fk_proprietario: number;
  proprietario?: { id_proprietario: number; nome: string; cpf: string };
};

export default function VeiculoList() {
  const [items, setItems] = useState<Veiculo[]>([]);
  const [busca, setBusca] = useState('');
  const router = useRouter();
  const { refresh } = useLocalSearchParams<{ refresh?: string }>();

  const fetchAll = useCallback(async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/veiculo`);
      setItems(response.data);
    } catch (error) { console.log(error); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll, refresh]);

  const filtrados = useMemo(() =>
    busca.trim() === ''
      ? items
      : items.filter((i) =>
          i.placa.toLowerCase().includes(busca.toLowerCase()) ||
          i.proprietario?.nome.toLowerCase().includes(busca.toLowerCase())
        ),
    [items, busca]
  );

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${apiBaseUrl}/veiculo/${id}`);
      fetchAll();
    } catch (error) { console.log(error); }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filtrados}
        keyExtractor={(item) => String(item.id_veiculo)}
        contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 8 }}
        ListHeaderComponent={
          <View style={{ gap: 10, marginBottom: 4 }}>
            <Text style={styles.countLabel}>{items.length} no pátio</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar veículo"
              placeholderTextColor="#A9B3C1"
              value={busca}
              onChangeText={setBusca}
            />
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <View style={styles.plateBadge}>
                <Text style={styles.plateCountry}>BRASIL</Text>
                <Text style={styles.plateText}>{item.placa}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>Ano {item.ano}</Text>
                <Text style={styles.cardSub}>{item.proprietario?.nome ?? `ID ${item.fk_proprietario}`}</Text>
                <Text style={styles.cardSub}>R$ {Number(item.mensalidade).toFixed(2)}/mês</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Pressable
                style={[styles.button, styles.buttonGhost, { flex: 1 }]}
                onPress={() => router.push({ pathname: '/veiculo/edit', params: { id_veiculo: String(item.id_veiculo), placa: item.placa, ano: String(item.ano), mensalidade: String(item.mensalidade), fk_proprietario: String(item.fk_proprietario) } })}
              >
                <Text style={styles.buttonText}>Editar</Text>
              </Pressable>
              <Pressable style={[styles.button, styles.buttonDanger, { flex: 1 }]} onPress={() => handleDelete(item.id_veiculo)}>
                <Text style={styles.buttonText}>Excluir</Text>
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>{busca ? 'Nenhum resultado.' : 'Nenhum veículo cadastrado.'}</Text>
            {!busca && <Text style={styles.emptySub}>Toque em + para adicionar o primeiro.</Text>}
          </View>
        }
      />
      <BottomNav />
    </SafeAreaView>
  );
}
