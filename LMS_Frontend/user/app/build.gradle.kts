plugins {
    alias(libs.plugins.android.application)
}

android {
    namespace = "com.example.user"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.example.user"
        minSdk = 24
        targetSdk = 36
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
}

dependencies {

    implementation(libs.appcompat)
    implementation(libs.material)
    implementation(libs.activity)
    implementation(libs.constraintlayout)
    testImplementation(libs.junit)
    androidTestImplementation(libs.ext.junit)
    androidTestImplementation(libs.espresso.core)

    // Use the stable version of Retrofit
    implementation("com.squareup.retrofit2:retrofit:2.9.0")

// Use the specific Gson converter for Retrofit
    implementation("com.squareup.retrofit2:converter-gson:2.9.0")

// OkHttp is included by Retrofit, but adding it explicitly is good practice
    implementation("com.squareup.okhttp3:okhttp:5.1.0")

    //lombok
    compileOnly("org.projectlombok:lombok:1.18.38")
    annotationProcessor("org.projectlombok:lombok:1.18.38")

    //meterial UI
    implementation("com.google.android.material:material:1.12.0")
}