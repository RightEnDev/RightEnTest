import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  StyleSheet, Text, View, ScrollView, Image, PermissionsAndroid,Platform, TouchableOpacity,
  Alert, RefreshControl, ActivityIndicator, FlatList, Dimensions, BackHandler
} from 'react-native';
import axios from 'axios';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import RNBlobUtil from 'react-native-blob-util';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageResizer from 'react-native-image-resizer';
import { stat } from 'react-native-fs';
import dayjs from 'dayjs'
import Icon from 'react-native-vector-icons/FontAwesome';



const screenWidth = Dimensions.get('window').width;

const ShowDetails = ({ route, navigation }) => {
  const { item } = route.params;
  const isFocused = useIsFocused();
  const [searchdata, setSearchData] = useState({});
  const [imgData, setImgData] = useState([]);
  const [adminImgData, setAdminImgData] = useState([]);
  const [logData, setLogData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [photoUris, setPhotoUris] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const serviceId = Number(searchdata.service_id);
  const flatListRef = useRef();
  console.log("service code",searchdata?.service_code);
  const formattedDate = dayjs(item.created_at).format('D MMMM YYYY h:mm A')



  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('ServiceHistory');
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  useEffect(() => {
    if (isFocused) getSearchData();
  }, [isFocused]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await getSearchData();
    setRefreshing(false);
  };

  const getSearchData = async () => {
    try {
      const response = await axios.get(item);
      const data = response.data.data?.[0] || {};
      setSearchData(data);
      setImgData(response.data.img_data || []);
      setAdminImgData(response.data.img_data_admin || []);
      setLogData(response.data.log_data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Could not fetch data');
    }
  };

const requestCameraPermission = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
};

  const getUploadUrl = (formServiceCode) => {
    const uploadMap = {
      REPAN: 'https://righten.in/api/services/pancard/upload',
      REIN: 'https://righten.in/api/services/insurance/upload',
      REITR: 'https://righten.in/api/services/income_tax/upload',
      REGST: 'https://righten.in/api/services/gst/upload',
      REFSSAI: 'https://righten.in/api/services/fssai/upload',
      RETL: 'https://righten.in/api/services/tl/upload',
      REMSME: 'https://righten.in/api/services/MSME/upload',
      RETM: 'https://righten.in/api/services/trademark/upload',
      REPTAX: 'https://righten.in/api/services/ptax/upload',
      REPF: 'https://righten.in/api/services/pf/upload',
      REPANS: 'https://righten.in/api/services/surrander/upload',
      REPAS: 'https://righten.in/api/services/passport/upload',
      REAPLINK: 'https://righten.in/api/services/link/upload',
      REPLC: 'https://righten.in/api/services/pvt_ltd/upload',
      REDL: 'https://righten.in/api/services/driving_license/upload',
      REPCF: 'https://righten.in/api/services/pan_find/upload',
    };

  return uploadMap[formServiceCode] || null;
};

const handleChooseImage = async (option) => {
  const picker = option === 'camera' ? launchCamera : launchImageLibrary;

  if (option === 'camera') {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      return showToast('error', 'Camera permission denied.');
    }
  }

  picker({ mediaType: 'photo', quality: 1, includeBase64: false }, async (response) => {
    if (response.didCancel) return;
    if (response.errorCode) return showToast('error', response.errorMessage);

    const asset = response.assets?.[0];
    if (!asset) return;

    let finalUri = asset.uri;
    let finalSize = asset.fileSize;

    if (finalSize > 2 * 1024 * 1024) {
      try {
        const resized = await ImageResizer.createResizedImage(
          asset.uri,
          asset.width * 0.7, // resize to 70% of original width
          asset.height * 0.7, // maintain aspect ratio
          'JPEG',
          75 // compress quality: 0-100
        );
        finalUri = resized.uri;
        const stat = await fetch(resized.uri);
        const blob = await stat.blob();
        finalSize = blob.size;

        if (finalSize > 2 * 1024 * 1024) {
          return showToast('error', 'Even after compression, image exceeds 2MB.');
        }
      } catch (err) {
        console.warn('Resize Error:', err);
        return showToast('error', 'Failed to compress image.');
      }
    }

    setPhotoUris((prev) => [...prev, finalUri]);
  });
};

const removeImage = (index) => {
  const updated = [...photoUris];
  updated.splice(index, 1);
  setPhotoUris(updated);
};

// const uploadPhotos = async () => {
//   const uploadUrl = getUploadUrl(searchdata?.service_code);
//   if (!uploadUrl) return Toast.show({ type: 'error', text1: '❌ Invalid service code' });
//   console.log("service code",searchdata?.service_code);

//   setLoading(true);
//   try {
//     const us_id = await AsyncStorage.getItem('us_id');
//     const formData = new FormData();

//     formData.append('user_id', us_id);
//     formData.append('form_id', searchdata.id);
//     formData.append('txn_id', searchdata.txn_id);

//     for (let i = 0; i < photoUris.length; i++) {
//       const uri = photoUris[i];
//       const ext = uri.split('.').pop().toLowerCase();
//       const mime = ext === 'png' ? 'image/png' : 'image/jpeg';

//       formData.append('files[]', {
//         uri: uri.startsWith('file://') ? uri : `file://${uri}`,
//         type: mime,
//         name: `photo_${i}.${ext}`,
//       });
//     }

//     const res = await axios.post(uploadUrl, formData, {
//       headers: { 'Content-Type': 'multipart/form-data' },
//     });

//     if (res.status === 200) {
//       Toast.show({ type: 'success', text1: '✅ Uploaded' });
//       setPhotoUris([]);
//       getSearchData();
//     } else {
//       throw new Error();
//     }
//   } catch (error) {
//     console.log("Upload error:", error.message);
//     Toast.show({ type: 'error', text1: 'Upload failed' });
//   } finally {
//     setLoading(false);
//   }
// };

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
  
    const uploadUrl = getUploadUrl(searchdata?.service_code);
    if (!uploadUrl) return Toast.show({ type: 'error', text1: '❌ Invalid service code' });
    console.log("service code",searchdata?.service_code);
  
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

      const response = await axios.post(uploadUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      if (response.status === 200) {
        showSuccessToast();
        setPhotoUris([]); // ✅ Upload er por image clear
        getSearchData();
      } else {
        showErrorToast('Failed to upload. Try again.');
      }
    } catch (error) {
      showErrorToast('Upload failed due to a network/server issue.');
    } finally {
      setLoading(false); // ✅ Loading state stop
    }
  };



