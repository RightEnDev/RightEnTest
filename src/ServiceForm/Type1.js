import {
  StyleSheet, Text, Modal, View, TextInput, Image,
  TouchableOpacity, BackHandler, Dimensions, KeyboardAvoidingView,
  Platform, ScrollView
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
  nameSVG, DOBSVG, fatherNameSVG, MobileSVG
} from '../../assets/ALLSVG';

const { width } = Dimensions.get('window');

const Type1 = ({ service_data, label, form_service_code, form_sub_service_id, form_service_id, formSubmitUrl, navigation }) => {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [fatherName, setFatherName] = useState('');
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

  const validateForm = () => {
    const nameRegex = /^[A-Za-z ]+$/;
    const mobileRegex = /^[0-9]{10}$/;

    if (!name.trim() || !nameRegex.test(name)) {
      Toast.show({ type: 'error', text1: 'Name must contain only letters' });
      return false;
    }
    if (!dob) {
      Toast.show({ type: 'error', text1: 'Please select your date of birth' });
      return false;
    }
    if (!fatherName.trim() || !nameRegex.test(fatherName)) {
      Toast.show({ type: 'error', text1: "Father's Name must contain only letters" });
      return false;
    }
    if (!mobileRegex.test(mobileNo)) {
      Toast.show({ type: 'error', text1: 'Mobile number must be 10 digits' });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const user_id = await AsyncStorage.getItem('us_id');
      if (!user_id) {
        Toast.show({ type: 'error', text1: 'User ID not found in storage' });
        return;
      }

      const payload = {
        user_id,
        service_id: form_service_id,
        service_code: form_service_code,
        sub_service_id: form_sub_service_id,
        name,
        father_name: fatherName,
        date_of_birth: dob,
        mobile: mobileNo,
      };

      const response = await axios.post(formSubmitUrl, qs.stringify(payload), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      const res = response.data;
      if (res.status === 'success' && res.form_id && res.data?.txn_id) {
        // setModalMessage(res.message);
        // setModalTxnId(res.data.txn_id);
        // setIsSuccessModalVisible(true);
        
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Form submitted successfully.',
        });

        setTimeout(() => {
          //setIsSuccessModalVisible(false);
          navigation.navigate('ImagePicker', {
            form_id: res.form_id,
            txn_id: res.data.txn_id,
            service_data,
          });
        }, 2000);

        setName('');
        setDob('');
        setFatherName('');
        setMobileNo('');
        setSelectedDate(new Date());
      } else {
        Toast.show({ type: 'error', text1: 'Submission failed, try again.' });
      }

    } catch (error) {
      console.error('Form submission error:', error);
      Toast.show({ type: 'error', text1: 'Something went wrong!' });
    }
  };

  const handleDateChange = (event, selected) => {
    setShowPicker(false);
    if (selected) {
      const formattedDate = selected.toLocaleDateString('en-GB'); // DD/MM/YYYY
      setDob(formattedDate);
      setSelectedDate(selected);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
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
              onChangeText={(text) => {
                const cleaned = text.replace(/[^A-Za-z ]/g, '');
                setName(cleaned.toUpperCase());
                }}
              placeholder="Enter Name"
              placeholderTextColor="#666"
            />
          </View>

          {/* DOB */}
          <Text style={styles.label}>DOB (DD/MM/YYYY) *</Text>
          <View style={styles.inputContainer}>
            <SvgXml xml={DOBSVG} style={styles.icon} />
            <TextInput
              style={styles.input}
              value={dob}
              onChangeText={(text) => {
                let cleanedText = text.replace(/\D/g, '');
                if (cleanedText.length > 2 && cleanedText.length <= 4) {
                  cleanedText = cleanedText.slice(0, 2) + '/' + cleanedText.slice(2);
                } else if (cleanedText.length > 4) {
                  cleanedText = cleanedText.slice(0, 2) + '/' + cleanedText.slice(2, 4) + '/' + cleanedText.slice(4, 8);
                }
                setDob(cleanedText);
              }}
              placeholder="DD/MM/YYYY"
              keyboardType="numeric"
              maxLength={10}
            />
            <TouchableOpacity onPress={() => setShowPicker(true)} style={{ padding: 10 }}>
              <SvgXml xml={DOBSVG} style={styles.icon} />
            </TouchableOpacity>
          </View>

          {showPicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="calendar"
              maximumDate={new Date()}
              minimumDate={new Date(1900, 0, 1)}
              onChange={handleDateChange}
            />
          )}

          {/* Father's Name */}
          <Text style={styles.label}>Father's Name *</Text>
          <View style={styles.inputContainer}>
            <SvgXml xml={fatherNameSVG} style={styles.icon} />
            <TextInput
              style={styles.input}
              value={fatherName}
              onChangeText={(text) => {
                const cleaned = text.replace(/[^A-Za-z ]/g, '');
                setFatherName(cleaned.toUpperCase());
                }}
              placeholder="Enter Father's Name"
              placeholderTextColor="#666"
            />
          </View>

          {/* Mobile No */}
          <Text style={styles.label}>Mobile No *</Text>
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

          {/* Submit Button */}
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>

        <Toast />
      </ScrollView>

      {/* Modal */}
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

export default Type1;



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContainer: {
        padding: 10,
    },
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
        color:'#FFCB0A',
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
    dateInput: {
        flex: 1,
        paddingVertical: 10,
    },
    dropdown: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        backgroundColor: '#fff',
        marginBottom: 10,
    },
    dropdownList: {
        maxHeight: 150,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
    },
    dropdownItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    dropdownText: {
        fontSize: 16,
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
        alignSelf: 'center', // Fix for centering
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
        alignSelf: 'center', // Fix for centering
        width: '100%', // Full width to maintain centering
        alignItems: 'center',
      },
      closeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
      },

});