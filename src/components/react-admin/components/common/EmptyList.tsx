import React from 'react';
import { CreateButton } from 'react-admin';
import { Box, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

interface EmptyListProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  showCreateButton?: boolean;
  createButtonLabel?: string;
  resource?: string;
}

export const EmptyList: React.FC<EmptyListProps> = ({
  title = '등록된 항목이 없습니다',
  description = '첫 번째 항목을 추가해보세요',
  icon = <AddIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />,
  showCreateButton = true,
  createButtonLabel,
  resource,
}) => {
  return (
    <Box 
      sx={{ 
        textAlign: 'center', 
        py: 6,
        px: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: 200,
        justifyContent: 'center'
      }}
    >
      {icon}
      <Typography variant="h6" color="textSecondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3, maxWidth: 400 }}>
        {description}
      </Typography>
      {showCreateButton && (
        <CreateButton 
          label={createButtonLabel}
          variant="contained"
          size="large"
        />
      )}
    </Box>
  );
};

export default EmptyList;
