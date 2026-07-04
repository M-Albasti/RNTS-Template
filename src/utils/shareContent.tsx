import {Share} from 'react-native';

export const shareText = async (title: string, message: string): Promise<void> => {
  try {
    await Share.share({title, message});
  } catch {
    // User dismissed share sheet
  }
};
