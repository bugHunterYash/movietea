import React from 'react';
import Hero from '../components/Home/Hero';
import FlavourExperience from '../components/Home/FlavourExperience';
import ProductShowcase from '../components/Home/ProductShowcase';
import WhyMovitea from '../components/Home/WhyMovitea';
import ComboPackShowcase from '../components/Home/ComboPackShowcase';
import Reviews from '../components/Home/Reviews';
import FAQ from '../components/Home/FAQ';

export default function Home({ setCurrentPage, setSelectedProduct }) {
  const handleShopRedirect = () => {
    setCurrentPage('shop');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleProductSelect = (productId) => {
    setSelectedProduct(productId);
    setCurrentPage('product');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <main>
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
