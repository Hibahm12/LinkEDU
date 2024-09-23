import PropTypes from 'prop-types';
import { forwardRef } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { useTheme } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

const Logo = forwardRef(({ disabledLink = false, destinationURL = "/", imageSrc =  'src/assets/LINKEDU.png', sx, ...other }, ref) => {
  const theme = useTheme();

  const logo = (
    <Box
      ref={ref}
      component="img"
      src={imageSrc}
      alt="Logo"
      sx={{
        width: 100, // Adjust the width here
        height: 100, // Adjust the height here
        cursor: 'pointer',
        ...sx,
      }}
      {...other}
    />
  );

  if (disabledLink) {
    return logo;
  }

  return (
    <Link component={RouterLink} to={destinationURL} sx={{ display: 'contents' }}>
      {logo}
    </Link>
  );
});

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  destinationURL: PropTypes.string,
  imageSrc: PropTypes.string,
  sx: PropTypes.object,
};

export default Logo;
