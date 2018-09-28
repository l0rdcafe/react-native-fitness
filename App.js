import React from "react";
import { View, Platform, StatusBar } from "react-native";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { createBottomTabNavigator, createMaterialTopTabNavigator, createStackNavigator } from "react-navigation";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Constants } from "expo";
import reducer from "./reducers";
import AddEntry from "./components/add-entry";
import History from "./components/history";
import EntryDetail from "./components/entry-detail";
import Live from "./components/live";
import { purple, white } from "./utils/colors";
import { setLocalNotification } from "./utils/helpers";

const store = createStore(reducer);

const StatusBarCustom = ({ backgroundColor, ...props }) => (
  <View style={{ backgroundColor, height: Constants.statusBarHeight }}>
    <StatusBar translucent backgroundColor={backgroundColor} {...props} />
  </View>
);

const iosNav = {
  History: {
    screen: History,
    navigationOptions: {
      tabBarLabel: "History",
      tabBarIcon: ({ tintColor }) => <Ionicons name="ios-bookmarks" size={30} color={tintColor} />
    }
  },
  AddEntry: {
    screen: AddEntry,
    navigationOptions: {
      tabBarLabel: "Add Entry",
      tabBarIcon: ({ tintColor }) => <FontAwesome name="plus-square" size={30} color={tintColor} />
    }
  },
  Live: {
    screen: Live,
    navigationOptions: {
      tabBarLabel: "Live",
      tabBarIcon: ({ tintColor }) => <Ionicons name="ios-speedometer" size={30} color={tintColor} />
    }
  }
};

const iosOptions = {
  navigationOptions: {
    header: null
  },
  tabBarOptions: {
    activeTintColor: purple,
    style: {
      height: 56,
      backgroundColor: white,
      shadowColor: "rgba(0, 0, 0, 0.24)",
      shadowOffset: {
        width: 0,
        height: 3
      },
      shadowRadius: 6,
      shadowOpacity: 1
    }
  }
};

const androidNav = {
  History: {
    screen: History,
    navigationOptions: {
      tabBarLabel: "History",
      tabBarIcon: ({ tintColor }) => <Ionicons name="ios-bookmarks" size={30} color={tintColor} />
    }
  },
  AddEntry: {
    screen: AddEntry,
    navigationOptions: {
      tabBarLabel: "Add Entry",
      tabBarIcon: ({ tintColor }) => <FontAwesome name="plus-square" size={30} color={tintColor} />
    }
  },
  Live: {
    screen: Live,
    navigationOptions: {
      tabBarLabel: "Live",
      tabBarIcon: ({ tintColor }) => <Ionicons name="ios-speedometer" size={30} color={tintColor} />
    }
  }
};

const androidOptions = {
  navigationOptions: {
    header: null
  },
  tabBarOptions: {
    activeTintColor: white,
    style: {
      height: 56,
      backgroundColor: purple,
      shadowColor: "rgba(0, 0, 0, 0.24)",
      shadowOffset: {
        width: 0,
        height: 3
      },
      shadowRadius: 6,
      shadowOpacity: 1
    }
  }
};

const Tabs =
  Platform.OS === "ios"
    ? createBottomTabNavigator(iosNav, iosOptions)
    : createMaterialTopTabNavigator(androidNav, androidOptions);

const MainNav = createStackNavigator({
  Home: {
    screen: Tabs
  },
  EntryDetail: {
    screen: EntryDetail,
    navigationOptions: {
      headerTintColor: white,
      headerStyle: {
        backgroundColor: purple
      }
    }
  }
});

export default class App extends React.Component {
  componentDidMount() {
    setLocalNotification();
  }
  render() {
    return (
      <Provider store={store}>
        <View style={{ flex: 1 }}>
          <StatusBarCustom backgroundColor={purple} barStyle="light-content" />
          <MainNav />
        </View>
      </Provider>
    );
  }
}
