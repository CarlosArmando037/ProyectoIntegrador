// app/perfil-admin.tsx
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Importamos nuestro hook personalizado
import { useUserData } from '../hooks/useUserData';

export default function PerfilAdminScreen() {
    // Obtenemos el UID de los parámetros de la ruta
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
                <Text style={styles.errorText}>No se pudo cargar el perfil.</Text>
            </View>
        );
    }

    // --- Si todo está bien, renderizamos la pantalla con los datos reales ---
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={28} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Modificar Perfil</Text>
                <View style={{ width: 28 }} />
            </View>
            <View style={styles.content}>
                <Ionicons name="person-circle-outline" size={100} color="#ccc" />
                {/* --- USAMOS LOS DATOS REALES DE FIREBASE --- */}
                <Text style={styles.profileName}>Dr. {userData.nombre}</Text>
                <Text style={styles.profileInfo}>Especialidad: {userData.rol}</Text>
                <Text style={styles.profileInfo}>Email: {userData.email}</Text>

                <TouchableOpacity style={styles.editButton}>
                    <Text style={styles.editButtonText}>Editar Información</Text>
                </TouchableOpacity>
            </View>
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
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
    content: { flex: 1, alignItems: 'center', padding: 40 },
    profileName: { fontSize: 24, fontWeight: 'bold', marginTop: 15, color: '#333' },
    profileInfo: { 
        fontSize: 16, 
        color: '#666', 
        marginTop: 5,
        textAlign: 'center'
    },
    editButton: {
        marginTop: 30,
        backgroundColor: '#007BFF',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    editButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
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