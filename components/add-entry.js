import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { connect } from "react-redux";
import { NavigationActions } from "react-navigation";
import { addEntry } from "../actions";
import {
  getMetricMetaInfo,
  timeToString,
  getDailyReminderValue,
  clearLocalNotifications,
  setLocalNotification
} from "../utils/helpers";
import { submitEntry, removeEntry } from "../utils/api";
import { white } from "../utils/colors";
import DateHeader from "./date-header";
import Slider from "./slider";
import Steppers from "./steppers";
import SubmitBtn from "./submit-btn";
import TextBtn from "./text-btn";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: white
  },
  row: { flexDirection: "row", flex: 1, alignItems: "center" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", marginLeft: 30, marginRight: 30 }
});

class AddEntry extends React.Component {
  state = {
    run: 0,
    bike: 0,
    swim: 0,
    sleep: 0,
    eat: 0
  };
  increment = metric => {
    const { max, step } = getMetricMetaInfo(metric);
    this.setState(prevState => {
      const count = prevState[metric] + step;
      return { ...prevState, [metric]: count > max ? max : count };
    });
  };
  decrement = metric => {
    this.setState(prevState => {
      const count = prevState[metric] - getMetricMetaInfo(metric).step;
      return { ...prevState, [metric]: count < 0 ? 0 : count };
    });
  };
  slide = (metric, value) => {
    this.setState({ [metric]: value });
  };
  submit = () => {
    const key = timeToString();
    const entry = this.state;

    this.props.dispatch(addEntry({ [key]: entry }));

    this.setState({
      run: 0,
      bike: 0,
      swim: 0,
      sleep: 0,
      eat: 0
    });
    this.toHome();
    submitEntry({ key, entry });
    clearLocalNotifications().then(setLocalNotification);
  };
  reset = () => {
    const key = timeToString();
    this.props.dispatch(addEntry({ [key]: getDailyReminderValue() }));
    this.toHome();
    removeEntry(key);
  };
  toHome = () => {
    this.props.navigation.dispatch(
      NavigationActions.back({
        key: "AddEntry"
      })
    );
  };
  render() {
    const metaInfo = getMetricMetaInfo();

    if (this.props.alreadyLogged) {
      return (
        <View style={styles.center}>
          <Ionicons name={Platform.OS === "ios" ? "ios-happy-outline" : "md-happy"} size={100} />
          <Text>You already logged your information for today</Text>
          <TextBtn style={{ padding: 10 }} onPress={this.reset}>
            Reset
          </TextBtn>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <DateHeader date={new Date().toLocaleDateString()} />
        {Object.keys(metaInfo).map(key => {
          const { getIcon, type, ...rest } = metaInfo[key];
          const value = this.state[key];
          return (
            <View key={key} style={styles.row}>
              {getIcon()}
              {type === "slider" ? (
                <Slider value={value} onChange={val => this.slide(key, val)} {...rest} />
              ) : (
                <Steppers
                  value={value}
                  onIncrement={() => this.increment(key)}
                  onDecrement={() => this.decrement(key)}
                  {...rest}
                />
              )}
            </View>
          );
        })}
        <SubmitBtn onPress={this.submit} />
      </View>
    );
  }
}

const mapStateToProps = state => {
  const key = timeToString();
  return { alreadyLogged: state[key] && typeof state[key].today === "undefined" };
};

export default connect(mapStateToProps)(AddEntry);
