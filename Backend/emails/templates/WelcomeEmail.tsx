import * as React from 'react';
import { Section, Text, Row, Column } from '@react-email/components';
import { EmailLayout } from '../components/EmailLayout';
import { Header, Footer } from '../components/HeaderFooter';
import { Button } from '../components/Button';
import { ProductCard } from '../components/ProductCard';
import { theme } from '../theme';

interface WelcomeEmailProps {
  userName: string;
  recommendedProducts?: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    discountPrice?: number | null;
    image: string;
    badge?: string | null;
  }>;
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ userName, recommendedProducts = [] }) => {
  return (
    <EmailLayout>
      <Header />
      
      <Section style={{ padding: '20px 40px', textAlign: 'center' as const }}>
        <Text style={{ fontFamily: theme.fonts.heading, fontSize: '28px', color: theme.colors.dark, margin: '0 0 20px 0' }}>
          Welcome to MOVITEA, {userName || 'Tea Lover'} ☕
        </Text>
        
        <Text style={{ fontSize: '16px', color: theme.colors.text.muted, lineHeight: '1.6', margin: '0 0 30px 0' }}>
          Thank you for joining MOVITEA. Step into a world of premium flavoured tea, crafted with sensory perfection and zero added sugar. We are thrilled to have you as part of our exclusive community.
        </Text>

        <Section style={{ backgroundColor: theme.colors.background, padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
          <Text style={{ margin: '0 0 10px 0', fontWeight: 'bold', fontSize: '16px', color: theme.colors.primary }}>Special Welcome Offer</Text>
          <Text style={{ margin: '0 0 15px 0', fontSize: '14px' }}>Use code <strong style={{ color: theme.colors.dark, fontSize: '18px', letterSpacing: '2px' }}>WELCOME10</strong> for 10% off your first order.</Text>
          <Button href="https://movitea.com/shop">Shop Now</Button>
        </Section>
      </Section>

      {recommendedProducts.length > 0 && (
        <Section style={{ padding: '0 40px 30px' }}>
          <Text style={{ fontFamily: theme.fonts.heading, fontSize: '22px', color: theme.colors.dark, margin: '0 0 20px 0', textAlign: 'center' as const }}>
            Our Signatures
          </Text>
          
          {recommendedProducts.map(product => (
            <ProductCard key={product.id} {...product} />
          ))}
        </Section>
      )}

      <Footer />
    </EmailLayout>
  );
};