const formatDate = date => date ? new Date(date).toLocaleDateString('en-GB') : 'N/A';

const handleDownload = async (fileUrl) => {
  try {
    if (Platform.OS === 'android') {
      let hasPermission = false;

      if (Platform.Version >= 33) {
        // Android 13+
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        );
        hasPermission = granted === PermissionsAndroid.RESULTS.GRANTED;
      } else if (Platform.Version >= 23) {
        // Android 6 to 12
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );
        hasPermission = granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        hasPermission = true; // pre-Marshmallow
      }

      if (!hasPermission) {
        Alert.alert('Permission denied', 'Storage permission is required to download files.');
        return;
      }
    }

    const { config, fs } = RNBlobUtil;
    const dir = fs.dirs.DownloadDir;
    const filename = `righten_doc_${Date.now()}.jpg`;

    config({
      fileCache: true,
      appendExt: 'jpg',
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: `${dir}/${filename}`,
        description: 'Downloading image'
      }
    })
      .fetch('GET', fileUrl)
      .then(() => {
        Toast.show({ type: 'success', text1: '✅ Downloaded', text2: filename });
      });
  } catch (err) {
    console.log('Download Error:', err);
    Toast.show({ type: 'error', text1: '❌ Download failed' });
  }
};

const renderKeyValue = (title, value, color) => {
  let dynamicColor = color || '#333';

  if (title === 'Pay Status') {
    if (value?.toLowerCase() === 'paid') dynamicColor = 'green';
    else if (value?.toLowerCase() === 'unpaid') dynamicColor = 'red';
    else if (value?.toLowerCase() === 'due') dynamicColor = 'orange';
  }

  if (title === 'Status' && color) {
    dynamicColor = color;
  }

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
      <Text style={{ fontWeight: '600', color: '#555' }}>{title}</Text>
      <Text style={{ fontWeight: '500', color: dynamicColor }}>{value}</Text>
    </View>
  );
};

