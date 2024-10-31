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
    <ScrollView style={cartStyles.container}>
      {inprocess && (
        <View style={cartStyles.overlay}>
          <View style={cartStyles.downloadBox}>
            <Text style={cartStyles.downloadText}>File Downloading in progress</Text>
          </View>
        </View>
      )}

      <View style={cartStyles.innerContainer}>
        {/* Retailer Details */}
        <View style={cartStyles.sectionHeader}>
          <Text style={cartStyles.headerText}>Retailer Details</Text>
        </View>

        {['Name', 'User', 'Mobile', 'Village', 'Block', 'District', 'State', 'Pin'].map((field, index) => (
          <View key={index} style={cartStyles.infoRow}>
            <View style={cartStyles.labelContainer}>
              <Text style={cartStyles.labelText}>{field}</Text>
            </View>
            <View style={cartStyles.valueContainer}>
              <Text style={cartStyles.valueText}>
                :{'  '}{searchdata[`user_${field.toLowerCase()}`]}
              </Text>
            </View>
          </View>
        ))}

        {/* Customer Details */}
        <View style={cartStyles.sectionHeader}>
          <Text style={cartStyles.headerText}>Customer Details</Text>
        </View>

        {['Name', 'Mobile', 'TXN', 'UTR'].map((field, index) => (
          <View key={index} style={cartStyles.infoRow}>
            <View style={cartStyles.labelContainer}>
              <Text style={cartStyles.labelText}>{field}</Text>
            </View>
            <View style={cartStyles.valueContainer}>
              <Text style={cartStyles.valueText}>
                :{'  '}{searchdata[field.toLowerCase()]}
              </Text>
            </View>
          </View>
        ))}

        {/* Documents */}
        <View style={cartStyles.sectionHeader}>
          <Text style={cartStyles.headerText}>Documents</Text>
        </View>

        <View style={cartStyles.imageContainer}>
          {searchdata?.retail_img && Object.values(searchdata.retail_img).map((item, index) => (
            <View key={index} style={cartStyles.imageWrapper}>
              {item.file_path && (
                <TouchableOpacity onPress={() => downloadFile(searchdata.retail_img_path + item.file_path)}>
                  <Text style={cartStyles.downloadButton}>Download</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {searchdata.coupon_no && (
          <View style={cartStyles.couponContainer}>
            <Text style={cartStyles.couponText}>
              Coupon No : <Text style={cartStyles.couponHighlight}>{searchdata.coupon_no}</Text>
            </Text>
          </View>
        )}

        {/* Admin Documents */}
        <View style={cartStyles.sectionHeader}>
          <Text style={cartStyles.headerText}>Admin Documents</Text>
        </View>

        <View style={cartStyles.imageContainer}>
          {searchdata?.admin_img && Object.values(searchdata.admin_img).map((item, index) => (
            <View key={index} style={cartStyles.imageWrapper}>
              {item.file_path && (
                <TouchableOpacity onPress={() => downloadFile(searchdata.admin_img_path + item.file_path)}>
                  <Text style={cartStyles.downloadButton}>Download</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default ShowDetails

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  overlay: {
    zIndex: 1,
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadBox: {
    height: 100,
    width: 250,
    backgroundColor: '#adadad',
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadText: {
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
  },
  innerContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 14,
  },
  sectionHeader: {
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingBottom: 5,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 5,
  },
  labelContainer: {
    width: 100,
  },
  labelText: {
    fontSize: 16,
    color: 'black',
  },
  valueContainer: {
    flex: 1,
  },
  valueText: {
    fontSize: 16,
    color: 'black',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  imageWrapper: {
    width: '30%',
    marginBottom: 10,
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
    marginTop: 15,
  },
  couponContainer: {
    alignItems: 'center',
    padding: 15,
  },
  couponText: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
  couponHighlight: {
    backgroundColor: 'yellow',
  },
});
