import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Home/Hero';
import FlavourExperience from '../components/Home/FlavourExperience';
import ProductShowcase from '../components/Home/ProductShowcase';
import WhyMovitea from '../components/Home/WhyMovitea';
import ComboPackShowcase from '../components/Home/ComboPackShowcase';
import Reviews from '../components/Home/Reviews';
import FAQ from '../components/Home/FAQ';
import SEO from '../components/SEO';

export default function Home({ setSelectedProduct }) {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleShopRedirect = () => {
    navigate('/shop');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleProductSelect = (productId) => {
    setSelectedProduct(productId);
    navigate(`/product/${productId}`);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MOVITEA",
    "url": "https://movitea.com",
    "logo": "https://movitea.com/assets/logo.png",
    "description": "Premium flavoured tea crafted with zero added sugar and exceptional ingredients."
  };

  return (
    <main>
      <SEO 
        title="MOVITEA | Premium Flavoured Tea in India"
        description="Discover premium flavoured tea by MOVITEA. Explore Chocolate, Vanilla, Rose and Butterscotch teas crafted with premium ingredients. Ready in 60 seconds."
        structuredData={structuredData}
      />
      <Hero onShopClick={handleShopRedirect} />
      <FlavourExperience onSelectProduct={handleProductSelect} />
      <ProductShowcase onSelectProduct={handleProductSelect} />
      <WhyMovitea />
      <ComboPackShowcase onShopClick={handleShopRedirect} />
      <Reviews />
      <FAQ />
    </main>
  );
}
