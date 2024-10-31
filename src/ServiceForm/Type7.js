import { StyleSheet, Text, View, TextInput, TouchableOpacity, BackHandler, Dimensions, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import qs from 'qs';
const { width } = Dimensions.get('window');
import { SvgXml } from 'react-native-svg';
import { serviceSVG, nameSVG, MobileSVG } from '../../assets/ALLSVG';
import Toast from 'react-native-toast-message';

const Type7 = ({ service_data, label, cardtype, form_service_code, form_sub_service_id, form_service_id, formSubmitUrl, navigation }) => {
    const [formResponse, setformResponse] = useState([]);
    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [mobileNo, setMobileNo] = useState('');

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

    const showSuccessToast = (txn_id) => {
        Toast.show({
            type: 'success',
            text1: `Success ✅ id: ${txn_id}`,
            text2: 'Form submitted successfully!',
        });
    };

    const showErrorToast = () => {
        Toast.show({
            type: 'error',
            text1: 'Oops! 😔',
            text2: 'Something went wrong. Please try again.',
        });
    };

    const handleSubmit = async () => {
        try {
            const user_id = await AsyncStorage.getItem('us_id');

            if (user_id && form_service_id && form_service_code && form_sub_service_id && name && mobileNo && mobileNo.length === 10) {
                const response = await axios.post(formSubmitUrl,
                    qs.stringify({
                        user_id: user_id,
                        service_id: form_service_id,
                        service_code: form_service_code,
                        sub_service_id: form_sub_service_id,
                        name: name.toUpperCase(),
                        mobile: mobileNo,
                    }),
                    {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                    }
                );

                if (response.data.status === 'success') {
                    showSuccessToast(response.data.data.txn_id);
                    navigation.navigate('Paymennt', {
                        form_id: response.data.form_id,
                        txn_id: response.data.data.txn_id,
                        service_data: service_data
                    });
                } else {
                    showErrorToast();
                }
            } else {
                Alert.alert("Please fill all fields correctly.");
            }
        } catch (error) {
            console.error('Error during form submission:', error);
            showErrorToast();
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.label}>{cardtype} Type <Text style={{ color: 'red' }}>*</Text></Text>
                <View style={styles.input_view}>
                    <View style={styles.svg_box}>
                        <SvgXml xml={serviceSVG} />
                    </View>
                    <Text style={[styles.input, { fontSize: 24, fontWeight: 'bold' }]}>{label}</Text>
                </View>

                <Toast />

                <Text style={styles.label}>Name <Text style={{ color: 'red' }}>*</Text></Text>
                <View style={styles.input_view}>
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

                <Text style={styles.label}>Mobile No <Text style={{ color: 'red' }}>*</Text></Text>
                <View style={styles.input_view}>
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
                    <Text style={styles.buttonText}>Buy Now</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default Type7;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    label: {
        color: 'black',
        fontSize: 16,
        marginBottom: 8,
        fontWeight: 'bold',
    },
    input_view: {
        borderColor: '#ccc',
        borderWidth: 2,
        borderRadius: 10,
        flexDirection: 'row',
        marginBottom: 15,
    },
    svg_box: {
        borderColor: '#ccc',
        borderWidth: 2,
        borderRadius: 5,
        backgroundColor: '#d2d2d2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        height: 40,
        width: '80%',
        paddingHorizontal: 10,
        fontSize: 18,
        color: 'black',
    },
    button: {
        backgroundColor: '#FFCB0A',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
});
