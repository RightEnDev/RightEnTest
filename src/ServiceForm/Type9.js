import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  BackHandler,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import qs from 'qs';
import { SvgXml } from 'react-native-svg';
import { MobileSVG } from '../../assets/ALLSVG';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');

const Type9 = ({
  service_data,
  label,
  cardtype,
  form_service_code,
  form_sub_service_id,
  form_service_id,
  formSubmitUrl,
  app_icon,
  navigation,
}) => {
  const [aadhaarNo, setAadhaarNo] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalTxnId, setModalTxnId] = useState('');
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('Details', {
          service_id: form_service_id,
          service_code: form_service_code,
          app_icon: app_icon,
        });
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [navigation, form_service_id, form_service_code, app_icon])
  );

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!aadhaarNo || aadhaarNo.length !== 12) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Aadhaar',
        text2: 'Please enter a valid 12-digit Aadhaar number.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const user_id = await AsyncStorage.getItem('us_id');
      const response = await axios.post(
        formSubmitUrl,
        qs.stringify({
          user_id: user_id,
          service_id: form_service_id,
          service_code: form_service_code,
          sub_service_id: form_sub_service_id,
          aadhaar: aadhaarNo,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      if (response.data.status === true && response.data.pan && response.data.orderId) {
        setIsError(false);
        setModalMessage(`PAN: ${response.data.pan}`);
        setModalTxnId(response.data.orderId);

        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'PAN Found Successfully!',
        });
      } else {
        setIsError(true);
        setModalMessage(response.data.msg || 'Something went wrong. Please try again.');
        setModalTxnId('');

        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: response.data.msg || 'PAN not found.',
        });
      }
    } catch (error) {
      console.error('PAN Find Error:', error);
      setIsError(true);
      setModalMessage('Error: Unable to process PAN Find.');
      setModalTxnId('');

      Toast.show({
        type: 'error',
        text1: 'Network Error',
        text2: 'Please try again later.',
      });
    }

    setIsSuccessModalVisible(true);
    setIsSubmitting(false);
  };

  const handleCloseModal = () => {
    setIsSuccessModalVisible(false);
    setAadhaarNo('');
    setModalMessage('');
    setModalTxnId('');
    setIsError(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>{label}</Text>

          <Text style={styles.label}>
            Aadhaar Number <Text style={{ color: 'red' }}>*</Text>
          </Text>
          <View style={styles.inputContainer}>
            <SvgXml xml={MobileSVG} style={styles.icon} />
            <TextInput
              style={styles.input}
              value={aadhaarNo}
              onChangeText={(text) => setAadhaarNo(text.replace(/[^0-9]/g, ''))}
              placeholder="Enter Aadhaar Number"
              placeholderTextColor="#666"
              keyboardType="numeric"
              maxLength={12}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, isSubmitting && { opacity: 0.6 }]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.buttonText}>
              {isSubmitting ? 'Please wait...' : 'Submit'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={isSuccessModalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Image
              source={
                isError
                  ? require('../../assets/error.gif')
                  : require('../../assets/success.gif')
              }
              style={styles.successGif}
            />
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            {modalTxnId ? (
              <Text style={styles.modalTransactionId}>Txn ID: {modalTxnId}</Text>
            ) : null}
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
              <Text style={styles.closeButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Toast />
    </KeyboardAvoidingView>
  );
};

export default Type9;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollContainer: { padding: 10 },
  card: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#FFCB0A',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#009743',
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFCB0A',
    borderRadius: 10,
    padding: 5,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: 'black',
  },
  button: {
    backgroundColor: '#009743',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  successGif: {
    width: 90,
    height: 90,
    marginBottom: 12,
    alignSelf: 'center',
  },
  modalMessage: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 8,
  },
  modalTransactionId: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 12,
  },
  closeButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignSelf: 'center',
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
