package com.rnts.template.prayer

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
 * Bridges JS prayer times state ↔ Android home-screen widget.
 */
class PrayerWidgetModule(
  private val reactContext: ReactApplicationContext,
) : ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "PrayerWidgetModule"

  @ReactMethod
  fun updateWidget(payload: ReadableMap) {
    val prefs = reactContext.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
    prefs.edit()
      .putString(KEY_LOCATION, stringOr(payload, "locationLabel", ""))
      .putString(KEY_TIMEZONE, stringOr(payload, "timezone", ""))
      .putString(KEY_NEXT_PRAYER_KEY, stringOr(payload, "nextPrayerKey", ""))
      .putString(KEY_NEXT_PRAYER_NAME, stringOr(payload, "nextPrayerName", ""))
      .putString(KEY_NEXT_PRAYER_TIME, stringOr(payload, "nextPrayerTime", ""))
      .putString(KEY_COUNTDOWN, stringOr(payload, "countdown", ""))
      .putString(KEY_FAJR, stringOr(payload, "fajr", "--"))
      .putString(KEY_DHUHR, stringOr(payload, "dhuhr", "--"))
      .putString(KEY_ASR, stringOr(payload, "asr", "--"))
      .putString(KEY_MAGHRIB, stringOr(payload, "maghrib", "--"))
      .putString(KEY_ISHA, stringOr(payload, "isha", "--"))
      .putBoolean(
        KEY_REMINDER_ENABLED,
        payload.hasKey("reminderEnabled") && payload.getBoolean("reminderEnabled"),
      )
      .apply()

    val manager = AppWidgetManager.getInstance(reactContext)
    val ids = manager.getAppWidgetIds(
      ComponentName(reactContext, PrayerTimesWidgetProvider::class.java),
    )
    if (ids.isEmpty()) {
      return
    }
    val intent = Intent(reactContext, PrayerTimesWidgetProvider::class.java).apply {
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
      .emit("PrayerWidgetAction", com.facebook.react.bridge.Arguments.createMap().apply {
        putString("action", action)
      })
  }

  companion object {
    const val PREFS = "prayer_widget_prefs"
    const val KEY_LOCATION = "locationLabel"
    const val KEY_TIMEZONE = "timezone"
    const val KEY_NEXT_PRAYER_KEY = "nextPrayerKey"
    const val KEY_NEXT_PRAYER_NAME = "nextPrayerName"
    const val KEY_NEXT_PRAYER_TIME = "nextPrayerTime"
    const val KEY_COUNTDOWN = "countdown"
    const val KEY_FAJR = "fajr"
    const val KEY_DHUHR = "dhuhr"
    const val KEY_ASR = "asr"
    const val KEY_MAGHRIB = "maghrib"
    const val KEY_ISHA = "isha"
    const val KEY_REMINDER_ENABLED = "reminderEnabled"

    @Volatile
    var instance: PrayerWidgetModule? = null

    private fun stringOr(payload: ReadableMap, key: String, fallback: String): String {
      if (!payload.hasKey(key) || payload.isNull(key)) {
        return fallback
      }
      return payload.getString(key) ?: fallback
    }
  }

  init {
    instance = this
  }
}
