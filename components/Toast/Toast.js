import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
} from 'react-native'
import { metrics } from '../../src/themes'

export const Toast = ({ onShow, resetToast }) => {
  //declare state
  // fade use to define toast's opacity
  const [fade] = useState(new Animated.Value(0))
  // define toast's width
  const [width] = useState(new Animated.Value(metrics.button.large.width))
  // define toast's height
  const [height] = useState(new Animated.Value(40))

  // declare function
  // run when it was called
  useEffect(() => {
    // check should show
    if (onShow) {
      // fade in toast
      const fadeIn = Animated.timing(fade, {
        toValue: 1,
        duration: 350,
      })
      // fade out toast
      const fadeOut = Animated.timing(fade, {
        toValue: 0,
        duration: 350,
        delay: 1000,
      })
      // zoom out width
      const zoomOutWidth = Animated.timing(width, {
        toValue: 0,
      })
      // zoom out heigth
      const zoomOutHeight = Animated.timing(height, {
        toValue: 0,
      })
      // zoom in width
      const zoomInWidth = Animated.timing(width, {
        toValue: metrics.button.large.width,
        duration: 0,
      })
      //zoom in height
      const zoomInHeight = Animated.timing(height, {
        toValue: 40,
        duration: 0,
      })
      // zoom in height and zoom in width in the same time
      const zoomIn = Animated.parallel([zoomInHeight, zoomInWidth])

      // zoom out height and zoom out width in the same time
      const zoomOut = Animated.parallel([zoomOutHeight, zoomOutWidth])

      // start animation step by step
      // zoom in -> fade in -> fade out -> zoom out
      Animated.sequence([zoomIn, fadeIn, fadeOut, zoomOut]).start()
    }
    resetToast()
  }, [onShow])

  //render
  return (
    <Animated.View
      style={[
        s.container,
        {
          opacity: fade,
          width,
          height,
        },
      ]}
    >
      <Text style={s.text}> copy success</Text>
    </Animated.View>
  )
}

const s = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    alignSelf: 'center',
    bottom: 20,
    borderRadius: metrics.border.radius.circle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
  },
})
