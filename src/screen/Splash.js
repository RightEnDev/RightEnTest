import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';

import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
const LOGO = require('../../assets/images/logo.png');
const { width, height } = Dimensions.get('window');

const Splash = ({ navigation }) => {
    useEffect(() => {
        setTimeout(async () => {
            const userEmail = await AsyncStorage.getItem('userEmail');
            const us_id = await AsyncStorage.getItem('us_id');
            if (userEmail && us_id) {
                navigation.navigate('Home');
            }
            else {
                navigation.navigate('LoginScreen');
            }
        }, 1000);
    }, []);
    return (
        <View style={styles.container}>
            <Image
                source={LOGO} // Replace with your image URL
                style={[styles.image, { width: width * 0.8, height: height * 0.4 }]} // Adjust size as needed
                resizeMode="contain" // You can use other modes like 'cover', 'stretch', etc.
            />
        </View>
    )
}

export default Splash
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'#CFF7FF'
    },
    image: {
        // width and height are controlled in the Image component inline style
    },
});