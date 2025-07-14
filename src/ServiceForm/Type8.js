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
import React, { useState } from 'react';
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

const { width } = Dimensions.get('window');

const Type8 = ({
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
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [fatherName, setFatherName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTxnId, setModalTxnId] = useState('');

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

  const validateText = (text) => text.replace(/[^a-zA-Z\s]/g, '');
  const validateNumber = (text) => text.replace(/[^0-9]/g, '');

  const handleSubmit = async () => {
    if (
      !name ||
      !fatherName ||
      !dob.match(/^\d{2}\/\d{2}\/\d{4}$/) ||
      mobileNo.length !== 10 ||
      !bloodGroup
    ) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fill all fields correctly',
      });
      return;
    }

    const user_id = await AsyncStorage.getItem('us_id');
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
          date_of_birth: dob,
          mobile: mobileNo,
          b_group: bloodGroup,
        }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      );

      if (response.data.status === 'success' && response.data.form_id) {
        setModalMessage(response.data.message);
        setModalTxnId(response.data.data?.txn_id || '');
        setIsSuccessModalVisible(true);

        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: response.data.message,
        });

        setTimeout(() => {
          setIsSuccessModalVisible(false);
          navigation.navigate('ImagePicker', {
            form_id: response.data.form_id,
            txn_id: response.data.data?.txn_id,
            service_data,
          });
        }, 2000);

        setName('');
        setDob('');
        setFatherName('');
        setMobileNo('');
        setBloodGroup('');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Submission Failed',
          text2: response.data.message || 'Something went wrong!',
        });

        setModalMessage(response.data.message || 'Submission failed');
        setModalTxnId('');
        setIsSuccessModalVisible(true);
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Network Error',
        text2: 'Please try again later.',
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>{label}</Text>

          <Text style={styles.label}>Name *</Text>
          <View style={styles.inputContainer}>
            <SvgXml xml={nameSVG} style={styles.icon} />
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={(text) =>
                setName(validateText(text.toUpperCase()))
              }
              placeholder="Enter Name"
            />
          </View>

          <Text style={styles.label}>DOB (DD/MM/YYYY) *</Text>
          <View style={styles.inputContainer}>
            <SvgXml xml={DOBSVG} style={styles.icon} />
            <TextInput
              style={styles.input}
              value={dob}
              onChangeText={(text) => {
                let cleaned = validateNumber(text);
                if (cleaned.length > 2 && cleaned.length <= 4)
                  cleaned = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
                else if (cleaned.length > 4)
                  cleaned =
                    cleaned.slice(0, 2) +
                    '/' +
                    cleaned.slice(2, 4) +
                    '/' +
                    cleaned.slice(4, 8);
                setDob(cleaned);
              }}
              placeholder="DD/MM/YYYY"
              maxLength={10}
              keyboardType="numeric"
            />
            <TouchableOpacity onPress={() => setShowPicker(true)}>
              <SvgXml xml={DOBSVG} style={styles.icon} />
            </TouchableOpacity>
          </View>

          {showPicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="calendar"
              maximumDate={new Date()}
              onChange={(event, selectedDate) => {
                setShowPicker(false);
                if (selectedDate) {
                  const formatted = selectedDate.toLocaleDateString('en-GB');
                  setDob(formatted);
                  setSelectedDate(selectedDate);
                }
              }}
            />
          )}

          <Text style={styles.label}>Father's Name *</Text>
          <View style={styles.inputContainer}>
            <SvgXml xml={fatherNameSVG} style={styles.icon} />
            <TextInput
              style={styles.input}
              value={fatherName}
              onChangeText={(text) =>
                setFatherName(validateText(text.toUpperCase()))
              }
              placeholder="Enter Father's Name"
            />
          </View>

          <Text style={styles.label}>Mobile No *</Text>
          <View style={styles.inputContainer}>
            <SvgXml xml={MobileSVG} style={styles.icon} />
            <TextInput
              style={styles.input}
              value={mobileNo}
              onChangeText={(text) => setMobileNo(validateNumber(text))}
              placeholder="Enter Mobile Number"
              keyboardType="numeric"
              maxLength={10}
            />
          </View>

          <Text style={styles.label}>Blood Group *</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={bloodGroup}
              onChangeText={(text) => setBloodGroup(text.toUpperCase())}
              placeholder="Enter Blood Group"
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
            <Image
              source={require('../../assets/success.gif')}
              style={styles.successGif}
            />
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            {modalTxnId ? (
              <Text style={styles.modalTransactionId}>
                Txn ID: {modalTxnId}
              </Text>
            ) : null}
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

export default Type8;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollContainer: { padding: 10 },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 10 },
  title: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#FFCB0A',
    marginBottom: 15,
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
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: 'black' },
  button: {
    backgroundColor: '#FFCB0A',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  successGif: { width: 90, height: 90, marginBottom: 12 },
  modalMessage: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalTransactionId: { fontSize: 14, color: '#666', marginBottom: 12 },
  closeButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  closeButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
