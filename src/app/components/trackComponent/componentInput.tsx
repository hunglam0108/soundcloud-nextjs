'use client'
import React, { useState } from 'react';
import { TextField, Button, Box, InputAdornment, IconButton } from '@mui/material';
import { Send } from '@mui/icons-material';

const CommentInput = (props:{ onSubmit: (comment: string) => void }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (comment.trim()) {
      props.onSubmit(comment);
      setComment('');
    }
  };

  return (
    <Box display="flex" gap={2} alignItems="center">
      <TextField
        fullWidth
        variant="standard"
        value={comment}
        label='Comments'
        onChange={(e) => setComment(e.target.value)}
        InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={handleSubmit} edge="end" 
              sx={{
                transform: 'scale(0.6)',
                transition: 'color 0.3s ease, transform 0.2s ease',
                '&:hover': {
                  color: 'primary.dark',
                  transform: 'scale(0.8)',
                },
              }}
            >
              <Send />
            </IconButton>
          </InputAdornment>
        ),
      }}
      />
    </Box>
  );
};

export default CommentInput;