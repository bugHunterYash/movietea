import * as React from 'react';
import { Section, Img, Text } from '@react-email/components';
import { theme } from '../theme';

export const Header: React.FC = () => {
  return (
    <Section style={{ textAlign: 'center' as const, padding: '40px 20px 20px', backgroundColor: theme.colors.card }}>
      <Img 
        src="https://movitea.com/assets/logo.jfif" 
        width="120" 
        height="auto" 
        alt="MOVITEA" 
        style={{ margin: '0 auto', mixBlendMode: 'multiply' }} 
      />
    </Section>
  );
};

export const Footer: React.FC = () => {
  return (
    <>
      {/* Help Section */}
      <Section style={{ borderTop: '1px solid #EAEAEA', padding: '30px 20px', backgroundColor: theme.colors.card }}>
        <Text style={{ margin: '0 0 15px 0', fontFamily: theme.fonts.heading, fontSize: '18px', color: theme.colors.dark }}>Need help?</Text>
        <Text style={{ margin: '0 0 15px 0', fontSize: '15px' }}>📧 movitea8@gmail.com</Text>
        
        <Text style={{ margin: '0 0 10px 0', fontSize: '14px', color: theme.colors.text.muted }}>We're happy to help with:</Text>
        <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '14px', color: theme.colors.text.main, lineHeight: '1.6' }}>
          <li>Orders</li>
          <li>Shipping</li>
          <li>Returns</li>
          <li>Product Questions</li>
          <li>Bulk Orders</li>
        </ul>
      </Section>

      {/* Real Footer */}
      <Section style={{ backgroundColor: theme.colors.dark, color: '#FFFFFF', textAlign: 'center' as const, padding: '40px 20px', fontSize: '13px', opacity: 0.9 }}>
        <Text style={{ margin: '0 0 5px 0', fontFamily: theme.fonts.heading, fontSize: '16px', letterSpacing: '2px', textTransform: 'uppercase' }}>MOVITEA</Text>
        <Text style={{ margin: '0 0 20px 0', color: theme.colors.accent, fontSize: '12px', letterSpacing: '1px' }}>Premium Tea Experience</Text>
        
        <Text style={{ margin: '0 0 5px 0' }}>🌐 <a href="https://movitea.com" style={{ color: '#FFFFFF', textDecoration: 'none' }}>www.movitea.com</a></Text>
        <Text style={{ margin: '0 0 20px 0' }}>📧 <a href="mailto:movitea8@gmail.com" style={{ color: '#FFFFFF', textDecoration: 'none' }}>movitea8@gmail.com</a></Text>

        <Text style={{ margin: '0 0 5px 0', color: '#999999', fontSize: '11px' }}>This is an automated email.</Text>
        <Text style={{ margin: '0 0 20px 0', color: '#999999', fontSize: '11px' }}>Please do not reply directly to this message.</Text>

        <Text style={{ margin: '0', color: '#999999', fontSize: '11px' }}>&copy; {new Date().getFullYear()} MOVITEA. All Rights Reserved.</Text>
      </Section>
    </>
  );
};
