import React, { useState } from 'react';
import {
  StyleSheet, Text, View, Image, TouchableOpacity,
  ActivityIndicator, FlatList, Dimensions, BackHandler, PermissionsAndroid
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ImageResizer from 'react-native-image-resizer';

const screenWidth = Dimensions.get('window').width;

const ImagePicker = ({ route, navigation }) => {
  const { txn_id, form_id, service_data } = route.params;
  const [loading, setLoading] = useState(false);
  const [photoUris, setPhotoUris] = useState([]);
  console.log('service data',service_data);
  console.log('form_id',form_id);

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
        PermissionsAndroid.PERMISSIONS.CAMERA
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const showToast = (type, message) => {
    Toast.show({
      type,
      text1: type === 'success' ? '✅ Success' : '❌ Error',
      text2: message,
    });
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

  const uploadPhotos = async () => {
    if (photoUris.length === 0) return;

    setLoading(true);
    try {
      const us_id = await AsyncStorage.getItem('us_id');
      const formData = new FormData();
      formData.append('user_id', us_id);
      formData.append('form_id', form_id);
      formData.append('txn_id', txn_id);

      for (let i = 0; i < photoUris.length; i++) {
        const uri = photoUris[i];
        const ext = uri.split('.').pop().toLowerCase();
        if (!['jpg', 'jpeg'].includes(ext)) {
          setLoading(false);
          return showToast('error', 'Only JPG and JPEG formats supported.');
        }

        formData.append('files[]', {
          uri: uri.startsWith('file://') ? uri : `file://${uri}`,
          type: 'image/jpeg',
          name: `photo_${i}.${ext}`,
        });
      }

      const response = await axios.post(service_data.fileUploadURl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        //timeout: 60000,
      });

      if (response.status === 200) {
        showToast('success', 'Images uploaded successfully!');
        setTimeout(() => {
          setPhotoUris([]);
          navigation.navigate('PaymentMode', { txn_id, user_id: us_id,form_id, service_data });
        }, 1000);
      } else {
        showToast('error', 'Upload failed.');
      }
    } catch (err) {
      showToast('error', 'Server/Network error.');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item }} style={styles.image} resizeMode="cover" />
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📤 Upload Documents <Text style={{ color: 'red' }}>*</Text></Text>

      {loading && <ActivityIndicator size="large" color="#009743" style={{ marginVertical: 10 }} />}

      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={() => handleChooseImage('gallery')} style={styles.iconButton}>
          <Image source={require('../../assets/icon/galary.png')} style={styles.iconImage} />
          <Text style={styles.buttonText}>Gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleChooseImage('camera')} style={styles.iconButton}>
          <Image source={require('../../assets/icon/camera.png')} style={styles.iconImage} />
          <Text style={styles.buttonText}>Camera</Text>
        </TouchableOpacity>
      </View>

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

      <TouchableOpacity
        style={[styles.uploadButton, photoUris.length === 0 && styles.disabledButton]}
        onPress={uploadPhotos}
        disabled={photoUris.length === 0}
      >
        <Text style={styles.uploadText}>📤 Upload & Pay</Text>
      </TouchableOpacity>
        <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff', padding: 12 },
  title: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    color: '#009743',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingBottom: 6,
  },
  buttonRow: {
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
  buttonText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
  scrollContainer: { alignItems: 'center', paddingBottom: 20 },
  imageContainer: {
    position: 'relative',
    margin: 8,
    width: screenWidth / 2.5, // 2 per row with margin
    height: screenWidth / 4.5,  // keep height proportional
  },
  image: {
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
    borderRadius: 25,
    zIndex: 1,
  },
  removeText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  noImageText: { textAlign: 'center', color: '#888', fontStyle: 'italic', marginTop: 10 },
  uploadButton: {
    backgroundColor: '#FFCB0A',
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  uploadText: { fontSize: 18, fontWeight: 'bold', color: 'black' },
  disabledButton: { opacity: 0.5 },
});

export default ImagePicker;
