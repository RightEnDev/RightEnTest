import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import qs from 'qs';
import { useFocusEffect } from '@react-navigation/native';

const WalletHistory = ({navigation}) => {
  const [walletData, setWalletData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [value, setValue] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchOptionData();
    fetchWalletHistory();
  }, []);

    useFocusEffect(
      React.useCallback(() => {
        const onBackPress = () => {
          navigation.navigate('Example2_1');
          return true;
        };
  
        BackHandler.addEventListener('hardwareBackPress', onBackPress);
        return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      }, [navigation])
    );

  const fetchOptionData = async () => {
    try {
      const response = await axios.get(`https://righten.in/api/users/services/level`);
      if (response.data.status !== "success") {
        throw new Error('Failed to load services');
      }
      const updatedData = response.data.data.map(item => {
        return {
          ...item,
          label: item.level,
        };
      });
      const newElement = {
        value: "",
        label: "All servicce",
        status: "1"
      };
      updatedData.unshift(newElement);

      setItems(updatedData);

      console.log('service_id',updatedData);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const fetchWalletHistory = async () => {
    try {
      setLoading(true);
      const user_id = await AsyncStorage.getItem('us_id');
      const from_date = startDate.toISOString().split('T')[0];
      const to_date = endDate.toISOString().split('T')[0];

      const postData = qs.stringify({
        user_id,
        from_date,
        to_date,
        service_id: value,
      });

      const response = await axios.post(
        'https://righten.in/api/users/wallet/history',
        postData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      if (response.data.status === 'success') {
        setWalletData(response.data.data || []);
      } else {
        Alert.alert('Error', response.data.message || 'Something went wrong');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch wallet history');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartDateChange = (event, selectedDate) => {
    if (selectedDate) setStartDate(selectedDate);
    setShowStartPicker(false);
  };

  const handleEndDateChange = (event, selectedDate) => {
    if (selectedDate) setEndDate(selectedDate);
    setShowEndPicker(false);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split(' ')[0].split('-');
    return `${day}-${month}-${year}`;
  };

  const renderItem = ({ item }) => (
    <View style={[styles.card,item.type === 'C' && { borderLeftColor: '#009743',backgroundColor: '#eaffea'}]}>
      <View style={styles.row}>
        <Image
          source={{ uri: `https://righten.in/public/admin/assets/img/service_icon/${item.icon}` }}
          style={styles.icon}
        />
        <View style={{ flex: 1 }}>
          <View style={styles.flexRow}>
            <Text style={styles.serviceName}>{item.service_name}</Text>
            <Text style={styles.subService}>{item.sub_service}</Text>
          </View>

          <View style={styles.flexRow}>
            <Text style={styles.serviceName}>Amount </Text>
            <Text style={[
              styles.amount,
              item.type === 'C' ? styles.credit : styles.debit
            ]}>
              ₹ {parseFloat(item.amount).toFixed(2)} ({item.type === 'C' ? 'Cr.' : 'Dr.'})
            </Text>
          </View>

          <View style={styles.flexRow}>
            <Text style={styles.serviceName}>Before </Text>
            <Text style={styles.subService}>₹ {item.before_bal}</Text>
          </View>

         <View style={styles.flexRow}>
            <Text style={styles.serviceName}>After </Text>
            <Text style={styles.subService}>₹ {item.update_bal}</Text>
          </View>

          <View style={styles.flexRow}>
            <Text style={styles.txnId}>{item.txn_id}</Text>
            <Text style={styles.subService}>{formatDate(item.created_at)}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#ffcb0a" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.filterCard}>
        <Text style={styles.heading}>Wallet History</Text>
        <View style={styles.dateRow}>
          <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.dateInput}>
            <Text style={styles.dateTextBtn}>From: {startDate.toDateString()}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.dateInput}>
            <Text style={styles.dateTextBtn}>To: {endDate.toDateString()}</Text>
          </TouchableOpacity>
        </View>

        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={handleStartDateChange}
            maximumDate={new Date()}
          />
        )}
        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={handleEndDateChange}
            maximumDate={new Date()}
          />
        )}

        <DropDownPicker
          open={dropdownOpen}
          value={value}
          items={items}
          setOpen={setDropdownOpen}
          setValue={setValue}
          setItems={setItems}
          placeholder="Select Service"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownList}
          searchable={true} // 🔍 search bar add
          searchPlaceholder="Search service..."
          listMode="SCROLLVIEW" // 📜 scrollable list
          zIndex={999}
          zIndexInverse={1000}
        />
        <TouchableOpacity style={styles.filterBtn} onPress={fetchWalletHistory}>
          <Text style={styles.filterText}>Apply Filter</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={walletData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={() => (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No history found</Text>
          </View>
        )}
      />

    </View>
  );
};

export default WalletHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    padding: 15,
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 1000, // updated
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dateInput: {
    flex: 1,
    marginRight: 10,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  dateTextBtn: {
    fontSize: 14,
    color: '#333',
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  dropdownList: {
    borderColor: '#ccc',
  },
  filterBtn: {
    backgroundColor: '#ffcb0a',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  filterText: {
    fontWeight: 'bold',
    color: '#000',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 14,
    marginBottom: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    borderLeftWidth: 5,
    borderLeftColor:'#f70303',
  },
  row: {
    flexDirection: 'row',
  },
  icon: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 5,
    top:35,
    resizeMode: 'cover',
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
  },
  serviceName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#222',
  },
  subService: {
    fontSize: 12,
    color: '#000000',
  },
  amount: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  credit: {
    color: '#009743',
  },
  debit: {
    color: '#f70303',
  },
  balance: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
  },
  txn: {
    fontSize: 12,
    color: '#999',
  },
  txnId: {
    fontWeight: '600',
    color: '#444',
  },
  dateText: {
    fontSize: 12,
    color: '#666',
  },
  emptyCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    marginTop: 0,
    marginHorizontal: 10,
    borderLeftWidth: 5,
    borderLeftColor:'#999',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '600',
  },

});
