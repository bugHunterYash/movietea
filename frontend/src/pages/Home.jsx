import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Home/Hero';
import FlavourExperience from '../components/Home/FlavourExperience';
import ProductGrid from '../components/Home/ProductGrid';
import WhyMovitea from '../components/Home/WhyMovitea';
import ComboPackShowcase from '../components/Home/ComboPackShowcase';
import Reviews from '../components/Home/Reviews';
import FAQ from '../components/Home/FAQ';
import BYOBBanner from '../components/Home/BYOBBanner';

export default function Home({ setSelectedProduct }) {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "MOVITEA | Modern Tea Atelier";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "MOVITEA redefines the tea experience. Indulge in premium handcrafted organic tea blends including Rose, Chocolate, Vanilla, and Butterscotch. Zero added sugar.");
    }
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

  return (
    <main>
      <Hero onShopClick={handleShopRedirect} />
      <ProductGrid onShopClick={handleShopRedirect} />
      <BYOBBanner />
      <WhyMovitea />
      <ComboPackShowcase onShopClick={handleShopRedirect} />
      <Reviews />
      <FAQ />
    </main>
  );
}
