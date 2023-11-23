import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import { COLOR } from 'index.style';
import { useCallback, useRef } from 'react';
import { Keyboard, Pressable, StyleSheet, View } from 'react-native';
import ColorPickers, {
  Panel1,
  Swatches,
  colorKit,
  returnedResults,
  HueCircular,
  PreviewText,
} from 'reanimated-color-picker';
import PlusIcon from '@assets/svgs/plus-gray.svg';
import BottomSheetHeader from '@components/BottomSheetHeader';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CheckIcon from '@assets/svgs/check.svg';

interface Props {
  color: string;
  onChange: (color: string) => void;
}

const customSwatches = new Array(6).fill('').map(() => colorKit.randomRgbColor().hex());

const ColorPicker = ({ color, onChange }: Props) => {
  const ref = useRef<BottomSheetModal>(null);

  const renderBackdrop = useCallback((props: any) => <BottomSheetBackdrop {...props} />, []);

  const onSelectColor = (color: returnedResults) => {
    onChange(color.hex);
  };

  return (
    <View>
      <Pressable
        onPress={() => {
          Keyboard.dismiss();
          ref.current?.present();
        }}
      >
        <View style={[styles.color, { backgroundColor: color }]}>
          {color === 'white' && <PlusIcon />}
        </View>
      </Pressable>
      <BottomSheetModal
        ref={ref}
        index={1}
        enableContentPanningGesture={false}
        snapPoints={[300, 500]}
        handleComponent={null}
        backdropComponent={renderBackdrop}
        onChange={(index) => {
          if (index !== 1) ref.current?.close();
        }}
        style={{ padding: 15 }}
      >
        <BottomSheetHeader
          onPressExit={() => ref.current?.close()}
          rightItems={
            <TouchableOpacity onPress={() => ref.current?.close()}>
              <CheckIcon />
            </TouchableOpacity>
          }
        />
        <View style={styles.pickerContainer}>
          <ColorPickers
            value={color}
            sliderThickness={20}
            thumbSize={24}
            onChange={onSelectColor}
            boundedThumb
          >
            <HueCircular containerStyle={styles.hueContainer} thumbShape="pill">
              <Panel1 style={styles.panelStyle} />
            </HueCircular>
            {/* <Swatches
              style={styles.swatchesContainer}
              swatchStyle={styles.swatchStyle}
              colors={customSwatches}
            /> */}
            <View style={styles.previewTxtContainer}>
              <PreviewText style={{ color: '#707070' }} colorFormat="hsl" />
            </View>
          </ColorPickers>
        </View>
      </BottomSheetModal>
    </View>
  );
};

const styles = StyleSheet.create({
  color: {
    width: 54,
    height: 54,
    marginTop: 16,
    borderRadius: 5,
    borderColor: COLOR.sub4,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {
    alignSelf: 'center',
    width: 300,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
  },
  hueContainer: {
    justifyContent: 'center',
  },
  panelStyle: {
    width: '70%',
    height: '70%',
    alignSelf: 'center',
    borderRadius: 16,
  },
  previewTxtContainer: {
    paddingTop: 20,
    marginTop: 20,
    borderTopWidth: 1,
    borderColor: '#bebdbe',
  },
  swatchesContainer: {
    paddingTop: 20,
    marginTop: 20,
    borderTopWidth: 1,
    borderColor: '#bebdbe',
    alignItems: 'center',
    flexWrap: 'nowrap',
    gap: 10,
  },
  swatchStyle: {
    borderRadius: 20,
    height: 30,
    width: 30,
    margin: 0,
    marginBottom: 0,
    marginHorizontal: 0,
    marginVertical: 0,
  },
});

export default ColorPicker;
