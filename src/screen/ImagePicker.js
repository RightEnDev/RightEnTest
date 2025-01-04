import React, { useState, useEffect } from 'react';
import {
  Button,
  PermissionsAndroid,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList, Dimensions,
  BackHandler,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';

import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { SvgXml } from 'react-native-svg';
import { ImageCompressor } from 'react-native-compressor';
import AsyncStorage from '@react-native-async-storage/async-storage';


const screenWidth = Dimensions.get('window').width;
import axios from 'axios';
// console.log(screenWidth);
const ImagePicker = ({ route, navigation }) => {
  const { txn_id, form_id,service_data } = route.params;
  // console.log(txn_id);
  // console.log(txn_id);
  const [loading, setLoading] = useState(false);
  const [photoUris, setPhotoUris] = useState([]);

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

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const handleChooseImage = async (option) => {
    // const compressImageUnder2MB = async (uri) => {
    //   console.log("compressImageUnder2MB called");
    //   let quality = 1.0;
    //   let compressedImageUri;
    //   let fileSize;

    //   do {
    //     compressedImageUri = await ImageCompressor.compress(uri, {
    //       compressionMethod: 'auto', // Use auto compression
    //       quality: quality * 80, // quality should be between 0-100
    //     });

    //     // Get the file size of the compressed image
    //     const stats = await RNFetchBlob.fs.stat(compressedImageUri);
    //     fileSize = stats.size;

    //     quality -= 0.1; // Reduce quality by 10% on each iteration if needed
    //   } while (fileSize > 2 * 1024 * 1024 && quality > 0);

    //   return compressedImageUri;
    // };

    if (option === 'camera') {
      const hasPermission = await requestCameraPermission();
      if (hasPermission) {
        launchCamera({
          mediaType: 'photo', 
          maxWidth: 1920,
          maxHeight: 1080,
          quality: 1, includeBase64: true
        }, async (response) => {
          if (response.didCancel) {
            Alert.alert('User cancelled photo picker');
          } else if (response.errorCode) {
            Alert.alert('ImagePicker Error: ', response.errorMessage);
          } else {
            const imageSize = response.assets[0].fileSize; // Get the original image size in bytes
            // console.log(`Original Image Size: ${(imageSize / (1024 * 1024)).toFixed(2)} MB`); // Log original size in MB

            if (imageSize > 2 * 1024 * 1024) { // 2 MB in bytes
              try {
                // const compressedImageUri = await compressImageUnder2MB(response.assets[0].uri);

                // Image.getSize(compressedImageUri, (width, height) => {
                //   console.log(`Compressed Image Size: Width = ${width}, Height = ${height}`);
                // });

                setPhotoUris((prevUris) => [...prevUris, response.assets[0].uri]);
              } catch (error) {
                Alert.alert('Compression Error', error.message);
              }
            } else {
              setPhotoUris((prevUris) => [...prevUris, response.assets[0].uri]);
            }
          }
        });
      } else {
        Alert.alert('Camera permission denied');
      }
    } else if (option === 'gallery') {
      launchImageLibrary({ mediaType: 'photo', includeBase64: true }, async (response) => {
        if (response.didCancel) {
          Alert.alert('User cancelled photo picker');
        } else if (response.errorCode) {
          Alert.alert('ImagePicker Error: ', response.errorMessage);
        } else {
          const imageSize = response.assets[0].fileSize; // Get the original image size in bytes
          // console.log(`Original Image Size: ${(imageSize / (1024 * 1024)).toFixed(2)} MB`); // Log original size in MB

          if (imageSize > 2 * 1024 * 1024) { // 2 MB in bytes
            try {
              // const compressedImageUri = await compressImageUnder2MB(response.assets[0].uri);

              // Image.getSize(compressedImageUri, (width, height) => {
              //   console.log(`Compressed Image Size: Width = ${width}, Height = ${height}`);
              // });

              setPhotoUris((prevUris) => [...prevUris, response.assets[0].uri]);
            } catch (error) {
              Alert.alert('Compression Error', error.message);
            }
          } else {
            setPhotoUris((prevUris) => [...prevUris, response.assets[0].uri]);
          }
        }
      });
    }
  };
  const showSuccessToast = () => {
    Toast.show({
      type: 'success',
      text1: `successfull ✅  `,
      text2: `Image upload successfully !`,
    });
  };
  const showErrorToast = (message) => {
    Toast.show({
      type: 'error',
      text1: 'Oops! 😔',
      text2: `${message}`,
    });
  };

  const uploadPhotos = async () => {
    setLoading(true); // Start loading indicator

    const attemptUpload = async () => { // Removed retry parameter
      try {
        const us_id = await AsyncStorage.getItem('us_id');

        const formData = new FormData();
        formData.append('user_id', us_id);
        formData.append('form_id', form_id);
        formData.append('txn_id', txn_id);

        

        for (let i = 0; i < photoUris.length; i++) {
          const uri = photoUris[i];
          if (uri) {
            const fileExtension = uri.split('.').pop().toLowerCase();
            if (fileExtension !== 'jpeg' && fileExtension !== 'jpg') {
              showErrorToast('Unsupported File Type', 'Only JPG and JPEG images are supported.');
              setLoading(false); // Stop loading indicator
              return;
            }

            const mimeType = 'image/jpeg';
            formData.append('files[]', {
              uri: uri.startsWith('file://') ? uri : `file://${uri}`,
              type: mimeType,
              name: `photo_${i}.${fileExtension}`,
            });
          }
        }

        const response = await axios.post(service_data.fileUploadURl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 60000 * 2, // Increased timeout to 60 seconds
        });

        if (response.status === 200) {
          // console.log('Photos uploaded successfully');
          // console.log(response.data);
          showSuccessToast();

          // Navigate to 'Payment' screen after 1 second
          setTimeout(() => {
            setPhotoUris([]);
            navigation.navigate('Paymennt', { "txn_id": txn_id , "user_id":us_id, "service_data":service_data});
          }, 1000);

        } else {
          console.error('Failed to upload photos', response.status, response.statusText);
          showErrorToast('Failed to upload photos. Please try again later.');
        }
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false); // Stop loading indicator regardless of success or failure
      }
    };

    const handleError = (error) => {
      if (error.response) {
        console.error('Server Error:', error.response.status, error.response.data);
        showErrorToast('Server error.');
      } else if (error.request) {
        console.error('No Response Received:', error.request);
        showErrorToast('Network error.');
      } else {
        console.error('Error uploading photos:', error.message);
        showErrorToast('Upload Error', 'An unexpected error occurred.');
      }
    };

    await attemptUpload(); // Call attemptUpload without retry logic
  };




  const renderItem = ({ item }) => (
    <Image source={{ uri: item }} style={styles.image} />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.item}>Upload Documents<Text style={{ color: 'red' }}>*</Text></Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" /> // Show loading indicator
      ) : null}
      <Toast />
      <View style={styles.buttonContainer}>

        {/* <TouchableOpacity
          style={styles.button}
          onPress={() => handleChooseImage('gallery')}
        >
          <View style={styles.buttonInner}>
            <SvgXml
              xml={`<svg viewBox="0 0 1024 1024" width="60" height="60" xmlns="http://www.w3.org/2000/svg" fill="#000000">
                <path d="M874.666667 896H277.333333c-46.933333 0-85.333333-38.4-85.333333-85.333333V384c0-46.933333 38.4-85.333333 85.333333-85.333333h597.333334c46.933333 0 85.333333 38.4 85.333333 85.333333v426.666667c0 46.933333-38.4 85.333333-85.333333 85.333333z" fill="#E65100"></path>
                <path d="M746.666667 768H149.333333c-46.933333 0-85.333333-38.4-85.333333-85.333333V256c0-46.933333 38.4-85.333333 85.333333-85.333333h597.333334c46.933333 0 85.333333 38.4 85.333333 85.333333v426.666667c0 46.933333-38.4 85.333333-85.333333 85.333333z" fill="#F57C00"></path>
                <path d="M640 341.333333m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="#FFF9C4"></path>
                <path d="M362.666667 381.866667L170.666667 661.333333h384z" fill="#942A09"></path>
                <path d="M597.333333 501.333333L469.333333 661.333333h256z" fill="#BF360C"></path>
              </svg>`}
            />
            <Text style={styles.buttonText}>Gallery</Text>
          </View>
        </TouchableOpacity> */}

        <TouchableOpacity
          style={styles.button}
          onPress={() => handleChooseImage('camera')}
        >
          <View style={styles.buttonInner}>
            <SvgXml
              xml={`<svg width="60px" height="60px" viewBox="0 -2 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>camera</title> <desc>Created with Sketch Beta.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"> <g id="Icon-Set-Filled" sketch:type="MSLayerGroup" transform="translate(-258.000000, -467.000000)" fill="#000000"> <path d="M286,471 L283,471 L282,469 C281.411,467.837 281.104,467 280,467 L268,467 C266.896,467 266.53,467.954 266,469 L265,471 L262,471 C259.791,471 258,472.791 258,475 L258,491 C258,493.209 259.791,495 262,495 L286,495 C288.209,495 290,493.209 290,491 L290,475 C290,472.791 288.209,471 286,471 Z M274,491 C269.582,491 266,487.418 266,483 C266,478.582 269.582,475 274,475 C278.418,475 282,478.582 282,483 C282,487.418 278.418,491 274,491 Z M274,477 C270.687,477 268,479.687 268,483 C268,486.313 270.687,489 274,489 C277.313,489 280,486.313 280,483 C280,479.687 277.313,477 274,477 L274,477 Z" id="camera" sketch:type="MSShapeGroup"> </path> </g> </g> </g></svg>`}
            />
            <Text style={styles.buttonText}>Camera</Text>
          </View>
        </TouchableOpacity>
      </View>

      <FlatList
        data={photoUris}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}
        contentContainerStyle={styles.scrollContainer}
      />

      <TouchableOpacity onPress={uploadPhotos}>
        <View style={{
          backgroundColor: '#FFCB0A', margin: 10, marginTop: 30, alignItems: 'center', justifyContent: 'center', height: 70, width: '70%', alignSelf: 'center'
          , borderRadius: 15
        }}>
          <Text style={{ height: 50, textAlign: 'center', fontSize: 30, fontWeight: 'bold', color: 'black' }}>submit / pay now</Text>
        </View>

      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 8,
  },
  scrollContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  item: {
    margin: 24,
    fontSize: 34,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#009743'
  },
  image: {
    width: screenWidth / 3,
    marginRight: '2%',
    height: undefined,
    aspectRatio: 1,
    marginTop: 20,
    alignSelf: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 1,
  },
  button: {
    marginHorizontal: 10,
    alignItems: 'center',
  },
  buttonInner: {
    backgroundColor: '#FFCB0A',
    alignItems: 'center',
    width: '100%',
    padding: 10,
    borderRadius: 15,
  },
  buttonText: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
    width: 150,
    textAlign: 'center',
  },
});

export default ImagePicker;