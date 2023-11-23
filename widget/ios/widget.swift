//
//  widget.swift
//  widget
//

import WidgetKit
import SwiftUI

extension UIColor {
  convenience init(red: Int, green: Int, blue: Int) {
    assert(red >= 0 && red <= 255, "Invalid red component")
    assert(green >= 0 && green <= 255, "Invalid green component")
    assert(blue >= 0 && blue <= 255, "Invalid blue component")
    
    self.init(red: CGFloat(red) / 255.0, green: CGFloat(green) / 255.0, blue: CGFloat(blue) / 255.0, alpha: 1.0)
  }
  
  convenience init(rgb: Int) {
    self.init(
      red: (rgb >> 16) & 0xFF,
      green: (rgb >> 8) & 0xFF,
      blue: rgb & 0xFF
    )
  }
}

extension String {
    func substring(from: Int, to: Int) -> String {
        guard from < count, to >= 0, to - from >= 0 else {
            return ""
        }
        
        // Index 값 획득
        let startIndex = index(self.startIndex, offsetBy: from)
        let endIndex = index(self.startIndex, offsetBy: to + 1) // '+1'이 있는 이유: endIndex는 문자열의 마지막 그 다음을 가리키기 때문
        
        // 파싱
        return String(self[startIndex ..< endIndex])
    }
}

extension WidgetConfiguration {
  func disableContentMarginsIfNeeded() -> some WidgetConfiguration {
    if #available(iOSApplicationExtension 15.0, *) {
      return self.contentMarginsDisabled()
    } else {
      return self
    }
  }
}

struct DateType: Codable {
  let day: String, dayName: String, dayType: String;
}

struct Schedule: Codable {
  let title: String, color: Int, time: String;
}

struct Shift: Codable {
  let name: String, shortName: String, color: Int, time: String;
}

struct Today: Codable {
  let date: DateType, shift: Shift?, schedules: [Schedule], closeSchedule: Schedule?;
}

struct DayDuty: Codable {
  let date: DateType, shift: Shift?, isCurrentMonth: Bool;
}

struct Week: Codable {
  let period: String, shiftList: [DayDuty];
}

struct Month: Codable {
  let year: Int, month: Int, startDayIndex: Int, endDayIndex: Int, calendar: [[DayDuty]];
}

struct WidgetData: Codable {
  let today: Today, week: Week, month: Month;
}

