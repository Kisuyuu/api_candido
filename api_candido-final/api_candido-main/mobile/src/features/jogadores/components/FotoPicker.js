import { useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Controller } from 'react-hook-form';
import { colors, radius } from '../../../core/theme';
import { Avatar } from '../../../shared/components/Avatar';
import { useToast } from '../../../shared/components/Toast';

const PICKER_OPTIONS = { mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.7 };

function toFoto(asset) {
  const ext = (asset.uri.split('.').pop() || 'jpg').split('?')[0].toLowerCase();
  return {
    uri: asset.uri,
    name: asset.fileName || `foto-perfil.${ext}`,
    type: asset.mimeType || (ext === 'png' ? 'image/png' : 'image/jpeg'),
  };
}

/** Foto de perfil: escolhe da galeria ou tira com a câmera. `currentUri` é a foto já salva na API. */
export function FotoPicker({ control, name = 'foto', currentUri, nome }) {
  const [sheet, setSheet] = useState(false);
  const toast = useToast();

  async function pick(source, onChange) {
    setSheet(false);

    const request =
      source === 'camera'
        ? ImagePicker.requestCameraPermissionsAsync
        : ImagePicker.requestMediaLibraryPermissionsAsync;
    const permission = await request();

    if (!permission.granted) {
      toast.show('Permissão negada. Autorize o acesso nas configurações do aparelho.', 'error');
      return;
    }

    const launch = source === 'camera' ? ImagePicker.launchCameraAsync : ImagePicker.launchImageLibraryAsync;
    const result = await launch(PICKER_OPTIONS);

    if (!result.canceled && result.assets?.[0]) {
      onChange(toFoto(result.assets[0]));
    }
  }

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <View style={styles.wrap}>
          <Pressable onPress={() => setSheet(true)} accessibilityRole="button" accessibilityLabel="Alterar foto de perfil">
            <Avatar uri={value?.uri || currentUri} name={nome || 'Jogador'} size={104} />
            <View style={styles.camera}>
              <Text style={styles.cameraIcon}>📷</Text>
            </View>
          </Pressable>
          <Text style={styles.caption}>{value ? 'Nova foto selecionada' : 'Toque para alterar a foto'}</Text>

          <Modal visible={sheet} transparent animationType="slide" onRequestClose={() => setSheet(false)}>
            <Pressable style={styles.overlay} onPress={() => setSheet(false)}>
              <Pressable style={styles.sheet} onPress={() => {}}>
                <View style={styles.handle} />
                <Text style={styles.sheetTitle}>Foto de perfil</Text>
                {Platform.OS !== 'web' && <Option label="📷  Tirar foto" onPress={() => pick('camera', onChange)} />}
                <Option label="🖼️  Escolher da galeria" onPress={() => pick('library', onChange)} />
                {value ? (
                  <Option
                    label="↩︎  Descartar nova foto"
                    onPress={() => {
                      onChange(null);
                      setSheet(false);
                    }}
                  />
                ) : null}
                <Option label="Cancelar" muted onPress={() => setSheet(false)} />
              </Pressable>
            </Pressable>
          </Modal>
        </View>
      )}
    />
  );
}

function Option({ label, onPress, muted }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.option, pressed && { backgroundColor: colors.soft }]}>
      <Text style={[styles.optionText, muted && { color: colors.muted }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', marginBottom: 22 },
  camera: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIcon: { fontSize: 15 },
  caption: { marginTop: 10, fontSize: 12, fontWeight: '700', color: colors.muted },
  overlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end', alignItems: 'center' },
  sheet: {
    width: '100%',
    maxWidth: 560,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: 20,
    paddingBottom: 32,
  },
  handle: { alignSelf: 'center', width: 44, height: 5, borderRadius: 3, backgroundColor: colors.border, marginBottom: 14 },
  sheetTitle: { fontSize: 18, fontWeight: '900', color: colors.ink, marginBottom: 8 },
  option: { paddingVertical: 15, paddingHorizontal: 10, borderRadius: radius.md },
  optionText: { fontSize: 16, fontWeight: '700', color: colors.ink },
});
