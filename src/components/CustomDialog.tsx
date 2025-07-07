import React, { ReactNode } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  DialogProps,
  PaperProps,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface CustomDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Function to call when the dialog should close */
  onClose: () => void;
  /** Title to display in the dialog header */
  title?: string;
  /** Content to display in the dialog body */
  children: ReactNode;
  /** Actions to display in the dialog footer */
  actions?: ReactNode;
  /** Maximum width of the dialog */
  maxWidth?: DialogProps['maxWidth'];
  /** Whether the dialog should take full width */
  fullWidth?: boolean;
  /** Whether to hide the close button in the title */
  hideCloseButton?: boolean;
  /** Typography variant for the title */
  titleVariant?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'subtitle1'
    | 'subtitle2';
  /** Text alignment for the title */
  titleAlign?: 'left' | 'center' | 'right';
  /** Custom styles for the content area */
  contentSx?: object;
  /** Custom styles for the actions area */
  actionsSx?: object;
  /** Additional props for the Dialog Paper component */
  PaperProps?: PaperProps;
}

const CustomDialog: React.FC<CustomDialogProps> = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'sm',
  fullWidth = true,
  hideCloseButton = false,
  titleVariant = 'h6',
  titleAlign = 'left',
  contentSx = {},
  actionsSx = {},
  PaperProps = {},
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{
        sx: {
          ...PaperProps.sx,
        },
        ...PaperProps,
      }}
    >
      {title && (
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pb: 1,
          }}
        >
          <Typography variant={titleVariant} align={titleAlign}>
            {title}
          </Typography>
          {!hideCloseButton && (
            <IconButton
              aria-label='close'
              onClick={onClose}
              sx={{
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
      )}

      <DialogContent
        sx={{
          pt: title ? 1 : 2,
          ...contentSx,
        }}
      >
        {children}
      </DialogContent>

      {actions && (
        <DialogActions
          sx={{
            px: 3,
            pb: 2,
            ...actionsSx,
          }}
        >
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default CustomDialog;
