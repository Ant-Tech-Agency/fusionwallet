import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native'
import { metrics } from '../../../themes'
import * as FS from 'expo-file-system'
import { PATH } from '../../../constants/FilePath'

export const DocumentPicker = ({ onPress, onPick }) => {
  const [dirs, setDirs] = useState([])

  async function getDirContent() {
    const dirContent = await FS.readDirectoryAsync(PATH)
    setDirs(dirContent)
  }

  useEffect(() => {
    getDirContent().then()
  }, [])

  return (
    <View style={s.container}>
      <View style={s.pickWindow}>
        <View style={s.header}>
          <Text style={s.title}>Select KeyStore</Text>
        </View>
        <View style={s.pickContent}>
          {dirs.length > 0 && (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={dirs}
              keyExtractor={item => item}
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity
                    onPress={() => onPick(item)}
                    style={s.item}
                  >
                    <Text numberOfLines={1}> {item} </Text>
                  </TouchableOpacity>
                )
              }}
            />
          )}
        </View>
        <View style={s.footer}>
          <TouchableWithoutFeedback style={s.footer} onPress={onPress}>
            <Text>Close</Text>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    width: metrics.screenWidth,
    height: metrics.screenHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: metrics.font.header.h2,
    fontWeight: 'bold',
  },
  pickWindow: {
    width: '95%',
    height: '60%',
    backgroundColor: 'white',
    alignItems: 'center',
    position: 'relative',
    zIndex: 2,
  },
  header: {
    width: '90%',
    height: '15%',
    borderBottomWidth: metrics.border.width.triple,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickContent: {
    height: '75%',
    width: '100%',
    paddingHorizontal: metrics.padding.base,
    borderBottomWidth: metrics.border.width.triple,
  },
  item: {
    width: '90%',
    marginVertical: metrics.margin.half,
    alignSelf: 'center',
  },
  footer: {
    width: '100%',
    height: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
})
