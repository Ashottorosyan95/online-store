import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
// @mui
import { Box, Card, Link, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import ReactImageGallery from 'react-image-gallery';
// utils
import { fCurrency } from '../../../utils/formatNumber';
import { fDate } from '../../../utils/formatTime';
// components
import Label from '../../../components/label';
import SvgColor from '../../../components/svg-color/SvgColor';

const StyledCardMedia = styled('div')({
  position: 'relative',
  paddingTop: 'calc(100% * 3 / 4)',
});

ShopProductCard.propTypes = {
  product: PropTypes.object,
};

export default function ShopProductCard({ product }) {
  const navigate = useNavigate();
  const {
    _id,
    SKU,
    name,
    price,
    status,
    pictures,
    createdAt,
    salaryPrice,
  } = product;
  const arr = [];

  pictures.forEach(elm => {
    arr.push({
      original: `${process.env.REACT_APP_AMAZON_S3_URL}/${elm}`,
      thumbnail: `${process.env.REACT_APP_AMAZON_S3_URL}/${elm}`
    })
  })

  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        {status && (
          <Label
            variant="filled"
            color={(status === 'sale' && 'error') || 'info'}
            sx={{
              zIndex: 9,
              top: 16,
              right: 16,
              position: 'absolute',
              textTransform: 'uppercase',
            }}
          >
            {status}
          </Label>
        )}
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
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Typography gutterBottom variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
          {fDate(createdAt)}
        </Typography>
        <Link
          color="inherit"
          underline="hover"
          sx={{ cursor: 'pointer' }}
          onClick={() => navigate(`/dashboard/product/${_id}`, { state: { productId: _id } })}
        >
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
        </Link>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography fontSize={12}>SKU</Typography>:&nbsp;<Typography color={'#2196f3'}>{SKU}</Typography>
        </Box>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1">
            <Typography
              component="span"
              variant="body1"
              sx={{
                color: 'text.disabled',
                textDecoration: 'line-through',
              }}
            >
              {price && fCurrency(price)}դ.
            </Typography>
            &nbsp;
            {fCurrency(`${salaryPrice}`)}դ.
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