const renderItem = ({ item, index }) => (
  <View style={styles.imageContainer}>
    <Image source={{ uri: item }} style={styles.ReUploadimage} resizeMode="cover" />
    <TouchableOpacity
      style={styles.removeButton}
      onPress={() => {
        const updatedUris = [...photoUris];
        updatedUris.splice(index, 1);
        setPhotoUris(updatedUris);
      }}
    >
      <Text style={styles.removeText}>✕</Text>
    </TouchableOpacity>
  </View>
);

const renderImageWithDownload = (data) => (
  <View style={styles.imageGrid}>
    {data.map((item, index) => (
      <View key={index} style={styles.imageWrapper}>
        <Image source={{ uri: item.full_url }} style={styles.image} />
        <TouchableOpacity onPress={() => handleDownload(item.full_url)} style={styles.downloadIcon}>
          <Image source={require('../../assets/images/download.png')} style={styles.icon} />
          <Text style={styles.downloadText}>Download</Text>
        </TouchableOpacity>
      </View>
    ))}
  </View>
);

  return (
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}>
      <Toast />
      {serviceId  == 1 && (
        <View style={styles.card}>
          {searchdata.sub_service_icon && (
            <Image
              source={{ uri: `https://righten.in/public/admin/assets/img/service_icon/${searchdata.sub_service_icon}` }}
              style={{
                width: 60,
                height: 60,
                resizeMode: 'contain',
                alignSelf: 'center',
                marginBottom: 10,
              }}
            />
          )}

          {renderKeyValue(searchdata.service_name, searchdata.sub_service_name)}
          {renderKeyValue('Name', searchdata.name)}
          {renderKeyValue('Vehicle No', searchdata.vehicle_no)}
          {renderKeyValue('Mobile', searchdata.mobile)}
          {renderKeyValue('Amount', `₹${searchdata.charges}`)}
          {renderKeyValue('Txn Id', searchdata.txn_id)}
          {renderKeyValue('Pay Status', searchdata.payment_status)}
          {renderKeyValue('Status', searchdata.status_name, searchdata.status_color_code)}
          {renderKeyValue('Sub Status', searchdata.sub_status_name)}
          {renderKeyValue('Apply Date', formatDate(searchdata.created_at))}
        </View>
      )}

      {serviceId  == 2 && (
        <View style={styles.card}>
            {searchdata.sub_service_icon && (
            <Image
              source={{ uri: `https://righten.in/public/admin/assets/img/service_icon/${searchdata.sub_service_icon}` }}
              style={{
                width: 100,
                height: 60,
                resizeMode: 'contain',
                alignSelf: 'center',
                marginBottom: 10,
              }}
            />
          )}
          {renderKeyValue(searchdata.service_name, searchdata.sub_service_name)}
          {renderKeyValue('Name', searchdata.name)}
          {renderKeyValue('Fathers Name', searchdata.father_name)}
          {renderKeyValue('DOB', formatDate(searchdata.date_of_birth))}
          {renderKeyValue('Mobile', searchdata.mobile)}
          {renderKeyValue('Amount', `₹${searchdata.charges}`)}
          {renderKeyValue('Txn Id', searchdata.txn_id)}
          {renderKeyValue('Pay Status', searchdata.payment_status)}
          {renderKeyValue('Status', searchdata.status_name, searchdata.status_color_code)}
          {renderKeyValue('Sub Status', searchdata.sub_status_name)}
          {renderKeyValue('Apply Date', formatDate(searchdata.created_at))}
          {renderKeyValue('Coupon No',searchdata.coupon_no || 'No coupon')}
          {searchdata.sub_service_id == 4 && (() => {
            try {
              const csf = JSON.parse(searchdata.csf_data || '{}');
              const filtered = Object.entries(csf).filter(([_, val]) => val && val !== '');
              if (filtered.length === 0) return null;

              return (
                <View style={{ marginTop: 10 }}>
                  <Text style={{ fontWeight: '600', textAlign: 'center', marginBottom: 10 }}>
                    Correction Type:
                  </Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    {filtered.map(([_, val], index) => (
                      <View key={index} style={{ width: '50%', marginBottom: 10 }}>
                        <Text style={{ fontSize: 14, color: 'red', textAlign: 'center' }}>{val}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              );
            } catch (e) {
              return <Text style={{ color: 'red' }}>Invalid CSF Data</Text>;
            }
          })()}

        </View>
      )}

      {serviceId  == 29 && (
        <View style={styles.card}>
            {searchdata.sub_service_icon && (
            <Image
              source={{ uri: `https://righten.in/public/admin/assets/img/service_icon/${searchdata.sub_service_icon}` }}
              style={{
                width: 100,
                height: 60,
                resizeMode: 'contain',
                alignSelf: 'center',
                marginBottom: 10,
              }}
            />
          )}
          {renderKeyValue(searchdata.service_name, searchdata.sub_service_name)}
          {renderKeyValue('Name', searchdata.name)}
          {renderKeyValue('Fathers Name', searchdata.father_name)}
          {renderKeyValue('DOB', formatDate(searchdata.date_of_birth))}
          {renderKeyValue('Blood Group', searchdata.blood_group)}
          {renderKeyValue('Mobile', searchdata.mobile)}
          {renderKeyValue('Amount', `₹${searchdata.charges}`)}
          {renderKeyValue('Txn Id', searchdata.txn_id)}
          {renderKeyValue('Pay Status', searchdata.payment_status)}
          {renderKeyValue('Status', searchdata.status_name, searchdata.status_color_code)}
          {renderKeyValue('Sub Status', searchdata.sub_status_name)}
          {renderKeyValue('Apply Date', formatDate(searchdata.created_at))}

        </View>
      )}

      {serviceId  == 30 && (
        <View style={styles.card}>
            {searchdata.sub_service_icon && (
            <Image
              source={{ uri: `https://righten.in/public/admin/assets/img/service_icon/${searchdata.sub_service_icon}` }}
              style={{
                width: 100,
                height: 60,
                resizeMode: 'contain',
                alignSelf: 'center',
                marginBottom: 10,
              }}
            />
          )}
          {renderKeyValue(searchdata.service_name, searchdata.sub_service_name)}
          {renderKeyValue('Aadhaar No', searchdata.uid)}
          {renderKeyValue('Pan No', searchdata.pan_no)}
          {renderKeyValue('Amount', `₹${searchdata.charges}`)}
          {renderKeyValue('Txn Id', searchdata.txn_id)}
          {renderKeyValue('Pay Status', searchdata.payment_status)}
          {renderKeyValue('Status', searchdata.status_name, searchdata.status_color_code)}
          {renderKeyValue('Sub Status', searchdata.sub_status_name)}
          {renderKeyValue('Apply Date', formatDate(searchdata.created_at))}

        </View>
      )}

      {(serviceId  !== 1 && serviceId  !== 2 && serviceId  !== 29 && serviceId  !== 30) && (
        <View style={styles.card}>
            {searchdata.sub_service_icon && (
            <Image
              source={{ uri: `https://righten.in/public/admin/assets/img/service_icon/${searchdata.sub_service_icon}` }}
              style={{
                width: 60,
                height: 60,
                resizeMode: 'contain',
                alignSelf: 'center',
                marginBottom: 10,
              }}
            />
          )}
          {renderKeyValue(searchdata.service_name, searchdata.sub_service_name)}
          {renderKeyValue('Name', searchdata.name)}
          {renderKeyValue('Mobile', searchdata.mobile)}
          {renderKeyValue('Amount', `₹${searchdata.charges}`)}
          {renderKeyValue('Txn Id', searchdata.txn_id)}
          {renderKeyValue('Pay Status', searchdata.payment_status)}
          {renderKeyValue('Status', searchdata.status_name, searchdata.status_color_code)}
          {renderKeyValue('Sub Status', searchdata.sub_status_name)}
          {renderKeyValue('Apply Date', formatDate(searchdata.created_at))}
        </View>
      )}

      {serviceId !== 30 && (
        <>
          {/* Uploaded Documents */}
          <View style={styles.card}>
            <Text style={styles.subtitle}>Uploaded Documents</Text>

            {imgData.length > 0 ? (
              renderImageWithDownload(imgData)
            ) : (
              <View style={styles.alertBox}>
                <Icon name="exclamation-circle" size={16} color="#fff" style={{ marginRight: 6 }} />
                <Text style={styles.alertText}>
                  No Documents Found. Please Re-Upload your documents to proceed.
                </Text>
              </View>
            )}
          </View>

          {/* Admin Documents */}
          <View style={styles.card}>
            <Text style={styles.subtitle}>Admin Documents</Text>

            {adminImgData.length > 0 ? (
              renderImageWithDownload(adminImgData)
            ) : (
              <View style={styles.infoBox}>
                <Icon name="info-circle" size={16} color="#555" style={{ marginRight: 6 }} />
                <Text style={styles.infoText}>Application not yet complete.</Text>
              </View>
            )}
          </View>

        {/* Re upload  */}
        <View style={styles.card}>
          <Text style={styles.subtitle}>Re-Upload</Text>

          {/* Camera & Gallery Buttons */}
          <View style={styles.row}>
            <TouchableOpacity onPress={() => handleChooseImage('gallery')} style={styles.iconButton}>
              <Image source={require('../../assets/icon/galary.png')} style={styles.iconImage} />
              <Text style={styles.buttonText}>Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleChooseImage('camera')} style={styles.iconButton}>
              <Image source={require('../../assets/icon/camera.png')} style={styles.iconImage} />
              <Text style={styles.buttonText}>Camera</Text>
            </TouchableOpacity>
          </View>

          {/* Image Preview */}
              {photoUris.length > 0 ? (
              <FlatList
                data={photoUris}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                key={photoUris.length > 1 ? 'multi' : 'single'}
                numColumns={2}
                contentContainerStyle={styles.scrollContainer}
              />
              ) : (
                <Text style={styles.noImageText}>No images selected</Text>
              )}

          {/* Upload Button */}
          <TouchableOpacity
            onPress={uploadPhotos}
            disabled={photoUris.length === 0}
            style={[
              styles.uploadButton,
              { backgroundColor: photoUris.length === 0 ? '#ccc' : '#007bff' },
            ]}
          >
            <Text style={[styles.buttonText, { color: photoUris.length === 0 ? '#888' : '#fff' }]}>
            Re Upload
            </Text>
          </TouchableOpacity>
        </View>

        {/* Status History */}
        <View style={styles.card}>
          <Text style={styles.subtitle}>Status History</Text>

          {/* Scrollable Timeline Container */}
          <View style={{ maxHeight: 300 }}>
            <FlatList
              data={logData}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item, index }) => {
              const iconMap = {
                'check-circle': 'check-circle',
                'ban': 'ban',
                'times-circle': 'times-circle',
                'pause': 'pause',
                'spinner': 'spinner',
                'check-circle': 'check-circle',
                'file-import': 'file',
                'exclamation-circle': 'exclamation-circle',
                'file': 'file',
                'default': 'info-circle',
              };

              // Directly use the status_icon from API
              const raw = item?.status_icon?.trim();  // safe fallback
              const iconName = iconMap[raw] || iconMap.default;
              const isLast = index === logData.length - 1;

                return (
                  <View style={styles.timelineItem}>
                    {/* Left Icon & Line */}
                    <View style={styles.timelineLeft}>
                      <View style={[styles.iconWrapper, { borderColor: item.status_color_code || '#ccc' }]}>
                        <Icon name={iconName} size={18} color={item.status_color_code || '#555'} />
                      </View>
                      {!isLast && <View style={styles.verticalLine} />}
                    </View>

                    {/* Right Content */}
                    <View style={[styles.timelineContent, { borderLeftColor: item.status_color_code || '#ccc' }]}>
                      <Text style={[styles.statusText, { color: item.status_color_code }]}>
                        {item.status_name} - <Text style={styles.subStatus}>{item.sub_status_name}</Text>
                      </Text>
                      <Text style={styles.byText}>By {item.userName}</Text>
                      <View style={styles.timeRow}>
                        <Icon name="clock-o" size={12} color="#888" />
                        <Text style={styles.timeText}>  {dayjs(item.created_at).format('D MMMM YYYY h:mm A')}</Text>
                      </View>
                    </View>
                  </View>
                );
              }}
              contentContainerStyle={styles.timelineContainer}
              showsVerticalScrollIndicator={true}
              scrollEnabled={true}
              nestedScrollEnabled={true}  // ✅ THIS LINE ENABLES INNER SCROLLING
            />
          </View>
        </View>
      </>
      )}
    {loading && <ActivityIndicator size="large" color="#00ff00" style={{ margin: 20 }} />}
      
    </ScrollView>
  );

  

};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
  heading: { fontSize: 20, fontWeight: 'bold', margin: 16, textAlign: 'center' },
