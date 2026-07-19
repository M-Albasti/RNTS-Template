package com.rnts.template.quran

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
 * Home-screen Quran controls: shows current ayah and media-player controls.
 * Buttons emit to JS when the RN bridge is alive; otherwise they deep-link into the app.
 */
class QuranAudioWidgetProvider : AppWidgetProvider() {

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
    val module = QuranWidgetModule.instance
    if (module != null) {
      module.emitAction(action)
    } else {
      val prefs = context.getSharedPreferences(QuranWidgetModule.PREFS, Context.MODE_PRIVATE)
      val surah = prefs.getInt(QuranWidgetModule.KEY_SURAH, 1)
      val ayah = prefs.getInt(QuranWidgetModule.KEY_AYAH, 1)
      val deepLink = if (action == "open") {
        "projectdeeplink://quran/open?surah=$surah&ayah=$ayah"
      } else {
        "projectdeeplink://quran/$action"
      }
      val launch = Intent(context, MainActivity::class.java).apply {
        flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP
        data = Uri.parse(deepLink)
      }
      context.startActivity(launch)
    }
    val manager = AppWidgetManager.getInstance(context)
    val ids = manager.getAppWidgetIds(
      android.content.ComponentName(context, QuranAudioWidgetProvider::class.java),
    )
    onUpdate(context, manager, ids)
  }

  companion object {
    const val EXTRA_ACTION = "quran_widget_action"
    const val ACTION_WIDGET = "com.rnts.template.QURAN_WIDGET_ACTION"

    fun updateAppWidget(context: Context, appWidgetManager: AppWidgetManager, appWidgetId: Int) {
      val prefs = context.getSharedPreferences(QuranWidgetModule.PREFS, Context.MODE_PRIVATE)
      val title = prefs.getString(QuranWidgetModule.KEY_TITLE, "Quran") ?: "Quran"
      val ayah = prefs.getInt(QuranWidgetModule.KEY_AYAH, 1)
      val playing = prefs.getBoolean(QuranWidgetModule.KEY_PLAYING, false)
      val isRepeat = prefs.getBoolean(QuranWidgetModule.KEY_REPEAT, false)

      val views = RemoteViews(context.packageName, R.layout.quran_audio_widget)
      views.setTextViewText(R.id.quran_widget_title, title)
      views.setTextViewText(R.id.quran_widget_subtitle, "Ayah $ayah")
      views.setImageViewResource(
        R.id.quran_widget_play,
        if (playing) R.drawable.ic_widget_pause else R.drawable.ic_widget_play,
      )
      views.setContentDescription(
        R.id.quran_widget_play,
        if (playing) {
          context.getString(R.string.quran_widget_pause)
        } else {
          context.getString(R.string.quran_widget_play)
        },
      )
      views.setImageViewResource(
        R.id.quran_widget_repeat,
        if (isRepeat) R.drawable.ic_widget_repeat_on else R.drawable.ic_widget_repeat,
      )

      views.setOnClickPendingIntent(
        R.id.quran_widget_title,
        actionPendingIntent(context, "open", appWidgetId, 0),
      )
      views.setOnClickPendingIntent(
        R.id.quran_widget_prev,
        actionPendingIntent(context, "prev", appWidgetId, 1),
      )
      views.setOnClickPendingIntent(
        R.id.quran_widget_play,
        actionPendingIntent(context, if (playing) "pause" else "play", appWidgetId, 2),
      )
      views.setOnClickPendingIntent(
        R.id.quran_widget_next,
        actionPendingIntent(context, "next", appWidgetId, 3),
      )
      views.setOnClickPendingIntent(
        R.id.quran_widget_repeat,
        actionPendingIntent(context, "repeat", appWidgetId, 4),
      )
      views.setOnClickPendingIntent(
        R.id.quran_widget_stop,
        actionPendingIntent(context, "stop", appWidgetId, 5),
      )

      appWidgetManager.updateAppWidget(appWidgetId, views)
    }

    private fun actionPendingIntent(
      context: Context,
      action: String,
      appWidgetId: Int,
      requestCode: Int,
    ): PendingIntent {
      val intent = Intent(context, QuranAudioWidgetProvider::class.java).apply {
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
