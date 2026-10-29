import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native';
import { apiBaseUrl } from '../../lib/api';
import styles from './styles';

type Proprietario = { id_proprietario: number; nome: string; cpf: string };

export default function VeiculoEdit() {
  const params = useLocalSearchParams<{ id_veiculo?: string; placa?: string; ano?: string; mensalidade?: string; fk_proprietario?: string }>();
  const [veiculo, setVeiculo] = useState({
    id_veiculo:      params.id_veiculo ?? '',
    placa:           params.placa ?? '',
    ano:             params.ano ?? '',
    mensalidade:     params.mensalidade ?? '',
    fk_proprietario: params.fk_proprietario ?? '',
  });
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
    try {
      await axios.put(`${apiBaseUrl}/veiculo/${veiculo.id_veiculo}`, {
        placa: veiculo.placa,
        ano: Number(veiculo.ano),
        mensalidade: Number(veiculo.mensalidade),
        fk_proprietario: Number(veiculo.fk_proprietario),
      });
      router.replace(`/veiculo?refresh=${Date.now()}`);
    } catch (error) { console.log(error); }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.section}>
        <Text style={styles.title}>Editar veículo</Text>
        <Text style={styles.desc}>Altere os dados e salve.</Text>

        <Text style={styles.label}>Identificação</Text>
        <TextInput style={[styles.input, styles.inputDisabled]} editable={false} value={`#${veiculo.id_veiculo}`} />

        <Text style={styles.label}>Placa</Text>
        <TextInput style={styles.input} value={veiculo.placa} onChangeText={(placa) => setVeiculo((prev) => ({ ...prev, placa }))} autoCapitalize="characters" />

        <Text style={styles.label}>Ano</Text>
        <TextInput style={styles.input} value={veiculo.ano} onChangeText={(ano) => setVeiculo((prev) => ({ ...prev, ano }))} keyboardType="numeric" />

        <Text style={styles.label}>Mensalidade (R$)</Text>
        <TextInput style={styles.input} value={veiculo.mensalidade} onChangeText={(mensalidade) => setVeiculo((prev) => ({ ...prev, mensalidade }))} keyboardType="numeric" />

        <Text style={styles.label}>Proprietário</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={veiculo.fk_proprietario} onValueChange={(value) => setVeiculo((prev) => ({ ...prev, fk_proprietario: String(value) }))}>
            <Picker.Item label="Selecione um proprietário" value="" />
            {proprietarios.map((item) => (
              <Picker.Item key={item.id_proprietario} label={`${item.nome} — CPF ${item.cpf}`} value={String(item.id_proprietario)} />
            ))}
          </Picker>
        </View>

        <Pressable style={styles.buttonPrimary} onPress={handleSubmit}>
          <Text style={styles.buttonPrimaryText}>Salvar alterações</Text>
        </Pressable>
        <Pressable style={styles.buttonCancel} onPress={() => router.back()}>
          <Text style={styles.buttonCancelText}>Cancelar</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
