import { StyleSheet, Text, View, Image, Modal, TextInput, TouchableOpacity, BackHandler, Dimensions, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import React, { useState, useCallback } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import qs from 'qs';
const { width } = Dimensions.get('window');
import { SvgXml } from 'react-native-svg';
import { mobile_svg, settingsSVG, profileSVG, reportSVG, eye, eyeoff, nameSVG, DOBSVG, datepicker, fatherNameSVG, MobileSVG, serviceSVG } from '../../assets/ALLSVG';
import Toast from 'react-native-toast-message';

const Type6 = ({ service_data, label, cardtype, form_service_code, form_sub_service_id, form_service_id, formSubmitUrl, navigation }) => {
    // console.log(cardtype);
    // console.log(form_service_code,form_sub_service_id,form_service_id);
    const [formResponse, setformResponse] = useState([]);

    const [panType, setPanType] = useState('');
    const [name, setName] = useState('');
    const [panNO, setPanNO] = useState('');
    const [aadhaar, setAadhaar] = useState('');
    const [dob, setDob] = useState('');
    const [mobileNo, setMobileNo] = useState('');
    // Modal state gula
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
            const formattedDate = date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
            setDob(formattedDate);
            console.log(formattedDate);
            setSelectedDate(date);
        }
    };
    const showSuccessToast = (txn_id) => {
        Toast.show({
            type: 'success',
            text1: `successfull ✅  id:${txn_id}`,
            text2: `Form submitted successfully !`,
        });
    };
    const showErrorToast = (txn_id) => {
        Toast.show({
            type: 'error',
            text1: 'Oops! 😔',
            text2: 'Something went wrong. Please try again.',
        });
    };

    const handleSubmit = async () => {
        // Handle form submission here

        const user_id = await AsyncStorage.getItem('us_id');

        if (
            user_id &&
            form_service_id &&
            form_service_code &&
            form_sub_service_id &&
            name &&
            panNO && panNO.length === 10 &&
            aadhaar && aadhaar.length === 12 &&
            mobileNo && mobileNo.length === 10
        ) {

            // console.log('Submitted Data:', { user_id, panType, name, dateOfBirth, fatherName, mobileNo });

            const response = await axios.post(formSubmitUrl,
                qs.stringify({
                    user_id: user_id,
                    service_id: form_service_id,
                    service_code: form_service_code,
                    sub_service_id: form_sub_service_id,
                    name: name.toUpperCase(),
                    mobile: mobileNo,
                    aadhaar_no:aadhaar,
                    pan_no:panNO

                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );

            if (response.data.status === 'success' && response.data.form_id && response.data.data?.txn_id) {
                setModalMessage(response.data.message);
                setModalTxnId(response.data.data.txn_id);
                setIsSuccessModalVisible(true);

                // 1 সেকেন্ড পর মডাল বন্ধ করে নেভিগেট করানো হবে
                setTimeout(() => {
                    setIsSuccessModalVisible(false);
                    navigation.navigate('ImagePicker', {
                        "form_id": response.data.form_id,
                        "txn_id": response.data.data.txn_id,
                        "service_data": service_data
                    });
                }, 2000);

                setformResponse(response.data.data);
                setPanNO('');
                setAadhaar('');
                setName('');
                setMobileNo('');


            } else {
                setModalMessage("Something went wrong. Please try again.");
                setModalTxnId('');
                setIsSuccessModalVisible(true);
            }
            // console.log(response.data.status === 'success');
        } else {
            Alert.alert("Enter all field");

        }




    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0} // Adjust offset if needed
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.card}>
                <Text style={styles.title}>{label}</Text>
                <Toast />
                <Text style={styles.label}>Aadhaar No <Text style={{ color: 'red' }}>*</Text></Text>
                <View style={styles.inputContainer}>
                    <View style={styles.svg_box}>

                        <SvgXml xml={nameSVG} />
                    </View>
                    <TextInput
                        style={styles.input}
                        value={aadhaar}
                        onChangeText={setAadhaar}
                        placeholder="Enter Aadhaar No"
                        placeholderTextColor="black"
                        maxLength={12}
                        keyboardType="numeric"

                    />
                </View>
                <Text style={styles.label}>PAN No <Text style={{ color: 'red' }}>*</Text></Text>
                <View style={styles.inputContainer}>
                    <View style={styles.svg_box}>

                        <SvgXml xml={nameSVG} />
                    </View>
                    <TextInput
                        style={styles.input}
                        value={panNO}
                        onChangeText={setPanNO}
                        placeholder="Enter PAN No"
                        placeholderTextColor="black"
                        maxLength={10}

                    />
                </View>


                <Text style={styles.label}>Name <Text style={{ color: 'red' }}>*</Text></Text>
                <View style={styles.inputContainer}>
                    <View style={styles.svg_box}>

                        <SvgXml xml={nameSVG} />
                    </View>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter Name"
                        placeholderTextColor="black"

                    />
                </View>
                

                <Text style={styles.label}>Mobile no <Text style={{ color: 'red' }}>*</Text></Text>
                <View style={styles.inputContainer}>
                    <View style={styles.svg_box}>

                    <SvgXml xml={MobileSVG} />
                    </View>
                    <TextInput
                        style={styles.input}
                        value={mobileNo}
                        onChangeText={setMobileNo}
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

            <Modal visible={isSuccessModalVisible} animationType="fade" transparent={true}>
                <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                    <Image source={require('../../assets/success.gif')} style={styles.successGif} />
                    <Text style={styles.modalMessage}>{modalMessage}</Text>
                    {modalTxnId ? <Text style={styles.modalTransactionId}>Txn ID: {modalTxnId} </Text>: null }

                    <TouchableOpacity
                        style={styles.closeButton}
                        //activeOpacity={1} 
                        onPress={() => {
                        setIsSuccessModalVisible(false);
                        }}
                    >
                        <Text style={styles.closeButtonText}>OK</Text>
                    </TouchableOpacity>
                    </View>
                </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
}

export default Type6 
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
        borderColor: '#FFCB0A',
        borderRadius: 8,
        padding: 10,
        backgroundColor: '#fff',
        marginBottom: 10,
    },
    dropdownList: {
        maxHeight: 150, // ✅ Ensure dropdown is not too long
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        overflow: 'hidden',
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