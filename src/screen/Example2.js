import { StyleSheet, Image, Text, Dimensions, View, StatusBar } from 'react-native';
import React from 'react';
const { width } = Dimensions.get('window');
import Toast from 'react-native-toast-message';
import { BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';


const pan_card = require('../../assets/images/SERVICEICON/pan_card.png');

const Example2 = ({ navigation }) => {
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('main'); // Navigate back to the main screen
        return true; // Prevent the default behavior
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content" // Light text for dark backgrounds
        backgroundColor="#06b4d6" // StatusBar background color
      />
      <View style={{
        marginLeft: 14,
        marginRight: 14,
      }}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://placehold.jp/400x250.png' }}
            style={styles.image}
            resizeMode='cover'
          />
        </View>
        <View style={styles.panCardContainer}>
          <View style={styles.image_container}>

            <Image
              source={pan_card}
              style={styles.panCardImage}
              resizeMode='cover'
            />
          </View>
          <View style={styles.service_option_text_view}>
            <Text style={styles.service_option_text}>hello</Text>

          </View>
          <View style={styles.service_option_price_view}>

            <Text style={styles.service_option_price}>hello</Text>
          </View>

        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    // backgroundColor:'red'
  },
  imageContainer: {
    marginTop: 15,
    marginBottom: 15,
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1.5,
    borderWidth: 5,
    borderColor: 'black',
    borderRadius: 15,
  },
  image_container: {
    width: (width / 3) - 28,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,

  },
  panCardContainer: {
    alignItems: 'center',
  },
  panCardImage: {
    width: 'auto',
    height: undefined,
    aspectRatio: 1,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: 'black'

  },
  service_option_text_view: {
    width: (width / 3) - 28,
    borderTopWidth: 2,
    borderTopColor: 'red',
    height: 35,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  service_option_text: {
    textAlign: 'center',
    fontFamily: 'BAUHS93',
    fontSize: 20,
    fontWeight: 'bold',
  },
  service_option_price: {
    textAlign: 'center',
    fontFamily: 'BAUHS93',
    fontSize: 24,
    fontWeight: 'bold'
  },
  service_option_price_view: {
    width: (width / 3) - 28,
    borderTopWidth: 2,
    borderColor: '#000000',
    height: 45,
    borderWidth: 3,
    borderColor: '#009743',
    backgroundColor: '#FFCB0A',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  }
});

export default Example2;
