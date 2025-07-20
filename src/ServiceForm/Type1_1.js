import {
  StyleSheet, Text, View, Modal, Image, TextInput, TouchableOpacity,
  BackHandler, Dimensions, KeyboardAvoidingView, Platform,
  ScrollView, Alert
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

const Type1_1 = ({ service_data, label, form_service_code, form_sub_service_id, form_service_id, formSubmitUrl, navigation }) => {

  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [fatherName, setFatherName] = useState('');
  const [mobileNo, setMobileNo] = useState('');

  const [checked, setChecked] = useState({
    form_csf_name: false,
    form_csf_fname: false,
    form_csf_dob: false,
    form_csf_photo: false,
    form_csf_signature: false,
  });

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

  const handleCheckboxChange = (key) => {
    setChecked(prev => ({ ...prev, [key]: !prev[key] }));
  };

    const validateForm = () => {
        const nameRegex = /^[A-Z ]+$/;
        const mobileRegex = /^[0-9]{10}$/;

        if (!name.trim() || !nameRegex.test(name)) {
            Toast.show({ type: 'error', text1: 'Name must contain only letters and spaces' });
            return false;
        }
        if (!dob) {
            Toast.show({ type: 'error', text1: 'Please select your date of birth' });
            return false;
        }
        if (!fatherName.trim() || !nameRegex.test(fatherName)) {
            Toast.show({ type: 'error', text1: "Father's Name must contain only letters and spaces" });
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

  const user_id = await AsyncStorage.getItem('us_id');
  const anyChecked = Object.values(checked).some(Boolean);
  const allThreeChecked = checked.form_csf_name && checked.form_csf_fname && checked.form_csf_dob;

  if (!anyChecked) {
    Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Select at least one Correction Type' });
    return;
  }

  if (allThreeChecked) {
    Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Cannot select Name, Father Name and DOB together' });
    return;
  }

  try {
    const response = await axios.post(formSubmitUrl,
      qs.stringify({
        user_id,
        service_id: form_service_id,
        service_code: form_service_code,
        sub_service_id: form_sub_service_id,
        name,
        father_name: fatherName,
        date_of_birth: dob,
        mobile: mobileNo,
        form_csf_name: checked.form_csf_name ? 'NAME' : '',
        form_csf_fname: checked.form_csf_fname ? 'FATHER NAME' : '',
        form_csf_dob: checked.form_csf_dob ? 'DATE OF BIRTH' : '',
        form_csf_photo: checked.form_csf_photo ? 'PHOTO' : '',
        form_csf_signature: checked.form_csf_signature ? 'SIGNATURE' : '',
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    if (response.data.status === 'success' && response.data.form_id && response.data.data?.txn_id) {
      Toast.show({ type: 'success', text1: response.data.message, text2: `Txn ID: ${response.data.data.txn_id}` });

      setTimeout(() => {
        navigation.navigate('ImagePicker', {
          form_id: response.data.form_id,
          txn_id: response.data.data.txn_id,
          service_data,
        });
      }, 2000);

      // Reset form
      setName('');
      setDob('');
      setSelectedDate(new Date());
      setFatherName('');
      setMobileNo('');
      setChecked({
        form_csf_name: false,
        form_csf_fname: false,
        form_csf_dob: false,
        form_csf_photo: false,
        form_csf_signature: false,
      });

    } else {
      Toast.show({ type: 'error', text1: 'Submission Failed', text2: 'Something went wrong. Please try again.' });
    }
  } catch (err) {
    Toast.show({ type: 'error', text1: 'Server Error', text2: 'Please try again later' });
  }
};


  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>{label}</Text>

          <Text style={styles.label}>Name <Text style={styles.required}>*</Text></Text>
          <View style={styles.inputContainer}>
            <SvgXml xml={nameSVG} style={styles.icon} />
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={(text) => {
                    const filtered = text.replace(/[^a-zA-Z ]/g, '').toUpperCase();
                    setName(filtered);
                }}
                placeholder="Enter Name"
                placeholderTextColor="#666"
                autoCapitalize="characters"
            />
          </View>

          <Text style={styles.label}>DOB (DD/MM/YYYY) <Text style={styles.required}>*</Text></Text>
          <View style={styles.inputContainer}>
            <SvgXml xml={DOBSVG} style={styles.icon} />
            <TextInput
              style={styles.input}
              value={dob}
              onChangeText={(text) => {
                let cleaned = text.replace(/\D/g, '');
                if (cleaned.length > 2 && cleaned.length <= 4) {
                  cleaned = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
                } else if (cleaned.length > 4) {
                  cleaned = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
                }
                setDob(cleaned);
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

          <Text style={styles.label}>Father's Name <Text style={styles.required}>*</Text></Text>
          <View style={styles.inputContainer}>
            <SvgXml xml={fatherNameSVG} style={styles.icon} />
            <TextInput
                style={styles.input}
                value={fatherName}
                onChangeText={(text) => {
                    const filtered = text.replace(/[^a-zA-Z ]/g, '').toUpperCase();
                    setFatherName(filtered);
                }}
                placeholder="Enter Father's Name"
                placeholderTextColor="#666"
                autoCapitalize="characters"
            />

          </View>

          <Text style={styles.label}>Mobile No <Text style={styles.required}>*</Text></Text>
          <View style={styles.inputContainer}>
            <SvgXml xml={MobileSVG} style={styles.icon} />
            <TextInput
                style={styles.input}
                value={mobileNo}
                onChangeText={(text) => {
                    const filtered = text.replace(/[^0-9]/g, '');
                    setMobileNo(filtered);
                }}
                placeholder="Enter Mobile Number"
                placeholderTextColor="#666"
                maxLength={10}
                keyboardType="numeric"
            />

          </View>

          <Text style={[styles.label, { fontSize: 18, marginTop: 10 }]}>Correction Type <Text style={styles.required}>*</Text></Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              {['form_csf_name', 'form_csf_fname', 'form_csf_dob'].map((key, i) => (
                <TouchableOpacity key={i} style={styles.checkboxContainer} onPress={() => handleCheckboxChange(key)}>
                  <View style={[styles.checkbox, checked[key] && styles.checkboxChecked]}>
                    {checked[key] && <Text style={{ color: '#fff' }}>✔</Text>}
                  </View>
                  <Text style={styles.labelCheckBox}>{key.split('_')[2].replace(/_/g, ' ').toUpperCase()}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View>
              {['form_csf_photo', 'form_csf_signature'].map((key, i) => (
                <TouchableOpacity key={i} style={styles.checkboxContainer} onPress={() => handleCheckboxChange(key)}>
                  <View style={[styles.checkbox, checked[key] && styles.checkboxChecked]}>
                    {checked[key] && <Text style={{ color: '#fff' }}>✔</Text>}
                  </View>
                  <Text style={styles.labelCheckBox}>{key.split('_')[2].toUpperCase()}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
        <Toast />
      </ScrollView>

      <Toast />
    </KeyboardAvoidingView>
  );
};

export default Type1_1;

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
    paddingHorizontal: 10,
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
    textTransform: 'uppercase', // auto-uppercase
  },
  button: {
    backgroundColor: '#FFCB0A',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  checkbox: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderRadius: 5,
  },
  checkboxChecked: {
    backgroundColor: 'red',
  },
  labelCheckBox: {
    fontSize: 16,
    color: '#000',
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

