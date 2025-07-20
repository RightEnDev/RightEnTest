import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  Modal,
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
import { SvgXml } from 'react-native-svg';
import Toast from 'react-native-toast-message';

import {
  nameSVG,
  DOBSVG,
  fatherNameSVG,
  MobileSVG,
} from '../../assets/ALLSVG';

const Type5 = ({
  service_data,
  label,
  cardtype,
  form_service_code,
  form_sub_service_id,
  form_service_id,
  formSubmitUrl,
  navigation,
}) => {
  const [formResponse, setformResponse] = useState([]);
  const [name, setName] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [dob, setDob] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [spouseName, setSpouseName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [remark, setRemark] = useState('');
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTxnId, setModalTxnId] = useState('');

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('main');
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  const handleDateChange = (event, date) => {
    if (date) {
      const formattedDate = date.toLocaleDateString('en-GB');
      setDob(formattedDate);
      setSelectedDate(date);
    }
  };

  const handleSubmit = async () => {
    const user_id = await AsyncStorage.getItem('us_id');

    if (
      user_id &&
      form_service_id &&
      form_service_code &&
      form_sub_service_id &&
      name &&
      fatherName &&
      motherName &&
      dob &&
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
            name,
            father_name: fatherName,
            mother_name: motherName,
            spouse_name: spouseName,
            date_of_birth: dob,
            mobile: mobileNo,
            remarks: remark,
          }),
          {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          }
        );

        if (
          response.data.status === 'success' &&
          response.data.form_id &&
          response.data.data?.txn_id
        ) {
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>{label}</Text>

          {/* Name */}
          <Text style={styles.label}>Name *</Text>
          <View style={styles.inputContainer}>
            <SvgXml xml={nameSVG} style={styles.icon} />
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={(text) => setName(filterTextOnly(text))}
              placeholder="Enter Name"
              placeholderTextColor="#666"
            />
          </View>

          {/* DOB */}
          <Text style={styles.label}>Date of Birth *</Text>
          <View style={styles.inputContainer}>
            <SvgXml xml={DOBSVG} style={styles.icon} />
            <TextInput
              style={styles.input}
              value={dob}
              onFocus={() => setShowPicker(true)}
              placeholder="DD/MM/YYYY"
              placeholderTextColor="#666"
            />
          </View>
          {Platform.OS === 'android' && showPicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="calendar"
              maximumDate={new Date()}
              minimumDate={new Date(1900, 0, 1)}
              onChange={(event, date) => {
                setShowPicker(false);
                handleDateChange(event, date);
              }}
            />
          )}

          {/* Father's Name */}
          <Text style={styles.label}>Father's Name *</Text>
          <View style={styles.inputContainer}>
            <SvgXml xml={fatherNameSVG} style={styles.icon} />
            <TextInput
              style={styles.input}
              value={fatherName}
              onChangeText={(text) => setFatherName(filterTextOnly(text))}
              placeholder="Enter Father's Name"
              placeholderTextColor="#666"
            />
          </View>

          {/* Mother's Name */}
          <Text style={styles.label}>Mother's Name *</Text>
          <View style={styles.inputContainer}>
            <SvgXml xml={fatherNameSVG} style={styles.icon} />
            <TextInput
              style={styles.input}
              value={motherName}
              onChangeText={(text) => setMotherName(filterTextOnly(text))}
              placeholder="Enter Mother's Name"
              placeholderTextColor="#666"
            />
          </View>

          {/* Spouse Name */}
          <Text style={styles.label}>Spouse Name</Text>
          <View style={styles.inputContainer}>
            <SvgXml xml={fatherNameSVG} style={styles.icon} />
            <TextInput
              style={styles.input}
              value={spouseName}
              onChangeText={(text) => setSpouseName(filterTextOnly(text))}
              placeholder="Enter Spouse Name"
              placeholderTextColor="#666"
            />
          </View>

          {/* Mobile */}
          <Text style={styles.label}>Mobile Number *</Text>
          <View style={styles.inputContainer}>
            <SvgXml xml={MobileSVG} style={styles.icon} />
            <TextInput
              style={styles.input}
              value={mobileNo}
              onChangeText={(text) => setMobileNo(filterDigitsOnly(text))}
              placeholder="Enter Mobile No"
              placeholderTextColor="#666"
              maxLength={10}
              keyboardType="numeric"
            />
          </View>

          {/* Remark */}
          <Text style={styles.label}>Remark</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={remark}
              onChangeText={setRemark}
              placeholder="Enter Remark"
              placeholderTextColor="#666"
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
        <Toast />
      </ScrollView>

      {/* Success Modal */}
      <Modal visible={isSuccessModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Image
              source={require('../../assets/success.gif')}
              style={styles.successGif}
            />
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            {modalTxnId && (
              <Text style={styles.modalTransactionId}>Txn ID: {modalTxnId}</Text>
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsSuccessModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Toast />
    </KeyboardAvoidingView>
  );
};

export default Type5;

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
