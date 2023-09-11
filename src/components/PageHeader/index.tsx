import { useNavigation } from '@react-navigation/native';
import { COLOR } from 'index.style';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import PrevIcon from '@assets/svgs/back-arrow.svg';

interface Props {
  title: string;
  rightItems?: JSX.Element;
  titleMargin?: number;
}

const PageHeader = ({ title, rightItems, titleMargin }: Props) => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <Pressable onPress={() => navigation.goBack()}>
        <PrevIcon />
      </Pressable>
      <Text style={[styles.headerTitle, { marginLeft: titleMargin ? titleMargin : 0 }]}>
        {title}
      </Text>
      {rightItems ?? <View style={styles.blank} />}
    </View>
  );
};

export default PageHeader;

const styles = StyleSheet.create({
  header: {
    marginHorizontal: 24,
    marginVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { fontFamily: 'Apple500', fontSize: 16, color: COLOR.sub1 },
  blank: { width: 24 },
});
