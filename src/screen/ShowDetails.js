import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native';
import RNBlobUtil from 'react-native-blob-util';
import RNFS from 'react-native-fs';

const ShowDetails = ({ route, navigation }) => {
  const { item } = route.params;
  // console.log('Data',  item);
  const isFocused = useIsFocused();
  const [inprocess, setInprocess] = useState(false);
  const [searchdata, setSearchData] = useState({});

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('Example2_1'); // Navigate back to the main screen
        return true; // Prevent the default behavior
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        setSearchData({}); // Clear data on unmount
      };
    }, [navigation])
  );

  const downloadFile = async (url) => {
    setInprocess(true);
    const date = new Date();
    const extension = url.split('.').pop();
    const fileName = `file_${Math.floor(date.getTime() + date.getSeconds() / 2)}.${extension}`;
    const { dirs } = RNBlobUtil.fs;
    const dirToSave = Platform.OS === 'ios' ? dirs.DocumentDir : RNFS.DownloadDirectoryPath;

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

    try {
      const res = await RNBlobUtil.config(configOptions).fetch('GET', url, {});
      if (Platform.OS === 'ios') {
        RNBlobUtil.fs.writeFile(res.path(), res.data, 'base64');
        RNBlobUtil.ios.previewDocument(res.path());
      }
      Alert.alert('Download Successful', 'Downloaded successfully.', [{ text: 'OK' }]);
    } catch (e) {
      Alert.alert('Download Failure', 'Please try again', [{ text: 'OK' }]);
      console.log('Download error:', e);
    } finally {
      setInprocess(false);
    }
  };

  const getSearchData = async () => {
    if (item?.action) {
      try {
        const response = await axios.get(item.action);
        setSearchData(response.data.data);
      } catch (error) {
        console.log('Error fetching data:', error);
        Alert.alert('Error', 'Could not fetch data');
      }
    }
  };

  useEffect(() => {
    if (isFocused) {
      getSearchData();
    } else {
      setSearchData({});
    }
  }, [isFocused]);

  return (
    <ScrollView style={{ backgroundColor: "white" }}>
      {inprocess && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Downloading in progress...</Text>
        </View>
      )}
      <View style={styles.container}>

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.headerText}>Service Details</Text>
          </View>

          {/* Centered Service Image */}
       
          <View style={styles.imageContainer}>
            <Image source={{ uri: `https://righten.in/public/admin/assets/img/service_icon/${item.service_icon}` }} style={styles.serviceImage} />
          </View>
         

          {Object.entries({
              'Service': item.service_name,
              'Type': item.sub_service,
              'Name': item.customer_name,
              'Mobile': searchdata.mobile,
              'Txn Id': item.txn_id,
              'Amount': item.amount,
              'UTR No': item.utr,
              'Payment Status': item.status,
              'Service Status': item.service_status,
              'Date': item.date,
            }).map(([key, value]) => (
              <View style={styles.detailRow} key={key}>
                <Text style={styles.detailLabel}>{key}</Text>

                {(key === 'Payment Status' || key === 'Service Status') ? (
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor: 
                          value === 'Success' ? '#22cc62' : 
                          value === 'Reject' ? 'red' : 
                          value === 'Pending' ? 'orange' : 
                          'gray', // Default to gray if no match
                      },
                    ]}
                  >
                    <Text style={styles.statusText}>{value ?? 'N/A'}</Text>
                  </View>
                ) : (
                  <Text style={styles.detailValue}>{value ?? 'N/A'}</Text>
                )}
              </View>
            ))}

        </View>
        <View style={styles.card}>
          <View style={styles.headerContainer}>
            <Text style={styles.documentHeader}>Documents</Text>
            {searchdata?.retail_img && (
              <View style={styles.imageContainer}>
                {Object.values(searchdata.retail_img).map((item, index) => (
                  <View key={index} style={styles.imageWrapper}>
                    {item.file_path && (
                      <TouchableOpacity onPress={() => downloadFile(searchdata.retail_img_path + item.file_path)}>
                        <Text style={styles.downloadButton}>Download</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </View>




      
        {/* Admin Documents Card */}
        <View style={styles.Admincard}>
          <View style={styles.headerContainer}>
            <Text style={styles.documentHeader}>Admin Documents</Text>
            {searchdata?.admin_img ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
              {Object.values(searchdata.admin_img).map((item, index) => (
                <View
                  key={index}
                  style={{
                    width: '30%', // Each item takes up 30% of the width
                    marginBottom: 10, // Margin between rows
                  }}
                >
                  {item.file_path ? (
                    // {/* {searchdata.retail_img_path} */}
                    //   {/* {item.file_path} */}
                    <TouchableOpacity onPress={() => {
                      console.log(searchdata.admin_img_path + item.file_path);
                      downloadFile(searchdata.admin_img_path + item.file_path);

                    }}>

                      <Text style={{
                        fontSize: 16, color: 'white', borderWidth: 1, borderColor: "#009743",
                        borderRadius: 5, paddingHorizontal: 10, backgroundColor: "#009743", paddingVertical: 5,
                        textAlign: 'center', marginTop: 15
                      }}>Download</Text>
                    </TouchableOpacity>

                  ) : null}
                </View>
              ))}
            </View>
          ) : (
            null
          )}
          </View>
        </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingOverlay: {
    zIndex: 1,
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
  },
  container: {
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    elevation: 2,
  },
  Admincard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width:"95%",
    padding: 10,
    alignItems:'center',
    marginLeft:10,
    marginBottom: 10,
    elevation: 2,
  },
  sectionHeader: {
    marginBottom: 10,
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    paddingVertical: 10,
  },
 
  serviceImage: {
    width: 80, // Set the image width
    height: 80, // Set the image height
    marginTop: -30,
    //borderRadius: 50, // Optional: make the image circular
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 5,
  },
  detailLabel: {
    width: 210,
    //alignItems: 'right',
    fontSize: 16,
    color: '#000000',
    fontWeight: 'bold',
  },
  detailValue: {
    fontSize: 16,
    color: '#000000',
    fontWeight: 'bold',
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
  headerContainer: {
    alignItems: 'center',
    marginVertical: 10,
    justifyContent: 'center',
  },
  documentHeader: {
    borderBottomWidth: 1,
    width: 376,
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center', // Center the documents
    marginTop: 10,
    paddingVertical: 10,
  },
  imageWrapper: {
    width: '30%',
    margin: 5, // Add margin for spacing between buttons
  },
  downloadButton: {
    fontSize: 16,
    color: 'white',
    borderWidth: 1,
    borderColor: '#009743',
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#009743',
    paddingVertical: 5,
    textAlign: 'center',
  },
});

export default ShowDetails;
