import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, TouchableOpacity, BackHandler, Image,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import qs from 'qs';
import { useFocusEffect } from '@react-navigation/native';

const ServiceHistory = ({ navigation }) => {
  const [serviceData, setServiceData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [serviceValue, setServiceValue] = useState('');
  const [serviceItems, setServiceItems] = useState([]);

  const [statusValue, setStatusValue] = useState('');
  const [statusOpen, setStatusOpen] = useState(false);
  const [statusItems, setStatusItems] = useState([
    { label: 'All Status', value: '' },
    { label: 'Pending', value: '-1' },
    { label: 'Success', value: '1' },
    { label: 'Process', value: '5' },
    { label: 'Rejected', value: '2' },
    { label: 'Hold', value: '4' },
    { label: 'Objection', value: '8' },
 ]);

 console.log("Status value being sent:", statusValue);


  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
       navigation.navigate('Example2_1');
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  useEffect(() => {
    fetchServices();
    fetchServiceHistory();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch('https://righten.in/api/users/services/level');
      const json = await res.json();
      if (json.status !== 'success') throw new Error('Service fetch failed');

      const formatted = json.data.map(item => ({
        ...item,
        label: item.level,
        value: item.value ?? item.id,
      }));
      formatted.unshift({ label: 'All Services', value: '' });
      setServiceItems(formatted);
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const fetchServiceHistory = async () => {
    try {
      setLoading(true);
      const user_id = await AsyncStorage.getItem('us_id');
      const from_date = startDate.toISOString().split('T')[0];
      const to_date = endDate.toISOString().split('T')[0];

      const postData = qs.stringify({ user_id, from_date, to_date, service_id: serviceValue, status: statusValue });

      const res = await fetch('https://righten.in/api/users/services/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: postData,
      });

      const json = await res.json();
      if (json.status === 'success' && Array.isArray(json.data)) {
        setServiceData(json.data);
      } else {
        setServiceData([]);
        Alert.alert('Error', json.message || 'No data found');
      }
    } catch (err) {
      Alert.alert('Error', 'Service history fetch failed');
    } finally {
      setLoading(false);
    }
  };

const renderItem = ({ item }) => {
  const isUnpaid = item.payment_status === 'Unpaid';

  const handleRepayment = async () => {
    const us_id = await AsyncStorage.getItem('us_id');
    const form_id = item.id;
    const service_data = {
      service_id: item.service_id,
      sub_service_id: item.sub_service_id,
      service_code: item.service_code,
      offer_price: item.charges,
    };
    navigation.navigate('PaymentMode', {
      txn_id: item.txn_id,
      user_id: us_id,
      form_id,
      service_data,
    });
  };

  const handleAction = async () => {
    navigation.navigate('ShowDetails',{
      item:item.action,
    });
    console.log('item',item);
  };

  return (
    <View style={[styles.card, { borderLeftColor: item.status_color_code || '#999' }]}>
      <View style={styles.mainRow}>
        {/* Icon (Left Side Centered) */}
        <View style={styles.leftIconWrap}>
          <Image
            source={{ uri: `https://righten.in/public/admin/assets/img/service_icon/${item.sub_service_icon}` }}
            style={styles.icon}
          />
        </View>

        {/* Content (Right Side) */}
        <View style={{ flex: 1 }}>
          <View style={styles.row}>
            <Text style={styles.label}>{item.service_name}</Text>
            <Text style={styles.value}>{item.sub_service_name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{item.name}</Text>
            <Text style={styles.value}>{item.mobile}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>₹ {item.charges}</Text>
            <Text style={[styles.label, { color: item.status_color_code }]}>{item.status_name}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>{item.txn_id}</Text>
            <Text style={styles.value}>{item.created_at?.split(' ')[0]}</Text>
          </View>

            <View style={styles.row}>
              <TouchableOpacity style={styles.viewDetailsBtn} onPress={handleAction}>
                  <Text style={styles.viewDetailsText}>View Details </Text>
              </TouchableOpacity>
              {/* Buttons */}
              {isUnpaid && (
                  <TouchableOpacity style={styles.repayBtn} onPress={handleRepayment}>
                  <Text style={styles.repayText}>Re-Payment</Text>
                  </TouchableOpacity>
              )}

            </View>
        </View>
      </View>
    </View>
  );
};


  return (
    <View style={{ flex: 1, backgroundColor: '#f4f6f8' }}>
      {/* Fixed Filter */}
      <View style={styles.filterCard}>
        <Text style={styles.heading}>Service History</Text>
        <View style={styles.dateRow}>
          <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.dateInput}>
            <Text>From: {startDate.toDateString()}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.dateInput}>
            <Text>To: {endDate.toDateString()}</Text>
          </TouchableOpacity>
        </View>
        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={(e, d) => { setShowStartPicker(false); if (d) setStartDate(d); }}
            maximumDate={new Date()}
          />
        )}
        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={(e, d) => { setShowEndPicker(false); if (d) setEndDate(d); }}
            maximumDate={new Date()}
          />
        )}
        <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 5 }}>
                <DropDownPicker
                open={dropdownOpen}
                value={serviceValue}
                items={serviceItems}
                setOpen={setDropdownOpen}
                setValue={setServiceValue}
                setItems={setServiceItems}
                placeholder="Select Service"
                searchable={true}
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownList}
                zIndex={999}
                zIndexInverse={1000}
                />
            </View>

            <View style={{ flex: 1, marginLeft: 5 }}>
                <DropDownPicker
                    open={statusOpen}
                    value={statusValue}
                    items={statusItems}
                    setOpen={setStatusOpen}
                    setValue={setStatusValue}         // ✅ এখানে সরাসরি দিতে পারো
                    setItems={setStatusItems}         // ✅ এটাও দিতে হবে
                    placeholder="Select Status"
                    searchable={true}                 // ✅ search option
                    style={styles.dropdown}
                    dropDownContainerStyle={styles.dropdownList}
                    zIndex={998}
                    zIndexInverse={999}
                />
            </View>
        </View>

        <TouchableOpacity style={styles.filterBtn} onPress={fetchServiceHistory}>
          <Text style={styles.filterText}>Apply Filter</Text>
        </TouchableOpacity>
      </View>

      {/* List Area */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#ffcb0a" />
        </View>
      ) : (
        <FlatList
          data={serviceData}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={() => (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No history found</Text>
          </View>
          )}
        />
      )}
    </View>
  );
};

