import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { purple } from "../utils/colors";

const styles = StyleSheet.create({
  reset: {
    textAlign: "center",
    color: purple
  }
});

const TextBtn = ({ children, onPress, style = {} }) => (
  <TouchableOpacity onPress={onPress}>
    <Text style={[styles.reset, style]}>{children}</Text>
  </TouchableOpacity>
);

export default TextBtn;
