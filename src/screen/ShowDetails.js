import { StyleSheet, Text, View, ScrollView, Image, PermissionsAndroid, ImageBackground, TouchableOpacity, Alert, RefreshControl, ActivityIndicator, Platform, FlatList, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native';
import RNBlobUtil from 'react-native-blob-util';
import RNFS from 'react-native-fs';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { SvgXml } from 'react-native-svg';
import { ImageCompressor } from 'react-native-compressor';
import Toast from 'react-native-toast-message';
const screenWidth = Dimensions.get('window').width;                                                                                                                                                    
import AsyncStorage from '@react-native-async-storage/async-storage';

const ShowDetails = ({ route, navigation }) => {
  const { item } = route.params;
  // console.log('Data',  item);
  const isFocused = useIsFocused();
  const [inprocess, setInprocess] = useState(false);
  const [searchdata, setSearchData] = useState({});
  const downloadIcon = require('../../assets/images/Down_load.png');
  const [loading, setLoading] = useState(false);
  const [photoUris, setPhotoUris] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  //const [capturedImage, setCapturedImage] = useState(null);

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


  const handleRefresh = async () => {
    setRefreshing(true);
    await getSearchData();
    setRefreshing(false);
  };

// Re upload url store

useEffect(() => {
  if (searchdata?.form_service_code === "REPAN") {
      searchdata.fileUploadURl = "https://righten.in/api/services/pancard/upload";
  }

  if (searchdata?.form_service_code === "REIN") {
    searchdata.fileUploadURl = "https://righten.in/api/services/insurance/upload";
  }  

  if (searchdata?.form_service_code === "REITR") {
    searchdata.fileUploadURl = "https://righten.in/api/services/income_tax/upload";
  }  

  if (searchdata?.form_service_code === "REGST") {
    searchdata.fileUploadURl = "https://righten.in/api/services/gst/upload";
  } 

  if (searchdata?.form_service_code === "REFSSAI") {
    searchdata.fileUploadURl = "https://righten.in/api/services/fssai/upload";
  } 

  if (searchdata?.form_service_code === "RETL") {
    searchdata.fileUploadURl = "https://righten.in/api/services/tl/upload";
  } 

  if (searchdata?.form_service_code === "REMSME") {
    searchdata.fileUploadURl = "https://righten.in/api/services/MSME/upload";
  } 

  if (searchdata?.form_service_code === "RETM") {
    searchdata.fileUploadURl = "https://righten.in/api/services/trademark/upload";
  } 

  if (searchdata?.form_service_code === "REPTAX") {
    searchdata.fileUploadURl = "https://righten.in/api/services/ptax/upload";
  }
  
  if (searchdata?.form_service_code === "REPF") {
    searchdata.fileUploadURl = "https://righten.in/api/services/pf/upload";
  } 

  if (searchdata?.form_service_code === "REPANS") {
    searchdata.fileUploadURl = "https://righten.in/api/services/surrander/upload";
  } 

  if (searchdata?.form_service_code === "REPAS") {
    searchdata.fileUploadURl = "https://righten.in/api/services/passport/upload";
  }
  
  if (searchdata?.form_service_code === "REAPLINK") {
    searchdata.fileUploadURl = "https://righten.in/api/services/link/upload";
  } 

  if (searchdata?.form_service_code === "REPLC") {
    searchdata.fileUploadURl = "https://righten.in/api/services/pvt_ltd/upload";
  } 

  if (searchdata?.form_service_code === "REDL") {
    searchdata.fileUploadURl = "https://righten.in/api/services/driving_license/upload";
  } 

  if (searchdata?.form_service_code === "REPCF") {
    searchdata.fileUploadURl = "https://righten.in/api/services/pan_find/upload";
  } 


}, [searchdata]); // API response update hole run hobe

const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString('en-GB', { 
    day: '2-digit', month: 'short', year: 'numeric' 
  }); // Output: 25 Feb, 2025
};

const formatTime = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleTimeString('en-US', { 
    hour: '2-digit', minute: '2-digit', hour12: true 
  }); // Output: 07:10 PM
};

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

  const allFiles = [];

  if (Array.isArray(searchdata?.admin_img) && searchdata.admin_img.length > 0) {
    searchdata.admin_img.forEach(item => {
      allFiles.push({
        name: item.file_name || "Document",
        path: searchdata.admin_img_path + item.file_path
      });
    });
  }
  
  if (searchdata?.slip) {
    allFiles.push({ name: "Slip", path: searchdata.slip });
  }
  
  if (searchdata?.pdf) {
    allFiles.push({ name: "PDF", path: searchdata.pdf });
  }

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
      text1: `Successfull ✅  `,
      text2: `Image Re-upload successfully !`,
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
  
    if (!searchdata?.fileUploadURl) {
      console.error("Error: fileUploadURl is undefined!");
      showErrorToast("Upload URL missing!");
      setLoading(false);
      return;
    }
  
    try {
      const us_id = await AsyncStorage.getItem('us_id');
  
      const formData = new FormData();
      formData.append('user_id', us_id);
      formData.append('form_id', searchdata.id);
      formData.append('txn_id', searchdata.txn_id);
  
      for (let i = 0; i < photoUris.length; i++) {
        const uri = photoUris[i];
        if (uri) {
          const fileExtension = uri.split('.').pop().toLowerCase();
          if (!['jpeg', 'jpg'].includes(fileExtension)) {
            showErrorToast('Only JPG and JPEG images are supported.');
            setLoading(false);
            return;
          }
  
          formData.append('files[]', {
            uri: uri.startsWith('file://') ? uri : `file://${uri}`,
            type: 'image/jpeg',
            name: `photo_${i}.${fileExtension}`,
          });
        }
      }
  
      const response = await axios.post(searchdata.fileUploadURl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000,
      });
  
      if (response.status === 200) {
        showSuccessToast();
        setPhotoUris([]); // ✅ Upload er por image clear
      } else {
        showErrorToast('Failed to upload. Try again.');
      }
    } catch (error) {
      showErrorToast('Upload failed due to a network/server issue.');
    } finally {
      setLoading(false); // ✅ Loading state stop
    }
  };
  

  const renderItem = ({ item }) => {
    return (
        <Image
          source={{ uri: item }}
          style={styles.image}
          resizeMode="cover"
        />
    );
  };

  {loading && <ActivityIndicator size="large" color="#00ff00" />}


  return (
    
    <ScrollView style={{ backgroundColor: "white" }}         
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
    > 
      
      {inprocess && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Downloading in progress...</Text>
        </View>
      )}
  
      <View style={styles.container}>
        <View style={styles.card}>

          {/* Watermark Background */}
          <ImageBackground
            source={{ uri: `https://righten.in/public/admin/assets/img/service_icon/${item?.service_icon}` }}
            style={styles.watermarkBackground}
            resizeMode="contain"
            imageStyle={{ opacity: 0.2 }} // Adjust transparency
          >
          <View style={styles.overlayContent}>
          <View style={styles.sectionHeader}>
            <Text style={styles.headerText}>Service Details</Text>
          </View>
  
          {/* Centered Service Image */}
          {/* <View style={styles.imageContainer}>
            {item?.service_icon ? (
              <Image source={{ uri: `https://righten.in/public/admin/assets/img/service_icon/${item.service_icon}` }} style={styles.serviceImage} />
            ) : (
              <Text style={styles.noImageText}>No Image Available</Text>
            )}
          </View> */}


  
              {Object.entries({
                'Service': item?.service_name ?? "N/A",
                'Type': item?.sub_service ?? "N/A",
                'Name': item?.customer_name ?? "N/A",
                'Mobile': searchdata?.mobile ?? "N/A",
                'Txn Id': item?.txn_id ?? "N/A",
                'Amount': item?.amount ?? "N/A",
                'UTR No': item?.utr ?? "N/A",
                'Payment Status': item?.status ?? "N/A",
                'Service Status': item?.service_status ?? "N/A",
                //'COUPON No': searchdata?.coupon_no ?? "N/A",
                ...(searchdata?.form_service_code === "REPAN" && { 'COUPON No': searchdata?.coupon_no ?? "N/A" }),
                'Apply Date': "",
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
                      <Text style={styles.statusText}>{value}</Text>
                    </View>
                  ) : (
                    <Text style={styles.detailValue}>{value}</Text>
                  )}

                  {key === 'Apply Date' && (

                    <View style={styles.dateTimeContainer}>
                      {/* Date Section */}
                      <View style={styles.dateItem}>
                      {/* <SvgXml 
                          xml={`<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="30" height="30" style="shape-rendering:geometricPrecision;text-rendering:geometricPrecision;image-rendering:optimizeQuality;fill-rule:evenodd;clip-rule:evenodd">
                          <rect x="3" y="4" width="18" height="16" rx="2" fill="#FFD180" stroke="#C62828" stroke-width="2"/>
                          <line x1="3" y1="8" x2="21" y2="8" stroke="#C62828" stroke-width="2"/>
                          <rect x="6" y="11" width="3" height="3" fill="#424242"/>
                          <rect x="10" y="11" width="3" height="3" fill="#616161"/>
                          <rect x="14" y="11" width="3" height="3" fill="#424242"/>
                          <rect x="6" y="15" width="3" height="3" fill="#616161"/>
                          <rect x="10" y="15" width="3" height="3" fill="#424242"/>
                          <rect x="14" y="15" width="3" height="3" fill="#616161"/>
                          <line x1="8" y1="2" x2="8" y2="6" stroke="#C62828" stroke-width="2"/>
                          <line x1="16" y1="2" x2="16" y2="6" stroke="#C62828" stroke-width="2"/>
                          </svg>`}
                        /> */}

                        <Text style={styles.dateText}>{formatDate(item?.date)} </Text>
                      </View>

                      {/* Time Section */}
                      <View style={styles.dateItem}>
                        <Text style={styles.timeText}> {formatTime(item?.date)}</Text>
                      </View>
                    </View>

                  )}

                </View>
              ))}

              </View>

          </ImageBackground>
        </View>
  
        {/* Retail Documents */}
        {searchdata?.retail_img && Object.values(searchdata.retail_img).length > 0 && (
          <View style={styles.card}>
            <View style={styles.headerContainer}>
              <Text style={styles.documentHeader}>Documents</Text>
              <View style={styles.imageContainer}>
                {Object.values(searchdata.retail_img).length > 0 ? (
                  Object.values(searchdata.retail_img).map((item, index) =>
                    item?.file_path ? (
                      <View key={index} style={styles.imageWrapper}>
                        <Image
                          source={{ uri: searchdata.retail_img_path + item.file_path }}
                          style={styles.image}
                          resizeMode="contain"
                        />
                        <TouchableOpacity onPress={() => downloadFile(searchdata.retail_img_path + item.file_path)}>
                          <Text style={styles.downloadButton}>Download</Text>
                        </TouchableOpacity>
                      </View>
                    ) : null
                  )
                ) : (
                  <View style={styles.alertBox}>
                    {/* <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="red"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                  >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12" y2="16" />
                  </svg> */}
                    <Text style={styles.alertTitle}>No Documents Found</Text>
                    <Text style={styles.alertMessage}>Please Re-Upload your documents to proceed.</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}
  
        {/* Admin Documents */}
        {allFiles.length > 0 && (
          <View style={styles.adminCard}>
            <View style={styles.headerContainer}>
              <Text style={styles.documentHeader}>Admin Documents</Text>
            </View>

            <View style={styles.fileContainer}>
              {allFiles.map((item, index) => (
                <View key={index} style={styles.fileBox}>
                  <Image source={downloadIcon} style={styles.downloadIcon} />
                  <Text style={styles.fileName} numberOfLines={1}>
                    {item?.name ?? "Unknown File"}
                  </Text>
                  <TouchableOpacity 
                    onPress={() => downloadFile(item?.path ?? "")}
                    style={styles.downloadButton}
                  >
                    <Text style={styles.buttonText}>Download</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.documentHeader}>Re Upload Document</Text>

          {/* ✅ Camera Button */}
          <TouchableOpacity style={styles.cameraButton} onPress={() => handleChooseImage('camera')}>
            <View style={styles.cameraContent}>
              <View style={styles.cameraIconContainer}>
                <SvgXml
                  xml={`<svg width="30px" height="30px" viewBox="0 -2 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" fill="#ffffff"><g id="SVGRepo_iconCarrier"> <title>camera</title> <g id="Icon-Set-Filled" transform="translate(-258.000000, -467.000000)" fill="#ffffff"> <path d="M286,471 L283,471 L282,469 C281.411,467.837 281.104,467 280,467 L268,467 C266.896,467 266.53,467.954 266,469 L265,471 L262,471 C259.791,471 258,472.791 258,475 L258,491 C258,493.209 259.791,495 262,495 L286,495 C288.209,495 290,493.209 290,491 L290,475 C290,472.791 288.209,471 286,471 Z M274,491 C269.582,491 266,487.418 266,483 C266,478.582 269.582,475 274,475 C278.418,475 282,478.582 282,483 C282,487.418 278.418,491 274,491 Z M274,477 C270.687,477 268,479.687 268,483 C268,486.313 270.687,489 274,489 C277.313,489 280,486.313 280,483 C280,479.687 277.313,477 274,477 L274,477 Z" id="camera"> </path> </g> </g></svg>`}
                />
              </View>
              <Text style={styles.buttonText}>Take a Photo</Text>
            </View>
          </TouchableOpacity>

          {photoUris.length > 0 ? (
            <FlatList
              data={photoUris}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              numColumns={3}
              contentContainerStyle={styles.scrollContainer}
            />
          ) : (
            <Text style={{ textAlign: "center", margin: 5 }}>No images selected</Text>
          )}

          {/* ✅ Reupload Button */}
          <TouchableOpacity
            style={[styles.reuploadButton, photoUris.length === 0 && styles.disabledButton]}
            onPress={uploadPhotos}
            disabled={photoUris.length === 0}
          >
            <Text style={styles.reuploadText}>Reupload</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
  );
  
};

const styles = StyleSheet.create({
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
  watermarkBackground: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    padding: 20,
  },
  overlayContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.60)', // Slight overlay for readability
    padding: 10,
    borderRadius: 10,
    width: '100%',
  },
  DownloadIcon: {
    width: 20,
    height: 20,
    marginLeft: 4,  // Space between icon and text
  },
  adminCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    elevation: 4,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  headerContainer: {
    marginBottom: 12,
  },
  documentHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#009743',
  },
  fileContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',  // ✅ **Auto-aligns 2 per row**
  },
  fileBox: {
    width: '48%',  // ✅ **Ensures 2 items per row**
    marginBottom: 12,
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  downloadIcon: {
    width: 30,
    height: 30,
    marginBottom: 5,
  },
  fileName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },

  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  downloadButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  downloadPdfButton: {
    backgroundColor: '#FF5733',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
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
    paddingVertical: 0,
  },
 
  serviceImage: {
    width: 80, // Set the image width
    height: 80, // Set the image height
    marginTop: -30,
    //borderRadius: 50, // Optional: make the image circular
  },
  detailRow: {
    flexDirection: 'row',
    //justifyContent: 'flex-start',
    marginBottom: 5,
  },
  detailLabel: {
    width: '50%',
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

  cameraButton: {
    backgroundColor: "#007bff",  // Professional blue
    borderRadius: 12,            // Smooth rounded corners
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",        // Icon & text same row
    elevation: 5,                // Shadow effect
    marginVertical: 10,
    width: "100%",                  // Fixed width
  },
  cameraContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  cameraIconContainer: {
    backgroundColor: "#0056b3",  // Darker blue shade
    padding: 8,
    borderRadius: 50,            // Circle background for icon
    marginRight: 8,              // Space between icon & text
  },

  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#009743',
  },
  disabledButton: {
    backgroundColor: "#ccc", // Gray color to indicate disabled state
    opacity: 0.6, // Reduce opacity
  },
  reuploadButton: {
    backgroundColor: '#FFCB0A',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 15,
    alignItems: 'center',
  },
  reuploadText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  RupimageContainer: {
    flex: 1,
    //alignItems: "center",
    //justifyContent: "center",
    margin: 10,
  },
  image: {
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#FFCB0A",
    width: screenWidth / 4,
    marginRight: '2%',
    height: undefined,
    aspectRatio: 1,
    //alignSelf: 'center',
    margin: 5,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD', // Light Blue Background
    borderRadius: 5,
    padding: 5,
    //width: '100%',
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5, // Space between icon & text
  },
  icon: {
    width: 20,
    height: 20,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#01579B', // Dark Blue
  },
  timeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#01579B',
  },
  alertBox: {
    backgroundColor: '#fde8e8',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f5c6cb',
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7d0d0d',
    marginTop: 5,
  },
  alertMessage: {
    color: '#7d0d0d',
    marginTop: 5,
    textAlign: 'center',
  },


});

export default ShowDetails;
