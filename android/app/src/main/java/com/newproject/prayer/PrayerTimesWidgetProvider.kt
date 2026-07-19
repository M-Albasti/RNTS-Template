package com.rnts.template.prayer

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.RemoteViews
import com.rnts.template.MainActivity
import com.rnts.template.R

/**
 * Home-screen prayer times: next prayer, countdown, daily schedule, remind/open actions.
 */
class PrayerTimesWidgetProvider : AppWidgetProvider() {

  override fun onUpdate(
    context: Context,
    appWidgetManager: AppWidgetManager,
    appWidgetIds: IntArray,
  ) {
    for (id in appWidgetIds) {
      updateAppWidget(context, appWidgetManager, id)
    }
  }

  override fun onReceive(context: Context, intent: Intent) {
    super.onReceive(context, intent)
    val action = intent.getStringExtra(EXTRA_ACTION) ?: return
    val module = PrayerWidgetModule.instance
    if (module != null) {
      module.emitAction(action)
    } else {
      val prefs = context.getSharedPreferences(PrayerWidgetModule.PREFS, Context.MODE_PRIVATE)
      val nextKey = prefs.getString(PrayerWidgetModule.KEY_NEXT_PRAYER_KEY, "") ?: ""
      val deepLink = when (action) {
        "remind" -> {
          if (nextKey.isNotEmpty()) {
            "projectdeeplink://prayer/remind/$nextKey"
          } else {
            "projectdeeplink://prayer/remind"
          }
        }
        "open" -> "projectdeeplink://prayer/open"
        else -> "projectdeeplink://prayer/$action"
      }
      val launch = Intent(context, MainActivity::class.java).apply {
        flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP
        data = Uri.parse(deepLink)
      }
      context.startActivity(launch)
    }
    val manager = AppWidgetManager.getInstance(context)
    val ids = manager.getAppWidgetIds(
      android.content.ComponentName(context, PrayerTimesWidgetProvider::class.java),
    )
    onUpdate(context, manager, ids)
  }

  companion object {
    const val EXTRA_ACTION = "prayer_widget_action"
    const val ACTION_WIDGET = "com.rnts.template.PRAYER_WIDGET_ACTION"

    fun updateAppWidget(context: Context, appWidgetManager: AppWidgetManager, appWidgetId: Int) {
      val prefs = context.getSharedPreferences(PrayerWidgetModule.PREFS, Context.MODE_PRIVATE)
      val location = prefs.getString(PrayerWidgetModule.KEY_LOCATION, "Location") ?: "Location"
      val timezone = prefs.getString(PrayerWidgetModule.KEY_TIMEZONE, "") ?: ""
      val nextName = prefs.getString(PrayerWidgetModule.KEY_NEXT_PRAYER_NAME, "") ?: ""
      val nextTime = prefs.getString(PrayerWidgetModule.KEY_NEXT_PRAYER_TIME, "") ?: ""
      val countdown = prefs.getString(PrayerWidgetModule.KEY_COUNTDOWN, "--") ?: "--"
      val reminderEnabled = prefs.getBoolean(PrayerWidgetModule.KEY_REMINDER_ENABLED, false)

      val nextLabel = when {
        nextName.isNotEmpty() && nextTime.isNotEmpty() -> "$nextName · $nextTime"
        nextName.isNotEmpty() -> nextName
        else -> context.getString(R.string.prayer_widget_name)
      }

      val views = RemoteViews(context.packageName, R.layout.prayer_times_widget)
      views.setTextViewText(R.id.prayer_widget_location, location.ifEmpty { "Location" })
      views.setTextViewText(R.id.prayer_widget_timezone, timezone)
      views.setTextViewText(R.id.prayer_widget_next, nextLabel)
      views.setTextViewText(R.id.prayer_widget_countdown, countdown)
      views.setTextViewText(
        R.id.prayer_widget_fajr,
        prefs.getString(PrayerWidgetModule.KEY_FAJR, "--") ?: "--",
      )
      views.setTextViewText(
        R.id.prayer_widget_dhuhr,
        prefs.getString(PrayerWidgetModule.KEY_DHUHR, "--") ?: "--",
      )
      views.setTextViewText(
        R.id.prayer_widget_asr,
        prefs.getString(PrayerWidgetModule.KEY_ASR, "--") ?: "--",
      )
      views.setTextViewText(
        R.id.prayer_widget_maghrib,
        prefs.getString(PrayerWidgetModule.KEY_MAGHRIB, "--") ?: "--",
      )
      views.setTextViewText(
        R.id.prayer_widget_isha,
        prefs.getString(PrayerWidgetModule.KEY_ISHA, "--") ?: "--",
      )
      views.setTextViewText(
        R.id.prayer_widget_remind,
        if (reminderEnabled) {
          context.getString(R.string.prayer_widget_remind) + " · on"
        } else {
          context.getString(R.string.prayer_widget_remind)
        },
      )

      views.setOnClickPendingIntent(
        R.id.prayer_widget_remind,
        actionPendingIntent(context, "remind", appWidgetId, 1),
      )
      views.setOnClickPendingIntent(
        R.id.prayer_widget_open,
        actionPendingIntent(context, "open", appWidgetId, 2),
      )

      appWidgetManager.updateAppWidget(appWidgetId, views)
    }

    private fun actionPendingIntent(
      context: Context,
      action: String,
      appWidgetId: Int,
      requestCode: Int,
    ): PendingIntent {
      val intent = Intent(context, PrayerTimesWidgetProvider::class.java).apply {
        this.action = ACTION_WIDGET
        putExtra(EXTRA_ACTION, action)
        putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId)
      }
      return PendingIntent.getBroadcast(
        context,
        requestCode + appWidgetId * 10,
        intent,
        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
      )
    }
  }
}
