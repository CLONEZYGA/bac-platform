import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { fetchApplications, Application, emitToUser, approveApplication, rejectApplication } from '../services/api';
import { useToken } from '../services/token';

export default function ApplicationsScreen() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const token = useToken();

  const fetchAndSetApplications = async () => {
    if (!token) return;
    setRefreshing(true);
    setLoading(true);
    try {
      const data = await fetchApplications(token);
      setApplications(data);
      setError('');
    } catch (err) {
      let msg = 'Failed to load applications';
      if (err.response && err.response.data && err.response.data.error) {
        msg += `: ${err.response.data.error}`;
      }
      setError(msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAndSetApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (loading) return <ActivityIndicator style={{ margin: 32 }} />;
  if (error) return <Text style={{ color: 'red', margin: 32 }}>{error}</Text>;
  if (!loading && !error && applications.length === 0) {
    return <Text style={{ margin: 32 }}>No applications found.</Text>;
  }

  // TODO: Store and use the real JWT token after login

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Applications</Text>
      <TouchableOpacity style={[styles.button, { marginBottom: 16, backgroundColor: '#28a745' }]} onPress={fetchAndSetApplications} disabled={refreshing}>
        <Text style={styles.buttonText}>{refreshing ? 'Refreshing...' : 'Refresh'}</Text>
      </TouchableOpacity>
      <FlatList
        data={applications}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Text style={styles.name}>{item.studentName}</Text>
            <Text style={styles.email}>{item.email}</Text>
            <Text style={styles.status}>Status: {item.status}</Text>
            <Text style={styles.date}>Submitted: {item.submittedDate}</Text>
            {/* Demo: Emit a notification to this student */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => emitToUser(item.id, 'notification', { title: 'Admin sent you a test notification!' })}
            >
              <Text style={styles.buttonText}>Send Test Notification</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#28a745' }]}
              onPress={async () => {
                if (token) await approveApplication(item.id, token);
                fetchAndSetApplications(); // Refresh after approve
              }}
            >
              <Text style={styles.buttonText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#dc3545' }]}
              onPress={async () => {
                if (token) await rejectApplication(item.id, token);
                fetchAndSetApplications(); // Refresh after reject
              }}
            >
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    color: '#555',
  },
  status: {
    fontSize: 14,
    color: '#007bff',
    marginTop: 4,
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
}); 