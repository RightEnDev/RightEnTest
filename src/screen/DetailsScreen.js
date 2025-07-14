import { StyleSheet, Text, View, ActivityIndicator,FlatList,Dimensions ,Image, TouchableOpacity, Animated} from 'react-native'
import React, { useState, useEffect,useRef } from 'react';
import axios from 'axios';
const { width } = Dimensions.get('window');
import { BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';

const DetailsScreen = ({ route ,navigation}) => {
  const isFocused = useIsFocused();

  const { service_code,app_icon } = route.params;
  // console.log(service_code);
  // console.log(app_icon);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;


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

  useFocusEffect(
    React.useCallback(() => {
      // Reset the state when the screen is unfocused
      return () => {
        setData([]);
        setLoading(true);
        setError(null);
        // console.log("data reset done ---------------------------------- ");
        // fetchData();

      };
    }, [])
  );

  const fetchData = async () => {
    try {
      setLoading(true);

      setData([]);
      const response = await axios.get(`https://righten.in/api/users/services/sub_service?service_code=${service_code}`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
      // console.log(response.data);
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
  useEffect(() => {
    // console.log("trying");
    fetchData();
  }, [isFocused]);

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
      <TouchableOpacity 
        onPress={() => navigation.navigate('ServiceForm', { 
          "service_code": service_code, 
          "service_data": item, 
          "app_icon": app_icon 
        })}
      >
        <Animated.View style={[styles.cardContainer, { transform: [{ scale: scaleAnim }] }]}>
          
          {/* Left Side - Icon */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: `https://righten.in/public/admin/assets/img/service_icon/${app_icon}` }}
              style={styles.image}
              resizeMode="cover"
              onError={(e) => console.log("Image Load Error:", e.nativeEvent.error)}
            />
          </View>
  
          {/* Middle - Service Name */}
          <View style={styles.textContainer}>
            <Text style={styles.serviceName}>{item.name}</Text>
          </View>
  
          {/* Right Side - Price */}
          <Text style={styles.servicePrice}>₹{item.offer_price}</Text>
  
        </Animated.View>
      </TouchableOpacity>
    );
  };
  
  
  

  return (
    <View  style={styles.container}>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={1} // 3 cards per row
        contentContainerStyle={styles.gridContainer}
      />
    </View>

  )
}

export default DetailsScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },

  gridContainer: {
    paddingBottom: 10,
  },

  cardContainer: {
    flexDirection: "row", // ✅ Horizontal layout
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    marginVertical: 3,
    padding: 10,
    margin:1,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },

  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    marginRight: 10, // ✅ Space between icon and text
  },

  image: {
    width: "100%",
    height: "100%",
  },

  textContainer: {
    flex: 1, // ✅ Takes available space in the center
  },

  serviceName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },

  servicePrice: {
    fontSize: 20,
    color: "#f57c00",
    fontWeight: "bold",
    textAlign: "right", // ✅ Align price to the right
    minWidth: 60, // ✅ Ensure it doesn't shrink
  },
});


