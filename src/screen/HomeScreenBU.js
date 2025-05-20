import { StyleSheet, Text, View,BackHandler, Alert, StatusBar, ActivityIndicator, FlatList, Dimensions, Image } from 'react-native'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigationState } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentRoute = useNavigationState((state) =>
    state.routes[state.index]?.name
  );

  useEffect(() => {
    const backAction = () => {
      if (currentRoute === 'main') {
        Alert.alert('Hold on!', 'Are you sure you want to exit the app?', [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          { text: 'YES', onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      }
      return false; // Allow the default behavior for other screens
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [currentRoute]);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const user_id = 217;
        const response = await axios.get('https://righten.in/api/users/services');
        console.log(response.data.status);
        if (!response.data.status === "success") {
          throw new Error('Network response was not ok');
        }
        setData(response.data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const user_id = 217;
  //       console.log('Sending user_id:', user_id);
  //       const response = await axios.post(
  //         'https://righten.in/api/users/services',
  //         { user_id }, // Pass user_id in the POST body
  //         { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  //       );
  //       console.log(response.data.status);
  //       if (!response.data.status === "success") {
  //         throw new Error('Network response was not ok');
  //       }
  //       setData(response.data.data);
  //     } catch (error) {
  //       setError(error.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}
      >
        <Text>Error: {error}</Text>
      </View>
    );
  }
  const renderItem = ({ item }) => {
    return (
      item.status === "1" && item.app_icon != null ? (
        <View style={styles.service_box}
          onStartShouldSetResponder={() => true}
          onResponderGrant={() => {
            // console.log(item.service_code);
            navigation.navigate('Details', { 
              "service_code": item.service_code, 
              "app_icon": item.app_icon, 
            });


          }}
        >
          <Image
            source={{ uri: `https://righten.in/public/admin/assets/img/service_icon/${item.app_icon}` }}
            style={styles.service_image}
          />
          {/* <Text>{item.service_name}</Text> */}
        </View>
      ) : null
    )
  };

  return (
    <View style={styles.service_image_container}>
      <StatusBar
        // barStyle="light-content" // Light text for dark backgrounds
        backgroundColor="#06b4d6"
      />

      <View style={{ marginTop: 30 }}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          columnWrapperStyle={styles.service_row}
        />

      </View>


    </View>

  )
}

export default HomeScreen;

const styles = StyleSheet.create({
  service_image_container: {
    backgroundColor: '#fff',
    flex: 1,
    // marginLeft: 14,
    // marginRight: 14,
    // marginTop: 30,

  },
  service_row: {
    width: "100%",
    justifyContent: 'center',
    alignItems: "center",
    flex: 1,

  },
  service_box: {
    justifyContent: 'center',
    width: (width - 0) / 3 - 28,
    height: (width - 0) / 3 - 28,
    margin: 5,
    borderWidth: 2,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    justifyContent: 'center',
    borderColor: '#FFCB0A'
  },
  service_image: {
    height: '90%',
    width: '90%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
})


