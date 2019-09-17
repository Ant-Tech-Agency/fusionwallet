import { Dimensions } from 'react-native'
const { width, height } = Dimensions.get('window')
export const metrics = {
  screenWidth: width < height ? width : height,
  screenHeight: width < height ? height : width,
  padding: {
    half: 6,
    base: 12,
    double: 24,
    triple: 36,
  },
  margin: {
    half: 6,
    base: 12,
    double: 24,
    triple: 36,
  },
  logo: {
    width: width / 3,
    height: width / 6,
  },
  font: {
    medium: 16,
    header: {
      h1: (width * 7) / 100,
      h2: (width * 5) / 100,
    },

    text: {
      t1: (width * 4) / 100,
      t2: (width * 3.5) / 100,
      t3: (width * 3) / 100,
    },
    coin: (width * 10) / 100,
  },
  button: {
    large: {
      width: (width * 85) / 100,
      height: 36,
    },
    small: {
      width: (width * 30) / 100,
      height: 24,
    },
  },
  input: {
    large: {
      width: (width * 85) / 100,
      height: 36,
    },
    small: {
      width: (width * 30) / 100,
      height: 24,
    },
  },
  border: {
    radius: {
      base: 5,
      double: 10,
      triple: 15,
      circle: 50,
    },
    width: {
      base: 0.3,
      double: 0.6,
      triple: 1,
    },
  },
  coinLogo: {
    width: 48,
    height: 48,
  },
  modal: {
    width: (width * 95) / 100,
  },
}
