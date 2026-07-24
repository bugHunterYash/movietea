import * as React from 'react';
import { Button as ReactEmailButton } from '@react-email/components';
import { theme } from '../theme';

interface ButtonProps {
  href: string;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ href, children }) => {
  return (
    <ReactEmailButton
      href={href}
      style={{
        backgroundColor: theme.colors.dark,
        color: '#FFFFFF',
        padding: '15px 40px',
        borderRadius: '24px',
        textDecoration: 'none',
        fontWeight: 600,
        letterSpacing: '1px',
        textTransform: 'uppercase',
        fontSize: '14px',
        display: 'inline-block',
        boxShadow: '0 4px 14px rgba(44, 24, 16, 0.15)',
        textAlign: 'center'
      }}
    >
      {children}
    </ReactEmailButton>
  );
};
