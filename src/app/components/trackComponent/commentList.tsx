'use client'
import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import moment from 'moment';

const CommentList = (props: { comments: any[], triggerTime: (time: number) => void } ) => {
  const { comments, triggerTime } = props
  if (comments.length === 0) {
    return (
      <Box
        textAlign="center"
        p={4}
        // border="1px solid #ccc"
        // borderRadius={2}
        color="text.secondary"
      >
        No comments yet.
      </Box>
    );
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secondsRemainder = Math.floor(seconds) % 60
    const paddedSeconds = `0${secondsRemainder}`.slice(-2)
    return `${minutes}:${paddedSeconds}`
  }

  const getTimeAgo = (createdAt: string) => {
    return moment(createdAt).fromNow(); // e.g., "6 minutes ago"
  }

  return (
    <List>
      {comments.map(({ _id, user, avatar, content, moment, createdAt }) => (
        <ListItem key={_id} alignItems="flex-start" sx={{ mb: 1, borderBottom: '1px solid #e0e0e0' }}>
          <ListItemAvatar>
            <Avatar alt={user} src={avatar} />
          </ListItemAvatar>
          <ListItemText
            primary={
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box sx={{ display: 'flex', flexDirection: 'row'}}>
                  <Typography variant="body2" color="text.secondary">
                    {`${user.name ?? user._id} at `}
                  </Typography>
                  <Typography
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      paddingLeft: '2px',
                      cursor: 'pointer',
                      transition: 'color 0.2s ease',
                      '&:hover': {
                        color: 'primary.dark',
                      },
                    }}
                    onClick={() => triggerTime(moment)}
                  >
                    {`${formatTime(moment)}`}
                  </Typography>
                </Box>
                
                <Typography variant="caption" color="text.secondary">
                  {getTimeAgo(createdAt)}
                </Typography>
              </Box>
            }
            secondary={<Typography variant="body2">{content}</Typography>}
          />
        </ListItem>
      ))}
    </List>
  )
}
export default CommentList;