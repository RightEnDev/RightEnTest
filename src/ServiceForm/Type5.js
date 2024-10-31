import { StyleSheet, Text, View, TextInput, TouchableOpacity, BackHandler, Dimensions, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
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
import DropDownPicker from 'react-native-dropdown-picker';

const Type5 = ({ service_data, label, cardtype, form_service_code, form_sub_service_id, form_service_id, formSubmitUrl, navigation }) => {
    // console.log("hello");
    // console.log(form_service_code,form_sub_service_id,form_service_id);
    const [formResponse, setformResponse] = useState([]);

    const [panType, setPanType] = useState('');
    const [name, setName] = useState('');

    const [DD, setDD] = useState('');
    const [MM, setMM] = useState('');
    const [YYYY, setYYYY] = useState('');
    const [dob, setDob] = useState('');
    const [showPicker, setShowPicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [fatherName, setFatherName] = useState('');
    const [motherName, setMotherName] = useState('');
    const [spouseName, setSpouseName] = useState('');
    const [mobileNo, setMobileNo] = useState('');
    const [edu, setEdu] = useState('');
    const [reamrk, setRemark] = useState('');
    const [openState, setOpenState] = useState(false);
    const [state, setState] = useState();
    const [itemsState, setItemsState] = useState([
        { label: 'Graduate And Above', value: 'option1' },
        { label: '7th Pass Or Less', value: 'option2' },
        { label: '10th Pass And Above', value: 'option3' },
        { label: 'Between 8th And 9th Standard', value: 'option4' },
        
    ]);
    // console.log(state.label);
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
        console.log(edu.label);
        const user_id = await AsyncStorage.getItem('us_id');
        const dateOfBirth = dob;

        if (
            user_id &&
            form_service_id &&
            form_service_code &&
            form_sub_service_id &&
            name &&
            fatherName &&
            dateOfBirth &&
            mobileNo && mobileNo.length === 10 &&
            motherName && edu.label
        ) {

            // console.log('Submitted Data:', { user_id, panType, name, dateOfBirth, fatherName, mobileNo });

            const response = await axios.post(formSubmitUrl,
                qs.stringify({
                    user_id: user_id,
                    service_id: form_service_id,
                    service_code: form_service_code,
                    sub_service_id: form_sub_service_id,
                    name: name,
                    father_name: fatherName,
                    mother_name:motherName,
                    spouse_name:spouseName,
                    date_of_birth: dateOfBirth,
                    mobile: mobileNo,
                    ed_data:edu.label,
                    remarks:reamrk

                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );

            if (response.data.status === 'success') {
                setformResponse(response.data.data);
                showSuccessToast(response.data.data.txn_id);
                setPanType('');
                setName('');
                setDD('');
                setMM('');
                setYYYY('');
                setDob('');
                setShowPicker(false);
                setSelectedDate(new Date());
                setFatherName('');
                setMobileNo('');

                navigation.navigate('ImagePicker', {
                    "form_id": response.data.form_id,
                    "txn_id": response.data.data.txn_id,
                    "service_data": service_data
                });


            } else {
                showErrorToast();
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
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.label}>{cardtype} Type <Text style={{ color: 'red' }}>*</Text></Text>
                <View style={styles.input_view}>
                    <View style={styles.svg_box}>

                        <SvgXml xml={serviceSVG} />
                    </View>
                    <Text style={[styles.input, { fontSize: 24, fontWeight: 'bold', fontFamily: 'BAUHS93', height: 'auto' }]}>{label}</Text>

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

                <Text style={styles.label}>DOB (DD/MM/YYYY) <Text style={{ color: 'red' }}>*</Text></Text>
                <View style={styles.input_view}>
                    <View style={styles.svg_box}>

                        <SvgXml xml={DOBSVG} />
                    </View>
                    <TouchableOpacity onPress={() => setShowPicker(true)} style={{ flex: 1 }}>
                        <TextInput
                            style={[styles.input, { width: '100%' }]}
                            value={dob}
                            placeholder="Select Date of Birth"
                            placeholderTextColor="black"
                            editable={false}
                        />
                    </TouchableOpacity>
                    {showPicker && (
                        <DateTimePicker
                            value={selectedDate}
                            mode="date"
                            display="spinner" // Use "spinner" for better UX on mobile
                            maximumDate={new Date()}
minimumDate={new Date(1900, 0, 1)}
                            onChange={handleDateChange}
                        />
                    )}

                </View>

                <Text style={styles.label}>Father's Name <Text style={{ color: 'red' }}>*</Text></Text>
                <View style={styles.input_view}>
                    <View style={styles.svg_box}>

                        <SvgXml xml={fatherNameSVG} />
                    </View>
                    <TextInput
                        style={styles.input}
                        value={fatherName}
                        onChangeText={setFatherName}
                        placeholder="Enter Father's Name"
                        placeholderTextColor="black"
                    />
                </View>
                <Text style={styles.label}>Mothers's Name <Text style={{ color: 'red' }}>*</Text></Text>
                <View style={styles.input_view}>
                    <View style={styles.svg_box}>

                        <SvgXml xml={fatherNameSVG} />
                    </View>
                    <TextInput
                        style={styles.input}
                        value={motherName}
                        onChangeText={setMotherName}
                        placeholder="Enter Mother's Name"
                        placeholderTextColor="black"
                    />
                </View>
                <Text style={styles.label}>Spouse  Name </Text>
                <View style={styles.input_view}>
                    <View style={styles.svg_box}>

                        <SvgXml xml={fatherNameSVG} />
                    </View>
                    <TextInput
                        style={styles.input}
                        value={spouseName}
                        onChangeText={setSpouseName}
                        placeholder="Enter Spouse Name"
                        placeholderTextColor="black"
                    />
                </View>

                <Text style={styles.label}>Mobile no <Text style={{ color: 'red' }}>*</Text></Text>
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


                <Text style={styles.label}>Educational Qualification <Text style={{ color: 'red' }}>*</Text></Text>
                <View style={styles.input_view}
                 onStartShouldSetResponder={() => true}
                 onResponderRelease={() => setOpenState(!openState)}
                 >
                    <View style={styles.svg_box}>

                        <SvgXml xml={MobileSVG} />
                    </View>
                    <View 
                        // onStartShouldSetResponder={() => true}
                        // onResponderRelease={() => setOpenState(!openState)}
                    >
                        <Text style={[{
                            alignItems: 'center',
                            paddingHorizontal: 10,
                            fontSize: 18,
                            color: 'black',
                            fontFamily: 'BAUHS93',
                            borderColor: '#ccc',
                        }]}>
                        {/* {state.label} */}

                             {state ?
                                state.label
                                : "Select Educational Qualification"} 
                        </Text>


                    </View>
                    
                </View>

                {openState ?
                        <ScrollView>
                            {itemsState.length === 0 ? (
                                <Text>No items available</Text>
                            ) : (
                                itemsState.map((item) => (
                                    <View key={item.value} style={{
                                        padding: 10,
                                        borderBottomWidth: 1,
                                        borderBottomColor: '#ccc',
                                    }}
                                        onStartShouldSetResponder={() => true}
                                        onResponderRelease={() => {
                                            setEdu(item);
                                            setOpenState(false);
                                        }}
                                    >
                                        <Text style={{
                                            fontSize: 18, color: 'black'
                                        }}>{item.label}</Text>
                                    </View>
                                ))
                            )}
                        </ScrollView>
                        : null}

                <Text style={styles.label}>Remark </Text>
                <View style={styles.input_view}>
                    <View style={styles.svg_box}>

                        <SvgXml xml={fatherNameSVG} />
                    </View>
                    <TextInput
                        style={styles.input}
                        value={reamrk}
                        onChangeText={setRemark}
                        placeholder="give your remarks"
                        placeholderTextColor="black"
                    />
                </View>


                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default Type5

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
        marginBottom: 15,

    },
    input_view: {
        borderColor: '#ccc',
        borderWidth: 2,
        borderRadius: 10,
        // alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 15,
    },
    svg_box: {
        borderColor: '#ccc',
        borderWidth: 2,
        borderRadius: 5,
        backgroundColor: '#d2d2d2',
        justifyContent: 'center',
        alignItems: 'center'

    },

    input: {
        height: 40,
        width: '80%',
        alignItems: 'center',
        paddingHorizontal: 10,
        fontSize: 18,
        color: 'black',
        fontFamily: 'BAUHS93',
        borderColor: '#ccc',
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
        fontWeight: 'bold'
    },
});