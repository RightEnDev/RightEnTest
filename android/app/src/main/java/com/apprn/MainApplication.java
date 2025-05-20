package com.righten;

import com.reactnativecompressor.CompressorPackage;
import android.app.Application;
import android.os.Handler;
import android.os.Looper;
import android.widget.Toast;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.soloader.SoLoader;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;
import org.json.JSONObject;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new DefaultReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Add manually linked packages here
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }

        @Override
        protected boolean isNewArchEnabled() {
          return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
        }

        @Override
        protected Boolean isHermesEnabled() {
          return BuildConfig.IS_HERMES_ENABLED;
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      DefaultNewArchitectureEntryPoint.load();
    }
    ReactNativeFlipper.initializeFlipper(this, getReactNativeHost().getReactInstanceManager());

    // Perform the API check on app startup
    checkApiStatus();
  }

  private void checkApiStatus() {
    new Thread(() -> {
      try {
        // Define the API URL
        URL url = new URL("https://righten.in/api/app_access");
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("GET");

        // Get the response
        int responseCode = connection.getResponseCode();
        if (responseCode == 200) {
          InputStream inputStream = connection.getInputStream();
          BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
          StringBuilder response = new StringBuilder();
          String line;

          while ((line = reader.readLine()) != null) {
            response.append(line);
          }
          reader.close();

          // Parse the JSON response
          JSONObject jsonResponse = new JSONObject(response.toString());
          boolean isAppAllowed = jsonResponse.optBoolean("builddAPP", false);

          if (!isAppAllowed) {
            // Show a toast message and close the app if builddAPP is false
            new Handler(Looper.getMainLooper()).post(() -> {
              Toast.makeText(this, "App is unavailable. Please try again later.", Toast.LENGTH_LONG).show();
              new Handler().postDelayed(() -> System.exit(0), 2000); // Delay for user to see the message
            });
          }
        } else {
          // Handle non-200 response codes as failure
          handleApiFailure();
        }
      } catch (Exception e) {
        e.printStackTrace();
        // Handle any exceptions as failure
        handleApiFailure();
      }
    }).start();
  }

  private void handleApiFailure() {
    new Handler(Looper.getMainLooper()).post(() -> {
      Toast.makeText(this, "Unable to verify app status. Exiting.", Toast.LENGTH_LONG).show();
      new Handler().postDelayed(() -> System.exit(0), 2000); // Close app after showing message
    });
  }



}
