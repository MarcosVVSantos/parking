import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native';
import { apiBaseUrl } from '../../lib/api';
import styles from './styles';

type Veiculo = { id_veiculo: number; placa: string; ano: number; mensalidade: string | number };

export default function ProprietarioEdit() {
  const params = useLocalSearchParams<{ id_proprietario?: string; nome?: string; cpf?: string }>();
  const [proprietario, setProprietario] = useState({
    id_proprietario: params.id_proprietario ?? '',
    nome: params.nome ?? '',
    cpf:  params.cpf ?? '',
  });
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!params.id_proprietario) return;
    axios.get(`${apiBaseUrl}/proprietario/${params.id_proprietario}`)
      .then((res) => setVeiculos(res.data.veiculos ?? []))
      .catch(console.log);
  }, [params.id_proprietario]);

  const handleSubmit = async () => {
    try {
      await axios.put(`${apiBaseUrl}/proprietario/${proprietario.id_proprietario}`, proprietario);
      router.replace(`/proprietario?refresh=${Date.now()}`);
    } catch (error) { console.log(error); }
  };

  const handleDeleteVeiculo = async (id: number) => {
    try {
      await axios.delete(`${apiBaseUrl}/veiculo/${id}`);
      setVeiculos((prev) => prev.filter((v) => v.id_veiculo !== id));
    } catch (error) { console.log(error); }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.section}>
        <Text style={styles.title}>Editar proprietário</Text>
        <Text style={styles.desc}>Altere os dados e salve.</Text>

        <Text style={styles.label}>Identificação</Text>
        <TextInput style={[styles.input, styles.inputDisabled]} editable={false} value={`#${proprietario.id_proprietario}`} />

        <Text style={styles.label}>Nome completo</Text>
        <TextInput
          style={styles.input}
          value={proprietario.nome}
          onChangeText={(nome) => setProprietario((prev) => ({ ...prev, nome }))}
        />

        <Text style={styles.label}>CPF</Text>
        <TextInput
          style={styles.input}
          value={proprietario.cpf}
          onChangeText={(cpf) => setProprietario((prev) => ({ ...prev, cpf }))}
          keyboardType="numeric"
        />

        <Pressable style={styles.buttonPrimary} onPress={handleSubmit}>
          <Text style={styles.buttonPrimaryText}>Salvar alterações</Text>
        </Pressable>
        <Pressable style={styles.buttonCancel} onPress={() => router.back()}>
          <Text style={styles.buttonCancelText}>Cancelar</Text>
        </Pressable>

        {/* seção de veículos */}
        <View style={styles.vehicleSection}>
          <View style={styles.vehicleSectionHeader}>
            <Text style={styles.vehicleSectionTitle}>
              Veículos vinculados {veiculos.length > 0 ? `(${veiculos.length})` : ''}
            </Text>
            <Pressable
              style={styles.addVehicleBtn}
              onPress={() => router.push({ pathname: '/veiculo/form', params: { proprietarioId: proprietario.id_proprietario } })}
            >
              <Text style={styles.addVehicleBtnText}>+ Vincular placa</Text>
            </Pressable>
          </View>

          {veiculos.length === 0 ? (
            <View style={styles.vehicleEmpty}>
              <Text style={styles.vehicleEmptyText}>Nenhum veículo vinculado.</Text>
            </View>
          ) : (
            veiculos.map((v) => (
              <View key={v.id_veiculo} style={styles.vehicleCard}>
                <View style={styles.plateBadgeSmall}>
                  <Text style={styles.plateTextSmall}>{v.placa}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.vehicleCardTitle}>Ano {v.ano}</Text>
                  <Text style={styles.vehicleCardSub}>R$ {Number(v.mensalidade).toFixed(2)}/mês</Text>
                </View>
                <Pressable onPress={() => handleDeleteVeiculo(v.id_veiculo)} style={styles.vehicleDeleteBtn}>
                  <Text style={styles.vehicleDeleteText}>Remover</Text>
                </Pressable>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
