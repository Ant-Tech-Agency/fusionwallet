import * as React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { MaterialIcons as Icon } from '@expo/vector-icons'
import { useNavigation } from 'react-navigation-hooks'

const styles = StyleSheet.create({
  container: {
    padding: 16,
    height: 64,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})

export default () => {
  const { navigate } = useNavigation()
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigate('Home')}>
        <Icon name="arrow-back" color="white" size={24} />
      </TouchableOpacity>
    </View>
  )
}