var mockWidgetData: WidgetData = WidgetData(
  today: Today(
    date: DateType(day: "03", dayName: "금", dayType: "workday"),
    shift: Shift(name: "데이", shortName: "D", color: 0x4DC2AD, time: "07:00 ~ 15:00"),
    schedules: [
      Schedule(title: "한글날", color: 0xFF2164, time: "-"),
      Schedule(title: "미용실 가기", color: 0xF8E85A, time: "10:00 ~ 11:00"),
    ],
    closeSchedule: Schedule(title: "미용실 가기", color: 0xF8E85A, time: "10:00 ~ 11:00")
  ),
  week: Week(
    period: "10.29 ~ 11.04",
    shiftList: [
      DayDuty(
        date: DateType(day: "29", dayName: "일", dayType: "sunday"),
        shift: Shift(name: "데이", shortName: "D", color: 0x4DC2AD, time: "07:00 ~ 15:00"),
        isCurrentMonth: false
      ),
      DayDuty(
        date: DateType(day: "30", dayName: "월", dayType: "workday"),
        shift: Shift(name: "데이", shortName: "D", color: 0x4DC2AD, time: "07:00 ~ 15:00"),
        isCurrentMonth: false
      ),
      DayDuty(
        date: DateType(day: "31", dayName: "화", dayType: "workday"),
        shift: Shift(name: "이브닝", shortName: "E", color: 0xFF8BA5, time: "15:00 ~ 23:00"),
        isCurrentMonth: false
      ),
      DayDuty(
        date: DateType(day: "1", dayName: "수", dayType: "workday"),
        shift: Shift(name: "나이트", shortName: "N", color: 0x3580FF, time: "23:00 ~ 07:00"),
        isCurrentMonth: true
      ),
      DayDuty(
        date: DateType(day: "2", dayName: "목", dayType: "workday"),
        shift: Shift(name: "오프", shortName: "O", color: 0x465B7A, time: "-"),
        isCurrentMonth: true
      ),
      DayDuty(
        date: DateType(day: "3", dayName: "금", dayType: "workday"),
        shift: Shift(name: "오프", shortName: "O", color: 0x465B7A, time: "-"),
        isCurrentMonth: true
      ),
      DayDuty(
        date: DateType(day: "4", dayName: "토", dayType: "saturday"),
        shift: Shift(name: "나이트", shortName: "N", color: 0x3580FF, time: "23:00 ~ 07:00"),
        isCurrentMonth: true
      ),
    ]
  ),
  month: Month(year: 2023, month: 11, startDayIndex: 3, endDayIndex: 33, calendar: [
    [
      DayDuty(
        date: DateType(day: "29", dayName: "일", dayType: "sunday"),
        shift: Shift(name: "데이", shortName: "D", color: 0x4DC2AD, time: "07:00 ~ 15:00"),
        isCurrentMonth: false
      ),
      DayDuty(
        date: DateType(day: "30", dayName: "일", dayType: "workday"),
        shift: Shift(name: "데이", shortName: "D", color: 0x4DC2AD, time: "07:00 ~ 15:00"),
        isCurrentMonth: false
      ),
      DayDuty(
        date: DateType(day: "31", dayName: "일", dayType: "workday"),
        shift: Shift(name: "이브닝", shortName: "E", color: 0xFF8BA5, time: "15:00 ~ 23:00"),
        isCurrentMonth: false
      ),
      DayDuty(
        date: DateType(day: "1", dayName: "일", dayType: "workday"),
        shift: Shift(name: "나이트", shortName: "N", color: 0x3580FF, time: "23:00 ~ 07:00"),
        isCurrentMonth: true
      ),
      DayDuty(
        date: DateType(day: "2", dayName: "일", dayType: "workday"),
        shift: Shift(name: "오프", shortName: "O", color: 0x465B7A, time: "-"),
        isCurrentMonth: true
      ),
      DayDuty(
        date: DateType(day: "3", dayName: "일", dayType: "workday"),
        shift: Shift(name: "오프", shortName: "O", color: 0x465B7A, time: "-"),
        isCurrentMonth: true
      ),
      DayDuty(
        date: DateType(day: "4", dayName: "일", dayType: "saturday"),
        shift: Shift(name: "나이트", shortName: "N", color: 0x3580FF, time: "23:00 ~ 07:00"),
        isCurrentMonth: true
      ),
    ],
    [
      DayDuty(
        date: DateType(day: "5", dayName: "일", dayType: "sunday"),
        shift: Shift(name: "데이", shortName: "D", color: 0x4DC2AD, time: "07:00 ~ 15:00"),
        isCurrentMonth: true
      ),
      DayDuty(
        date: DateType(day: "6", dayName: "일", dayType: "workday"),
        shift: Shift(name: "데이", shortName: "D", color: 0x4DC2AD, time: "07:00 ~ 15:00"),
        isCurrentMonth: true
      ),
      DayDuty(
        date: DateType(day: "7", dayName: "일", dayType: "workday"),
        shift: Shift(name: "이브닝", shortName: "E", color: 0xFF8BA5, time: "15:00 ~ 23:00"),
        isCurrentMonth: true
      ),
      DayDuty(
        date: DateType(day: "8", dayName: "일", dayType: "workday"),
        shift: Shift(name: "나이트", shortName: "N", color: 0x3580FF, time: "23:00 ~ 07:00"),
        isCurrentMonth: true
      ),
      DayDuty(
        date: DateType(day: "9", dayName: "일", dayType: "workday"),
        shift: Shift(name: "오프", shortName: "O", color: 0x465B7A, time: "-"),
        isCurrentMonth: true
      ),
      DayDuty(
        date: DateType(day: "10", dayName: "일", dayType: "workday"),
        shift: Shift(name: "오프", shortName: "O", color: 0x465B7A, time: "-"),
        isCurrentMonth: true
      ),
      DayDuty(
        date: DateType(day: "11", dayName: "일", dayType: "saturday"),
        shift: Shift(name: "나이트", shortName: "N", color: 0x3580FF, time: "23:00 ~ 07:00"),
        isCurrentMonth: true
      ),
    ],
    [
      DayDuty(
        date: DateType(day: "12", dayName: "일", dayType: "sunday"),
        shift: Shift(name: "데이", shortName: "D", color: 0x4DC2AD, time: "07:00 ~ 15:00"),
        isCurrentMonth: true
      ),
      DayDuty(
        date: DateType(day: "13", dayName: "일", dayType: "workday"),
        shift: Shift(name: "데이", shortName: "D", color: 0x4DC2AD, time: "07:00 ~ 15:00"),
        isCurrentMonth: true
      ),
      DayDuty(
        date: DateType(day: "14", dayName: "일", dayType: "workday"),
        shift: Shift(name: "이브닝", shortName: "E", color: 0xFF8BA5, time: "15:00 ~ 23:00"),
        isCurrentMonth: true
      ),
      DayDuty(
        date: DateType(day: "15", dayName: "일", dayType: "workday"),
        shift: Shift(name: "나이트", shortName: "N", color: 0x3580FF, time: "23:00 ~ 07:00"),
        isCurrentMonth: true
      ),
      DayDuty(
        date: DateType(day: "16", dayName: "일", dayType: "workday"),
        shift: Shift(name: "오프", shortName: "O", color: 0x465B7A, time: "-"),
        isCurrentMonth: true
      ),
      DayDuty(
        date: DateType(day: "17", dayName: "일", dayType: "workday"),
        shift: Shift(name: "오프", shortName: "O", color: 0x465B7A, time: "-"),
        isCurrentMonth: true
      ),
      DayDuty(
        date: DateType(day: "18", dayName: "일", dayType: "saturday"),
        shift: Shift(name: "나이트", shortName: "N", color: 0x3580FF, time: "23:00 ~ 07:00"),
        isCurrentMonth: true
      ),
    ],
    [
      DayDuty(
        date: DateType(day: "19", dayName: "일", dayType: "sunday"),
        shift: Shift(name: "데이", shortName: "D", color: 0x4DC2AD, time: "07:00 ~ 15:00"),
        isCurrentMonth: true
      ),
      DayDuty(
        date: DateType(day: "20", dayName: "일", dayType: "workday"),
        shift: Shift(name: "데이", shortName: "D", color: 0x4DC2AD, time: "07:00 ~ 15:00"),
        isCurrentMonth: true
      ),
      DayDuty(
        date: DateType(day: "21", dayName: "일", dayType: "workday"),
        shift: Shift(name: "이브닝", shortName: "E", color: 0xFF8BA5, time: "15:00 ~ 23:00"),
        isCurrentMonth: true
      ),
      DayDuty(
        date: DateType(day: "22", dayName: "일", dayType: "workday"),
        shift: Shift(name: "나이트", shortName: "N", color: 0x3580FF, time: "23:00 ~ 07:00"),
        isCurrentMonth: true
      ),
      DayDuty(
        date: DateType(day: "23", dayName: "일", dayType: "workday"),
        shift: Shift(name: "오프", shortName: "O", color: 0x465B7A, time: "-"),
        isCurrentMonth: true
      ),
      DayDuty(
        date: DateType(day: "24", dayName: "일", dayType: "workday"),
        shift: Shift(name: "오프", shortName: "O", color: 0x465B7A, time: "-"),
        isCurrentMonth: true
      ),
      DayDuty(
        date: DateType(day: "25", dayName: "일", dayType: "saturday"),
        shift: Shift(name: "나이트", shortName: "N", color: 0x3580FF, time: "23:00 ~ 07:00"),
        isCurrentMonth: true
      ),
    ],
    [
      DayDuty(
        date: DateType(day: "26", dayName: "일", dayType: "sunday"),
        shift: Shift(name: "데이", shortName: "D", color: 0x4DC2AD, time: "07:00 ~ 15:00"),
        isCurrentMonth: true
      ),
      DayDuty(
        date: DateType(day: "27", dayName: "일", dayType: "workday"),
        shift: Shift(name: "데이", shortName: "D", color: 0x4DC2AD, time: "07:00 ~ 15:00"),
        isCurrentMonth: true
      ),
      DayDuty(
        date: DateType(day: "28", dayName: "일", dayType: "workday"),
        shift: Shift(name: "이브닝", shortName: "E", color: 0xFF8BA5, time: "15:00 ~ 23:00"),
        isCurrentMonth: true
      ),
      DayDuty(
        date: DateType(day: "29", dayName: "일", dayType: "workday"),
        shift: Shift(name: "나이트", shortName: "N", color: 0x3580FF, time: "23:00 ~ 07:00"),
        isCurrentMonth: true
      ),
      DayDuty(
        date: DateType(day: "30", dayName: "일", dayType: "workday"),
        shift: Shift(name: "오프", shortName: "O", color: 0x465B7A, time: "-"),
        isCurrentMonth: true
      ),
      DayDuty(
        date: DateType(day: "1", dayName: "일", dayType: "workday"),
        shift: Shift(name: "오프", shortName: "O", color: 0x465B7A, time: "-"),
        isCurrentMonth: false
      ),
      DayDuty(
        date: DateType(day: "2", dayName: "일", dayType: "saturday"),
        shift: Shift(name: "나이트", shortName: "N", color: 0x3580FF, time: "23:00 ~ 07:00"),
        isCurrentMonth: false
      ),
    ],
  ])
)

