// NOTE: If auto sign in, we could use rainbowkit to automatically sign in after connected to wallet.

// src/providers/AuthProvider.tsx
import {ReactNode, useEffect, useMemo} from 'react';
import {createAuthenticationAdapter, RainbowKitAuthenticationProvider,} from '@rainbow-me/rainbowkit';
import {createSiweMessage} from 'viem/siwe';
import {useAccount} from 'wagmi';
import {
    CommonResponse,
    NonceData,
    URL_API_LOGIN,
    URL_API_LOGOUT,
    URL_API_NONCE,
    UserData,
    useUserData
} from './services/api';
import {useUIStore} from './stores/uiStore';

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    // const status = 'loading' | 'unauthenticated' | 'authenticated';
    const { address, isConnected } = useAccount();
    // const [authStatus, setAuthStatus] = useState<AuthenticationStatus>("unauthenticated");
    const { authStatus, setAuthStatus } = useUIStore();
    console.log('authStatus:', authStatus);
    const { data: userData, refetch: refetchUserData } = useUserData(address);
    console.log('userData:', userData);

    useEffect(() => {
        if (!isConnected) {
            setAuthStatus('unauthenticated');
            return;
        }

        if (userData && address !== '0x' && userData.address == address) {
            if (userData.expire_at > Date.now() / 1000) {
                setAuthStatus('authenticated');
            } else {
                setAuthStatus('unauthenticated');
            }
        } else {
            setAuthStatus('unauthenticated');
        }
    }, [userData]);


    const authenticationAdapter = useMemo(
        () =>
            createAuthenticationAdapter({
                getNonce: async () => {
                    console.log('getNonce');
                    let response = await fetch(URL_API_NONCE, {
                        credentials: 'include',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    const resp: CommonResponse<NonceData> = await response.json();
                    return resp.data.nonce;
                    // // Generate a random nonce
                    // const nonce = Math.random().toString(36).substring(2, 15);
                    // console.log('Generated nonce:', nonce);
                    // return nonce;
                },
                createMessage: ({ nonce, address, chainId }) => {
                    console.log('createMessage', nonce, address, chainId);
                    // setStatus('loading');
                    return createSiweMessage({
                        domain: window.location.host,
                        address,
                        statement: 'Sign in To Manage Your Divinations',
                        uri: window.location.origin,
                        version: '1',
                        chainId,
                        nonce,
                    });
                },
                verify: async ({ message, signature }) => {
                    console.log('verify', message, signature);

                    const verifyRes = await fetch(URL_API_LOGIN, {
                        method: 'POST',
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ message, signature }),
                    });
                    const resp: CommonResponse<UserData> = await verifyRes.json();
                    console.log('verifyRes:', resp);
                    // setAuthStatus(resp.success ? 'authenticated' : 'unauthenticated');
                    refetchUserData();
                    return resp.success;
                },
                signOut: async () => {
                    console.log('signOut');
                    // setStatus('unauthenticated');
                    await fetch(URL_API_LOGOUT, {
                        method: 'POST',
                        credentials: 'include',
                    });
                    // setAuthStatus('unauthenticated');
                    refetchUserData();
                },
            }),
        [address],
    );

    return (
        <RainbowKitAuthenticationProvider
            adapter={authenticationAdapter}
            enabled={true}
            status={authStatus}
        >
            {children}
        </RainbowKitAuthenticationProvider>
    );
}