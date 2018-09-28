import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { white } from "../utils/colors";
import MetricCard from "./metric-card";
import TextBtn from "./text-btn";
import { addEntry } from "../actions";
import { removeEntry } from "../utils/api";
import { timeToString, getDailyReminderValue } from "../utils/helpers";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
    padding: 15
  }
});

class EntryDetail extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { entryId } = navigation.state.params;
    const year = entryId.slice(0, 4);
    const month = entryId.slice(5, 7);
    const day = entryId.slice(8);
    return { title: `${month}/${day}/${year}` };
  };
  shouldComponentUpdate(nextProps) {
    return nextProps.metrics && !nextProps.metrics.today;
  }
  reset = () => {
    const { remove, goBack, entryId } = this.props;
    remove();
    goBack();
    removeEntry(entryId);
  };
  render() {
    const { metrics } = this.props;
    return (
      <View style={styles.container}>
        <MetricCard metrics={metrics} />
        <TextBtn onPress={this.reset} style={{ margin: 20 }}>
          Reset
        </TextBtn>
      </View>
    );
  }
}

const mapStateToProps = (state, { navigation }) => {
  const { entryId } = navigation.state.params;
  return { entryId, metrics: state[entryId] };
};

const mapDispatchToProps = (dispatch, { navigation }) => {
  const { entryId } = navigation.state.params;

  return {
    remove: () =>
      dispatch(
        addEntry({
          [entryId]: timeToString() === entryId ? getDailyReminderValue() : null
        })
      ),
    goBack: () => navigation.goBack()
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EntryDetail);