struct Provider: TimelineProvider {
  func placeholder(in context: Context) -> WidgetEntry {
    WidgetEntry(date: Date(), widgetData: mockWidgetData)
  }
  
  func getSnapshot(in context: Context, completion: @escaping (WidgetEntry) -> ()) {
    let entry = WidgetEntry(date: Date(), widgetData: mockWidgetData)
    completion(entry)
  }
  
  func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
    var entries: [WidgetEntry] = []
    
    let userDefaults = UserDefaults(suiteName: "group.expo.modules.widgetsync.data")
    let jsonText = userDefaults?.string(forKey: "savedData")
    
    var widgetData : WidgetData = mockWidgetData;
    
    do {
      if jsonText != nil {
        let jsonData = Data(jsonText?.utf8 ?? "".utf8)
        let valueData = try JSONDecoder().decode(WidgetData.self, from: jsonData)
        widgetData = valueData
      }
    } catch {
      print(error)
    }
    
    
    // Generate a timeline consisting of five entries an hour apart, starting from the current date.
    let currentDate = Date()
    for hourOffset in 0 ..< 5 {
      let entryDate = Calendar.current.date(byAdding: .hour, value: hourOffset, to: currentDate)!
      let entry = WidgetEntry(date: entryDate, widgetData: widgetData)
      entries.append(entry)
    }
    
