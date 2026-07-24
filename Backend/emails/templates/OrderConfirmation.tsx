import * as React from 'react';
import { Section, Text, Row, Column, Hr } from '@react-email/components';
import { EmailLayout } from '../components/EmailLayout';
import { Header, Footer } from '../components/HeaderFooter';
import { Button } from '../components/Button';
import { ProductCard } from '../components/ProductCard';
import { theme } from '../theme';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderConfirmationProps {
  orderNumber: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  address: string;
  paymentMethod: string;
  expectedDelivery?: string;
  recommendedProducts?: Array<any>;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ 
  orderNumber, customerName, items = [], totalAmount, address, paymentMethod, expectedDelivery, recommendedProducts = [] 
}) => {
  return (
    <EmailLayout>
      <Header />
      
      <Section style={{ padding: '20px 40px', textAlign: 'center' as const }}>
        <Text style={{ fontFamily: theme.fonts.heading, fontSize: '28px', color: theme.colors.dark, margin: '0 0 10px 0' }}>
          Order Confirmed 🎉
        </Text>
        <Text style={{ fontSize: '16px', color: theme.colors.text.muted }}>
          Thank you for your purchase, {customerName}.
        </Text>
      </Section>

      <Section style={{ padding: '0 40px 20px' }}>
        <div style={{ backgroundColor: theme.colors.background, padding: '20px', borderRadius: '8px' }}>
          <Text style={{ margin: '0 0 5px 0', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', color: theme.colors.text.muted }}>Order Number</Text>
          <Text style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold', color: theme.colors.dark }}>{orderNumber}</Text>
          
          <Hr style={{ borderColor: '#EAEAEA', margin: '20px 0' }} />
          
          {items.map((item, idx) => (
            <Row key={idx} style={{ marginBottom: '10px' }}>
              <Column>
                <Text style={{ margin: '0', fontWeight: 'bold', color: theme.colors.dark }}>{item.name}</Text>
                <Text style={{ margin: '0', fontSize: '13px', color: theme.colors.text.muted }}>Qty: {item.quantity}</Text>
              </Column>
              <Column style={{ textAlign: 'right' as const }}>
                <Text style={{ margin: '0', fontWeight: 'bold', color: theme.colors.dark }}>₹{item.price * item.quantity}</Text>
              </Column>
            </Row>
          ))}
          
          <Hr style={{ borderColor: '#EAEAEA', margin: '20px 0' }} />
          
          <Row>
            <Column><Text style={{ margin: '0 0 10px 0', color: theme.colors.text.muted }}>Total</Text></Column>
            <Column style={{ textAlign: 'right' as const }}><Text style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: theme.colors.primary }}>₹{totalAmount}</Text></Column>
          </Row>
          <Row>
            <Column><Text style={{ margin: '0 0 10px 0', color: theme.colors.text.muted }}>Payment</Text></Column>
            <Column style={{ textAlign: 'right' as const }}><Text style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>{paymentMethod}</Text></Column>
          </Row>
          <Row>
            <Column><Text style={{ margin: '0 0 10px 0', color: theme.colors.text.muted }}>Delivery To</Text></Column>
            <Column style={{ textAlign: 'right' as const }}><Text style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>{address}</Text></Column>
          </Row>
          {expectedDelivery && (
            <Row>
              <Column><Text style={{ margin: '0', color: theme.colors.text.muted }}>Expected Delivery</Text></Column>
              <Column style={{ textAlign: 'right' as const }}><Text style={{ margin: '0', fontWeight: 'bold', color: theme.colors.success }}>{expectedDelivery}</Text></Column>
            </Row>
          )}
        </div>
      </Section>
      
      <Section style={{ padding: '0 40px 30px', textAlign: 'center' as const }}>
        <Button href={`https://movitea.com/account/orders`}>Track Order</Button>
      </Section>

      {recommendedProducts.length > 0 && (
        <Section style={{ padding: '0 40px 30px' }}>
          <Hr style={{ borderColor: '#EAEAEA', margin: '0 0 30px 0' }} />
          <Text style={{ fontFamily: theme.fonts.heading, fontSize: '22px', color: theme.colors.dark, margin: '0 0 20px 0', textAlign: 'center' as const }}>
            Customers Also Bought
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
