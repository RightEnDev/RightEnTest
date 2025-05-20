import { StyleSheet, StatusBar, Text, Image, View, Dimensions, SafeAreaView } from 'react-native'
import React, { useState,useEffect } from 'react'
import AppNav from './src/navigation/AppNav'
import PayUBizSdk from 'payu-non-seam-less-react'
import axios from 'axios'
const LOGO = require('./assets/images/logo.png');
const { width, height } = Dimensions.get('window');

const App = () => {
  const [load, setload] = useState(false);

  //PayUBizSdk.enableDebug(true);

  const shouldLoad = load
  // console.log(shouldLoad);


  return (
    <View style={{ flex: 1 }}>
        <AppNav />

    </View>

  )
}

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#CFF7FF'
  },
  image: {
    // width and height are controlled in the Image component inline style
  },
});