    let timeline = Timeline(entries: entries, policy: .atEnd)
    completion(timeline)
  }
}

struct small01View : View {
  @Environment(\.widgetFamily) var family: WidgetFamily
  @Environment(\.colorScheme) var scheme
  var entry: Provider.Entry
  
  var body: some View {
    VStack(alignment: .leading) {
      Text(entry.widgetData.today.date.day.count == 1 ? "0" + entry.widgetData.today.date.day : entry.widgetData.today.date.day +
           ", " + entry.widgetData.today.date.dayName)
      .font(.system(size: 14))
      .fontWeight(.semibold)
      .foregroundColor(scheme == .dark ?  Color.white: Color(UIColor(rgb: 0x242428)))
      .frame(maxWidth: .infinity, alignment: .leading)
      Spacer()
      if (entry.widgetData.today.shift != nil) {
        Text(entry.widgetData.today.shift!.shortName)
          .font(.system(size: 36))
          .foregroundColor(Color.white)
          .fixedSize(horizontal: false, vertical: true)
          .multilineTextAlignment(.center)
          .frame(width: 58, height: 58)
          .background(RoundedRectangle(cornerRadius: 8)
            .fill(Color(UIColor(rgb: entry.widgetData.today.shift!.color))))
      } else {
        Text("근무를 등록해주세요")
          .font(.system(size: 12))
          .multilineTextAlignment(.center)
      }
      Spacer()
      if(entry.widgetData.today.schedules.count == 0) {
        HStack {
          Text("일정이 없습니다.")
            .font(.system(size: 12))
            .fontWeight(.semibold)
            .foregroundColor(scheme == .dark ?  Color.white: Color(UIColor(rgb: 0x242428)))
        }
      } else {
        HStack {
          Rectangle()
            .fill(Color(UIColor(rgb: entry.widgetData.today.schedules[0].color)))
            .frame(width: 4, height: 36)
          VStack(alignment: .leading){
            Text(entry.widgetData.today.schedules[0].title)
              .font(.system(size: 15))
              .fontWeight(.semibold)
              .lineLimit(1)
              .truncationMode(.tail)
              .foregroundColor(scheme == .dark ?  Color.white: Color(UIColor(rgb: 0x242428)))
            Text(entry.widgetData.today.schedules[0].time)
              .font(.system(size: 12))
              .foregroundColor(Color(UIColor(rgb: 0xABABB4)))
          }
          if(entry.widgetData.today.schedules.count > 1) {
            Spacer()
            Text("+" + String(entry.widgetData.today.schedules.count - 1))
              .font(.system(size: 14))
              .foregroundColor(scheme == .dark ?  Color(UIColor(rgb: 0x595961)): Color(UIColor(rgb: 0x242428)))
              .fixedSize(horizontal: false, vertical: true)
              .multilineTextAlignment(.center)
              .frame(width: 30, height: 30)
              .background(RoundedRectangle(cornerRadius: .infinity)
                .fill(scheme == .dark ?  Color(UIColor(rgb: 0xD6D6DE)): Color(UIColor(rgb: 0xF2F2F7))))
          }
        }
      }
    }
    .frame(maxWidth: .infinity, maxHeight: .infinity)
    .padding(EdgeInsets(top: 14, leading: 16, bottom: 14, trailing: 16))
    .background(scheme == .dark ? Color(UIColor(rgb: 0x202123)) : Color.white)
  }
}

struct small02View : View {
  @Environment(\.widgetFamily) var family: WidgetFamily
  @Environment(\.colorScheme) var scheme
  var entry: Provider.Entry
  
  var body: some View {
    let day = entry.widgetData.today.date.day.count == 1 ? "0" + entry.widgetData.today.date.day : entry.widgetData.today.date.day +
    ", " + entry.widgetData.today.date.dayName
    
    if (entry.widgetData.today.shift != nil) {
      VStack {
          HStack {
            Text(entry.widgetData.today.shift!.shortName)
              .font(.system(size: 32))
              .fontWeight(.semibold)
              .foregroundColor(Color.white)
              .padding(.leading, 16)
            Text(entry.widgetData.today.shift!.name)
              .font(.system(size: 32))
              .foregroundColor(Color.white)
              .padding(.leading, 4)
            Spacer()
          }
          .frame(maxWidth: .infinity, maxHeight: 64)
          .background(Color(UIColor(rgb: entry.widgetData.today.shift!.color)))
        Spacer()
        VStack {
          Text(day)
            .font(.system(size: 14))
            .fontWeight(.semibold)
            .foregroundColor(scheme == .dark ?  Color.white: Color(UIColor(rgb: 0x242428)))
            .frame(maxWidth: .infinity, alignment: .leading)
          Text(entry.widgetData.today.shift!.time)
            .font(.system(size: 12))
            .foregroundColor(Color(UIColor(rgb: 0xABABB4)))
            .frame(maxWidth: .infinity, alignment: .leading)
        }
        .frame(maxWidth: .infinity)
        .background(scheme == .dark ? Color(UIColor(rgb: 0x202123)) : Color.white)
        .padding(EdgeInsets(top: 14, leading: 16, bottom: 14, trailing: 16))
      }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(scheme == .dark ? Color(UIColor(rgb: 0x202123)) : Color.white)
    } else {
      VStack {
        Text("근무를 등록해주세요")
          .font(.system(size: 14))
          .fontWeight(.semibold)
          .foregroundColor(scheme == .dark ?  Color.white: Color(UIColor(rgb: 0x242428)))
      }
      .frame(maxWidth: .infinity, maxHeight: .infinity)
      .background(scheme == .dark ? Color(UIColor(rgb: 0x202123)) : Color.white)
    }
  }
}

