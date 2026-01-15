'use client';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useLanguage } from '@/hooks/useLanguage';

export const LanguageSwitch: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const handleChange = (
    _: React.MouseEvent<HTMLElement>,
    newLanguage: 'ja' | 'en' | null
  ) => {
    if (newLanguage !== null) {
      setLanguage(newLanguage);
    }
  };

  return (
    <ToggleButtonGroup
      value={language}
      exclusive
      onChange={handleChange}
      size="small"
    >
      <ToggleButton value="ja" sx={{ px: 1.5, py: 0.5 }}>
        日本語
      </ToggleButton>
      <ToggleButton value="en" sx={{ px: 1.5, py: 0.5 }}>
        EN
      </ToggleButton>
    </ToggleButtonGroup>
  );
};
