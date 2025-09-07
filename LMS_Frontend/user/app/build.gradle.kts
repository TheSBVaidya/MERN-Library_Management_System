plugins {
    alias(libs.plugins.android.application)
}

android {
    namespace = "com.example.user"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.example.user"
        minSdk = 26
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

    coreLibraryDesugaring ("com.android.tools:desugar_jdk_libs:2.0.4")

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
    implementation("com.squareup.okhttp3:logging-interceptor:4.12.0")

    //lombok
    compileOnly("org.projectlombok:lombok:1.18.38")
    annotationProcessor("org.projectlombok:lombok:1.18.38")

}