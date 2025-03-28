import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar, Modal, Image, Animated, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StackActions } from '@react-navigation/native';
import { auth } from '../config/firebaseConfig';
import axios from 'axios';

const newsData = [
  { id: '1', title: 'FiberX Expands Coverage Nationwide', source: 'TechDaily', url: 'https://techdaily.com/fiberx-expansion' },
  { id: '2', title: 'New 1Gbps Plans Available Now', source: 'Global News', url: 'https://globalnews.com/1gbps' },
  { id: '3', title: 'Top Tips for Maximizing Your Fiber Speed', source: 'NetExperts', url: 'https://netexperts.com/speed-tips' },
];

export default function Home({ navigation}) {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(0))[0];
  const [profileName] = useState(auth.currentUser?.displayName || 'User');
  const [profileEmail] = useState(auth.currentUser?.email || 'No email available');
  const [profileImage] = useState(require('../assets/profile.jpg'));
  const [speedTestVisible, setSpeedTestVisible] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [downloadSpeed, setDownloadSpeed] = useState(null);
  const [uploadSpeed, setUploadSpeed] = useState(null);
  const [ping, setPing] = useState(null);

  const toggleSidebar = (isOpen) => {
    setSidebarVisible(isOpen);
    Animated.timing(slideAnim, {
      toValue: isOpen ? 0 : -300,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleLogout = () => {
    toggleSidebar(false);
    navigation.dispatch(StackActions.replace('Registrations'));
  };
  const startSpeedTest = async () => {
    setIsTesting(true);
    setDownloadSpeed(null);
    setUploadSpeed(null);
    setPing(null);

    try {
      // ✅ Measure Ping (Latency)
      const pingStart = performance.now();
      await axios.get("https://www.cloudflare.com/cdn-cgi/trace");
      const pingEnd = performance.now();
      const pingTime = pingEnd - pingStart;
      setPing(pingTime.toFixed(2));

      // ✅ Measure Download Speed
      const downloadStart = performance.now();
      const response = await axios.get("https://speed.cloudflare.com/__down?bytes=25000000", {
        responseType: "arraybuffer",
      });
      const downloadEnd = performance.now();

      const fileSizeInBits = response.data.byteLength * 8;
      const downloadTimeInSeconds = (downloadEnd - downloadStart) / 1000;
      const downloadSpeedMbps = (fileSizeInBits / downloadTimeInSeconds) / 1_000_000;
      setDownloadSpeed(downloadSpeedMbps.toFixed(2));

      // ✅ Measure Upload Speed
      const uploadData = new Uint8Array(5 * 1024 * 1024); // 5MB file (random data)
      const uploadStart = performance.now();
      await axios.post("https://speed.cloudflare.com/__up", uploadData, {
        headers: { "Content-Type": "application/octet-stream" },
      });
      const uploadEnd = performance.now();

      const uploadFileSizeInBits = uploadData.byteLength * 8;
      const uploadTimeInSeconds = (uploadEnd - uploadStart) / 1000;
      const uploadSpeedMbps = (uploadFileSizeInBits / uploadTimeInSeconds) / 1_000_000;
      setUploadSpeed(uploadSpeedMbps.toFixed(2));

    } catch (error) {
      console.error("Speed test failed:", error);
    }

    setIsTesting(false);
  };

  
  return (
    <View style={styles.safeContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#0044cc" />
      
      {/* Header */}
      <LinearGradient colors={['#0044cc', '#002b80']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => toggleSidebar(true)}>
            <Ionicons name="menu" size={28} color="#fff" />
          </TouchableOpacity>
          <Image source={require('../assets/logo.jpg')} style={styles.logo} />
          <Text style={styles.headerText}>FiBear Network</Text>
          <TouchableOpacity onPress={() => alert('No new notifications')}>
            <Ionicons name="notifications" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <Modal visible={sidebarVisible} transparent>
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setSidebarVisible(false)}>
          <View style={styles.sidebar}> 
            <TouchableOpacity onPress={() => setSidebarVisible(false)} style={styles.closeButton}>
              <Ionicons name="close" size={28} color="#333" left="86%" />
            </TouchableOpacity>
            <View style={styles.sidebarProfile}>
              <Image source={profileImage} style={styles.sidebarProfilePic} />
              <Text style={styles.sidebarProfileName}>{profileName}</Text>
              <Text style={styles.sidebarProfileEmail}>{profileEmail}</Text>
            </View>
            {[ 
              { icon: 'home', text: 'Home', onPress: () => navigation.navigate('Home') },
              { icon: 'account-circle', text: 'My Account', onPress: () => navigation.navigate('Account') },
              { icon: 'receipt', text: 'Billing & Payments', onPress: () => navigation.navigate('Bills') },
              { icon: 'build', text: 'Technical Support', onPress: () => navigation.navigate('TechSupp') },
              { icon: 'logout', text: 'Logout', onPress: handleLogout }
            ].map((item, index) => (
              <TouchableOpacity key={index} style={styles.sidebarItem} onPress={item.onPress}>
                <MaterialIcons name={item.icon} size={24} color="#333" />
                <Text style={styles.sidebarText}>{item.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <ScrollView>
        {/* Announcement Section */}
        <View style={styles.announcementContainer}>
          <Text style={styles.announcementTitle}>📢 Announcement</Text>
          <Text style={styles.announcementText}>Enjoy our new 1Gbps FiberX Plan at a special promo price! Limited time only.</Text>
        </View>

        {/* Main Content */}
        <View style={styles.container}>
          {/* Account Overview */}
          <View style={styles.card}>
            <Text style={styles.title}>Plan: <Text style={styles.highlight}>FiberX 500 Mbps</Text></Text>
            <Text style={styles.usage}>Billing Cycle: <Text style={styles.bold}>15th of Every Month</Text></Text>
            <Text style={styles.usage}>Current Bill: <Text style={styles.balance}>₱2,499</Text></Text>
            <Text style={styles.usage}>Due Date: <Text style={styles.warning}>March 15, 2025</Text></Text>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>View Billing Details</Text>
            </TouchableOpacity>
          </View>
        
        {/* Quick Actions */}
        <View style={styles.quickActions}>
          {[
            { text: "Pay Now", icon: "payment", screen: "Bills" },
            { text: "Upgrade Plan", icon: "speed", screen: "Account" },
            { text: "Customer Support", icon: "support-agent", screen: "TechSupp" }
          ].map(({ text, icon, screen }, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.actionButton} 
              onPress={() => navigation.navigate(screen)}
            >
              <MaterialIcons name={icon} size={28} color="#0044cc" />
              <Text style={styles.actionText}>{text}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Features */}
        <View style={styles.featureCard}>
          <TouchableOpacity style={styles.featureButton} onPress={() => setSpeedTestVisible(true)}>
            <FontAwesome5 name="tachometer-alt" size={24} color="#28a745" />
            <Text style={styles.featureText}>Speed Test</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.featureButton} onPress={() => alert('Chat support coming soon!')}>
            <Ionicons name="chatbubbles" size={24} color="#17a2b8" />
            <Text style={styles.featureText}>Chat Support</Text>
          </TouchableOpacity>
        </View>
        
        {/* News Section */}
        <View style={styles.newsContainer}>
          <Text style={styles.sectionTitle}>📢 Latest Updates</Text>
          {newsData.map((item) => (
            <TouchableOpacity key={item.id} style={styles.newsItem} onPress={() => alert(`Opening: ${item.url}`)}>
              <Text style={styles.newsTitle}>{item.title}</Text>
              <Text style={styles.newsSource}>{item.source}</Text>
            </TouchableOpacity>
          ))}
          {/* Ensure View is separate and not inside a Text component */}
          <View style={{ height: 50 }} />
        </View>
      </View>

      <Modal visible={speedTestVisible} transparent animationType="slide">
  <View style={styles.modalOverlayed}>
    <View style={styles.modalContented}>
      <Text style={styles.modalTitled}>Internet Speed Test</Text>

      {isTesting ? (
        <ActivityIndicator size="large" color="#0044cc" />
      ) : (
        <>
          <Text style={styles.speedTexted}>Download: {downloadSpeed ? `${downloadSpeed} Mbps` : '--'}</Text>
          <Text style={styles.speedTexted}>Upload: {uploadSpeed ? `${uploadSpeed} Mbps` : '--'}</Text>
          <Text style={styles.speedTexted}>Ping: {ping ? `${ping} ms` : '--'}</Text>
        </>
      )}
 
       <TouchableOpacity style={styles.modalButtoned} onPress={startSpeedTest} disabled={isTesting}>
            <Text style={styles.modalButtonTexted}>{isTesting ? 'Testing...' : 'Start Test'}</Text>
          </TouchableOpacity>

      <TouchableOpacity style={styles.closeButtoned} onPress={() => setSpeedTestVisible(false)}>
        <Text style={styles.closeButtonTexted}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
    </ScrollView>
  </View>
  );
};

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#f4f4f4' },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  
  header: { 
    borderBottomLeftRadius: 20, 
    borderBottomRightRadius: 20, 
    paddingVertical: 20,
    paddingHorizontal: 20
  },
  headerContent: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginTop: StatusBar.currentHeight || 40
  },
  headerText: { 
    fontSize: 19, 
    color: '#fff', 
    fontWeight: 'bold', 
    position: 'absolute', 
    left: '76%', 
    transform: [{ translateX: -122 }] 
  },
  logo: { 
    width: 40, 
    height: 40, 
    resizeMode: 'contain', 
    borderRadius: 20,
    right: '23%'
  },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-start' },
  sidebar: { width: '70%', backgroundColor: '#fff', height: '100%', padding: 20, borderTopRightRadius: 20, borderBottomRightRadius: 20 },
  sidebarProfile: { alignItems: 'center', marginBottom: 20 },
  sidebarProfilePic: { width: 60, height: 60, borderRadius: 30 },
  sidebarProfileName: { fontSize: 16, fontWeight: 'bold' },
  sidebarProfileEmail: { fontSize: 14, color: '#555' },
  sidebarItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15 },
  sidebarText: { fontSize: 16, marginLeft: 10 },
  profileCard: { alignItems: 'center', backgroundColor: '#fff', padding: 20, borderRadius: 10, marginBottom: 20 },
  profilePic: { width: 80, height: 80, borderRadius: 40, marginBottom: 10 },
  profileName: { fontSize: 18, fontWeight: 'bold' },
  profileEmail: { fontSize: 14, color: '#555' },


  announcementContainer: { backgroundColor: '#ffdd57', padding: 15, margin: 20, borderRadius: 10 },
  announcementTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  announcementText: { fontSize: 14, color: '#555', marginTop: 5 },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-start' },
  sidebar: { width: '70%', backgroundColor: '#fff', height: '100%', padding: 20, borderTopRightRadius: 20, borderBottomRightRadius: 20 },
  sidebarTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  sidebarItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15 },
  sidebarText: { fontSize: 16, marginLeft: 10 },

  card: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 12, 
    elevation: 5, 
    shadowColor: '#000', 
    marginBottom: 20 
  },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  usage: { fontSize: 14, color: '#555', marginTop: 5 },
  highlight: { color: '#0044cc', fontWeight: 'bold' },
  bold: { fontWeight: 'bold' },
  balance: { color: '#d9534f', fontWeight: 'bold' },
  warning: { color: '#f39c12', fontWeight: 'bold' },
  
  button: { backgroundColor: '#0044cc', padding: 12, borderRadius: 8, marginTop: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },

  quickActions: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  actionButton: { alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 10, elevation: 3, width: 100 },
  actionText: { fontSize: 14, fontWeight: 'bold', marginTop: 5, color: '#0044cc' },

  featureCard: { flexDirection: 'row', justifyContent: 'space-around', padding: 15, backgroundColor: '#fff', borderRadius: 10, elevation: 3 },
  featureButton: { alignItems: 'center', flex: 1, padding: 10 },
  featureText: { fontSize: 14, fontWeight: 'bold', marginTop: 5, color: '#333' },

  newsContainer: { marginTop: 20, paddingHorizontal: 5 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  newsItem: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 10, elevation: 3 },
  newsTitle: { fontSize: 16, fontWeight: 'bold', color: '#0044cc' },
  newsSource: { fontSize: 12, color: '#666', marginTop: 3 },

  modalOverlayed: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Slightly darker overlay
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContented: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10, // Shadow for Android
  },
  modalTitled: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  speedTexted: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
    color: '#0044cc',
  },
  speedUnit: {
    fontSize: 16,
    color: '#555',
  },
  modalButtoned: {
    backgroundColor: '#0044cc',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonTexted: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButtoned: {
    marginTop: 15,
  },
  closeButtonTexted: {
    color: '#d9534f',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
