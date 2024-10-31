import { LogBox, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SvgXml } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import profileicon from '../../assets/images/profileicon.jpg'
const Profile = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const us_id = await AsyncStorage.getItem('us_id');
        if(!us_id){
          navigation.navigate('LoginScreen'); 
          return ;
        }
        console.log(us_id,"clicked");
        // navigation.navigate('LoginScreen');

        try {
          const response = await axios.get(`https://righten.in/api/users/profile?user_id=${us_id}`);
          console.log(response.data);
          if (!response.data.status === "success") {
            throw new Error('Network response was not ok');
          }
          setData(response.data.data);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // fetchData();
    // const fetchUserData = async () => {

    // };

    // fetchUserData();
    const refreashdata = navigation.addListener('focus', fetchData);

    return refreashdata;
  }, [navigation]);

  const removeStoredItems = async () => {
    try {

      // Define the keys to be removed
      const keysToRemove = ['userEmail', 'userPassword', 'us_id'];


      // Use Promise.all to remove all keys in parallel
      await Promise.all(keysToRemove.map(key => AsyncStorage.removeItem(key)));
      setData([]);
      console.log("data removed");
      navigation.navigate('LoginScreen');
    } catch (error) {
      navigation.navigate('LoginScreen');
    }
  };

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
  return (
    data && data.user_id?

    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View style={styles.upper_circle}>
          <View style={styles.inner_circle}>
            {data.icon === null ?
              <Image
                source={profileicon}
                style={{
                  width: 175,
                  height: 175,
                  alignItems: 'center',
                  alignSelf: 'center',
                  justifyContent: 'center',
                  borderRadius: 500

                }}
              />
              : 
              <Image
                source={{uri: `https://righten.in/public/admin/assets/img/users/profile/${data.icon}`}}
                style={{
                  width: 175,
                  height: 175,
                  alignItems: 'center',
                  alignSelf: 'center',
                  justifyContent: 'center',
                  borderRadius: 500,
                  zIndex:1

                }}
              />
            }
            {/* <Text>hello</Text> */}
          </View>
        </View>

        <View style={styles.upper_box}>
          <View style={styles.row}>
            <SvgXml
              xml={`<svg width="30px" height="30px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#FFCB0A"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>profile_round [#1342]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-140.000000, -2159.000000)" fill="#FFCB0A"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M100.562548,2016.99998 L87.4381713,2016.99998 C86.7317804,2016.99998 86.2101535,2016.30298 86.4765813,2015.66198 C87.7127655,2012.69798 90.6169306,2010.99998 93.9998492,2010.99998 C97.3837885,2010.99998 100.287954,2012.69798 101.524138,2015.66198 C101.790566,2016.30298 101.268939,2016.99998 100.562548,2016.99998 M89.9166645,2004.99998 C89.9166645,2002.79398 91.7489936,2000.99998 93.9998492,2000.99998 C96.2517256,2000.99998 98.0830339,2002.79398 98.0830339,2004.99998 C98.0830339,2007.20598 96.2517256,2008.99998 93.9998492,2008.99998 C91.7489936,2008.99998 89.9166645,2007.20598 89.9166645,2004.99998 M103.955674,2016.63598 C103.213556,2013.27698 100.892265,2010.79798 97.837022,2009.67298 C99.4560048,2008.39598 100.400241,2006.33098 100.053171,2004.06998 C99.6509769,2001.44698 97.4235996,1999.34798 94.7348224,1999.04198 C91.0232075,1998.61898 87.8750721,2001.44898 87.8750721,2004.99998 C87.8750721,2006.88998 88.7692896,2008.57398 90.1636971,2009.67298 C87.1074334,2010.79798 84.7871636,2013.27698 84.044024,2016.63598 C83.7745338,2017.85698 84.7789973,2018.99998 86.0539717,2018.99998 L101.945727,2018.99998 C103.221722,2018.99998 104.226185,2017.85698 103.955674,2016.63598" id="profile_round-[#1342]"> </path> </g> </g> </g> </g></svg>`}
            />
            <Text style={styles.profileText}>{data.name}</Text>
          </View>
          <View style={styles.row}>
            <SvgXml xml={`<svg viewBox="0 0 48 48" width=30 height=30 xmlns="http://www.w3.org/2000/svg" fill="#FFCB0A"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>user-id</title> <g id="Layer_2" data-name="Layer 2"> <g id="invisible_box" data-name="invisible box"> <rect width="48" height="48" fill="none"></rect> </g> <g id="icons_Q2" data-name="icons Q2"> <g> <path d="M38,6H29.9V4a2,2,0,0,0-2-2h-8a2,2,0,0,0-2,2V6H10A2,2,0,0,0,8,8V44a2,2,0,0,0,2,2H38a2,2,0,0,0,2-2V8A2,2,0,0,0,38,6ZM36,42H12V39.2a24.1,24.1,0,0,1,24,0Zm0-7.3a28,28,0,0,0-24,0V10H22V6h4v4H36Z"></path> <path d="M16,22a8,8,0,1,0,8-8A8,8,0,0,0,16,22Zm12,0a4,4,0,1,1-4-4A4,4,0,0,1,28,22Z"></path> </g> </g> </g> </g></svg>`} />
            <Text style={styles.profileText}>{data.user_id}</Text>
          </View>
          <View style={styles.row}>
            <SvgXml
              xml={`<svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11 18H13M9.2 21H14.8C15.9201 21 16.4802 21 16.908 20.782C17.2843 20.5903 17.5903 20.2843 17.782 19.908C18 19.4802 18 18.9201 18 17.8V6.2C18 5.0799 18 4.51984 17.782 4.09202C17.5903 3.71569 17.2843 3.40973 16.908 3.21799C16.4802 3 15.9201 3 14.8 3H9.2C8.0799 3 7.51984 3 7.09202 3.21799C6.71569 3.40973 6.40973 3.71569 6.21799 4.09202C6 4.51984 6 5.07989 6 6.2V17.8C6 18.9201 6 19.4802 6.21799 19.908C6.40973 20.2843 6.71569 20.5903 7.09202 20.782C7.51984 21 8.07989 21 9.2 21Z" stroke="#FFCB0A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`}
            />
            <Text style={styles.profileText}>{data.mobile}</Text>
          </View>
          <View style={styles.row}>
            <SvgXml
              xml={`<svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 9.00005L10.2 13.65C11.2667 14.45 12.7333 14.45 13.8 13.65L20 9" stroke="#FFCB0A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M3 9.17681C3 8.45047 3.39378 7.78123 4.02871 7.42849L11.0287 3.5396C11.6328 3.20402 12.3672 3.20402 12.9713 3.5396L19.9713 7.42849C20.6062 7.78123 21 8.45047 21 9.17681V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V9.17681Z" stroke="#FFCB0A" stroke-width="2" stroke-linecap="round"></path> </g></svg>`} />
            <Text style={styles.profileText}>{data.email_id}</Text>
          </View>
          <View style={styles.row}>
            <SvgXml
              xml={`<svg fill="#FFCB0A" width="30px" height="30px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Layer_2" data-name="Layer 2"> <g id="Layer_1-2" data-name="Layer 1"> <path d="M8,8A4,4,0,1,0,4,4,4,4,0,0,0,8,8ZM8,1A3,3,0,1,1,5,4,3,3,0,0,1,8,1Zm4,7a4,4,0,1,0,4,4A4,4,0,0,0,12,8Zm0,7a3,3,0,1,1,2.27-4.94.54.54,0,0,0-.12.09L11.5,12.79l-.65-.64a.49.49,0,0,0-.7.7l1,1a.48.48,0,0,0,.7,0l2.94-2.93A3,3,0,0,1,15,12,3,3,0,0,1,12,15Zm-4,.5a.5.5,0,0,1-.5.5h-6A1.5,1.5,0,0,1,0,14.5,4.51,4.51,0,0,1,4.5,10h2a.5.5,0,0,1,0,1h-2A3.5,3.5,0,0,0,1,14.5a.5.5,0,0,0,.5.5h6A.5.5,0,0,1,8,15.5Z"></path> </g> </g> </g></svg>`} />
            {data.kyc === 'true' ?
              <Text style={styles.profileText}>✓ verified</Text>
              
              :  <Text style={[styles.profileText,{color:'red'}]}>X Not verified</Text>}
             


          </View>
        </View>

        <View style={styles.upper_box}>
          <View style={styles.row}>
            <SvgXml
              xml={`<svg width="30px" height="30px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="#FFCB0A" fill-rule="evenodd" d="M11.2 1.65a2 2 0 00-2.4 0L1.885 6.836a2.017 2.017 0 00-.783 1.907c.145.99.398 2.92.398 4.257 0 1.11-.175 2.638-.32 3.702C1.019 17.899 1.94 19 3.178 19h13.646c1.236 0 2.16-1.1 1.997-2.298-.145-1.064-.32-2.592-.32-3.702 0-1.337.253-3.268.398-4.257a2.017 2.017 0 00-.783-1.907L11.2 1.65zM3.085 8.436L10 3.25l6.915 5.186.001.001.002.003a.025.025 0 010 .013C16.776 9.435 16.5 11.5 16.5 13c0 1.258.193 2.903.338 3.97v.013a.035.035 0 01-.014.017H14v-5a4 4 0 00-8 0v5H3.176c-.001 0-.004-.002-.006-.005a.035.035 0 01-.007-.012.026.026 0 010-.012c.144-1.068.337-2.713.337-3.971 0-1.5-.275-3.565-.419-4.547l.001-.013.003-.004zM8 17h4v-5a2 2 0 10-4 0v5z"></path> </g></svg>`} />
            <Text style={styles.profileText}>{data.village}</Text>
          </View>
          <View style={styles.row}>
            <SvgXml
              xml={`<svg width="30px" height="30px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="#FFCB0A" fill-rule="evenodd" d="M11.2 1.65a2 2 0 00-2.4 0L1.885 6.836a2.017 2.017 0 00-.783 1.907c.145.99.398 2.92.398 4.257 0 1.11-.175 2.638-.32 3.702C1.019 17.899 1.94 19 3.178 19h13.646c1.236 0 2.16-1.1 1.997-2.298-.145-1.064-.32-2.592-.32-3.702 0-1.337.253-3.268.398-4.257a2.017 2.017 0 00-.783-1.907L11.2 1.65zM3.085 8.436L10 3.25l6.915 5.186.001.001.002.003a.025.025 0 010 .013C16.776 9.435 16.5 11.5 16.5 13c0 1.258.193 2.903.338 3.97v.013a.035.035 0 01-.014.017H14v-5a4 4 0 00-8 0v5H3.176c-.001 0-.004-.002-.006-.005a.035.035 0 01-.007-.012.026.026 0 010-.012c.144-1.068.337-2.713.337-3.971 0-1.5-.275-3.565-.419-4.547l.001-.013.003-.004zM8 17h4v-5a2 2 0 10-4 0v5z"></path> </g></svg>`} />
            <Text style={styles.profileText}>{data.block}</Text>
          </View>
          <View style={styles.row}>
            <SvgXml
              xml={`<svg width="30px" height="30px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="#FFCB0A" fill-rule="evenodd" d="M11.2 1.65a2 2 0 00-2.4 0L1.885 6.836a2.017 2.017 0 00-.783 1.907c.145.99.398 2.92.398 4.257 0 1.11-.175 2.638-.32 3.702C1.019 17.899 1.94 19 3.178 19h13.646c1.236 0 2.16-1.1 1.997-2.298-.145-1.064-.32-2.592-.32-3.702 0-1.337.253-3.268.398-4.257a2.017 2.017 0 00-.783-1.907L11.2 1.65zM3.085 8.436L10 3.25l6.915 5.186.001.001.002.003a.025.025 0 010 .013C16.776 9.435 16.5 11.5 16.5 13c0 1.258.193 2.903.338 3.97v.013a.035.035 0 01-.014.017H14v-5a4 4 0 00-8 0v5H3.176c-.001 0-.004-.002-.006-.005a.035.035 0 01-.007-.012.026.026 0 010-.012c.144-1.068.337-2.713.337-3.971 0-1.5-.275-3.565-.419-4.547l.001-.013.003-.004zM8 17h4v-5a2 2 0 10-4 0v5z"></path> </g></svg>`} />
            <Text style={styles.profileText}>{data.city}</Text>
          </View>
          <View style={styles.row}>
            <SvgXml
              xml={`<svg fill="#FFCB0A" width="30px" height="30px" viewBox="0 0 100.00 100.00" xmlns="http://www.w3.org/2000/svg" stroke="#FFCB0A" stroke-width="10"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M49,18.92A23.74,23.74,0,0,0,25.27,42.77c0,16.48,17,31.59,22.23,35.59a2.45,2.45,0,0,0,3.12,0c5.24-4.12,22.1-19.11,22.1-35.59A23.74,23.74,0,0,0,49,18.92Zm0,33.71a10,10,0,1,1,10-10A10,10,0,0,1,49,52.63Z"></path></g></svg>`}
            />
            <Text style={styles.profileText}>{data.post_office}</Text>
          </View>
          <View style={styles.row}>
            <SvgXml
              xml={`<svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3 19H21M12 12V19M18 12V19M6 12V19M12.4472 3.22361L20.59 7.29502C21.4395 7.71974 21.1372 9 20.1875 9H3.81246C2.86276 9 2.56053 7.71974 3.40997 7.29502L11.5528 3.22361C11.8343 3.08284 12.1657 3.08284 12.4472 3.22361Z" stroke="#FFCB0A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`} />
            <Text style={styles.profileText}>{data.state}</Text>
          </View>
          <View style={styles.row}>
            <SvgXml
              xml={`<svg fill="#FFCB0A" width="30px" height="30px" viewBox="0 0 100.00 100.00" xmlns="http://www.w3.org/2000/svg" stroke="#FFCB0A" stroke-width="10"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M49,18.92A23.74,23.74,0,0,0,25.27,42.77c0,16.48,17,31.59,22.23,35.59a2.45,2.45,0,0,0,3.12,0c5.24-4.12,22.1-19.11,22.1-35.59A23.74,23.74,0,0,0,49,18.92Zm0,33.71a10,10,0,1,1,10-10A10,10,0,0,1,49,52.63Z"></path></g></svg>`}
            />
            <Text style={styles.profileText}>{data.pin_code}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={removeStoredItems}>
          <View style={{
            backgroundColor: '#fff', marginLeft: 20, marginRight: 20,
            marginTop: 10, flex: 1, flexDirection: 'row', borderWidth: 3,
            borderRadius: 10, borderColor: 'black',
            justifyContent: 'center',
          }}>

            <SvgXml
              xml={`<svg width="50px" height="50px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M13 12H22M22 12L18.6667 8M22 12L18.6667 16" stroke="#FF0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M14 7V5.1736C14 4.00352 12.9999 3.08334 11.8339 3.18051L3.83391 3.84717C2.79732 3.93356 2 4.80009 2 5.84027V18.1597C2 19.1999 2.79733 20.0664 3.83391 20.1528L11.8339 20.8195C12.9999 20.9167 14 19.9965 14 18.8264V17" stroke="#FF0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`}
              style={{ position: 'relative', justifyContent: 'flex-start' }}
            />

            <Text style={{
              fontSize: 30,
              fontWeight: 'bold',
              fontFamily: 'BAHUS93',
              color: '#FF0000',
              textAlign: 'center',
            }}>Log Out</Text>
          </View>
        </TouchableOpacity>

      </View>
    </ScrollView>
    :
    null
  )
}

export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexGrow: 1,

    backgroundColor: '#fff',
    // padding: 16,
  },
  upper_circle: {
    backgroundColor: '#d9d9d9',
    height: 180,
    borderBottomLeftRadius: 1000,
    borderBottomRightRadius: 1000,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 10
  },
  inner_circle: {
    // backgroundColor: 'gray',
    height: '100%',
    width: undefined,
    aspectRatio: 1,
    // width: '42%',
    borderWidth: 4,
    borderColor: '#FFCB0A',
    borderTopLeftRadius: 500,
    borderTopRightRadius: 500,
    borderBottomLeftRadius: 500,
    borderBottomRightRadius: 500,
    justifyContent: 'center'

  },
  upper_box: {
    marginTop: 10,
    borderWidth: 2,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 15,
    paddingVertical: 10
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center', // Ensure items are vertically centered
    marginLeft: 10,
    marginRight: 20,
    paddingVertical: 2

  },
  profileText: {
    color: '#009743',
    marginLeft: 16, // Add some space between the icon and text
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'BAHUS93'
  },
  lower_box: {
    // Your styles for the lower box
  },
})