import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native';
import RNBlobUtil from 'react-native-blob-util';
import RNFS from 'react-native-fs';

const ShowDetails = ({ route, navigation }) => {
  // console.log("open");
  const { item } = route.params;
  // console.log(item.action);
  const isFocused = useIsFocused();

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('Example2_1'); // Navigate back to the main screen
        return true; // Prevent the default behavior
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  const [inprocess, setinprocess] = useState(false);

  const downloadFile = async (url) => {
    setinprocess(true);
    const date = new Date();
    const pathJPG = url;
    // 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?cs=srgb&dl=pexels-pixabay-460672.jpg';
    const extension = url.split('.').pop();
    const fileName = `file_${Math.floor(date.getTime() + date.getSeconds() / 2)}.${extension}`;

    if (Platform.OS === 'ios') {
      actualDownload();
    } else {
      try {
        // Request storage permission on Android
        actualDownload(fileName, pathJPG);
        // const granted = await PermissionsAndroid.request(
        //   PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        // );
        // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //   actualDownload();
        // } else {
        //   console.log('Please grant permission');
        // }
      } catch (err) {
        console.log('Display error', err);
      }
    }




  };


  const actualDownload = (fileName, pathJPG) => {
    console.log(fileName, pathJPG);
    // console.log("");
    const { dirs } = RNBlobUtil.fs;
    const dirToSave = Platform.OS === 'ios' ? dirs.DocumentDir : RNFS.DownloadDirectoryPath;
    console.log(`${dirToSave}/${fileName}`);
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
        setinprocess(false);

        // Alert.alert(
        //   'Download successful',
        //   'The file has been successfully downloaded.',
        //   [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        // );
        if (Platform.OS === 'ios') {
          RNBlobUtil.fs.writeFile(res.path(), res.data, 'base64');
          RNBlobUtil.ios.previewDocument(res.path());
        }
        if (Platform.OS === 'android') {
          console.log('File downloaded');
        }
      })
      .catch(e => {
        setinprocess(false);

        Alert.alert(
          'Download Faliure',
          'Download again',
          [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        );
        console.log('Download error==>', e);
      });
  };


  const [searchdata, setsearchdata] = useState([])
  const getSearchData = async () => {
    console.log(item.action,);
    if (item && item.action) {
      setsearchdata([])
      console.log(item.action);
      const response = await axios.get(item.action);


      // const response = await axios.get('https://righten.in/api/services/view_all_data?service_id=2&row_id=MTYzNA==');
      // console.log(response.data.data);
      setsearchdata(response.data.data)
    }
    // console.log(item.action);

  }

  // useEffect(() => {
  //   getSearchData();
  //   console.log("new call");
  // }, [navifation])


  useEffect(() => {
    if (!isFocused) {
      setsearchdata([])
      console.log('Screen is unfocused, resetting state');
      // setData('');
    } else {
      console.log('in focus');
      getSearchData();
    }
  }, [isFocused]);
  return (
    <ScrollView style={{ backgroundColor: "white" }}>
      {inprocess ?

        <View
          style={{
            zIndex: 1,
            position: 'absolute',
            height:'100%',
            width:'100%',
            // backgroundColor: 'red'
          }}>
          <View style={{
            height: 100,
            width: 250,
            backgroundColor: '#adadad',
            alignSelf:'center',
            top:'50%'

          }}>
            <Text style={{
              color: 'white',fontSize:24,textAlign:'center'
            }}>FIle Downloading in progress</Text>

          </View>


        </View>


        : null}
      <View style={{ backgroundColor: 'white', paddingHorizontal: 14 }} >


        <View style={{ alignItems: 'center', borderBottomWidth: 1 }}>
          <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold' }}>Retailer Details</Text>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 5 }}>
          <View style={{ width: 100 }}>
            <Text style={{ fontSize: 16, color: 'black' }}>Name </Text>
          </View>
          <View style={{ flex: 1, }}>
            <Text style={{ fontSize: 16, color: 'black' }}>:{'  '}{searchdata.user_name}</Text>
          </View>
        </View>


        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 5 }}>
          <View style={{ width: 100 }}>
            <Text style={{ fontSize: 16, color: 'black' }}>User </Text>
          </View>
          <View style={{ flex: 1, }}>
            <Text style={{ fontSize: 16, color: 'black' }}>:{'  '}{searchdata.user_id}</Text>
          </View>
        </View>



        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 5 }}>
          <View style={{ width: 100 }}>
            <Text style={{ fontSize: 16, color: 'black' }}>Mobile </Text>
          </View>
          <View style={{ flex: 1, }}>
            <Text style={{ fontSize: 16, color: 'black' }}>:{'  '}{searchdata.user_mobile}</Text>
          </View>
        </View>


        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 5 }}>
          <View style={{ width: 100 }}>
            <Text style={{ fontSize: 16, color: 'black' }}>Village </Text>
          </View>
          <View style={{ flex: 1, }}>
            <Text style={{ fontSize: 16, color: 'black' }}>:{'  '}{searchdata.vill}</Text>
          </View>
        </View>



        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 5 }}>
          <View style={{ width: 100 }}>
            <Text style={{ fontSize: 16, color: 'black' }}>Block </Text>
          </View>
          <View style={{ flex: 1, }}>
            <Text style={{ fontSize: 16, color: 'black' }}>:{'  '}{searchdata.block}</Text>
          </View>
        </View>


        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 5 }}>
          <View style={{ width: 100 }}>
            <Text style={{ fontSize: 16, color: 'black' }}>District </Text>
          </View>
          <View style={{ flex: 1, }}>
            <Text style={{ fontSize: 16, color: 'black' }}>:{'  '}{searchdata.city}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 5 }}>
          <View style={{ width: 100 }}>
            <Text style={{ fontSize: 16, color: 'black' }}>State </Text>
          </View>
          <View style={{ flex: 1, }}>
            <Text style={{ fontSize: 16, color: 'black' }}>:{'  '}{searchdata.state}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 5 }}>
          <View style={{ width: 100 }}>
            <Text style={{ fontSize: 16, color: 'black' }}>Pin </Text>
          </View>
          <View style={{ flex: 1, }}>
            <Text style={{ fontSize: 16, color: 'black' }}>:{'  '}{searchdata.pin}</Text>
          </View>
        </View>





        <View style={{ alignItems: 'center', borderBottomWidth: 1 }}>
          <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold' }}>Customer Details</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 5 }}>
          <View style={{ width: 100 }}>
            <Text style={{ fontSize: 16, color: 'black' }}>Name </Text>
          </View>
          <View style={{ flex: 1, }}>
            <Text style={{ fontSize: 16, color: 'black' }}>:{'  '}{searchdata.name}</Text>
          </View>
        </View>






        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 5 }}>
          <View style={{ width: 100 }}>
            <Text style={{ fontSize: 16, color: 'black' }}>Mobile </Text>
          </View>
          <View style={{ flex: 1, }}>
            <Text style={{ fontSize: 16, color: 'black' }}>:{'  '}{searchdata.mobile}</Text>
          </View>
        </View>


        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 5 }}>
          <View style={{ width: 100 }}>
            <Text style={{ fontSize: 16, color: 'black' }}>TXN </Text>
          </View>
          <View style={{ flex: 1, }}>
            <Text style={{ fontSize: 16, color: 'black' }}>:{'  '}{searchdata.txn_id}</Text>
          </View>
        </View>



        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 5 }}>
          <View style={{ width: 100 }}>
            <Text style={{ fontSize: 16, color: 'black' }}>UTR </Text>
          </View>
          <View style={{ flex: 1, }}>
            <Text style={{ fontSize: 16, color: 'black' }}>:{'  '}{searchdata.utr_no}</Text>
          </View>
        </View>


        <View style={{ alignItems: 'center', borderBottomWidth: 1 }}>
          <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold' }}>Documents</Text>
        </View>

        {/* {searchdata.retail_img.length()} */}
        <View>
          {searchdata?.retail_img ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
              {Object.values(searchdata.retail_img).map((item, index) => (
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
                      console.log(searchdata.retail_img_path + item.file_path);
                      downloadFile(searchdata.retail_img_path + item.file_path)
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
        {searchdata.coupon_no ?
          <View>


            <Text style={{ fontSize: 16, color: 'black', fontWeight: 'bold', textAlign: 'center', padding: 15 }}>Coupon No : {' '}
              <Text style={{ fontSize: 16, color: 'black', fontWeight: 'bold', backgroundColor: 'yellow' }}>{searchdata.coupon_no}</Text>

            </Text>

          </View>
          : null}



        <View style={{ alignItems: 'center', borderBottomWidth: 1 }}>
          <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold' }}>Admin Documents</Text>
        </View>

        <View>
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
  )
}

export default ShowDetails

const styles = StyleSheet.create({})

















































































































































































































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
      Alert.alert('Download Successful', 'File has been downloaded successfully.', [{ text: 'OK' }]);
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
              <Text style={styles.detailValue}>{value ?? 'N/A'}</Text>
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
              <Text style={styles.detailValue}>{value ?? 'N/A'}</Text>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    paddingVertical: 10,
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
    marginVertical: 10,
    justifyContent: 'center',
  },
  documentHeader: {
    borderBottomWidth: 1,
    width: 376,
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    textAlign:'center'
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
