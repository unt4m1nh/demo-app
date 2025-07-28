import React from 'react';
import { Chip, ChipProps, useTheme } from '@mui/material';
import styled from '@emotion/styled';
import { Theme } from '@mui/material/styles';

export type ChipType = 'level1' | 'gray-background';
export type ChipSize = 'S' | 'M';

export interface FilteredChipProps
  extends Omit<ChipProps, 'size' | 'variant' | 'label'> {
  type: ChipType;
  size: ChipSize;
  title: string;
  selected?: boolean;
}

const FilteredChip: React.FC<FilteredChipProps> = ({
  type,
  size,
  title,
  selected = false,
  disabled = false,
  onClick,
  ...otherProps
}) => {
  const theme = useTheme();

  // Validate size for gray-background type
  const validatedSize = type === 'gray-background' && size === 'S' ? 'M' : size;

  if (type === 'gray-background' && size === 'S') {
    console.warn(
      'Gray background type only supports size M. Defaulting to size M.'
    );
  }

  // Create a wrapper component that excludes custom props from DOM
  const ChipWrapper: React.FC<any> = (props) => {
    const { chipType, chipSize, isSelected, ...domProps } = props;
    return <Chip {...domProps} />;
  };

  const StyledWrapper = styled(ChipWrapper)<{
    chipType: ChipType;
    chipSize: ChipSize;
    isSelected: boolean;
    theme?: Theme;
  }>`
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-weight: 500;
    border-radius: 24px;
    transition: ${({ theme }) =>
      theme.transitions.create(
        ['background-color', 'border-color', 'transform', 'box-shadow'],
        {
          duration: theme.transitions.duration.short,
          easing: theme.transitions.easing.easeInOut,
        }
      )};
    cursor: pointer;
    user-select: none;
    border: 2px solid transparent;

    /* Size variants */
    ${({ chipSize, theme }) =>
      chipSize === 'S' &&
      `
      height: 36px;
      font-size: ${theme.typography.pxToRem(14)};
      line-height: 1.2;
      
      .MuiChip-label {
        padding: 0 20px;
      }
    `}

    ${({ chipSize, theme }) =>
      chipSize === 'M' &&
      `
      height: 48px;
      font-size: ${theme.typography.pxToRem(16)};
      line-height: 1.3;
      
      .MuiChip-label {
        padding: 0 32px;
      }
    `}

    /* Level 1 type styles */
    ${({ chipType, isSelected, theme }) =>
      chipType === 'level1' &&
      !isSelected &&
      `
      background-color: ${theme.palette.common.white};
      color: ${theme.palette.text.primary};
      border-color: ${theme.palette.grey[300]};
      
      &:hover:not(.Mui-disabled) {
        background-color: ${theme.palette.grey[50]};
        border-color: ${theme.palette.grey[400]};
        transform: translateY(-1px);
        box-shadow: ${theme.shadows[2]};
      }
    `}

    ${({ chipType, isSelected, theme }) =>
      chipType === 'level1' &&
      isSelected &&
      `
      background-color: ${theme.palette.primary.main};
      color: ${theme.palette.primary.contrastText};
      border-color: ${theme.palette.primary.main};
      box-shadow: 0 2px 8px ${theme.palette.primary.main}40;
      
      &:hover:not(.Mui-disabled) {
        background-color: ${theme.palette.primary.dark};
        border-color: ${theme.palette.primary.dark};
        transform: translateY(-1px);
        box-shadow: 0 4px 12px ${theme.palette.primary.main}60;
      }
    `}

    ${({ chipType, theme }) =>
      chipType === 'level1' &&
      `
      &.Mui-disabled {
        background-color: ${theme.palette.grey[100]};
        color: ${theme.palette.text.disabled};
        border-color: ${theme.palette.grey[200]};
        cursor: not-allowed;
        opacity: 0.6;
        
        &:hover {
          transform: none;
          box-shadow: none;
        }
      }
    `}

    /* Gray background type styles */
    ${({ chipType, isSelected, theme }) =>
      chipType === 'gray-background' &&
      !isSelected &&
      `
      background-color: ${theme.palette.grey[100]};
      color: ${theme.palette.grey[700]};
      border-color: ${theme.palette.grey[300]};
      
      &:hover:not(.Mui-disabled) {
        background-color: ${theme.palette.grey[200]};
        border-color: ${theme.palette.grey[400]};
        transform: translateY(-1px);
        box-shadow: ${theme.shadows[1]};
      }
    `}

    ${({ chipType, isSelected, theme }) =>
      chipType === 'gray-background' &&
      isSelected &&
      `
      background-color: ${theme.palette.grey[800]};
      color: ${theme.palette.common.white};
      border-color: ${theme.palette.grey[800]};
      box-shadow: 0 2px 8px ${theme.palette.grey[800]}40;
      
      &:hover:not(.Mui-disabled) {
        background-color: ${theme.palette.grey[900]};
        border-color: ${theme.palette.grey[900]};
        transform: translateY(-1px);
        box-shadow: 0 4px 12px ${theme.palette.grey[800]}60;
      }
    `}

    ${({ chipType, theme }) =>
      chipType === 'gray-background' &&
      `
      &.Mui-disabled {
        background-color: ${theme.palette.grey[200]};
        color: ${theme.palette.text.disabled};
        border-color: ${theme.palette.grey[300]};
        cursor: not-allowed;
        opacity: 0.6;
        
        &:hover {
          transform: none;
          box-shadow: none;
        }
      }
    `}

    /* Active state */
    &:active:not(.Mui-disabled) {
      transform: translateY(0);
    }

    /* Focus state */
    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.palette.primary.main};
      outline-offset: 2px;
    }

    /* Remove MUI default styles that might interfere */
    &.MuiChip-root {
      border-radius: 24px;
    }

    &.MuiChip-clickable:hover {
      background-color: inherit;
    }

    &.MuiChip-filled {
      background-color: inherit;
    }
  `;

  return (
    <StyledWrapper
      chipType={type}
      chipSize={validatedSize}
      isSelected={selected}
      theme={theme}
      label={title}
      disabled={disabled}
      onClick={onClick}
      clickable={!!onClick && !disabled}
      {...otherProps}
    />
  );
};

export default FilteredChip;
