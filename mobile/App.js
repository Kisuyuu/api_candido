import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import {
  Alert,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  createPlayer,
  deletePlayer,
  getPhotoUrl,
  getPlayer,
  listPlayers,
  updatePlayer,
} from './src/services/api';

const initialPlayer = {
  nome_usuario: '',
  email: '',
  senha: '',
  nivel: '1',
  xp: '0',
  moedas: '0',
  data_nascimento: '',
  personagem_favorito: '',
  plataforma: '',
  photo: null,
};

export default function App() {
  const [screen, setScreen] = useState('home');
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function loadPlayers(showSpinner = true) {
    if (showSpinner) {
      setLoading(true);
    }

    try {
      setError('');
      setPlayers(await listPlayers());
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadPlayers();
  }, []);

  function navigate(nextScreen) {
    setError('');
    setSuccess('');
    setScreen(nextScreen);
  }

  async function openPlayer(player) {
    try {
      setError('');
      const currentPlayer = await getPlayer(player.id);
      setSelectedPlayer(currentPlayer);
      setScreen('detail');
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function openEdit(player) {
    try {
      setError('');
      const currentPlayer = await getPlayer(player.id);
      setEditingPlayer(currentPlayer);
      setScreen('form');
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  function confirmDelete(player) {
    Alert.alert(
      'Excluir jogador',
      `Deseja excluir ${player.nome_usuario}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              setError('');
              await deletePlayer(player.id);
              setSuccess('Jogador excluído com sucesso.');
              await loadPlayers(false);
              if (selectedPlayer?.id === player.id) {
                setSelectedPlayer(null);
                setScreen('players');
              }
            } catch (requestError) {
              setError(requestError.message);
            }
          },
        },
      ]
    );
  }

  async function savePlayer(player) {
    try {
      setError('');
      if (editingPlayer) {
        await updatePlayer(editingPlayer.id, player);
        setSuccess('Jogador atualizado com sucesso.');
      } else {
        await createPlayer(player);
        setSuccess('Jogador cadastrado com sucesso.');
      }

      setEditingPlayer(null);
      await loadPlayers(false);
      setScreen('players');
    } catch (requestError) {
      setError(requestError.message);
      throw requestError;
    }
  }

  function renderContent() {
    if (screen === 'form') {
      return (
        <PlayerForm
          key={editingPlayer?.id || 'new'}
          player={editingPlayer}
                    error={error}
          onCancel={() => {
            setEditingPlayer(null);
            navigate('players');
          }}
          onSubmit={savePlayer}
        />
      );
    }

    if (screen === 'detail' && selectedPlayer) {
      return (
        <PlayerDetails
          player={selectedPlayer}
          onEdit={() => openEdit(selectedPlayer)}
          onDelete={() => confirmDelete(selectedPlayer)}
          onBack={() => navigate('players')}
        />
      );
    }

    if (screen === 'players') {
      return (
        <PlayersScreen
          players={players}
          loading={loading}
          onRefresh={() => {
            setRefreshing(true);
            loadPlayers(false);
          }}
          onOpen={openPlayer}
          onEdit={openEdit}
          onDelete={confirmDelete}
          onCreate={() => {
            setEditingPlayer(null);
            navigate('form');
          }}
        />
      );
    }

    return (
      <HomeScreen
        players={players}
        onPlayers={() => navigate('players')}
        onCreate={() => {
          setEditingPlayer(null);
          navigate('form');
        }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.app}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerSmall}>BEM-VINDO</Text>
            <Text style={styles.headerTitle}>GameHub</Text>
          </View>
          <Text style={styles.headerAvatar}>👤</Text>
        </View>

        {(error || success) && screen !== 'form' && (
          <Message message={error || success} type={error ? 'error' : 'success'} />
        )}

        <View style={styles.content}>{renderContent()}</View>
        <BottomNavigation screen={screen} onNavigate={navigate} />
      </View>
    </SafeAreaView>
  );
}

function HomeScreen({ players, onPlayers, onCreate }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.welcomeCard}>
        <View>
          <Text style={styles.cardLabel}>SEU PERFIL</Text>
          <Text style={styles.welcomeName}>Kisuyu</Text>
          <Text style={styles.mutedText}>Nível 5 • 1.250 XP</Text>
        </View>
        <Text style={styles.largeEmoji}>👤</Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Jogadores</Text>
        <Pressable onPress={onPlayers}><Text style={styles.link}>Ver todos</Text></Pressable>
      </View>

      {players.slice(0, 2).map((player) => <PlayerCard key={player.id} player={player} compact />)}
      {!players.length && <EmptyState text="Nenhum jogador cadastrado." />}
      <PrimaryButton label="+ Cadastrar jogador" onPress={onCreate} />
    </ScrollView>
  );
}

function PlayersScreen({ players, loading, onRefresh, onOpen, onEdit, onDelete, onCreate }) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} tintColor={colors.accent} />}
    >
      <Text style={styles.screenTitle}>Jogadores</Text>
      <Text style={styles.screenSubtitle}>Jogadores cadastrados no sistema</Text>
      {loading ? <ActivityIndicator color={colors.accent} style={styles.loader} /> : null}
      {!loading && !players.length && <EmptyState text="Nenhum jogador cadastrado." />}
      {players.map((player) => (
        <PlayerCard
          key={player.id}
          player={player}
          onOpen={() => onOpen(player)}
          onEdit={() => onEdit(player)}
          onDelete={() => onDelete(player)}
        />
      ))}
      <PrimaryButton label="+ Novo jogador" onPress={onCreate} />
    </ScrollView>
  );
}

function PlayerCard({ player, compact = false, onOpen, onEdit, onDelete }) {
  return (
    <Pressable style={styles.playerCard} onPress={onOpen} disabled={!onOpen}>
      {player.foto_perfil ? (
        <Image source={{ uri: getPhotoUrl(player.foto_perfil) }} style={styles.playerAvatar} />
      ) : <Text style={styles.playerAvatarEmoji}>👤</Text>}
      <View style={styles.playerInfo}>
        <Text style={styles.playerName}>{player.nome_usuario}</Text>
        <Text style={styles.playerDetails}>Nível {player.nivel} • {player.xp} XP</Text>
      </View>
      <Text style={styles.platform}>{player.plataforma}</Text>
      {!compact && (
        <View style={styles.cardActions}>
          <Pressable onPress={onEdit} hitSlop={8}><Text style={styles.actionIcon}>✎</Text></Pressable>
          <Pressable onPress={onDelete} hitSlop={8}><Text style={styles.deleteIcon}>×</Text></Pressable>
        </View>
      )}
    </Pressable>
  );
}

function PlayerDetails({ player, onEdit, onDelete, onBack }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Pressable onPress={onBack}><Text style={styles.link}>‹ Voltar para jogadores</Text></Pressable>
      <Text style={styles.screenTitle}>Informações</Text>
      {player.foto_perfil ? (
        <Image source={{ uri: getPhotoUrl(player.foto_perfil) }} style={styles.detailPhoto} />
      ) : <Text style={styles.detailEmoji}>👤</Text>}
      <Text style={styles.detailName}>{player.nome_usuario}</Text>
      <Text style={styles.detailEmail}>{player.email}</Text>
      <View style={styles.statsRow}>
        <Stat value={player.nivel} label="Nível" />
        <Stat value={player.xp} label="XP" />
        <Stat value={player.moedas} label="Moedas" />
      </View>
      <InfoRow label="Data de nascimento" value={player.data_nascimento} />
      <InfoRow label="Personagem favorito" value={player.personagem_favorito || 'Não informado'} />
      <InfoRow label="Plataforma" value={player.plataforma} />
      <PrimaryButton label="Editar jogador" onPress={onEdit} />
      <SecondaryButton label="Excluir jogador" onPress={onDelete} danger />
    </ScrollView>
  );
}

function PlayerForm({ player, error, onCancel, onSubmit }) {
  const [form, setForm] = useState(player ? {
    nome_usuario: player.nome_usuario || '', email: player.email || '', senha: '',
    nivel: String(player.nivel), xp: String(player.xp), moedas: String(player.moedas),
    data_nascimento: player.data_nascimento?.slice(0, 10) || '',
    personagem_favorito: player.personagem_favorito || '', plataforma: player.plataforma || '', photo: null,
  } : initialPlayer);
  const [saving, setSaving] = useState(false);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function choosePhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permissão necessária', 'Autorize o acesso às fotos para selecionar uma imagem de perfil.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setForm((current) => ({
        ...current,
        photo: { uri: asset.uri, name: asset.fileName || 'foto-perfil.jpg', type: asset.mimeType || 'image/jpeg' },
      }));
    }
  }

  async function submit() {
    setSaving(true);
    try {
      await onSubmit(form);
    } finally {
      setSaving(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={styles.screenTitle}>{player ? 'Editar jogador' : 'Novo jogador'}</Text>
        <Text style={styles.screenSubtitle}>{player ? 'Atualize os dados do jogador' : 'Cadastre um novo jogador'}</Text>
                {error ? <Message message={error} type="error" /> : null}
        <Pressable style={styles.photoPicker} onPress={choosePhoto}>
          {form.photo ? <Image source={{ uri: form.photo.uri }} style={styles.formPhoto} /> : <Text style={styles.detailEmoji}>👤</Text>}
          <Text style={styles.link}>{form.photo ? 'Trocar foto' : 'Adicionar foto'}</Text>
        </Pressable>
        <Field label="Nome de usuário" value={form.nome_usuario} onChangeText={(value) => updateField('nome_usuario', value)} />
        <Field label="E-mail" value={form.email} keyboardType="email-address" autoCapitalize="none" onChangeText={(value) => updateField('email', value)} />
        <Field label={player ? 'Nova senha (opcional)' : 'Senha'} value={form.senha} secureTextEntry onChangeText={(value) => updateField('senha', value)} />
        <View style={styles.fieldRow}>
          <Field label="Nível" value={form.nivel} keyboardType="numeric" onChangeText={(value) => updateField('nivel', value)} half />
          <Field label="XP" value={form.xp} keyboardType="numeric" onChangeText={(value) => updateField('xp', value)} half />
        </View>
        <Field label="Moedas" value={form.moedas} keyboardType="numeric" onChangeText={(value) => updateField('moedas', value)} />
        <Field label="Data de nascimento" placeholder="AAAA-MM-DD" value={form.data_nascimento} onChangeText={(value) => updateField('data_nascimento', value)} />
        <Field label="Personagem favorito" value={form.personagem_favorito} onChangeText={(value) => updateField('personagem_favorito', value)} />
        <Text style={styles.fieldLabel}>Plataforma</Text>
        <View style={styles.platformOptions}>
          {['Android', 'iOS', 'PC', 'Console'].map((platform) => (
            <Pressable key={platform} onPress={() => updateField('plataforma', platform)} style={[styles.platformOption, form.plataforma === platform && styles.platformOptionActive]}>
              <Text style={form.plataforma === platform ? styles.platformOptionTextActive : styles.platformOptionText}>{platform}</Text>
            </Pressable>
          ))}
        </View>
        <PrimaryButton label={saving ? 'Salvando...' : player ? 'Salvar alterações' : 'Cadastrar jogador'} onPress={submit} disabled={saving} />
        {player && <SecondaryButton label="Cancelar" onPress={onCancel} />}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({ label, half, ...props }) {
  return <View style={half ? styles.fieldHalf : styles.field}><Text style={styles.fieldLabel}>{label}</Text><TextInput style={styles.input} {...props} /> </View>;
}

function InfoRow({ label, value }) {
  return <View style={styles.infoRow}><Text style={styles.infoLabel}>{label}</Text><Text style={styles.infoValue}>{value}</Text></View>;
}

function Stat({ value, label }) {
  return <View style={styles.stat}><Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View>;
}

function BottomNavigation({ screen, onNavigate }) {
  return <View style={styles.bottomNav}>
    <NavButton icon="⌂" label="Início" active={screen === 'home'} onPress={() => onNavigate('home')} />
    <NavButton icon="👥" label="Jogadores" active={screen === 'players' || screen === 'detail'} onPress={() => onNavigate('players')} />
    <NavButton icon="＋" label="Cadastrar" active={screen === 'form'} onPress={() => onNavigate('form')} />
  </View>;
}

function NavButton({ icon, label, active, onPress }) {
  return <Pressable style={styles.navButton} onPress={onPress}><Text style={[styles.navIcon, active && styles.activeText]}>{icon}</Text><Text style={[styles.navLabel, active && styles.activeText]}>{label}</Text></Pressable>;
}

function PrimaryButton({ label, onPress, disabled }) {
  return <Pressable style={[styles.primaryButton, disabled && styles.disabledButton]} onPress={onPress} disabled={disabled}><Text style={styles.primaryButtonText}>{label}</Text></Pressable>;
}

function SecondaryButton({ label, onPress, danger }) {
  return <Pressable style={styles.secondaryButton} onPress={onPress}><Text style={danger ? styles.dangerText : styles.secondaryButtonText}>{label}</Text></Pressable>;
}

function EmptyState({ text }) {
  return <View style={styles.emptyState}><Text style={styles.emptyText}>{text}</Text></View>;
}

function Message({ message, type }) {
  return <View style={type === 'error' ? styles.errorMessage : styles.successMessage}><Text style={styles.messageText}>{message}</Text></View>;
}

const colors = { background: '#f2f2f7', ink: '#202024', muted: '#888', accent: '#6554c0', soft: '#eeeafd', border: '#eeeeee' };

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  app: { flex: 1, maxWidth: 520, width: '100%', alignSelf: 'center', backgroundColor: '#fff' },
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerSmall: { color: colors.muted, fontSize: 11, letterSpacing: 1, fontWeight: '700' },
  headerTitle: { color: colors.ink, fontSize: 24, fontWeight: '800', marginTop: 4 },
  headerAvatar: { backgroundColor: colors.soft, borderRadius: 24, padding: 10, fontSize: 20 },
  content: { flex: 1, padding: 20, paddingBottom: 90 },
  welcomeCard: { backgroundColor: colors.soft, borderRadius: 20, padding: 22, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 26 },
  cardLabel: { color: '#777', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  welcomeName: { color: colors.ink, fontSize: 25, fontWeight: '800', marginVertical: 7 },
  mutedText: { color: '#777', fontSize: 14 },
  largeEmoji: { backgroundColor: '#fff', borderRadius: 40, padding: 15, fontSize: 28 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: colors.ink },
  screenTitle: { color: colors.ink, fontSize: 26, fontWeight: '800', marginBottom: 5 },
  screenSubtitle: { color: colors.muted, fontSize: 14, marginBottom: 22 },
  link: { color: colors.accent, fontWeight: '800', fontSize: 13 },
  playerCard: { backgroundColor: '#fafafa', borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 13, marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 10 },
  playerAvatar: { width: 48, height: 48, borderRadius: 14, backgroundColor: colors.soft },
  playerAvatarEmoji: { width: 48, height: 48, borderRadius: 14, backgroundColor: colors.soft, textAlign: 'center', textAlignVertical: 'center', fontSize: 23 },
  playerInfo: { flex: 1, minWidth: 0 },
  playerName: { color: colors.ink, fontSize: 15, fontWeight: '700' },
  playerDetails: { color: colors.muted, fontSize: 12, marginTop: 4 },
  platform: { color: colors.accent, fontSize: 11, fontWeight: '800' },
  cardActions: { flexDirection: 'row', gap: 8 },
  actionIcon: { color: colors.accent, fontSize: 21, paddingHorizontal: 3 },
  deleteIcon: { color: '#c2415a', fontSize: 25, lineHeight: 22, paddingHorizontal: 3 },
  primaryButton: { backgroundColor: colors.accent, borderRadius: 14, padding: 15, alignItems: 'center', marginTop: 8, marginBottom: 10 },
  primaryButtonText: { color: '#fff', fontWeight: '800' },
  secondaryButton: { backgroundColor: '#eee', borderRadius: 14, padding: 15, alignItems: 'center', marginTop: 8, marginBottom: 10 },
  secondaryButtonText: { color: '#333', fontWeight: '800' },
  dangerText: { color: '#b4233c', fontWeight: '800' },
  disabledButton: { opacity: 0.55 },
  loader: { marginVertical: 30 },
  emptyState: { padding: 28, alignItems: 'center' },
  emptyText: { color: colors.muted },
  errorMessage: { backgroundColor: '#fde8ec', padding: 12, marginHorizontal: 20, borderRadius: 10 },
  successMessage: { backgroundColor: '#e6f6ed', padding: 12, marginHorizontal: 20, borderRadius: 10 },
  messageText: { color: colors.ink, fontSize: 13 },
  detailPhoto: { width: 110, height: 110, borderRadius: 55, alignSelf: 'center', backgroundColor: colors.soft, marginVertical: 14 },
  detailEmoji: { alignSelf: 'center', fontSize: 60, backgroundColor: colors.soft, borderRadius: 60, padding: 20, marginVertical: 14 },
  detailName: { textAlign: 'center', color: colors.ink, fontSize: 24, fontWeight: '800' },
  detailEmail: { textAlign: 'center', color: colors.muted, marginTop: 5, marginBottom: 20 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  stat: { flex: 1, backgroundColor: '#f7f7f7', borderRadius: 14, padding: 15, alignItems: 'center' },
  statValue: { color: colors.ink, fontSize: 20, fontWeight: '800' },
  statLabel: { color: colors.muted, fontSize: 11, marginTop: 4 },
  infoRow: { borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: 13, flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  infoLabel: { color: colors.muted, fontSize: 13 },
  infoValue: { color: colors.ink, fontWeight: '700', flexShrink: 1, textAlign: 'right' },
  photoPicker: { alignItems: 'center', marginBottom: 18 },
  formPhoto: { width: 100, height: 100, borderRadius: 50, marginBottom: 8 },
  field: { marginBottom: 14 },
  fieldHalf: { flex: 1, marginBottom: 14 },
  fieldRow: { flexDirection: 'row', gap: 12 },
  fieldLabel: { color: colors.ink, fontSize: 13, fontWeight: '700', marginBottom: 7 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 11, padding: 13, color: colors.ink, backgroundColor: '#fff' },
  platformOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  platformOption: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 12 },
  platformOptionActive: { backgroundColor: colors.soft, borderColor: colors.accent },
  platformOptionText: { color: colors.muted, fontSize: 12 },
  platformOptionTextActive: { color: colors.accent, fontSize: 12, fontWeight: '800' },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 70, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: colors.border, flexDirection: 'row', justifyContent: 'space-around' },
  navButton: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 3 },
  navIcon: { color: '#999', fontSize: 20 },
  navLabel: { color: '#999', fontSize: 10 },
  activeText: { color: colors.accent, fontWeight: '800' },
});
