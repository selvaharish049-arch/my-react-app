import React from 'react';
import Banner from './Banner';
import HomeDecor from './HomeDecor';
import Portfolio from './Portfolio';
import Material from './Material';
import OurServices from './OurServices';
import Bottom from './Bottom';
import CustomerReviews from './CustomerReviews';

const Home = ({ isLoggedIn, userRole }) => {
  return (
    <div>
      <Banner />
      <HomeDecor />
      <Portfolio />
      <Material />
      <OurServices />
      <CustomerReviews isLoggedIn={isLoggedIn} userRole={userRole} />
      <Bottom />
    </div>
  );
};

export default Home;