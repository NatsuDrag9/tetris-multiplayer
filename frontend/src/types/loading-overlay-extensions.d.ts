// import * as React from 'react';
// import { LoadingOverlayProps as BaseLoadingOverlayProps } from '@types/react-loading-overlay';

// // Extend the existing LoadingOverlayProps
// interface LoadingOverlayProps extends BaseLoadingOverlayProps {
//   children?: React.ReactNode;
// }

// export default LoadingOverlayProps;

// Import React from the 'react' namespace to use the ReactNode type.
import * as React from 'react';
import { LoadingOverlayProps as BaseLoadingOverlayProps } from '@types/react-loading-overlay';

// Declare module augmentation for 'react-loading-overlay-ts'
declare module '@types/react-loading-overlay' {
  // Extend the existing LoadingOverlayProps
  interface LoadingOverlayProps extends BaseLoadingOverlayProps {
    children?: React.ReactNode;
  }
}
