import * as React from 'react';
import { Img, Text, Row, Column } from '@react-email/components';
import { theme } from '../theme';
import { Button } from './Button';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  image: string;
  badge?: string | null;
}

export const ProductCard: React.FC<ProductCardProps> = ({ id, name, description, price, discountPrice, image, badge }) => {
  return (
    <Row style={{ backgroundColor: theme.colors.background, borderRadius: '12px', padding: '15px', marginBottom: '20px', width: '100%' }}>
      <Column style={{ width: '120px', paddingRight: '20px' }}>
        <div style={{ position: 'relative' }}>
          <Img src={image || 'https://movitea.com/images/Final.png'} width="100" height="100" style={{ borderRadius: '8px', objectFit: 'cover' }} />
          {badge && (
            <div style={{ position: 'absolute', top: '5px', left: '5px', backgroundColor: theme.colors.primary, color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>
              {badge}
            </div>
          )}
        </div>
      </Column>
      <Column style={{ verticalAlign: 'top' }}>
        <Text style={{ margin: '0 0 5px 0', fontFamily: theme.fonts.heading, fontSize: '18px', color: theme.colors.text.main, fontWeight: 'bold' }}>{name}</Text>
        <Text style={{ margin: '0 0 10px 0', fontSize: '13px', color: theme.colors.text.muted, lineHeight: '1.4' }}>{description}</Text>
        <Row>
          <Column>
            <Text style={{ margin: '0', fontSize: '16px', fontWeight: 'bold', color: theme.colors.primary }}>
              ₹{discountPrice || price}
              {discountPrice && <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '12px', marginLeft: '8px' }}>₹{price}</span>}
            </Text>
          </Column>
          <Column style={{ textAlign: 'right' as const }}>
            <a href={`https://movitea.com/product/${id}`} style={{
              backgroundColor: theme.colors.dark,
              color: '#FFFFFF',
              padding: '8px 16px',
              borderRadius: '16px',
              textDecoration: 'none',
              fontSize: '12px',
              fontWeight: 'bold',
              textTransform: 'uppercase'
            }}>Buy Now</a>
          </Column>
        </Row>
      </Column>
    </Row>
  );
};
