package com.rnts.template.quran

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.modules.core.DeviceEventManagerModule

/**
 * Bridges JS Quran playback state ↔ Android home-screen widget.
 */
class QuranWidgetModule(
  private val reactContext: ReactApplicationContext,
) : ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "QuranWidgetModule"

  @ReactMethod
  fun updateWidget(payload: ReadableMap) {
    val prefs = reactContext.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
    prefs.edit()
      .putInt(KEY_SURAH, if (payload.hasKey("surahNumber")) payload.getInt("surahNumber") else 1)
      .putInt(KEY_AYAH, if (payload.hasKey("ayahNumber")) payload.getInt("ayahNumber") else 1)
      .putBoolean(KEY_PLAYING, payload.hasKey("isPlaying") && payload.getBoolean("isPlaying"))
      .putString(KEY_TITLE, if (payload.hasKey("title")) payload.getString("title") else "Quran")
      .apply()

    val manager = AppWidgetManager.getInstance(reactContext)
    val ids = manager.getAppWidgetIds(ComponentName(reactContext, QuranAudioWidgetProvider::class.java))
    if (ids.isEmpty()) {
      return
    }
    val intent = Intent(reactContext, QuranAudioWidgetProvider::class.java).apply {
      action = AppWidgetManager.ACTION_APPWIDGET_UPDATE
      putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids)
    }
    reactContext.sendBroadcast(intent)
  }

  @ReactMethod
  fun addListener(eventName: String?) {
    // Required for NativeEventEmitter
  }

  @ReactMethod
  fun removeListeners(count: Int) {
    // Required for NativeEventEmitter
  }

  fun emitAction(action: String) {
    if (!reactContext.hasActiveReactInstance()) {
      return
    }
    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit("QuranWidgetAction", com.facebook.react.bridge.Arguments.createMap().apply {
        putString("action", action)
      })
  }

  companion object {
    const val PREFS = "quran_widget_prefs"
    const val KEY_SURAH = "surahNumber"
    const val KEY_AYAH = "ayahNumber"
    const val KEY_PLAYING = "isPlaying"
    const val KEY_TITLE = "title"

    @Volatile
    var instance: QuranWidgetModule? = null
  }

  init {
    instance = this
  }
}
