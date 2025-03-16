import React, {useEffect, useRef} from 'react';
import {Outlet, useLocation} from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import {useQueryClient} from '@tanstack/react-query';
import {useAccount} from 'wagmi';
import {routes} from './utils/constants';
import ParticlesBackground from './bg';

const Layout = () => {
  const location = useLocation();
  const previousAddress = useRef<string>('');
  const queryClient = useQueryClient();

  // const {
  //   setStatus,
  //   status,
  //   open,
  //   setOpen,
  //   unstoppableDomainName,
  //   setUnstoppableDomainName,
  //   setError,
  //   error
  // } = useAuthStore();

  const { address, isConnected } = useAccount();
  // Set up the auth status query
  // const { data: userData } = useUserData(address as string);
  // const { data, error, isLoading } = useUserData(isConnected);



  // Monitor address changes
  useEffect(() => {
    const handleAddressChange = async () => {
      // Case 1: Address changed from one value to another
      if (previousAddress.current && address && previousAddress.current !== address) {
        console.log('Address changed from', previousAddress.current, 'to', address);
        // Invalidate the old query and trigger new fetch
        queryClient.invalidateQueries({ queryKey: ["me", previousAddress.current] });
        // setStatus('idle'); // Reset status to trigger new fetch
      }

      // Case 2: Address changed to empty/null (logout case)
      if (previousAddress.current && !address) {
        console.log('Address cleared, logging out');
        // setStatus('unverified');
        // setUnstoppableDomainName("");
        // Clear any cached data
        queryClient.removeQueries({ queryKey: ['me', previousAddress.current] });
      }

      // Case 3: Address changed from empty/null to a value
      if (!previousAddress.current && address) {
        console.log('New address connected:', address);
        // setStatus('idle');
      }

      // Update the ref for next comparison
      previousAddress.current = address as string ?? '';
    };

    handleAddressChange();
  }, [address, queryClient]);



  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet key={location.pathname} />
        <div style={{ width: '100%', zIndex: 0, pointerEvents: 'none' }}>
          <ParticlesBackground />
        </div>
      </main>
      {location.pathname !== routes.divi && <Footer />}
    </div>
  );
};

export default Layout;