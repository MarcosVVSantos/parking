import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, SafeAreaView, Text, TextInput, View } from 'react-native';
import BottomNav from '../../components/BottomNav';
import { apiBaseUrl } from '../../lib/api';
import styles from './styles';

type Proprietario = { id_proprietario: number; nome: string; cpf: string };

function Initials({ nome }: { nome: string }) {
  const parts = nome.trim().split(' ');
  const letters = parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : parts[0].slice(0, 2);
  return (
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>{letters.toUpperCase()}</Text>
    </View>
  );
}

export default function ProprietarioList() {
  const [items, setItems] = useState<Proprietario[]>([]);
  const [busca, setBusca] = useState('');
  const router = useRouter();
  const { refresh } = useLocalSearchParams<{ refresh?: string }>();

  const fetchAll = useCallback(async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/proprietario`);
      setItems(response.data);
    } catch (error) { console.log(error); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll, refresh]);

  const filtrados = useMemo(() =>
    busca.trim() === ''
      ? items
      : items.filter((i) => i.nome.toLowerCase().includes(busca.toLowerCase()) || i.cpf.includes(busca)),
    [items, busca]
  );

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${apiBaseUrl}/proprietario/${id}`);
      fetchAll();
    } catch (error) { console.log(error); }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filtrados}
        keyExtractor={(item) => String(item.id_proprietario)}
        contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 8 }}
        ListHeaderComponent={
          <View style={{ gap: 10, marginBottom: 4 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={styles.countLabel}>{items.length} cadastrado{items.length !== 1 ? 's' : ''}</Text>
            </View>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar proprietário"
              placeholderTextColor="#A9B3C1"
              value={busca}
              onChangeText={setBusca}
            />
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <Initials nome={item.nome} />
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.nome}</Text>
                <Text style={styles.cardSub}>CPF {item.cpf}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Pressable
                style={[styles.button, styles.buttonGhost, { flex: 1 }]}
                onPress={() => router.push({ pathname: '/proprietario/edit', params: { id_proprietario: String(item.id_proprietario), nome: item.nome, cpf: item.cpf } })}
              >
                <Text style={styles.buttonText}>Editar</Text>
              </Pressable>
              <Pressable style={[styles.button, styles.buttonDanger, { flex: 1 }]} onPress={() => handleDelete(item.id_proprietario)}>
                <Text style={styles.buttonText}>Excluir</Text>
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>{busca ? 'Nenhum resultado.' : 'Nenhum proprietário cadastrado.'}</Text>
            {!busca && <Text style={styles.emptySub}>Toque em + para adicionar o primeiro.</Text>}
          </View>
        }
      />
      <BottomNav />
    </SafeAreaView>
  );
}
