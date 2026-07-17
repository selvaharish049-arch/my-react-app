import React from 'react';
import Banner from './Banner';
import HomeDecor from './HomeDecor';
import Offer from './Offer';
import Material from './Material';
import Choose from './Choose';
import Bottom from './Bottom';
import CustomerReviews from './CustomerReviews';

const Home = ({ isLoggedIn, userRole }) => {
  return (
    <div>
      <Banner />
      <HomeDecor />
      <Offer />
      <Material />
      <Choose />
      <CustomerReviews isLoggedIn={isLoggedIn} userRole={userRole} />
      <Bottom />
    </div>
  );
};

export default Home;