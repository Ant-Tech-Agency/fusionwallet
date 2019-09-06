import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  const double = x => x + '!!!'

  return (
    <View style={styles.container}>
      <Text>{'Linh' |> double}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
