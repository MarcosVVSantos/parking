import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native';
import { apiBaseUrl } from '../../lib/api';
import styles from './styles';

type Proprietario = { id_proprietario: number; nome: string; cpf: string };

export default function VeiculoForm() {
  const { proprietarioId } = useLocalSearchParams<{ proprietarioId?: string }>();
  const [placa, setPlaca] = useState('');
  const [ano, setAno] = useState('');
  const [mensalidade, setMensalidade] = useState('');
  const [fkProprietario, setFkProprietario] = useState(proprietarioId ?? '');
  const [proprietarios, setProprietarios] = useState<Proprietario[]>([]);
  const router = useRouter();

  const fetchProprietarios = useCallback(async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/proprietario`);
      setProprietarios(response.data);
    } catch (error) { console.log(error); }
  }, []);

  useEffect(() => { fetchProprietarios(); }, [fetchProprietarios]);

  const handleSubmit = async () => {
    if (!placa || !ano || !fkProprietario) {
      alert('Preencha placa, ano e selecione um proprietário.');
      return;
    }
    try {
      await axios.post(`${apiBaseUrl}/veiculo`, {
        placa,
        ano: Number(ano),
        mensalidade: Number(mensalidade),
        fk_proprietario: Number(fkProprietario),
      });
      if (proprietarioId) {
        router.back();
      } else {
        router.replace(`/veiculo?refresh=${Date.now()}`);
      }
    } catch (error) { console.log(error); }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.section}>
        <Text style={styles.title}>Novo veículo</Text>
        <Text style={styles.desc}>Preencha os dados e vincule a um proprietário.</Text>

        <Text style={styles.label}>Placa</Text>
        <TextInput style={styles.input} placeholder="Ex: BRA2E19" placeholderTextColor="#A9B3C1" value={placa} onChangeText={setPlaca} autoCapitalize="characters" />

        <Text style={styles.label}>Ano</Text>
        <TextInput style={styles.input} placeholder="Ex: 2020" placeholderTextColor="#A9B3C1" value={ano} onChangeText={setAno} keyboardType="numeric" />

        <Text style={styles.label}>Mensalidade (R$)</Text>
        <TextInput style={styles.input} placeholder="Ex: 250.00" placeholderTextColor="#A9B3C1" value={mensalidade} onChangeText={setMensalidade} keyboardType="numeric" />

        <Text style={styles.label}>Proprietário</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={fkProprietario} onValueChange={(value) => setFkProprietario(String(value))}>
            <Picker.Item label="Selecione um proprietário" value="" />
            {proprietarios.map((item) => (
              <Picker.Item key={item.id_proprietario} label={`${item.nome} — CPF ${item.cpf}`} value={String(item.id_proprietario)} />
            ))}
          </Picker>
        </View>
        <Text style={styles.helperText}>Lista vinda de GET /proprietario — salva o ID no veículo.</Text>

        <Pressable style={styles.buttonPrimary} onPress={handleSubmit}>
          <Text style={styles.buttonPrimaryText}>Salvar veículo</Text>
        </Pressable>
        <Pressable style={styles.buttonCancel} onPress={() => router.back()}>
          <Text style={styles.buttonCancelText}>Cancelar</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
