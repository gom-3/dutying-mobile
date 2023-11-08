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

extension WidgetConfiguration {
  func disableContentMarginsIfNeeded() -> some WidgetConfiguration {
    if #available(iOSApplicationExtension 17.0, *) {
      return self.contentMarginsDisabled()
    } else {
      return self
    }
  }
}

struct Shift:Codable {
  let name: String, shortName: String, color: Int;
}

struct WeekItem:Codable {
  let day: Int
  let dayName: String
  let isToday: Bool
  let shift: Shift
}

struct DutyModel:Codable {
  let today: Shift, week: [WeekItem]
}

var mockDutyModel: DutyModel = DutyModel(
  today: Shift(name: "데이", shortName: "D", color: 0x4DC2AD),
  week:  [
    WeekItem(day: 29, dayName: "일", isToday: false, shift: Shift(name: "데이", shortName: "D", color: 0x4DC2AD)),
    WeekItem(day: 30, dayName: "월", isToday: false, shift: Shift(name: "데이", shortName: "D", color: 0x4DC2AD)),
    WeekItem(day: 31, dayName: "화", isToday: false, shift: Shift(name: "이브닝", shortName: "E", color: 0xFF8BA5)),
    WeekItem(day: 1, dayName: "수", isToday: false, shift: Shift(name: "나이트", shortName: "N", color: 0x3580FF)),
    WeekItem(day: 2, dayName: "목", isToday: false, shift: Shift(name: "오프", shortName: "O", color: 0x465B7A)),
    WeekItem(day: 3, dayName: "금", isToday: true, shift: Shift(name: "오프", shortName: "O", color: 0x465B7A)),
    WeekItem(day: 4, dayName: "토", isToday: false, shift: Shift(name: "나이트", shortName: "N", color: 0x3580FF)),
  ]
)

struct Provider: TimelineProvider {
  func placeholder(in context: Context) -> WidgetEntry {
    WidgetEntry(date: Date(), duty: mockDutyModel)
  }
  
  func getSnapshot(in context: Context, completion: @escaping (WidgetEntry) -> ()) {
    let entry = WidgetEntry(date: Date(), duty: mockDutyModel)
    completion(entry)
  }
  
  func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
    var entries: [WidgetEntry] = []
    
    let userDefaults = UserDefaults(suiteName: "group.expo.modules.widgetsync.example")
    let jsonText = userDefaults?.string(forKey: "savedData")
    
    var duty : DutyModel = mockDutyModel;
    
//    do {
//      if jsonText != nil {
//        let jsonData = Data(jsonText?.utf8 ?? "".utf8)
//        let valueData = try JSONDecoder().decode(DutyModel.self, from: jsonData)
//        duty = valueData
//      }
//    } catch {
//      print(error)
//    }
    
