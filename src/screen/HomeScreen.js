import { StyleSheet, Text, View,BackHandler, Alert, StatusBar, ActivityIndicator, RefreshControl, ScrollView, Animated, FlatList, Dimensions, Image, TouchableOpacity } from 'react-native';
import React, { useState, useEffect,useCallback } from 'react';
import axios from 'axios';
//import Carousel from 'react-native-snap-carousel';
import { useNavigationState } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
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


  const fetchData = async () => {
    try {
      const response = await axios.get('https://righten.in/api/users/services');
      console.log(response.data.status);
      if (response.data.status !== "success") {
        throw new Error('Network response was not ok');
      }
      setData(response.data.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false); // Ensure refreshing is stopped even if an error occurs
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
  };
  

  useEffect(() => {
    fetchData();
  }, []);


  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading services...</Text>

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
  // const renderItem = ({ item }) => {
  //   return (
  //     item.status === "1" && item.app_icon != null ? (
  //       <View style={styles.service_box}
  //         onStartShouldSetResponder={() => true}
  //         onResponderGrant={() => {
  //           // console.log(item.service_code);
  //           navigation.navigate('Details', { 
  //             "service_code": item.service_code, 
  //             "app_icon": item.app_icon, 
  //           });


  //         }}
  //       >
  //         <Image
  //           source={{ uri: `https://righten.in/public/admin/assets/img/service_icon/${item.app_icon}` }}
  //           style={styles.service_image}
  //         />
  //         {/* <Text>{item.service_name}</Text> */}
  //       </View>
  //     ) : null
  //   )
  // };

  const highlightServiceCodes = ['code1', 'code2'];
  const renderItem = ({ item }) => {
  const isHighlighted = highlightServiceCodes.includes(item.service_code);
  
    return (
      
      item.status === "1" && item.app_icon != null ? (
        <TouchableOpacity
          style={[styles.serviceBox, isHighlighted && styles.highlightedServiceBox]}
          onPress={() => {
            navigation.navigate('Details', {
              "service_id": item.id,
              "app_icon": item.app_icon,
              "service_code": item.service_code,
            });
          }}

        >
          <Image
            source={{ uri: `https://righten.in/public/admin/assets/img/service_icon/${item.app_icon}` }}
            style={styles.serviceImage}
          />
          <Text style={styles.serviceName}>{item.service_name}</Text>
          <Text style={styles.serviceDescription}>{item.description}</Text>
        </TouchableOpacity>
      ) : null
      
    );
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
          columnWrapperStyle={styles.serviceRow}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />

      </View>


    </View>

  )
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9f9f9',
    flex: 1,
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#ff4d4d',
    fontSize: 16,
  },
  serviceRow: {
    justifyContent: 'space-between',
    margin: 5,
    padding: 5,
  },
  serviceBox: {
    justifyContent: 'center',
    width: (width - 50) / 3,
    height: (width - 130) / 5 + 25,
    marginVertical: 0,
    marginHorizontal: 0,
    borderWidth: 2,
    borderColor: '#009743',
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#009743',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    marginTop: 5,
  },
  highlightedServiceBox: {
    borderColor: '#FF5722',
    backgroundColor: '#ffe0b2',
    elevation: 6,
    shadowOpacity: 0.5,
  },
  serviceImage: {
    height: '100%',
    width: '60%',
    alignSelf: 'center',
    marginTop: 20,
  },
  serviceName: {
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: 'bold',
    fontSize:11,
    color: '#000000',
  },
  serviceDescription: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  flatListContent: {
    paddingBottom: 10,
  },
  carouselContainer: {
    alignItems: 'center',
    marginLeft:15,
  },
  sliderImage: {
    width: '96%',
    height: 133,
    borderRadius: 13,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 7,
    marginHorizontal: 3,
    backgroundColor: '#C4C4C4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  activeDot: {
    backgroundColor: '#FFCB0A',
    width: 13,
    height: 13,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    transform: [{ scale: 1.2 }],
  },
  inactiveDot: {
    backgroundColor: '#009743',
    opacity: 0.7,
  },
});

