import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Modal,
  Image,
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
  settingsSVG,
  profileSVG,
  reportSVG,
  eye,
  eyeoff,
  nameSVG,
  DOBSVG,
  datepicker,
  fatherNameSVG,
  MobileSVG,
  serviceSVG,
} from '../../assets/ALLSVG';
import Toast from 'react-native-toast-message';

const Type2 = ({
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
  const [panType, setPanType] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bikeNo, setBikeNO] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalTxnId, setModalTxnId] = useState('');
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

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

  const handleDateChange = (event, date) => {
    setShowPicker(false);
    if (date) {
      const formattedDate = date.toISOString().split('T')[0];
      setDob(formattedDate);
      setSelectedDate(date);
    }
  };

  const handleSubmit = async () => {
    const user_id = await AsyncStorage.getItem('us_id');

    if (!name || !bikeNo || !mobileNo) {
      Toast.show({
        type: 'error',
        text1: 'Missing Fields',
        text2: 'Please fill all required fields.',
      });
      return;
    }

    if (bikeNo.length < 7 || bikeNo.length > 10) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Bike No',
        text2: 'Bike number must be 7 to 10 characters.',
      });
      return;
    }

    if (mobileNo.length !== 10 || !/^[0-9]+$/.test(mobileNo)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Mobile',
        text2: 'Mobile number must be 10 digits.',
      });
      return;
    }

    try {
      const response = await axios.post(
        formSubmitUrl,
        qs.stringify({
          user_id: user_id,
          service_id: form_service_id,
          service_code: form_service_code,
          sub_service_id: form_sub_service_id,
          name: name.toUpperCase(),
          bike_no: bikeNo,
          mobile: mobileNo,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      if (response.data.status === 'success' && response.data.form_id && response.data.data?.txn_id) {
        // setModalMessage(response.data.message);
        // setModalTxnId(response.data.data.txn_id);
        // setIsSuccessModalVisible(true);

        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Form submitted successfully.',
        });

        setTimeout(() => {
          //setIsSuccessModalVisible(false);
          navigation.navigate('ImagePicker', {
            form_id: response.data.form_id,
            txn_id: response.data.data.txn_id,
            service_data: service_data,
          });
        }, 2000);

        setformResponse(response.data.data);
        setPanType('');
        setName('');
        setDob('');
        setShowPicker(false);
        setSelectedDate(new Date());
        setBikeNO('');
        setMobileNo('');
      } else {
        // setModalMessage('Something went wrong. Please try again.');
        // setModalTxnId('');
        // setIsSuccessModalVisible(true);

        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: response.data.message || 'Submission failed.',
        });
      }
    } catch (error) {
      console.log('Submission Error:', error);

      Toast.show({
        type: 'error',
        text1: 'Network Error',
        text2: 'Failed to submit form. Try again later.',
      });
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>{label}</Text>

          <Text style={styles.label}>
            Name <Text style={{ color: 'red' }}>*</Text>
          </Text>
          <View style={styles.inputContainer}>
            <SvgXml xml={nameSVG} style={styles.icon} />
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={(text) => {
                    const onlyLetters = text.replace(/[^A-Za-z ]/g, ''); // Remove non-letters
                    setName(onlyLetters.toUpperCase());
                }}
                placeholder="Enter Name"
                placeholderTextColor="#666"
            />
          </View>

          <Text style={styles.label}>
            Bike No <Text style={{ color: 'red' }}>*</Text>
          </Text>
          <View style={styles.inputContainer}>
            <SvgXml xml={fatherNameSVG} style={styles.icon} />
            <TextInput
                style={styles.input}
                value={bikeNo}
                onChangeText={(text) => {
                    const bike = text.replace(/[^A-Za-z0-9]/g, '');
                    setBikeNO(bike.toUpperCase());
                }}
                placeholder="Enter Bike No"
                placeholderTextColor="#666"
            />
          </View>

          <Text style={styles.label}>
            Mobile No <Text style={{ color: 'red' }}>*</Text>
          </Text>
          <View style={styles.inputContainer}>
            <SvgXml xml={MobileSVG} style={styles.icon} />
            <TextInput
              style={styles.input}
              value={mobileNo}
              onChangeText={(text) => setMobileNo(text.replace(/[^0-9]/g, ''))}
              placeholder="Enter Mobile Number"
              placeholderTextColor="#666"
              maxLength={10}
              keyboardType="numeric"
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={isSuccessModalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Image source={require('../../assets/success.gif')} style={styles.successGif} />
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            {modalTxnId ? <Text style={styles.modalTransactionId}>Txn ID: {modalTxnId}</Text> : null}
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

export default Type2;

const styles = StyleSheet.create({
  // Styles remain unchanged
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
    backgroundColor: '#FFCB0A',
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