struct medium01View : View {
  @Environment(\.widgetFamily) var family: WidgetFamily
  @Environment(\.colorScheme) var scheme
  var entry: Provider.Entry
  
  var body: some View {
    HStack(spacing: 0) {
      VStack(alignment: .leading) {
        HStack(alignment: .bottom, spacing: 4) {
          Text(entry.widgetData.today.date.day.count == 1 ? "0" + entry.widgetData.today.date.day : entry.widgetData.today.date.day)
            .font(.system(size: 36))
            .foregroundColor(scheme == .dark ?  Color.white: Color(UIColor(rgb: 0x242428)))
          Text(entry.widgetData.today.date.dayName)
            .frame(height: 28)
            .font(.system(size: 12))
            .foregroundColor(scheme == .dark ?  Color.white: Color(UIColor(rgb: 0x242428)))
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        Spacer()
        if (entry.widgetData.today.shift != nil) {
          HStack {
            HStack {
              Text(entry.widgetData.today.shift!.shortName)
                .font(.system(size: 20))
                .fontWeight(.semibold)
                .foregroundColor(Color.white)
              Text(entry.widgetData.today.shift!.name)
                .font(.system(size: 20))
                .foregroundColor(Color.white)
                .padding(.leading, 4)
            }
            .frame(width: 90, height: 35)
            .background(RoundedRectangle(cornerRadius: 20)
              .fill(Color(UIColor(rgb: entry.widgetData.today.shift!.color))))
            VStack {
              Text(entry.widgetData.today.shift!.time.substring(from: 0, to: 5))
                .font(.system(size: 12))
                .foregroundColor(Color(UIColor(rgb: 0xABABB4)))
                .frame(maxWidth: .infinity, alignment: .leading)
              Text(entry.widgetData.today.shift!.time.substring(from: 5, to: 12))
                .font(.system(size: 12))
                .foregroundColor(Color(UIColor(rgb: 0xABABB4)))
                .frame(maxWidth: .infinity, alignment: .leading)
            }
          }
        } else {
          Text("근무를 등록해주세요")
            .font(.system(size: 14))
            .fontWeight(.semibold)
            .foregroundColor(scheme == .dark ?  Color.white: Color(UIColor(rgb: 0x242428)))
        }
      }
      Spacer()
      VStack(alignment: .leading) {
        if (entry.widgetData.today.schedules.count == 1) {
          HStack {
            Rectangle()
              .fill(Color(UIColor(rgb: entry.widgetData.today.schedules[0].color)))
              .frame(width: 4, height: 36)
            VStack(alignment: .leading){
              Text(entry.widgetData.today.schedules[0].title)
                .font(.system(size: 15))
                .fontWeight(.semibold)
                .lineLimit(1)
                .truncationMode(.tail)
                .foregroundColor(scheme == .dark ?  Color.white: Color(UIColor(rgb: 0x242428)))
              Text(entry.widgetData.today.schedules[0].time)
                .font(.system(size: 12))
                .foregroundColor(Color(UIColor(rgb: 0xABABB4)))
            }
          }
          Spacer()
          Spacer()
        } else if (entry.widgetData.today.schedules.count == 2) {
          HStack {
            Rectangle()
              .fill(Color(UIColor(rgb: entry.widgetData.today.schedules[0].color)))
              .frame(width: 4, height: 36)
            VStack(alignment: .leading){
              Text(entry.widgetData.today.schedules[0].title)
                .font(.system(size: 15))
                .fontWeight(.semibold)
                .lineLimit(1)
                .truncationMode(.tail)
                .foregroundColor(scheme == .dark ?  Color.white: Color(UIColor(rgb: 0x242428)))
              Text(entry.widgetData.today.schedules[0].time)
                .font(.system(size: 12))
                .foregroundColor(Color(UIColor(rgb: 0xABABB4)))
            }
          }
          HStack {
            Rectangle()
              .fill(Color(UIColor(rgb: entry.widgetData.today.schedules[1].color)))
              .frame(width: 4, height: 36)
            VStack(alignment: .leading){
              Text(entry.widgetData.today.schedules[1].title)
                .font(.system(size: 15))
                .fontWeight(.semibold)
                .lineLimit(1)
                .truncationMode(.tail)
                .foregroundColor(scheme == .dark ?  Color.white: Color(UIColor(rgb: 0x242428)))
              Text(entry.widgetData.today.schedules[1].time)
                .font(.system(size: 12))
                .foregroundColor(Color(UIColor(rgb: 0xABABB4)))
            }
          }
          Spacer()
        } else if (entry.widgetData.today.schedules.count >= 3) {
          HStack {
            Rectangle()
              .fill(Color(UIColor(rgb: entry.widgetData.today.schedules[0].color)))
              .frame(width: 4, height: 36)
            VStack(alignment: .leading){
              Text(entry.widgetData.today.schedules[0].title)
                .font(.system(size: 15))
                .fontWeight(.semibold)
                .lineLimit(1)
                .truncationMode(.tail)
                .foregroundColor(scheme == .dark ?  Color.white: Color(UIColor(rgb: 0x242428)))
              Text(entry.widgetData.today.schedules[0].time)
                .font(.system(size: 12))
                .foregroundColor(Color(UIColor(rgb: 0xABABB4)))
            }
          }
          HStack {
            Rectangle()
              .fill(Color(UIColor(rgb: entry.widgetData.today.schedules[1].color)))
              .frame(width: 4, height: 36)
            VStack(alignment: .leading){
              Text(entry.widgetData.today.schedules[1].title)
                .font(.system(size: 15))
                .fontWeight(.semibold)
                .lineLimit(1)
                .truncationMode(.tail)
                .foregroundColor(scheme == .dark ?  Color.white: Color(UIColor(rgb: 0x242428)))
              Text(entry.widgetData.today.schedules[1].time)
                .font(.system(size: 12))
                .foregroundColor(Color(UIColor(rgb: 0xABABB4)))
            }
          }
          HStack {
            Rectangle()
              .fill(Color(UIColor(rgb: entry.widgetData.today.schedules[2].color)))
              .frame(width: 4, height: 36)
            VStack(alignment: .leading){
              Text(entry.widgetData.today.schedules[2].title)
                .font(.system(size: 15))
                .fontWeight(.semibold)
                .lineLimit(1)
                .truncationMode(.tail)
                .foregroundColor(scheme == .dark ?  Color.white: Color(UIColor(rgb: 0x242428)))
              Text(entry.widgetData.today.schedules[2].time)
                .font(.system(size: 12))
                .foregroundColor(Color(UIColor(rgb: 0xABABB4)))
            }
          }
        }
      }
      .frame(width: 124)
    }
    .frame(maxWidth: .infinity, maxHeight: .infinity)
    .padding(EdgeInsets(top: 14, leading: 16, bottom: 14, trailing: 16))
    .background(scheme == .dark ? Color(UIColor(rgb: 0x202123)) : Color.white)
  }
}

struct medium02View : View {
  @Environment(\.widgetFamily) var family: WidgetFamily
  @Environment(\.colorScheme) var scheme
  var entry: Provider.Entry
  
