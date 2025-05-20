// import { getMessaging, getToken, onMessage } from "firebase/messaging";
// import notifee from "@notifee/react-native";

// export async function requestUserPermission() {
//     try {
//         const messaging = getMessaging();
//         const permission = await Notification.requestPermission();
//         if (permission === "granted") {
//             console.log("Notification permission granted.");
//             await getFCMToken();
//         }
//     } catch (error) {
//         console.error("Permission Error:", error);
//     }
// }

// export async function getFCMToken() {
//     try {
//         const messaging = getMessaging();
//         const token = await getToken(messaging);
//         console.log("FCM Token:", token);
//     } catch (error) {
//         console.error("FCM Token Fetch Error:", error);
//     }
// }

// // Setup Notification Listeners
// export function setupNotificationListeners() {
//     const messaging = getMessaging();
//     onMessage(messaging, async (remoteMessage) => {
//         console.log("Foreground Notification:", remoteMessage);
        
//         await notifee.displayNotification({
//             title: remoteMessage.notification?.title || "New Notification",
//             body: remoteMessage.notification?.body || "You have a new message",
//             android: {
//                 channelId: "default",
//                 smallIcon: "ic_launcher",
//                 pressAction: {
//                     id: "default",
//                 },
//                 largeIcon: remoteMessage.notification?.android?.imageUrl,
//             },
//         });
//     });
// }
