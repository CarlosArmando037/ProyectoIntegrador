// app/home-admin.tsx
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// Importamos nuestro hook personalizado
import { useUserData } from '../hooks/useUserData';

// Datos de ejemplo para las citas de HOY (específico para admin)
const todaysAppointments = [
  { id: '1', patientName: 'Armando Mata Flores', time: '10:00 AM' },
  { id: '2', patientName: 'Laura Sánchez Gómez', time: '11:30 AM' },
];

export default function HomeAdminScreen() {
  // Obtenemos el UID de los parámetros de la ruta que nos mandó el login
  const { uid } = useLocalSearchParams<{ uid: string }>();
  
  // Usamos el hook para obtener los datos del usuario
  const { userData, loading, error } = useUserData(uid);

  // 1. Mientras carga, mostramos un indicador
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  // 2. Si hay un error, lo mostramos
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }
  
  // 3. Si no hay datos, mostramos un mensaje
  if (!userData) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No se pudo cargar la información del usuario.</Text>
      </View>
    );
  }

  // --- Si todo está bien, renderizamos la pantalla ---

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres salir?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Salir", 
          onPress: () => router.replace('/')
        }
      ]
    );
  };

  const renderTodayAppointment = ({ item }: any) => (
    <View style={styles.todayAppointmentItem}>
      <View style={styles.timeBadge}>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>
      <Text style={styles.patientName}>{item.patientName}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header con el nombre real del administrador */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Panel de Dr. {userData.nombre}</Text>
        <View style={styles.headerIcons}>
          {/* --- LÍNEA CLAVE: Botón de perfil que pasa el UID --- */}
          <TouchableOpacity onPress={() => router.push({ pathname: '/perfil-admin', params: { uid: uid } })}>
            <Ionicons name="person-outline" size={28} color="#007BFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={28} color="#d9534f" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* --- SECCIÓN DE CITAS DE HOY (para admin) --- */}
        <View style={styles.todaysSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Citas de Hoy</Text>
            <TouchableOpacity onPress={() => router.push('/citas-programadas')}>
              <Text style={styles.seeAllText}>Ver Todas</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={todaysAppointments}
            renderItem={renderTodayAppointment}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>

        {/* --- SECCIÓN DE BOTONES DE GESTIÓN (para admin) --- */}
        <View style={styles.actionCardsContainer}>
          <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/citas-programadas')}>
            <Ionicons name="calendar-outline" size={40} color="#007BFF" />
            <Text style={styles.actionCardTitle}>Citas Programadas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/citas-hechas')}>
            <Ionicons name="checkmark-circle-outline" size={40} color="#28a745" />
            <Text style={styles.actionCardTitle}>Citas Hechas</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.actionCardsContainer}>
          <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/citas-canceladas')}>
            <Ionicons name="close-circle-outline" size={40} color="#dc3545" />
            <Text style={styles.actionCardTitle}>Citas Canceladas</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- ESTILOS COMPLETOS ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#333' }, // Tamaño igual al del estudiante
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    marginLeft: 15,
  },
  content: { flex: 1, padding: 20 },
  // Estilos para la sección de "Citas de Hoy"
  todaysSection: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  seeAllText: { fontSize: 14, color: '#007BFF', fontWeight: '600' },
  todayAppointmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  timeBadge: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginRight: 15,
  },
  timeText: { fontSize: 12, fontWeight: 'bold', color: '#495057' },
  patientName: { fontSize: 16, color: '#333' },
  // Estilos para las tarjetas de acción (iguales a las del estudiante)
  actionCardsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  actionCard: {
    backgroundColor: '#fff',
    width: '48%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionCardTitle: { marginTop: 10, fontSize: 14, fontWeight: '600', textAlign: 'center' },
  // Estilos para los estados de carga/error
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});