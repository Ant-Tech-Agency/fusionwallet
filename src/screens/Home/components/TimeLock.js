import React, { useState } from 'react'
import {
  DatePickerAndroid,
  DatePickerIOS,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import moment from 'moment'
import { colors, metrics } from '../../../themes'
import { Tag } from '../../../constants/timelock.constant'
import { TxType } from '../../../constants/tx-type.constant'

export const TimeLock = ({
  setTimeLockType,
  onFromDateChange,
  onToDateChange,
}) => {
  const [timeLock, setTimeLock] = useState(TxType.None)
  const [isFromDateClick, setIsFromDateClick] = useState(false)
  const [isToDateClick, setIsToDateClick] = useState(false)
  const [fromDate, setFromDate] = useState(null)
  const [isDateToForeverClick, setIsDateToForeverClick] = useState(false)
  const [toDate, setToDate] = useState(null)
  const [dateToForever, setDateToForever] = useState(null)
  const [currentDate, setCurrentDate] = useState(new Date())

  async function onOpenDatePicker(tag) {
    switch (tag) {
      case Tag.To:
        if (isFromDateClick || isDateToForeverClick) {
          setIsToDateClick(true)
          setIsDateToForeverClick(false)
          setIsFromDateClick(false)
        } else if (isToDateClick) {
          setIsToDateClick(false)
        } else {
          setIsToDateClick(true)
        }
        break
      case Tag.From:
        if (isToDateClick || isDateToForeverClick) {
          setIsFromDateClick(true)
          setIsDateToForeverClick(false)
          setIsToDateClick(false)
        } else if (isFromDateClick) {
          setIsFromDateClick(false)
        } else {
          setIsFromDateClick(true)
        }
        break
      case Tag.Forever:
        if (isToDateClick || isFromDateClick) {
          setIsToDateClick(false)
          setIsFromDateClick(false)
          setIsDateToForeverClick(true)
        } else if (isDateToForeverClick) {
          setIsDateToForeverClick(false)
        } else {
          setIsDateToForeverClick(true)
        }
        break
    }
    if (Platform.OS === 'android') {
      try {
        const res = await DatePickerAndroid.open({
          // Use `new Date()` for current date.
          // May 25 2020. Month 0 is January.
          date: new Date(),
        })
        console.log(res)
        const { action, day, month, year } = res
        console.log(DatePickerAndroid.dismissedAction)
        if (action !== DatePickerAndroid.dismissedAction) {
          console.log('true case')
          let date = new Date(year, month, day)
          switch (tag) {
            case Tag.From:
              console.log('fromcase')
              onFromDateChange(date)
              setFromDate(date)
              break
            case Tag.To:
              onToDateChange(date)
              console.log('tocase')
              setToDate(date)
              break
            case Tag.Forever:
              onFromDateChange(date)
              console.log('forevercase')
              setDateToForever(date)
              break
            default:
              break
          }
        }
      } catch ({ code, message }) {
        console.warn('Cannot open date picker', message)
      }
    }
  }

  function onChangeDate(date) {
    if (isFromDateClick) {
      setCurrentDate(date)
      setFromDate(date)
      onFromDateChange(date)
    } else if (isToDateClick) {
      setCurrentDate(date)
      setToDate(date)
      onToDateChange(date)
    } else {
      setCurrentDate(date)
      setDateToForever(date)
      onFromDateChange(date)
    }
  }

  function onSegmentClick(tag) {
    setTimeLock(tag)
    setIsFromDateClick(false)
    setIsDateToForeverClick(false)
    setIsToDateClick(false)
    setFromDate(null)
    setToDate(null)
    setDateToForever(null)
    setTimeLockType(tag)
  }

  return (
    <View style={s.labelCover}>
      <Text style={s.label}>Time Lock</Text>
      <View style={s.segmentsCover}>
        <TouchableOpacity
          onPress={() => onSegmentClick(TxType.None)}
          style={timeLock === TxType.None ? s.segmentActive : s.segment}
        >
          <Text>None</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onSegmentClick(TxType.DateRange)}
          style={timeLock === TxType.DateRange ? s.segmentActive : s.segment}
        >
          <Text>Date to Date</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onSegmentClick(TxType.Scheduled)}
          style={timeLock === TxType.Scheduled ? s.segmentActive : s.segment}
        >
          <Text>Date to Forever</Text>
        </TouchableOpacity>
      </View>
      {timeLock === TxType.DateRange ? (
        <View>
          <View style={s.dtdCover}>
            <Text>From: </Text>
            <TouchableOpacity onPress={() => onOpenDatePicker(Tag.From)}>
              <View style={isFromDateClick ? s.dateBorderActive : s.dateBorder}>
                <Text style={s.normalText}>
                  {fromDate
                    ? moment(fromDate).format('DD-MM-YYYY')
                    : 'dd/mm/yy'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={s.dtdCover}>
            <Text>To: </Text>
            <TouchableOpacity onPress={() => onOpenDatePicker(Tag.To)}>
              <View style={isToDateClick ? s.dateBorderActive : s.dateBorder}>
                <Text style={s.normalText}>
                  {toDate ? moment(toDate).format('DD-MM-YYYY') : 'dd/mm/yy'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        timeLock === TxType.Scheduled && (
          <View>
            <View style={s.dtfCover}>
              <Text>from : </Text>
              <TouchableOpacity onPress={() => onOpenDatePicker(Tag.Forever)}>
                <View
                  style={
                    isDateToForeverClick ? s.dateBorderActive : s.dateBorder
                  }
                >
                  <Text style={s.normalText}>
                    {dateToForever
                      ? moment(dateToForever).format('DD-MM-YYYY')
                      : 'dd/mm/yy'}
                  </Text>
                </View>
              </TouchableOpacity>
              <Text>
                {' '}
                - <Text style={s.normalText}>To Forever</Text>
              </Text>
            </View>
          </View>
        )
      )}
      {Platform.OS === 'ios' &&
        (isFromDateClick !== isToDateClick) !== isDateToForeverClick && (
          <View>
            <DatePickerIOS
              mode="date"
              date={currentDate}
              onDateChange={date => onChangeDate(date)}
            />
          </View>
        )}
    </View>
  )
}

const s = StyleSheet.create({
  labelCover: {
    marginTop: metrics.margin.base,
  },
  label: {
    fontSize: metrics.font.text.t1,
    color: colors.text.primary,
    fontWeight: 'bold',
  },
  segmentsCover: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: metrics.margin.base,
  },
  segment: {
    borderWidth: 0.5,
    borderColor: 'black',
    borderRadius: 10,
    flexDirection: 'row',
    padding: metrics.padding.half,
  },
  segmentActive: {
    borderWidth: 0.5,
    borderColor: 'blue',
    borderRadius: 10,
    flexDirection: 'row',
    padding: metrics.padding.half,
  },
  dateBorder: {
    borderColor: colors.border.primary,
    borderRadius: 10,
    padding: metrics.padding.half,
    borderWidth: 1,
  },
  dateBorderActive: {
    borderColor: colors.border.active,
    borderRadius: 10,
    padding: metrics.padding.half,
    borderWidth: 1,
  },
  dtdCover: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: metrics.margin.half,
  },
  normalText: {
    color: colors.text.primary,
  },
  dtfCover: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})