    // Generate a timeline consisting of five entries an hour apart, starting from the current date.
    let currentDate = Date()
    for hourOffset in 1 ..< 10 {
        let entryDate = Calendar.current.date(byAdding: .second, value: hourOffset * 30, to: currentDate)!
        let entry = WidgetEntry(date: entryDate, duty: duty)
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
      Text("03, 금")
        .font(.system(size: 14))
        .fontWeight(.semibold)
        .foregroundColor(scheme == .dark ?  Color.white: Color(UIColor(rgb: 0x242428)))
        .frame(maxWidth: .infinity, alignment: .leading)
      Spacer()
      Text(entry.duty.today.shortName)
        .font(.system(size: 36))
        .foregroundColor(Color.white)
        .fixedSize(horizontal: false, vertical: true)
        .multilineTextAlignment(.center)
        .frame(width: 58, height: 58)
        .background(RoundedRectangle(cornerRadius: 8)
          .fill(Color(UIColor(rgb: entry.duty.today.color))))
      Spacer()
      HStack {
        Rectangle()
          .fill(Color(UIColor(rgb: 0xF8E85A)))
          .frame(width: 4, height: 36)
        VStack(alignment: .leading){
          Text("미용실 가기")
            .font(.system(size: 15))
            .fontWeight(.semibold)
            .lineLimit(1)
            .truncationMode(.tail)
            .foregroundColor(scheme == .dark ?  Color.white: Color(UIColor(rgb: 0x242428)))
          Text("10:00-11:30")
            .font(.system(size: 12))
            .foregroundColor(Color(UIColor(rgb: 0xABABB4)))
        }
        Spacer()
        Text("+2")
          .font(.system(size: 14))
          .foregroundColor(scheme == .dark ?  Color(UIColor(rgb: 0x595961)): Color(UIColor(rgb: 0x242428)))
          .fixedSize(horizontal: false, vertical: true)
          .multilineTextAlignment(.center)
          .frame(width: 30, height: 30)
          .background(RoundedRectangle(cornerRadius: .infinity)
            .fill(scheme == .dark ?  Color(UIColor(rgb: 0xD6D6DE)): Color(UIColor(rgb: 0xF2F2F7))))
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
    VStack {
      HStack {
        Text(entry.duty.today.shortName)
          .font(.system(size: 32))
          .fontWeight(.semibold)
          .foregroundColor(Color.white)
          .padding(.leading, 16)
        Text(entry.duty.today.name)
          .font(.system(size: 32))
          .foregroundColor(Color.white)
          .padding(.leading, 4)
        Spacer()
      }
      .frame(maxWidth: .infinity, maxHeight: 64)
      .background(Color(UIColor(rgb: entry.duty.today.color)))
      Spacer()
      VStack {
        Text("03, 금")
          .font(.system(size: 14))
          .fontWeight(.semibold)
          .foregroundColor(scheme == .dark ?  Color.white: Color(UIColor(rgb: 0x242428)))
          .frame(maxWidth: .infinity, alignment: .leading)
        Text("10:00-11:30")
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
          Text("03")
            .font(.system(size: 36))
            .foregroundColor(scheme == .dark ?  Color.white: Color(UIColor(rgb: 0x242428)))
          Text("금")
            .frame(height: 28)
            .font(.system(size: 12))
            .foregroundColor(scheme == .dark ?  Color.white: Color(UIColor(rgb: 0x242428)))
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        Spacer()
        HStack {
          HStack {
            Text(entry.duty.today.shortName)
              .font(.system(size: 20))
              .fontWeight(.semibold)
              .foregroundColor(Color.white)
            Text(entry.duty.today.name)
              .font(.system(size: 20))
              .foregroundColor(Color.white)
              .padding(.leading, 4)
          }
          .frame(width: 87, height: 35)
          .background(RoundedRectangle(cornerRadius: 20)
            .fill(Color(UIColor(rgb: entry.duty.today.color))))
          VStack {
            Text("07:00")
              .font(.system(size: 12))
              .foregroundColor(Color(UIColor(rgb: 0xABABB4)))
              .frame(maxWidth: .infinity, alignment: .leading)
            Text("-14:30")
              .font(.system(size: 12))
              .foregroundColor(Color(UIColor(rgb: 0xABABB4)))
              .frame(maxWidth: .infinity, alignment: .leading)
          }
        }
      }
      Spacer()
      VStack(alignment: .leading) {
        HStack {
          Rectangle()
            .fill(Color(UIColor(rgb: 0xFF2164)))
            .frame(width: 4, height: 36)
          VStack(alignment: .leading){
            Text("한글날")
              .font(.system(size: 15))
              .fontWeight(.semibold)
              .lineLimit(1)
              .truncationMode(.tail)
              .foregroundColor(scheme == .dark ?  Color.white: Color(UIColor(rgb: 0x242428)))
            Text("-")
              .font(.system(size: 12))
              .foregroundColor(Color(UIColor(rgb: 0xABABB4)))
          }
        }
        Rectangle().fill(Color(UIColor(rgb: 0xE7E7EF))).frame(width: 122, height: 0.5)
        HStack {
          Rectangle()
            .fill(Color(UIColor(rgb: 0xEB5AF8)))
            .frame(width: 4, height: 36)
          VStack(alignment: .leading){
            Text("듀팅이 생일")
              .font(.system(size: 15))
              .fontWeight(.semibold)
              .lineLimit(1)
              .truncationMode(.tail)
              .foregroundColor(scheme == .dark ?  Color.white: Color(UIColor(rgb: 0x242428)))
            Text("-")
              .font(.system(size: 12))
              .foregroundColor(Color(UIColor(rgb: 0xABABB4)))
          }
        }
        Rectangle().fill(Color(UIColor(rgb: 0xE7E7EF))).frame(width: 122, height: 0.5)
        HStack {
          Rectangle()
            .fill(Color(UIColor(rgb: 0xF8E85A)))
            .frame(width: 4, height: 36)
          VStack(alignment: .leading){
            Text("미용실 가기")
              .font(.system(size: 15))
              .fontWeight(.semibold)
              .lineLimit(1)
              .truncationMode(.tail)
              .foregroundColor(scheme == .dark ?  Color.white: Color(UIColor(rgb: 0x242428)))
            Text("10:00-11:30")
              .font(.system(size: 12))
              .foregroundColor(Color(UIColor(rgb: 0xABABB4)))
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
    VStack(spacing: 0) {
      HStack {
        Text("10.29 - 11.04")
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
        ForEach(entry.duty.week, id: \.day) { item in
          VStack {
            Text(item.dayName)
              .font(.system(size: 12))
              .fontWeight(.medium)
              .foregroundColor(item.isToday ? Color.white : scheme == .dark ? Color(UIColor(rgb: 0xD6D6DE)) :  Color(UIColor(rgb: 0x242428)))
            Text(String(item.day))
              .font(.system(size: 12))
              .fontWeight(.semibold)
              .foregroundColor(item.isToday ? Color.white : scheme == .dark ? Color(UIColor(rgb: 0xFDFCFE)) :  Color(UIColor(rgb: 0x242428)))
              .padding(.top, 4)
            Spacer()
            Text(item.shift.shortName)
              .font(.system(size: 24))
              .foregroundColor(Color.white)
              .fixedSize(horizontal: false, vertical: true)
              .multilineTextAlignment(.center)
              .frame(width: 40, height: 40)
              .background(RoundedRectangle(cornerRadius: 8)
                .fill(Color(UIColor(rgb: item.shift.color))))
          }
          .padding(.top, 7)
          .background(RoundedRectangle(cornerRadius: 8)
            .fill(item.isToday ? Color(UIColor(rgb: item.shift.color)): Color.clear))
//          .background(item.isToday ? RoundedRectangle(cornerRadius: 8)
//            .fill(Color(UIColor(rgb: item.shift.color))) as! Color : Color.clear)
        }
      }
      .padding(EdgeInsets(top: 0, leading: 16, bottom: 14, trailing: 16))
    }
    .frame(maxWidth: .infinity, maxHeight: .infinity)
    .background(scheme == .dark ? Color(UIColor(rgb: 0x202123)) : Color.white)
  }
}


struct WidgetEntry: TimelineEntry {
  let date: Date, duty: DutyModel
}

struct Small01Widget: Widget {
  let kind: String = "dutying_small_1"
  
  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: Provider()) { entry in
      small01View(entry: entry)
    }
    .configurationDisplayName("듀팅 | 작은 사이즈")
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
    .configurationDisplayName("듀팅 | 작은 사이즈")
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
    .configurationDisplayName("듀팅 | 중간 사이즈")
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
    .configurationDisplayName("듀팅 | 중간 사이즈")
    .description("이번주 근무 일정을 확인해요")
    .supportedFamilies([.systemMedium])
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
  }
}

struct widget_Previews: PreviewProvider {
  static var previews: some View {
    small01View(entry: WidgetEntry(date: Date(), duty: mockDutyModel))
      .previewContext(WidgetPreviewContext(family: .systemSmall))
  }
}