  var body: some View {
    let today = entry.widgetData.today.date.day;
    
    return (
      VStack(spacing: 0) {
        HStack {
          Text(entry.widgetData.week.period)
            .font(.system(size: 15))
            .fontWeight(.semibold)
            .foregroundColor(scheme == .dark ?  Color.white: Color(UIColor(rgb: 0x242428)))
            .frame(maxWidth: .infinity, alignment: .leading)
        }
        .padding(EdgeInsets(top: 14, leading: 16, bottom: 8, trailing: 16))
        Rectangle().fill(Color(UIColor(rgb: 0xE7E7EF)))
          .frame(width: .infinity, height: 1)
          .padding(EdgeInsets(top: 0, leading: 0, bottom: 4, trailing: 0))
        HStack(spacing: 3) {
          ForEach(entry.widgetData.week.shiftList, id: \.date.day) { item in
            VStack {
              Text(item.date.dayName)
                .font(.system(size: 12))
                .fontWeight(.medium)
                .foregroundColor(item.date.day == today ? Color.white : item.date.dayType == "workday" ? (scheme == .dark ? Color(UIColor(rgb: 0xD6D6DE).withAlphaComponent(item.isCurrentMonth ? 1 : 0.5)) :  Color(UIColor(rgb: 0xABABB4).withAlphaComponent(item.isCurrentMonth ? 1 : 0.5))) : item.date.dayType == "sunday" ?  Color(UIColor(rgb: 0xFF99AA).withAlphaComponent(item.isCurrentMonth ? 1 : 0.5)) : Color(UIColor(rgb: 0x8B9BFF).withAlphaComponent(item.isCurrentMonth ? 1 : 0.5)))
              Text(item.date.day)
                .font(.system(size: 12))
                .fontWeight(.semibold)
                .foregroundColor(item.date.day == today ? Color.white : item.date.dayType == "workday" ? (scheme == .dark ? Color(UIColor(rgb: 0xFDFCFE).withAlphaComponent(item.isCurrentMonth ? 1 : 0.5)) :  Color(UIColor(rgb: 0x595961).withAlphaComponent(item.isCurrentMonth ? 1 : 0.5))) : item.date.dayType == "sunday" ?  Color(UIColor(rgb: 0xFF99AA).withAlphaComponent(item.isCurrentMonth ? 1 : 0.5)) : Color(UIColor(rgb: 0x8B9BFF).withAlphaComponent(item.isCurrentMonth ? 1 : 0.5)))
                .padding(.top, 4)
              Spacer()
              if(item.shift != nil) {
                Text(item.shift!.shortName)
                  .font(.system(size: 24))
                  .foregroundColor(Color.white)
                  .fixedSize(horizontal: false, vertical: true)
                  .multilineTextAlignment(.center)
                  .frame(width: 40, height: 40)
                  .background(RoundedRectangle(cornerRadius: 8)
                    .fill(Color(UIColor(rgb: item.shift!.color).withAlphaComponent(item.isCurrentMonth ? 1 : 0.5))))
              } else {
                Text("")
                  .font(.system(size: 24))
                  .foregroundColor(Color.white)
                  .fixedSize(horizontal: false, vertical: true)
                  .multilineTextAlignment(.center)
                  .frame(width: 40, height: 40)
                  .background(RoundedRectangle(cornerRadius: 8)
                    .fill(Color.clear))
              }
            }
            .padding(.top, 7)
            .background(RoundedRectangle(cornerRadius: 8)
              .fill(item.date.day == today ?
                    (item.shift == nil ? Color(UIColor(rgb: 0x93939D)) : Color(UIColor(rgb: item.shift!.color)))
                    : Color.clear)
            )
          }
        }
        .padding(EdgeInsets(top: 0, leading: 16, bottom: 14, trailing: 16))
      }
      .frame(maxWidth: .infinity, maxHeight: .infinity)
      .background(scheme == .dark ? Color(UIColor(rgb: 0x202123)) : Color.white)
    )
  }
}

struct calendarCell: View {
  var scheme: ColorScheme
  var item: DayDuty
  var today: String
  
