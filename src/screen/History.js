import { StyleSheet, Text, TouchableOpacity, View, Image, Platform, ActivityIndicator, FlatList, NativeModules, ScrollView, Button, Alert, PermissionsAndroid, Linking } from 'react-native'
import React, { useState, useEffect } from 'react'
import { BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import qs from 'qs';
import { useIsFocused } from '@react-navigation/native';
import { SvgXml } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const History = ({ navigation }) => {
  const isFocused = useIsFocused();

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const downloadFile = async (url) => {
    const date = new Date();
    const pathJPG = url;
    const extension = url.split('.').pop();
    const fileName = `file_${Math.floor(date.getTime() + date.getSeconds() / 2)}.${extension}`;

    if (Platform.OS === 'ios') {
      actualDownload();
    } else {
      try {
        // Request storage permission on Android
        actualDownload(fileName, pathJPG);
 
      } catch (err) {
        console.log('Display error', err);
      }
    }




  };


  const actualDownload = (fileName, pathJPG) => {
    console.log(fileName, pathJPG);
    // console.log("");
    const { dirs } = RNFetchBlob.fs;
    const dirToSave = Platform.OS === 'ios' ? dirs.DocumentDir : dirs.DownloadDir;
    const configOptions = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        mediaScannable: true,
        title: fileName,
        path: `${dirToSave}/${fileName}`,
      },
    };

    RNFetchBlob.config(configOptions)
      .fetch('GET', pathJPG, {})
      .then(res => {
        Alert.alert(
          'Download successful',
          'The file has been successfully downloaded.',
          [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        );
        if (Platform.OS === 'ios') {
          RNFetchBlob.fs.writeFile(res.path(), res.data, 'base64');
          RNFetchBlob.ios.previewDocument(res.path());
        }
        if (Platform.OS === 'android') {
          console.log('File downloaded');
        }
      })
      .catch(e => {
        Alert.alert(
          'Download Faliure',
          'Download again',
          [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        );
        console.log('Download error==>', e);
      });
  };  
  const fetchData = async () => {
    try {
      setLoading(true);

      setData([]);
      const us_id = await AsyncStorage.getItem('us_id');
      // console.log(startDate.toISOString().split('T')[0]);
      // console.log(endDate.toISOString().split('T')[0]);
      const response = await axios.post('https://righten.in/api/services/report',
        qs.stringify({
          user_id: us_id,
          service_id: value,
          from_date: startDate.toISOString().split('T')[0],
          to_date: endDate.toISOString().split('T')[0]

        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0',
          },
        }
      );
      // console.log(response.data);
      if (!response.data.status === "success") {
        throw new Error('Network response was not ok');
      }
      setData(response.data.data);
      // console.log(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOptionData = async () => {
    try {
      setLoading(true);

      try {
        const response = await axios.get(`https://righten.in/api/users/services/level`);
        // console.log(response.data);
        if (!response.data.status === "success") {
          throw new Error('Network response was not ok');
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
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
      // console.log(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchOptionData();
  }, [isFocused, startDate, endDate, value]);

  const handleStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartPicker(false);
    setStartDate(currentDate);
  };

  const handleEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndPicker(false);
    setEndDate(currentDate);
  };

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

  const renderItem = ({ item }) => {
    return (
      <View style={{ padding: 5 }}>
        <View style={styles.card}>
          {/* Row Container */}
          <View style={styles.row}>
            
            {/* Left Column: Service Icon */}
            <View style={styles.iconContainer}>
              <Image 
                source={{ uri: `https://righten.in/public/admin/assets/img/service_icon/${item.service_icon}` }} 
                style={styles.serviceIcon} 
              />
            </View>
  
            {/* Middle Column: Details */}
            <View style={styles.detailsContainer}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Name</Text>
                <Text style={styles.infoText}>{item.customer_name}</Text>
              </View>
  
              <View style={styles.infoRow}>
                <Text style={styles.infoText}>{item.service_name}</Text>
                <Text style={styles.infoText}>{item.sub_service}</Text>
              </View>
  
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Amount</Text>
                <Text style={styles.infoText}>{item.amount}</Text>
              </View>
  
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Utr no</Text>
                <Text style={styles.infoText}>{item.utr}</Text>
              </View>
  
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Payment Status</Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: item.status === 'Success' ? '#22cc62' : 'red' },
                  ]}
                >
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>
  
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Service Status</Text>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: 
                        item.service_status === 'Success' ? '#22cc62' : 
                        item.service_status === 'Reject' ? 'red' : 
                        item.service_status === 'Pending' ? 'orange' : 
                        'gray', // Default to gray if no match
                    },
                  ]}

                >
                  <Text style={styles.statusText}>{item.service_status}</Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Date</Text>
                <Text style={styles.infoText}>{item.date}</Text>
              </View>
  
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Txn ID</Text>
                <Text style={styles.infoText}>{item.txn_id}</Text>
              </View>
            </View>

          </View>
  
          {/* Details Button */}
          <TouchableOpacity
            style={styles.showButton}
            onPress={() => navigation.navigate('ShowDetails', { item: item })}
          >
            <Text style={styles.showButtonText}> View Service Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  

  return (
    <View style={styles.container}>
       <View style={styles.datePickersContainer}>
        <View style={styles.datePickersRow}>
          <View style={styles.datePickerWrapper}>
            <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.dateButton}>
              <Text style={styles.dateButtonText}>{startDate.toDateString()}</Text>
            </TouchableOpacity>
            {showStartPicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display="spinner"
                onChange={handleStartDateChange}
                maximumDate={new Date()}
                minimumDate={new Date(1900, 0, 1)}
              />
            )}
          </View>
  
          <View style={styles.datePickerWrapper}>
            <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.dateButton}>
              <Text style={styles.dateButtonText}>{endDate.toDateString()}</Text>
            </TouchableOpacity>
            {showEndPicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display="spinner"
                onChange={handleEndDateChange}
                maximumDate={new Date()}
                minimumDate={new Date(1900, 0, 1)}
              />
            )}
          </View>
        </View>
      </View>

      <View style={styles.dropdownContainer}>
        <DropDownPicker
          open={dropdownOpen}
          value={value}
          items={items}
          setOpen={setDropdownOpen}
          setValue={setValue}
          setItems={setItems}
          placeholder="Select a Service Category"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownList}
        />
      </View>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.txn_id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    width: '100%',
    borderRadius: 15,
    backgroundColor: '#ffffff',
    padding: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceIcon: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  detailsContainer: {
    width: '80%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 1,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  infoText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  statusBadge: {
    paddingHorizontal: 10, // Add space around the text
    paddingVertical: 2, // Vertical padding
    borderRadius: 5, // Rounded corners
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff', // White text color
  },
  showButton: {
    borderColor: '#ffcb0a',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  showButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: 'bold',
  },

  datePickersContainer: {
    paddingLeft:7,
  },
  datePickersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  datePickerWrapper: {
    flex: 1,
    marginRight: 10,
  },
  dateButton: {
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#FFCB0A',
    alignItems: 'center',
  },
  dateButtonText: {
    color: '#333',
    fontSize: 13,
    fontWeight: 'bold',
  },
  dropdownContainer: {
    justifyContent: 'center',
    width: '100%',
    height:10,
    paddingBottom:50,
    padding:10,
    flexDirection: 'row'
  },
  dropdown: {
    backgroundColor: '#ffffff',
  },
  dropdownList: {
    backgroundColor: '#ffffff',
    fontSize: 20
  },

});

export default History;