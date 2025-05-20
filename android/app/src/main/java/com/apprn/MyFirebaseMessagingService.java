// package com.righten;

// import android.app.NotificationChannel;
// import android.app.NotificationManager;
// import android.app.PendingIntent;
// import android.content.Context;
// import android.content.Intent;
// import android.os.Build;
// import android.util.Log;
// import androidx.annotation.NonNull;
// import androidx.core.app.NotificationCompat;
// import com.google.firebase.messaging.FirebaseMessagingService;
// import com.google.firebase.messaging.RemoteMessage;

// public class MyFirebaseMessagingService extends FirebaseMessagingService {

//     private static final String TAG = "MyFirebaseMsgService";
//     private static final String CHANNEL_ID = "RightEn_Channel";

//     @Override
//     public void onMessageReceived(@NonNull RemoteMessage remoteMessage) {
//         Log.d(TAG, "Message received: " + remoteMessage.getData());

//         if (remoteMessage.getNotification() != null) {
//             sendNotification(remoteMessage.getNotification().getTitle(), remoteMessage.getNotification().getBody());
//         }
//     }

//     private void sendNotification(String title, String messageBody) {
//         NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);

//         if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
//             NotificationChannel channel = new NotificationChannel(CHANNEL_ID, "RightEn Notifications",
//                     NotificationManager.IMPORTANCE_HIGH);
//             notificationManager.createNotificationChannel(channel);
//         }

//         NotificationCompat.Builder notificationBuilder = new NotificationCompat.Builder(this, CHANNEL_ID)
//                 .setSmallIcon(R.mipmap.ic_launcher)
//                 .setContentTitle(title)
//                 .setContentText(messageBody)
//                 .setAutoCancel(true)
//                 .setPriority(NotificationCompat.PRIORITY_HIGH);

//         notificationManager.notify(0, notificationBuilder.build());
//     }
// }