card: {
  backgroundColor: '#fff',
  padding: 15,
  marginVertical: 10,
  marginHorizontal: 15,
  borderRadius: 12,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 3,
  elevation: 3,
},


  valueText: { fontSize: 14, color: '#333' },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center'
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center'
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
imageGrid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  marginTop: 10,
},

imageWrapper: {
  width: '30%',
  marginBottom: 15,
  alignItems: 'center',
},

image: {
  width: '70%',
  height: 60,
  borderRadius: 8,
  backgroundColor: '#eee',
  borderWidth: 1,
  borderColor: '#FFCB0A'
},

downloadIcon: {
  marginTop: 5,
  alignItems: 'center',
  gap: 2,
},

icon: {
  width: 30,
  height: 30,
  resizeMode: 'contain',
  tintColor: '#007bff',
},

downloadText: {
  fontSize: 12,
  color: '#007bff',
},
row: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 10,
  gap: 10,
},

iconButton: {
  flex: 1,
  backgroundColor: '#f2f2f2',
  paddingVertical: 10,
  borderRadius: 8,
  alignItems: 'center',
  flexDirection: 'column',
  gap: 5,
},

iconImage: {
  width: 30,
  height: 30,
  resizeMode: 'contain',
},

uploadButton: {
  marginTop: 10,
  paddingVertical: 12,
  borderRadius: 8,
  alignItems: 'center',
},

