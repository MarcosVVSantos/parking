import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, Text, TextInput } from 'react-native';
import { apiBaseUrl } from '../../lib/api';
import styles from './styles';

export default function ProprietarioForm() {
  const [nome, setNome] = useState('');
  const [cpf, setCPF] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
    if (!nome || !cpf) {
      alert('Preencha nome e CPF.');
      return;
    }
    try {
      const { data } = await axios.post(`${apiBaseUrl}/proprietario`, { nome, cpf });
      // redireciona para edição para que o usuário possa vincular veículos
      router.replace({ pathname: '/proprietario/edit', params: { id_proprietario: String(data.id_proprietario), nome: data.nome, cpf: data.cpf } });
    } catch (error) { console.log(error); }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.section}>
        <Text style={styles.title}>Novo proprietário</Text>
        <Text style={styles.desc}>Preencha os dados abaixo para cadastrar.</Text>

        <Text style={styles.label}>Nome completo</Text>
        <TextInput style={styles.input} placeholder="Ex: Ana Souza" placeholderTextColor="#A9B3C1" value={nome} onChangeText={setNome} />

        <Text style={styles.label}>CPF</Text>
        <TextInput style={styles.input} placeholder="000.000.000-00" placeholderTextColor="#A9B3C1" value={cpf} onChangeText={setCPF} keyboardType="numeric" />

        <Pressable style={styles.buttonPrimary} onPress={handleSubmit}>
          <Text style={styles.buttonPrimaryText}>Salvar e vincular veículos</Text>
        </Pressable>
        <Pressable style={styles.buttonCancel} onPress={() => router.back()}>
          <Text style={styles.buttonCancelText}>Cancelar</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