export default ServiceHistory;

const styles = StyleSheet.create({
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
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
    margin: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 1000,
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
mainRow: {
  flexDirection: 'row',
  padding: 5,
},
leftIconWrap: {
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 10,
},
icon: {
  width: 60,
  height: 60,
  resizeMode: 'contain',
},
row: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 4,
},
label: {
  fontWeight: 'bold',
  color: '#555',
  flex: 1,
},
value: {
  flex: 1,
  textAlign: 'right',
  color: '#222',
},
repayBtn: {
  backgroundColor: '#ffcb0a',
  padding: 10,
  borderRadius: 8,
  marginTop: 10,
  alignItems: 'center',
},
repayText: {
  fontWeight: 'bold',
  color: '#000',
},
viewDetailsBtn: {
  backgroundColor: 'green',
  padding: 10,
  borderRadius: 8,
  marginTop: 10,
  alignItems: 'center',
},
viewDetailsText: {
  color: '#fff',
  fontWeight: 'bold',
},

dropdown: {
  borderColor: '#ccc',
  borderRadius: 10,
  backgroundColor: '#fff',
},
dropdownList: {
  borderColor: '#ccc',
  maxHeight: 350,
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
    padding: 10,
    borderRadius: 14,
    marginBottom: 8,
    marginHorizontal: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    borderLeftWidth: 5,
    borderLeftColor: '#999',
  },
  flexRowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  value: {
    color: '#000',
  },
  status: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  txnText: {
    color: '#555',
  },
    emptyCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    marginTop: 0,
    marginHorizontal: 15,
    borderLeftWidth: 5,
    borderLeftColor:'#999',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '600',
  },
});