buttonText: {
  fontSize: 14,
  fontWeight: '600',
},
scrollContainer: { alignItems: 'center', paddingBottom: 20 },
  imageContainer: {
    position: 'relative',
    margin: 8,
    width: screenWidth / 2.5, // 2 per row with margin
    height: screenWidth / 4.5,  // keep height proportional
  },
  ReUploadimage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#009743',
  },
  removeButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ff4444',
    padding: 5,
    borderRadius: 50,
    zIndex: 1,
  },
  removeText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  noImageText: { textAlign: 'center', color: '#888', fontStyle: 'italic', marginTop: 10 },
timelineContainer: {
  marginTop: 12,
  paddingLeft: 5,
},
timelineItem: {
  flexDirection: 'row',
  marginBottom: 20,
  position: 'relative',
},
timelineLeft: {
  alignItems: 'center',
  width: 40,
  position: 'relative',
},
iconWrapper: {
  width: 30,
  height: 30,
  borderRadius: 50,
  backgroundColor: '#fff',
  borderWidth: 2,
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1,
},
verticalLine: {
  width: 2,
  flex: 1,
  backgroundColor: '#ccc',
  position: 'absolute',
  top: 22,
  left: 14,
},
timelineContent: {
  flex: 1,
  paddingLeft: 10,
  backgroundColor: '#f9f9f9',
  borderRadius: 8,
  padding: 10,
  elevation: 2,
  borderLeftWidth: 4,
  borderLeftColor: '#ccc',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
},
statusText: {
  fontSize: 14,
  fontWeight: 'bold',
},
subStatus: {
  fontSize: 13,
  fontWeight: '400',
  color: '#444',
},
byText: {
  fontSize: 13,
  color: '#333',
  marginTop: 4,
},
timeRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 2,
},
timeText: {
  fontSize: 12,
  color: '#777',
},
alertBox: {
  backgroundColor: '#f8d7da',
  borderRadius: 6,
  padding: 10,
  marginTop: 8,
  flexDirection: 'row',
  alignItems: 'center',
},
alertText: {
  color: '#721c24',
  fontSize: 13,
  flex: 1,
  fontWeight: '500',
},

infoBox: {
  backgroundColor: '#f0f0f0',
  borderRadius: 6,
  padding: 10,
  marginTop: 8,
  flexDirection: 'row',
  alignItems: 'center',
},
infoText: {
  fontSize: 13,
  color: '#333',
  fontWeight: '500',
  flex: 1,
},


});

export default ShowDetails;
