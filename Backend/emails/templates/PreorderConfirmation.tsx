import * as React from 'react';
import { Section, Text, Row, Column } from '@react-email/components';
import { EmailLayout } from '../components/EmailLayout';
import { Header, Footer } from '../components/HeaderFooter';
import { Button } from '../components/Button';
import { theme } from '../theme';

interface PreorderConfirmationProps {
  customerName: string;
  productName: string;
  referenceId: string;
  status: string;
  expectedLaunch?: string;
}

export const PreorderConfirmation: React.FC<PreorderConfirmationProps> = ({ 
  customerName, productName, referenceId, status, expectedLaunch = 'Coming Soon'
}) => {
  return (
    <EmailLayout>
      <Header />
      
      <Section style={{ padding: '20px 40px', textAlign: 'center' as const }}>
        <Text style={{ fontFamily: theme.fonts.heading, fontSize: '26px', color: theme.colors.dark, margin: '0 0 10px 0' }}>
          We've received your preorder
        </Text>
        <Text style={{ fontSize: '16px', color: theme.colors.text.muted }}>
          Thank you for reserving {productName}, {customerName}.
        </Text>
      </Section>

      <Section style={{ padding: '0 40px 30px' }}>
        <div style={{ backgroundColor: theme.colors.background, padding: '20px', borderRadius: '8px', border: `1px solid #EAEAEA` }}>
          <Row style={{ marginBottom: '15px' }}>
            <Column><Text style={{ margin: '0', color: theme.colors.text.muted, fontSize: '13px', textTransform: 'uppercase' }}>Reference ID</Text></Column>
            <Column style={{ textAlign: 'right' as const }}><Text style={{ margin: '0', fontWeight: 'bold', color: theme.colors.dark }}>{referenceId}</Text></Column>
          </Row>
          <Row style={{ marginBottom: '15px' }}>
            <Column><Text style={{ margin: '0', color: theme.colors.text.muted, fontSize: '13px', textTransform: 'uppercase' }}>Product</Text></Column>
            <Column style={{ textAlign: 'right' as const }}><Text style={{ margin: '0', fontWeight: 'bold' }}>{productName}</Text></Column>
          </Row>
          <Row style={{ marginBottom: '15px' }}>
            <Column><Text style={{ margin: '0', color: theme.colors.text.muted, fontSize: '13px', textTransform: 'uppercase' }}>Status</Text></Column>
            <Column style={{ textAlign: 'right' as const }}><Text style={{ margin: '0', fontWeight: 'bold', color: theme.colors.primary }}>{status}</Text></Column>
          </Row>
          <Row>
            <Column><Text style={{ margin: '0', color: theme.colors.text.muted, fontSize: '13px', textTransform: 'uppercase' }}>Expected Launch</Text></Column>
            <Column style={{ textAlign: 'right' as const }}><Text style={{ margin: '0', fontWeight: 'bold' }}>{expectedLaunch}</Text></Column>
          </Row>
        </div>
      </Section>

      <Section style={{ padding: '0 40px 30px', textAlign: 'center' as const }}>
        <Text style={{ fontSize: '15px', color: theme.colors.text.main, margin: '0 0 20px 0', fontStyle: 'italic' }}>
          "We'll notify you first the moment it becomes available."
        </Text>
        <Button href="https://movitea.com/shop">Visit Store</Button>
      </Section>

      <Footer />
    </EmailLayout>
  );
};
