import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
// @mui
import ReactImageGallery from 'react-image-gallery';
import { styled } from '@mui/material/styles';
import { Box, Link, Card, Grid, Typography, CardContent } from '@mui/material';
// utils
import { fDate } from '../../../utils/formatTime';
//
import SvgColor from '../../../components/svg-color';
import Iconify from '../../../components/iconify';

const StyledCardMedia = styled('div')({
  position: 'relative',
  paddingTop: 'calc(100% * 3 / 4)',
});

const StyledTitle = styled(Link)({
  height: 44,
  overflow: 'hidden',
  WebkitLineClamp: 2,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
});

const StyledInfo = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  marginTop: theme.spacing(3),
  color: theme.palette.text.disabled,
}));

BlogPostCard.propTypes = {
  post: PropTypes.object.isRequired,
  index: PropTypes.number,
};

export default function BlogPostCard({ post, index }) {
  const { _id, name, views, pictures, createdAt } = post;
  const latestPostLarge = index === 0;
  const latestPost = index === 1 || index === 2;
  const arr = [];

  pictures.forEach(elm => {
    arr.push({
      original: `${process.env.REACT_APP_AMAZON_S3_URL}/${elm}`,
      thumbnail: `${process.env.REACT_APP_AMAZON_S3_URL}/${elm}`
    })
  })

  const navigate = useNavigate();

  const POST_INFO = [
    { number: views, icon: 'eva:eye-fill' },
  ];

  return (
    <Grid item xs={9} sm={9} md={4}>
      <Card sx={{ position: 'relative' }}>
        <StyledCardMedia>
          <SvgColor
            color="paper"
            src="/assets/icons/shape-avatar.svg"
            sx={{
              width: 80,
              height: 36,
              zIndex: 9,
              bottom: -15,
              position: 'absolute',
              color: 'background.paper',
            }}
          />
          <ReactImageGallery
            width={100}
            items={arr}
            showPlayButton={false}
            showBullets='true'
            showFullscreenButton={false}
            showThumbnails={false}
            showNav={false}
          />
        </StyledCardMedia>

        <CardContent
        >
          <Typography gutterBottom variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
            {fDate(createdAt)}
          </Typography>

          <StyledTitle
            color="inherit"
            variant="subtitle2"
            underline="hover"
            sx={{
              cursor: 'pointer'
            }}
            onClick={() => navigate(`/dashboard/blog/${_id}`, { state: { blogId: _id } })}
          >
            {name}
          </StyledTitle>

          <StyledInfo>
            {POST_INFO.map((info, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  ml: index === 0 ? 0 : 1.5,
                  ...((latestPostLarge || latestPost) && {
                    color: 'grey.500',
                  }),
                }}
              >
                <Iconify icon={info.icon} sx={{ width: 16, height: 16, mr: 0.5 }} />
                <Typography variant="caption">{info.number}</Typography>
              </Box>
            ))}
          </StyledInfo>
        </CardContent>
      </Card>
    </Grid>
  );
}
