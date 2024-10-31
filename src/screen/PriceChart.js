import { StyleSheet, Text,Image, ScrollView, View, BackHandler, StatusBar, ActivityIndicator, FlatList, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const PriceChart = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('main');
        return true; // Prevent the default behavior
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://righten.in/api/users/price_chart');
        if (response.data.status !== "success") {
          throw new Error('Network response was not ok');
        }
        setData(response.data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.userContainer}>
      <View style={styles.card}>
        <View style={styles.row}>
          <Image
            source={{ uri: `https://righten.in/public/admin/assets/img/service_icon/${item.icon}` }}
            style={styles.serviceImage}
          />
          
          <View style={styles.detailsContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.serviceText}>{item.service_name}</Text>
              <Text style={styles.prText}>{item.sub_service}</Text>
            </View>
  
            <View style={styles.infoRow}>
              <Text style={styles.serviceText}>Price: </Text>
              <Text style={styles.pr1Text}>₹ {item.charges}</Text>
            </View>
  
            <View style={styles.infoRow}>
              <Text style={styles.serviceText}>Discount: </Text>
              <Text style={styles.pr2Text}>₹ {item.offer_price}</Text>
            </View>
  
            <View style={styles.infoRow}>
              <Text style={styles.serviceText}>Earning: </Text>
              <Text style={styles.commText}>₹ {item.income}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
  
  

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#06b4d6" />
      <Text style={styles.title}> ₹ Price Chart All Services </Text>
      <ScrollView>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
        />
      </ScrollView>
    </View>
  );
}

export default PriceChart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#009743',
    marginTop: 5,
  },
  userContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 3,
    marginVertical: 3,
  },
  card: {
    width: '95%',
    borderRadius: 15,
    backgroundColor: '#ffffff',
    padding: 10,
    // marginVertical: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    // marginVertical: 5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginVertical: 2,
  },
  serviceImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  detailsContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  serviceText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  prText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  pr1Text: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  pr2Text: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  commText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50', // Special color for commission
  },
});