  var body: some View {
    VStack(alignment: .leading) {
      Text(item.date.day)
        .font(.system(size: 12))
        .fontWeight(.semibold)
        .foregroundColor(item.date.day == today ? Color(UIColor(rgb: 0x844AFF)) : item.date.dayType == "workday" ? (scheme == .dark ? Color(UIColor(rgb: 0xFDFCFE).withAlphaComponent(item.isCurrentMonth ? 1 : 0.5)) :  Color(UIColor(rgb: 0x595961).withAlphaComponent(item.isCurrentMonth ? 1 : 0.5))) : item.date.dayType == "sunday" ?  Color(UIColor(rgb: 0xFF99AA).withAlphaComponent(item.isCurrentMonth ? 1 : 0.5)) : Color(UIColor(rgb: 0x8B9BFF).withAlphaComponent(item.isCurrentMonth ? 1 : 0.5)))
        .padding(.top, 4)
      if(item.shift != nil) {
        Text(item.shift!.name)
          .font(.system(size: 12))
          .foregroundColor(Color.white)
          .fixedSize(horizontal: false, vertical: true)
          .multilineTextAlignment(.center)
          .frame(width: 40, height: 20)
          .background(RoundedRectangle(cornerRadius: 3)
            .fill(Color(UIColor(rgb: item.shift!.color).withAlphaComponent(item.isCurrentMonth ? 1 : 0.5))))
      } else {
        Text("")
          .font(.system(size: 12))
          .foregroundColor(Color.white)
          .fixedSize(horizontal: false, vertical: true)
          .multilineTextAlignment(.center)
          .frame(width: 40, height: 20)
          .background(RoundedRectangle(cornerRadius: 3)
            .fill(Color.clear))
      }
    }
    .padding(EdgeInsets(top: 4, leading: 0, bottom: 10, trailing: 0))
    .background(item.date.day == today ? Color(UIColor(rgb: 0xEDE4FF)) : Color.clear)
  }
}

struct large01View: View {
  @Environment(\.widgetFamily) var family: WidgetFamily
  @Environment(\.colorScheme) var scheme
  var entry: Provider.Entry
  
