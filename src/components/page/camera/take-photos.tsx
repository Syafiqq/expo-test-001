import { type CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { setPhoto } from '@/core/state/take-photo-slice';
import { useAppDispatch } from '@/core/state/use-redux';
import { nullableToUndefined } from '@/core/type-utils';

// eslint-disable-next-line max-lines-per-function
export default function TakePhotos() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [pictureSize, setPictureSize] = useState<string | undefined>(undefined);
  const [isCameraReady, setCameraReady] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  async function getRecommendedSize(): Promise<string | null> {
    const camera = cameraRef.current;
    if (!camera) {
      return null;
    }

    const sizes = await camera.getAvailablePictureSizesAsync();
    if (!sizes || sizes.length === 0) {
      return null;
    }

    return sizes[sizes.length - 1];
  }

  async function takePicture() {
    if (!isCameraReady) {
      return;
    }

    const camera = cameraRef.current;
    if (!camera) {
      return;
    }

    const result = await camera.takePictureAsync({
      quality: 1,
      exif: false,
      base64: false,
    });
    if (!result) {
      return;
    }
    if (router.canGoBack()) {
      router.back();
    }
    dispatch(setPhoto(result));
  }

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission().then().catch();
    }
  }, [permission, requestPermission]);

  useEffect(() => {
    if (cameraRef.current) {
      getRecommendedSize()
        .then((size) => {
          setPictureSize(nullableToUndefined(size));
        })
        .catch((error) => {
          console.error('Failed to get recommended size', error);
        });
    }
  }, [cameraRef]);

  if (!permission && !pictureSize) {
    return <View />;
  }

  return (
    <View className="flex-1 justify-center">
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        className="flex"
        facing={facing}
        pictureSize={pictureSize}
        onCameraReady={() => setCameraReady(true)}
      >
        <View className="m-16 flex-1 flex-row bg-transparent">
          <TouchableOpacity
            className="flex-1 items-center self-end"
            onPress={toggleCameraFacing}
            disabled={!isCameraReady}
          >
            <Text className="text-2xl font-bold text-white">Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 items-center self-end"
            onPress={takePicture}
            disabled={!isCameraReady}
          >
            <Text className="text-2xl font-bold text-white">Take Picture</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}
