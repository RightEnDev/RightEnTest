import {
  StyleSheet,
  Text,
  View,
  BackHandler,
  Alert,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  FlatList,
  ScrollView,
  Animated,
  Dimensions,
  Image,
  TouchableOpacity
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigationState } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const scrollRef = useRef();
  const scrollX = useRef(new Animated.Value(0)).current;
  const currentRoute = useNavigationState((state) => state.routes[state.index]?.name);

  // Android Back Button Handling
  useEffect(() => {
    const backAction = () => {
      if (currentRoute === 'main') {
        Alert.alert('Hold on!', 'Are you sure you want to exit the app?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'YES', onPress: () => BackHandler.exitApp() }
        ]);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [currentRoute]);

  // Fetch Services
  const fetchData = async () => {
    try {
      const response = await axios.get('https://righten.in/api/users/services');
      if (response.data.status !== "success") throw new Error('Something went wrong');
      setData(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch Notices
  const fetchNotices = async () => {
    try {
      const response = await axios.get('https://righten.in/api/retailer/notice?audience=retailer');
      setNotices(response.data);
    } catch (err) {
      console.error('Error fetching notices:', err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchNotices();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    await fetchNotices();
  };

  // Optional: Auto-scroll for notice slider
  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (scrollRef.current && notices.length > 1) {
        currentIndex = (currentIndex + 1) % notices.length;
        scrollRef.current.scrollTo({
          x: currentIndex * (width - 60),
          animated: true,
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [notices]);

  const getColor = (color) => {
    switch (color) {
      case 'primary': return '#0d6efd';
      case 'success': return '#198754';
      case 'info': return '#0dcaf0';
      case 'warning': return '#ffc107';
      case 'danger': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const highlightServiceCodes = ['code1', 'code2'];

  const renderItem = ({ item }) => {
    if (item.status !== "1" || !item.app_icon) return null;
    const isHighlighted = highlightServiceCodes.includes(item.service_code);

    return (
      <TouchableOpacity
        style={[styles.serviceBox, isHighlighted && styles.highlightedServiceBox]}
        onPress={() =>
          navigation.navigate('Details', {
            service_id: item.id,
            app_icon: item.app_icon,
            service_code: item.service_code
          })
        }
      >
        <Image
          source={{ uri: `https://righten.in/public/admin/assets/img/service_icon/${item.app_icon}` }}
          style={styles.serviceImage}
        />
        <Text style={styles.serviceName}>{item.service_name}</Text>
        <Text style={styles.serviceDescription}>{item.description}</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#06b4d6" />
        <Text style={styles.loadingText}>Loading services...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#06b4d6" />

      {/* 🔔 Notice Slider */}
      {notices.length > 0 && (
        <View style={styles.noticeContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            ref={scrollRef}
          >
            {notices.map((notice, index) => (
              <View
                key={index}
                style={[styles.noticeCard, { backgroundColor: getColor(notice.color) }]}
              >
                <Text style={styles.noticeTitle}>{notice.title}</Text>
                <Text style={styles.noticeMessage}>{notice.message}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* 🧩 Services Grid */}
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        columnWrapperStyle={styles.serviceRow}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default HomeScreen;

// 🧱 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 10,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },

  // 🔔 Notices
  noticeContainer: {
    height: 120,
    marginBottom: 15,
  },
  noticeCard: {
    width: width - 60,
    marginRight: 10,
    borderRadius: 10,
    padding: 15,
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  noticeMessage: {
    fontSize: 14,
    color: '#f8f9fa',
  },

  // 🔘 Service Box
  serviceRow: {
    justifyContent: 'space-between',
    margin: 5,
    padding: 5,
  },
  serviceBox: {
    justifyContent: 'center',
    width: (width - 60) / 3,
    height: (width - 130) / 5 + 25,
    marginVertical: 0,
    marginHorizontal: 0,
    borderWidth: 2,
    borderColor: '#009743',
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#009743',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    marginTop: 5,
  },
  highlightedServiceBox: {
    borderColor: '#FF5722',
    backgroundColor: '#ffe0b2',
    elevation: 6,
    shadowOpacity: 0.5,
  },
  serviceImage: {
    height: '100%',
    width: '60%',
    alignSelf: 'center',
    marginTop: 20,
  },
  serviceName: {
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: 'bold',
    fontSize: 11,
    color: '#000',
  },
  serviceDescription: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});
