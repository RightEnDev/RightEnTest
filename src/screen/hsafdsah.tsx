import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native';
import RNBlobUtil from 'react-native-blob-util';
import RNFS from 'react-native-fs';

const ShowDetails = ({ route, navigation }) => {
  const { item } = route.params;
  const isFocused = useIsFocused();
  const [inprocess, setInprocess] = useState(false);
  const [searchdata, setSearchData] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('Example2_1'); // Navigate back to the main screen
        return true; // Prevent the default behavior
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  const downloadFile = async (url) => {
    setInprocess(true);
    const date = new Date();
    const extension = url.split('.').pop();
    const fileName = `file_${Math.floor(date.getTime() + date.getSeconds() / 2)}.${extension}`;

    try {
      const granted = Platform.OS === 'android' ? await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE) : true;
      if (granted === PermissionsAndroid.RESULTS.GRANTED || Platform.OS === 'ios') {
        actualDownload(fileName, url);
      } else {
        Alert.alert('Permission denied', 'Please grant storage permissions to download the file.');
      }
    } catch (err) {
      console.log('Permission error:', err);
      Alert.alert('Error', 'Could not request permissions');
    }
  };

  const actualDownload = (fileName, pathJPG) => {
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

    RNBlobUtil.config(configOptions)
      .fetch('GET', pathJPG, {})
      .then(res => {
        setInprocess(false);
        if (Platform.OS === 'ios') {
          RNBlobUtil.fs.writeFile(res.path(), res.data, 'base64');
          RNBlobUtil.ios.previewDocument(res.path());
        } else {
          console.log('File downloaded:', res.path());
        }
      })
      .catch(e => {
        setInprocess(false);
        Alert.alert('Download Failure', 'Please try again', [{ text: 'OK' }]);
        console.log('Download error:', e);
      });
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
      setSearchData([]);
    }
  }, [isFocused]);

  return (
    <ScrollView style={{ backgroundColor: "white" }}>
      {inprocess && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>File Downloading in progress...</Text>
        </View>
      )}
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.headerText}>Retailer Details</Text>
          </View>
          {Object.entries({
            'Name': searchdata.user_name,
            'UserId': searchdata.user_id,
            'Mobile': searchdata.user_mobile,
            'Village': searchdata.vill,
            'Block': searchdata.block,
            'District': searchdata.city,
            'State': searchdata.state,
            'Pin': searchdata.pin,
          }).map(([key, value]) => (
            <View style={styles.detailRow} key={key}>
              <Text style={styles.detailLabel}>{key}</Text>
              <Text style={styles.detailValue}>{value}</Text>
            </View>
          ))}
        </View>
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.headerText}>Customer Details</Text>
          </View>
          {Object.entries({
            'Name': searchdata.name,
            'Mobile': searchdata.mobile,
            'TXN': searchdata.txn_id,
            'UTR': searchdata.utr_no,
          }).map(([key, value]) => (
            <View style={styles.detailRow} key={key}>
              <Text style={styles.detailLabel}>{key}</Text>
              <Text style={styles.detailValue}>{value}</Text>
            </View>
          ))}
        </View>
        <View style={styles.headerContainer}>
          <Text style={styles.documentHeader}>Documents</Text>
        </View>
        <View>
          {searchdata?.retail_img && (
            <View style={styles.imagesContainer}>
              {Object.values(searchdata.retail_img).map((imgItem, index) => (
                <TouchableOpacity key={index} onPress={() => downloadFile(imgItem.file_path)}>
                  <View style={styles.imageWrapper}>
                    {/* Display image here */}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
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
  sectionHeader: {
    marginBottom: 10,
    borderBottomWidth: 1,
    alignItems: 'center', // Align items in the center
    justifyContent: 'center', // Center the content

    
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    paddingVertical: 10, // Add some vertical padding

  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 5,
    
  },
  detailLabel: {
    width: 210,
    fontSize: 16,
    color: '#000000',

  },
  detailValue: {
    fontSize: 16,
    color: '#000000',

  },
  headerContainer: {
    alignItems: 'center',
    borderBottomWidth: 1,
    marginVertical: 10,
    
  },
  documentHeader: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  imageWrapper: {
    width: '30%', // Adjust as needed
    marginBottom: 10,
    // Add styles for the image
  },
});

export default ShowDetails;
