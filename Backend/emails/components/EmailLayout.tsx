import * as React from 'react';
import { Html, Head, Body, Container, Section, Font, Tailwind } from '@react-email/components';
import { theme } from '../theme';

interface EmailLayoutProps {
  children: React.ReactNode;
}

export const EmailLayout: React.FC<EmailLayoutProps> = ({ children }) => {
  return (
    <Tailwind>
      <Html>
        <Head>
          <Font
            fontFamily="Inter"
            fallbackFontFamily="sans-serif"
            webFont={{
              url: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2',
              format: 'woff2',
            }}
            fontWeight={400}
            fontStyle="normal"
          />
          <Font
            fontFamily="Playfair Display"
            fallbackFontFamily="serif"
            webFont={{
              url: 'https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDXbtM.woff2',
              format: 'woff2',
            }}
            fontWeight={400}
            fontStyle="normal"
          />
        </Head>
        <Body style={{ backgroundColor: theme.colors.background, fontFamily: theme.fonts.body, margin: '0 auto', padding: '0' }}>
          <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
            <Section style={{ backgroundColor: theme.colors.card, borderRadius: '8px', overflow: 'hidden', border: '1px solid #EAEAEA', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              {children}
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};