  var body: some View {
    let today = entry.widgetData.today.date.day;
    
    return (
      VStack(spacing: 0) {
        HStack {
          Text(String(entry.widgetData.month.year) + "." + String(entry.widgetData.month.month))
            .font(.system(size: 15))
            .fontWeight(.semibold)
            .foregroundColor(scheme == .dark ?  Color.white: Color(UIColor(rgb: 0x242428)))
            .frame(maxWidth: .infinity, alignment: .leading)
        }
        .padding(EdgeInsets(top: 14, leading: 16, bottom: 8, trailing: 16))
        HStack(spacing: 3) {
          Text("일")
            .font(.system(size: 12))
            .fontWeight(.medium)
            .frame(width: 40)
            .foregroundColor(Color(UIColor(rgb: 0xFF99AA)))
          Text("월")
            .font(.system(size: 12))
            .fontWeight(.medium)
            .frame(width: 40)
            .foregroundColor(scheme == .dark ? Color(UIColor(rgb: 0xE7E7EF)) :  Color(UIColor(rgb: 0x93939D)))
          Text("화")
            .font(.system(size: 12))
            .fontWeight(.medium)
            .frame(width: 40)
            .foregroundColor(scheme == .dark ? Color(UIColor(rgb: 0xE7E7EF)) :  Color(UIColor(rgb: 0x93939D)))
          Text("수")
            .font(.system(size: 12))
            .fontWeight(.medium)
            .frame(width: 40)
            .foregroundColor(scheme == .dark ? Color(UIColor(rgb: 0xE7E7EF)) :  Color(UIColor(rgb: 0x93939D)))
          Text("목")
            .font(.system(size: 12))
            .fontWeight(.medium)
            .frame(width: 40)
            .foregroundColor(scheme == .dark ? Color(UIColor(rgb: 0xE7E7EF)) :  Color(UIColor(rgb: 0x93939D)))
          Text("금")
            .font(.system(size: 12))
            .fontWeight(.medium)
            .frame(width: 40)
            .foregroundColor(scheme == .dark ? Color(UIColor(rgb: 0xE7E7EF)) :  Color(UIColor(rgb: 0x93939D)))
          Text("토")
            .font(.system(size: 12))
            .fontWeight(.medium)
            .frame(width: 40)
            .foregroundColor(Color(UIColor(rgb: 0x8B9BFF)))
        }
        Rectangle().fill(Color(UIColor(rgb: 0xE7E7EF)))
          .frame(width: .infinity, height: 1)
          .padding(EdgeInsets(top: 0, leading: 0, bottom: 0, trailing: 0))
        ForEach(entry.widgetData.month.calendar, id: \.self[0].date.day) { row in
          VStack(spacing: 0) {
            HStack(spacing: 3) {
              ForEach(row, id: \.date.day) { item in
                calendarCell(scheme: scheme, item: item, today: today)
              }
            }
            .padding(EdgeInsets(top: 0, leading: 16, bottom: 0, trailing: 16))
            if(entry.widgetData.month.calendar.last![0].date.day != row[0].date.day) {
              Rectangle().fill(Color(UIColor(rgb: 0xE7E7EF)))
                .frame(width: .infinity, height: 1)
                .padding(EdgeInsets(top: 0, leading: 0, bottom: 0, trailing: 0))
            }
          }
        }
      }
      .frame(maxWidth: .infinity, maxHeight: .infinity)
      .background(scheme == .dark ? Color(UIColor(rgb: 0x202123)) : Color.white)
    )
  }
}


struct WidgetEntry: TimelineEntry {
  let date: Date, widgetData: WidgetData;
}

struct Small01Widget: Widget {
  let kind: String = "dutying_small_1"
  
  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: Provider()) { entry in
      small01View(entry: entry)
    }
    .configurationDisplayName("오늘 근무와 일정")
    .description("오늘 근무와 일정을 함께 봐요")
    .supportedFamilies([.systemSmall])
    .disableContentMarginsIfNeeded()
  }
}

struct Small02Widget: Widget {
  let kind: String = "dutying_small_2"
  
  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: Provider()) { entry in
      small02View(entry: entry)
    }
    .configurationDisplayName("오늘 근무")
    .description("오늘 근무를 확인해요")
    .supportedFamilies([.systemSmall])
    .disableContentMarginsIfNeeded()
  }
}

struct Medium01Widget: Widget {
  let kind: String = "dutying_medium_1"
  
  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: Provider()) { entry in
      medium01View(entry: entry)
    }
    .configurationDisplayName("오늘 근무와 일정")
    .description("오늘 근무와 일정을 함께 봐요")
    .supportedFamilies([.systemMedium])
    .disableContentMarginsIfNeeded()
  }
}

struct Medium02Widget: Widget {
  let kind: String = "dutying_medium_2"
  
  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: Provider()) { entry in
      medium02View(entry: entry)
    }
    .configurationDisplayName("이번주 근무")
    .description("이번주 근무 일정을 확인해요")
    .supportedFamilies([.systemMedium])
    .disableContentMarginsIfNeeded()
  }
}

struct Large01Widget: Widget {
  let kind: String = "dutying_large_1"
  
  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: Provider()) { entry in
      large01View(entry: entry)
    }
    .configurationDisplayName("이번달 근무")
    .description("이번달 근무 일정을 확인해요")
    .supportedFamilies([.systemLarge])
    .disableContentMarginsIfNeeded()
  }
}

@main
struct NSWidgetBundle: WidgetBundle {
  @WidgetBundleBuilder
  var body: some Widget {
    Small01Widget()
    Small02Widget()
    Medium01Widget()
    Medium02Widget()
    Large01Widget()
  }
}

struct widget_Previews: PreviewProvider {
  static var previews: some View {
    small01View(entry: WidgetEntry(date: Date(), widgetData: mockWidgetData))
      .previewContext(WidgetPreviewContext(family: .systemSmall))
  }
}
