import {
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  TextInput,
  TouchableOpacity,
  BackHandler,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import React, { useState, useCallback } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import qs from 'qs';
const { width } = Dimensions.get('window');
import { SvgXml } from 'react-native-svg';
import {
  mobile_svg,
  nameSVG,
  MobileSVG,
} from '../../assets/ALLSVG';
import Toast from 'react-native-toast-message';

const Type6 = ({ service_data, label, cardtype, form_service_code, form_sub_service_id, form_service_id, formSubmitUrl, navigation }) => {
  const [aadhaar, setAadhaar] = useState('');
  const [panNO, setPanNO] = useState('');
  const [name, setName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalTxnId, setModalTxnId] = useState('');
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('main');
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  const handleSubmit = async () => {
    const user_id = await AsyncStorage.getItem('us_id');

    if (
      user_id &&
      form_service_id &&
      form_service_code &&
      form_sub_service_id &&
      name &&
      panNO.length === 10 &&
      aadhaar.length === 12 &&
      mobileNo.length === 10
    ) {
      try {
        const response = await axios.post(
          formSubmitUrl,
          qs.stringify({
            user_id,
            service_id: form_service_id,
            service_code: form_service_code,
            sub_service_id: form_sub_service_id,
            name: name.toUpperCase(),
            mobile: mobileNo,
            aadhaar_no: aadhaar,
            pan_no: panNO,
          }),
          {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          }
        );

        if (response.data.status === 'success' && response.data.form_id && response.data.data?.txn_id) {
          // setModalMessage(response.data.message);
          // setModalTxnId(response.data.data.txn_id);
          // setIsSuccessModalVisible(true);
          Toast.show({
            type: 'success',
            text1: '✅ Success',
            text2: `Txn ID: ${response.data.data.txn_id}`,
          });
          setTimeout(() => {
            //setIsSuccessModalVisible(false);
            navigation.navigate('ImagePicker', {
              form_id: response.data.form_id,
              txn_id: response.data.data.txn_id,
              service_data,
            });
          }, 2000);
          setAadhaar('');
          setPanNO('');
          setName('');
          setMobileNo('');
        } else {
          Toast.show({
            type: 'error',
            text1: 'Failed',
            text2: 'Something went wrong. Please try again.',
          });
        }
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Form submission failed.',
        });
      }
    } else {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fill all required fields correctly.',
      });
    }
  };

  const filterTextOnly = (text) => text.replace(/[^a-zA-Z ]/g, '').toUpperCase();
  const filterDigitsOnly = (text) => text.replace(/[^0-9]/g, '');

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>{label}</Text>
          <Text style={styles.label}>Aadhaar No *</Text>
          <View style={styles.inputContainer}>
            <SvgXml xml={nameSVG} style={styles.icon} />
            <TextInput
              style={styles.input}
              value={aadhaar}
              onChangeText={(text) => setAadhaar(filterDigitsOnly(text))}
              placeholder="Enter Aadhaar No"
              placeholderTextColor="black"
              maxLength={12}
              keyboardType="numeric"
            />
          </View>

          <Text style={styles.label}>PAN No *</Text>
          <View style={styles.inputContainer}>
            <SvgXml xml={nameSVG} style={styles.icon} />
            <TextInput
              style={styles.input}
              value={panNO}
              onChangeText={(text) => setPanNO(text.toUpperCase())}
              placeholder="Enter PAN No"
              placeholderTextColor="black"
              maxLength={10}
            />
          </View>

          <Text style={styles.label}>Name *</Text>
          <View style={styles.inputContainer}>
            <SvgXml xml={nameSVG} style={styles.icon} />
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={(text) => setName(filterTextOnly(text))}
              placeholder="Enter Name"
              placeholderTextColor="black"
            />
          </View>

          <Text style={styles.label}>Mobile No *</Text>
          <View style={styles.inputContainer}>
            <SvgXml xml={MobileSVG} style={styles.icon} />
            <TextInput
              style={styles.input}
              value={mobileNo}
              onChangeText={(text) => setMobileNo(filterDigitsOnly(text))}
              placeholder="Enter Mobile Number"
              placeholderTextColor="black"
              maxLength={10}
              keyboardType="numeric"
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={isSuccessModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Image source={require('../../assets/success.gif')} style={styles.successGif} />
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            {modalTxnId && <Text style={styles.modalTransactionId}>Txn ID: {modalTxnId}</Text>}
            <TouchableOpacity style={styles.closeButton} onPress={() => setIsSuccessModalVisible(false)}>
              <Text style={styles.closeButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Toast />
    </KeyboardAvoidingView>
  );
};

export default Type6;

const styles = StyleSheet.create({
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
  icon: { marginRight: 10 },
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
