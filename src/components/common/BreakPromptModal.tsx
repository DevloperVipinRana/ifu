//Quick break prompt modal component

import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../theme/color';

type BreakPromptModalProps = {
  visible: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const BreakPromptModal: React.FC<BreakPromptModalProps> = ({ visible, message, onConfirm, onCancel }) => {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Quick Break</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.actions}>
            <TouchableOpacity onPress={onCancel} style={styles.actionWrapper}>
              <LinearGradient colors={['#E0E0E0', '#CFCFCF']} style={styles.button}>
                <Text style={styles.noText}>No</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={onConfirm} style={styles.actionWrapper}>
              <LinearGradient colors={colors.gradient.passion} style={styles.button}>
                <Text style={styles.yesText}>Yes</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    borderRadius: 16,
    backgroundColor: colors.background?.primary || '#fff',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text?.primary || '#222',
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    color: colors.text?.secondary || '#444',
    marginBottom: 18,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionWrapper: { flex: 1 },
  button: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  yesText: { color: '#fff', fontWeight: '700' },
  noText: { color: '#333', fontWeight: '700' },
});

export default BreakPromptModal;


