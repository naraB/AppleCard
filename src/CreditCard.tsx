import React from 'react';
import {
  Blend,
  Box,
  Canvas,
  ImageSVG,
  useComputedValue,
  interpolate,
  RadialGradient,
  rect,
  rrect,
  useSharedValueEffect,
  useSVG,
  useValue,
  vec,
  Skia,
  Group,
  BoxShadow,
} from '@shopify/react-native-skia';
import { ScreenWidth } from './constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  useAnimatedSensor,
  SensorType,
  useAnimatedReaction,
  useSharedValue,
  Extrapolate,
} from 'react-native-reanimated';
import { toMatrix3, processTransform3d } from './redash/Matrix4';

export const degreeToRad = (degree: number) => {
  'worklet';

  return degree * (Math.PI / 180);
};

export const CreditCard = () => {
  const safeAreaInsets = useSafeAreaInsets();
  const width = ScreenWidth - 32;
  const height = 240;
  const x = (ScreenWidth - width) / 2;
  const y = safeAreaInsets.top;
  const apple = useSVG(require('./assets/apple.svg'));
  const mastercard = useSVG(require('./assets/mastercard.svg'));

  const animatedSensor = useAnimatedSensor(SensorType.ROTATION, { interval: 1 });
  const roll = useSharedValue(0);
  const pitch = useSharedValue(0);
  const rotateX = useValue(0);
  const rotateY = useValue(0);
  const translateX = useValue(0);
  const translateY = useValue(0);

  useAnimatedReaction(
    () => animatedSensor.sensor.value,
    (s) => {
      pitch.value = s.pitch;
      roll.value = s.roll;
    },
    []
  );

  useSharedValueEffect(
    () => {
      translateX.current = interpolate(
        roll.value,
        [-Math.PI / 2, Math.PI / 2],
        [-40 * 3, 40 * 3],
        Extrapolate.CLAMP
      );
      translateY.current = interpolate(
        pitch.value,
        [-Math.PI / 2, Math.PI / 2],
        [-40 * 3, 40 * 3],
        Extrapolate.CLAMP
      );

      rotateY.current = interpolate(
        roll.value,
        [-Math.PI, Math.PI],
        [degreeToRad(-40), degreeToRad(40)],
        Extrapolate.CLAMP
      );

      rotateX.current = interpolate(
        pitch.value,
        [-Math.PI, Math.PI],
        [degreeToRad(40), degreeToRad(-40)],
        Extrapolate.CLAMP
      );
    },
    roll,
    pitch
  );

  const transform = useComputedValue(
    () => [{ translateX: translateX.current }, { translateY: translateY.current }],
    [translateX, translateY]
  );

  const matrix = useComputedValue(() => {
    const mat3 = toMatrix3(
      processTransform3d([
        { perspective: 300 },
        { rotateY: rotateY.current },
        { rotateX: rotateX.current },
      ])
    );

    return Skia.Matrix(mat3);
  }, [rotateX, rotateY]);

  return (
    <Canvas style={{ width: '100%', height: height + y + 128 }}>
      <Group origin={vec(ScreenWidth / 2, (y + height) / 2)} matrix={matrix}>
        <Box box={rrect(rect(x, y, width, height), 12, 12)} color="#FFF">
          <BoxShadow blur={10} color="rgba(0,0,0,0.4)" dx={5} dy={5} />
          <Blend mode="color">
            <Blend mode="colorBurn">
              <Blend mode="colorBurn">
                <RadialGradient
                  c={vec(ScreenWidth / 2 - 120, y + height / 2 + 40)}
                  r={120}
                  colors={['rgba(162,126,252,1)', 'rgba(162,126,252,0.3)']}
                  transform={transform}
                />
                <RadialGradient
                  c={vec(ScreenWidth / 2, y + height / 2 - 40)}
                  r={120}
                  colors={['rgba(247,146,78,1)', 'rgba(247,146,78,0.3)']}
                  transform={transform}
                />
              </Blend>
              <RadialGradient
                c={vec(ScreenWidth / 2 + 80, y + height / 2 + 40)}
                r={120}
                colors={['rgba(243,186,58,1)', 'rgba(243,186,58,0.3)']}
                transform={transform}
              />
            </Blend>

            <RadialGradient
              c={vec(ScreenWidth / 2, y + height / 2 + 80)}
              r={120}
              colors={['rgba(44,197,53,1)', 'rgba(44,197,53,0.1)']}
              transform={transform}
            />
          </Blend>
        </Box>
        {apple && <ImageSVG x={40} y={y + 16} svg={apple} height={30} width={37} />}
        {mastercard && (
          <ImageSVG
            x={ScreenWidth - 40 - 45}
            y={y + height - 16 - 28}
            svg={mastercard}
            height={28}
            width={45}
          />
        )}
      </Group>
    </Canvas>
  );
};
