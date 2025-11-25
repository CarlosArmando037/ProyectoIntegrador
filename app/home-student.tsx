// app/home-student.tsx
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Alert, FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// Importamos nuestro hook personalizado para obtener los datos del usuario
import { useUserData } from '../hooks/useUserData';

// Datos de ejemplo para las citas (sin cambios)
const mockAppointments = [
  { id: '1', doctor: 'Dra. Esmeralda Ayala', specialty: 'Psicología', date: '2023-11-25', time: '10:00 AM' },
  { id: '2', doctor: 'Dr. Emiliano Perez', specialty: 'Enfermería', date: '2023-11-26', time: '02:30 PM' },
];

export default function HomeStudentScreen() {
  // Obtenemos el UID de los parámetros de la ruta que nos mandó el login
  const { uid } = useLocalSearchParams<{ uid: string }>();
  
  // Usamos nuestro hook para obtener los datos del usuario desde Firestore
  const { userData, loading, error } = useUserData(uid);

  // 1. Mientras los datos se están cargando, mostramos un indicador de actividad
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  // 2. Si hay un error al cargar los datos, lo mostramos
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // 3. Si por alguna razón no hay datos del usuario, mostramos un mensaje
  if (!userData) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No se pudo cargar la información del usuario.</Text>
      </View>
    );
  }

  // --- Si todo está bien, renderizamos la pantalla con los datos reales ---

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

  // Función para renderizar cada cita en la lista (sin cambios)
  const renderAppointment = ({ item }: any) => (
    <View style={styles.appointmentCard}>
      <Text style={styles.appointmentDoctor}>{item.doctor}</Text>
      <Text style={styles.appointmentSpecialty}>{item.specialty}</Text>
      <Text style={styles.appointmentDate}>{item.date} a las {item.time}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* --- HEADER CON EL NOMBRE REAL DEL USUARIO --- */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>¡Hola, {userData.nombre}!</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => router.push({ pathname: '/perfil-student', params: { uid: uid } })}>
              <Ionicons name="person-outline" size={28} color="#007BFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={28} color="#d9534f" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* --- TARJETAS DE ACCIÓN PRINCIPALES (como en tu ejemplo) --- */}
        <View style={styles.actionCardsContainer}>
          <TouchableOpacity style={styles.actionCard} onPress={() => Alert.alert('Solicitud', 'Redirigiendo a solicitud con Psicólogo...')}>
            <Ionicons name="heart-outline" size={40} color="#E91E63" />
            <Text style={styles.actionCardTitle}>Solicitar con Psicólogo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={() => Alert.alert('Solicitud', 'Redirigiendo a solicitud con Médico...')}>
            <Ionicons name="medical-outline" size={40} color="#2196F3" />
            <Text style={styles.actionCardTitle}>Solicitar con Médico</Text>
          </TouchableOpacity>
        </View>

        {/* --- SECCIÓN DE PRÓXIMAS CITAS (como en tu ejemplo) --- */}
        <View style={styles.appointmentsSection}>
          <Text style={styles.sectionTitle}>Mis Próximas Citas</Text>
          <FlatList
            data={mockAppointments}
            renderItem={renderAppointment}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={<Text>No tienes citas programadas.</Text>}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- ESTILOS COMPLETOS Y CORRECTOS ---
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
  welcomeText: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    marginLeft: 15,
  },
  content: { flex: 1, padding: 20 },
  actionCardsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
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
  appointmentsSection: { marginTop: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  appointmentCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#007BFF',
  },
  appointmentDoctor: { fontSize: 16, fontWeight: 'bold' },
  appointmentSpecialty: { fontSize: 14, color: '#666', marginTop: 2 },
  appointmentDate: { fontSize: 12, color: '#999', marginTop: 5 },
  // --- Estilos para los estados de carga/error ---
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