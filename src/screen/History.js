import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  BackHandler,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const History = ({ navigation }) => {
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('main');
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  const historyCards = [
    {
      title: 'Service History',
      icon: require('../../assets/icon/service.png'), // replace with your asset
      navigateTo: 'ServiceHistory',
    },
    {
      title: 'Wallet History',
      icon: require('../../assets/icon/wallet_icon.png'), // replace with your asset
      navigateTo: 'WalletHistory',
    },
    {
      title: 'Payment History',
      icon: require('../../assets/icon/payment.png'), // replace with your asset
      navigateTo: 'PaymentHistory',
    },
  ];

  const renderCard = (item, index) => (
    <TouchableOpacity
      key={index}
      style={styles.card}
      onPress={() => navigation.navigate(item.navigateTo)}
    >
      <Image source={item.icon} style={styles.icon} />
      <Text style={styles.cardText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>History</Text>
      <View style={styles.cardContainer}>
        {historyCards.map((item, index) => renderCard(item, index))}
      </View>
    </View>
  );
};

export default History;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdfdfd',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  cardContainer: {
    flexDirection: 'column',
    gap: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffffff',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderLeftWidth:5,
    borderLeftColor: '#0097449c',
    shadowOffset: { width: 0, height: 3 },
  },
  icon: {
    width: 80,
    height: 80,
    marginRight: 20,
    resizeMode: 'contain',
  },
  cardText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
});
