import React from "react";
import { View, StyleSheet, AsyncStorage } from "react-native";
import { FontAwesome, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Notifications, Permissions } from "expo";
import { white, red, orange, lightPurp, pink, blue } from "./colors";

const NOTIFICATION_KEY = "Fitness:notifications";

const styles = StyleSheet.create({
  iconContainer: {
    padding: 5,
    borderRadius: 8,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20
  }
});

function getMetricMetaInfo(metric) {
  const info = {
    run: {
      displayName: "Run",
      max: 50,
      unit: "miles",
      step: 1,
      type: "steppers",
      getIcon() {
        return (
          <View style={[styles.iconContainer, { backgroundColor: red }]}>
            <MaterialIcons name="directions-run" size={35} color={white} />
          </View>
        );
      }
    },
    bike: {
      displayName: "Bike",
      max: 100,
      unit: "miles",
      step: 1,
      type: "steppers",
      getIcon() {
        return (
          <View style={[styles.iconContainer, { backgroundColor: orange }]}>
            <MaterialCommunityIcons name="bike" size={32} color={white} />
          </View>
        );
      }
    },
    swim: {
      displayName: "Swim",
      max: 9900,
      unit: "meters",
      step: 100,
      type: "steppers",
      getIcon() {
        return (
          <View style={[styles.iconContainer, { backgroundColor: blue }]}>
            <MaterialCommunityIcons name="swim" size={35} color={white} />
          </View>
        );
      }
    },
    sleep: {
      displayName: "Sleep",
      max: 24,
      unit: "hours",
      step: 1,
      type: "slider",
      getIcon() {
        return (
          <View style={[styles.iconContainer, { backgroundColor: lightPurp }]}>
            <FontAwesome name="bed" size={30} color={white} />
          </View>
        );
      }
    },
    eat: {
      displayName: "Eat",
      max: 10,
      unit: "rating",
      step: 1,
      type: "slider",
      getIcon() {
        return (
          <View style={[styles.iconContainer, { backgroundColor: pink }]}>
            <MaterialCommunityIcons name="food" size={35} color={white} />
          </View>
        );
      }
    }
  };

  return typeof metric === "undefined" ? info : info[metric];
}

function isBetween(num, x, y) {
  if (num >= x && num <= y) {
    return true;
  }

  return false;
}

function calculateDirection(heading) {
  let direction = "";

  if (isBetween(heading, 0, 22.5)) {
    direction = "North";
  } else if (isBetween(heading, 22.5, 67.5)) {
    direction = "North East";
  } else if (isBetween(heading, 67.5, 112.5)) {
    direction = "East";
  } else if (isBetween(heading, 112.5, 157.5)) {
    direction = "South East";
  } else if (isBetween(heading, 157.5, 202.5)) {
    direction = "South";
  } else if (isBetween(heading, 202.5, 247.5)) {
    direction = "South West";
  } else if (isBetween(heading, 247.5, 292.5)) {
    direction = "West";
  } else if (isBetween(heading, 292.5, 337.5)) {
    direction = "North West";
  } else if (isBetween(heading, 337.5, 360)) {
    direction = "North";
  } else {
    direction = "N/A";
  }

  return direction;
}

function timeToString(time = Date.now()) {
  const date = new Date(time);
  const todayUTC = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  return todayUTC.toISOString().split("T")[0];
}

function getDailyReminderValue() {
  return {
    today: "👋 Don't forget to log your data today!"
  };
}

function clearLocalNotifications() {
  return AsyncStorage.removeItem(NOTIFICATION_KEY).then(Notifications.cancelAllScheduledNotificationsAsync);
}

function createNotification() {
  return {
    title: "Log your stats",
    body: "👋 Don't forget to log your stats for today",
    ios: {
      sound: true
    },
    android: {
      sound: true,
      priority: "high",
      sticky: false,
      vibrate: true
    }
  };
}

function setLocalNotification() {
  AsyncStorage.getItem(NOTIFICATION_KEY)
    .then(JSON.parse)
    .then(data => {
      if (!data) {
        Permissions.askAsync(Permissions.NOTIFICATIONS).then(({ status }) => {
          if (status === "granted") {
            Notifications.cancelAllScheduledNotificationsAsync();

            const tmrw = new Date();
            tmrw.setDate(tmrw.getDate() + 1);
            tmrw.setHours(20);
            tmrw.setMinutes(0);

            Notifications.scheduleLocalNotificationAsync(createNotification(), { time: tmrw, repeat: "day" });

            AsyncStorage.setItem(NOTIFICATION_KEY, JSON.stringify(true));
          }
        });
      }
    });
}

export {
  getMetricMetaInfo,
  calculateDirection,
  timeToString,
  getDailyReminderValue,
  clearLocalNotifications,
  setLocalNotification
};
