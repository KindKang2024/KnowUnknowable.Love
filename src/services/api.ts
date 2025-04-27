import { Gua } from "@/stores/Gua";
import { InfiniteData, useInfiniteQuery, useMutation, useQuery, useQueryClient, } from "@tanstack/react-query";
import { Address } from "viem";


export const DEFAULT_PAGE_SIZE = process.env.NODE_ENV === 'development' ? 2 : 10;
// Types for API responses
// export const URL_API = 'http://localhost:8787';
export const URL_API = process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : "https://knowunknowable.love";
// const URL_API = 'https://api_unstoppable.beswarm.workers.dev';
export const URL_API_NONCE = URL_API + '/open/nonce';
export const URL_API_LOGIN = URL_API + '/open/login';
export const URL_API_LOGOUT = URL_API + '/open/logout';
export const URL_API_LATEST_DAO_EVENTS = URL_API + '/open/latest_dao_events';
export const URL_API_INVESTORS = URL_API + '/open/investors';
export const URL_API_ME = URL_API + '/api/me';
export const API_BASE = URL_API + '/api';
export const URL_API_MY_DAO_EVENTS = URL_API + '/api/my_dao_events';

export type CommonResponse<T> = {
    success: boolean;
    message: string;
    data: T;
    cursor?: number | null;
};



export type Interpretation = {
    interpretation: string;
    dao_tx: string;
    dao_tx_amount: number;
}

export type UserData = {
    address: Address;
    expire_at: number;
};

export type NonceData = {
    nonce: string;
}

export type DivinationRequest = {
    will: string;
    will_signature: string;
    will_hash: string;
    manifestation: string;
    interpretation: string;
    visibility: number;
    dao_money: number;
    dao_hash: string;

    // 
    lang: string;
    gua: string;
    mutability: boolean[];
};



// Types for divination entries
export interface DivinationEntry {
    uuid: string;  // bytes16
    diviner: string;
    visibility: number;
    lang: string;
    will: string;
    will_hash: string;
    will_signature: string;
    manifestation: string; // bytes16
    interpretation: string;
    dao_tx: string;
    dao_tx_amount: number;
    // 0: Unknown, 1: Verified Pass, 2: Verified Reject, 3: Deprecated
    known_status: number;
    known_at: number;
    created_at: number;
    gua: Gua;
}

export interface DivinationResponse {
    success: boolean;
    data: DivinationEntry[];
    cursor: number | null;
}

export interface DivinationPageRequest {
    cursor: number | null;
    pageSize: number;
}

export interface DivinationDetailResponse {
    success: boolean;
    data: DivinationEntry;
}

// {
//     "tx_hash": "0x44bc316691623a4e32d9375b3817f50b95552ffceed1d195e00e878cdbeb265b",
//     "diviner": "0x40977C4706851E4c052356885957E61D74A9E4Ba",
//     "block_number": 35,
//     "event_type": "DukiInAction",
//     "event_interact_type": null,
//     "event_data": {
//         "user": "0x40977C4706851E4c052356885957E61D74A9E4Ba",
//         "interactType": 0,
//         "daoEvolveRound": 2,
//         "amount": 3000000,
//         "unitNumber": 1,
//         "timestamp": 1745303636,
//         "metaDomain": ""
//     }
// }

export interface DaoEvent {
    tx_hash: string;
    diviner: string;
    block_number: number;
    event_type: string;
    event_interact_type: number | null;
    event_data: {
        user: string;
        interactType: number;
        daoEvolveRound: number;
        amount: number;
        unitNumber: number;
        timestamp: number;
        metaDomain: string;
    }
}
export interface Transaction {
    timestamp: number;
    txHash: string;
    account: string;
    amount: number;
    interactType: number;
    evolveNum: number;
}

// Helper function to add getGua method to DivinationEntry objects
function addGetGuaMethod(entry: DivinationEntry): DivinationEntry {
    if (!entry) return entry;

    // Add getGua method if it doesn't exist
    if (!entry.gua) {
        entry.gua = Gua.createFromOpsString(entry.manifestation);
    }

    return entry;
}

// API client with type hints
const apiClient = {
    // API functions
    interpretDivination: async (entry: DivinationEntry, daoTx: string, daoTxAmount: number, latestBlock: number): Promise<Interpretation> => {
        const response = await fetch(`${API_BASE}/deepseek_dao`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uuid: entry.uuid,
                lang: entry.lang,
                gua: entry.gua.getBinaryString(),
                gua_mutability: entry.gua.getMutabilityString(),
                dao_tx: daoTx,
                dao_tx_money: daoTxAmount,
                latest_block: latestBlock
            }),
        });
        if (!response.ok) {
            throw new Error('Failed to update zone');
        }
        const resp = await response.json() as CommonResponse<Interpretation>;
        return resp.data;
    },
    createDivination: async (data: DivinationRequest): Promise<DivinationEntry> => {
        const response = await fetch(`${API_BASE}/divination`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create divination');
        }
        const resp = await response.json() as CommonResponse<DivinationEntry>;
        return addGetGuaMethod(resp.data);
    },
    // API function for fetching latest public divinations
    fetchLatestPublicDivinations: async (): Promise<DivinationEntry[]> => {
        const response = await fetch(`${URL_API}/open/latest_dao_divinations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cursor: null,
                limit: 64
            }),
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch latest public divinations');
        }

        const data = await response.json() as DivinationResponse;
        return data.success ? data.data.map(addGetGuaMethod) : [];
    },
    // API function for fetching my divinations
    fetchMyDivinations: async ({ pageParam }): Promise<DivinationResponse> => {
        console.log(pageParam, "pageParam is cursor");
        const response = await fetch(`${URL_API}/api/my_divinations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cursor: pageParam,
                limit: DEFAULT_PAGE_SIZE
            }),
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch my divinations');
        }

        const result = await response.json() as DivinationResponse;

        // Add getGua method to each entry in the response
        if (result.success && result.data) {
            result.data = result.data.map(addGetGuaMethod);
        }

        return result;
    },

    fetchMyDaoEvents: async (latestBlock: number, cursor: number | null): Promise<CommonResponse<DaoEvent[]>> => {
        const response = await fetch(`${URL_API_MY_DAO_EVENTS}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cursor: cursor,
                latest_block: latestBlock
            }),
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch my divinations');
        }

        const result = await response.json() as CommonResponse<DaoEvent[]>;

        // Add getGua method to each entry in the response
        if (result.success && result.data) {
            result.data = result.data
        }

        return result;
    },

    // API function for fetching my divinations
    fetchFeaturedDivinations: async ({ pageParam }): Promise<DivinationResponse> => {
        console.log(pageParam, "pageParam is cursor");
        const response = await fetch(`${URL_API}/open/featured_dao_divinations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cursor: pageParam,
                limit: 8
            }),
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch featured divinations');
        }
        const result = await response.json() as DivinationResponse;

        // Add getGua method to each entry in the response
        if (result.success && result.data) {
            result.data = result.data.map(addGetGuaMethod);
        }

        return result;
    },
    // API function for fetching latest public divinations
    fetchOneDivination: async (id: string): Promise<DivinationEntry> => {
        const response = await fetch(`${URL_API}/api/divination/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id
            }),
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch latest public divinations');
        }
        const data = await response.json() as DivinationDetailResponse;
        return data.success ? addGetGuaMethod(data.data) : null;
    },
    me: async (): Promise<CommonResponse<UserData>> => {
        const response = await fetch(URL_API_ME, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.status >= 400 && response.status < 500) {
            return { success: false, message: 'Not logged in', data: { address: '0x', expire_at: 0 } };
        }
        if (!response.ok) throw new Error('Failed to fetch user data');
        return response.json();
    },
    // API function for fetching latest public divinations
    fetchDaoInvestors: async (latestBlock: number): Promise<CommonResponse<DaoEvent[]>> => {
        const response = await fetch(`${URL_API_INVESTORS}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                latest_block: latestBlock
            }),
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch all investors');
        }
        const data = await response.json() as CommonResponse<DaoEvent[]>;
        return data;
    },
    fetchLatestDaoEvents: async (latestBlock: number): Promise<CommonResponse<DaoEvent[]>> => {
        const response = await fetch(`${URL_API_LATEST_DAO_EVENTS}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                latest_block: latestBlock
            }),
            credentials: 'include'
        });
        debugger;
        if (!response.ok) {
            throw new Error('Failed to fetch latest dao events');
        }
        const data = await response.json() as CommonResponse<DaoEvent[]>;
        return data;
    },

    // Update divination verification status
    updateDivinationKnownStatus: async (uuid: string, known_status: number, known_tx: string, known_note: string): Promise<boolean> => {
        const response = await fetch(`${API_BASE}/divination/known_status`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uuid,
                known_status,
                known_tx,
                known_note
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update divination status');
        }
        return true;
    },
}

// Export the createDivination hook for use with TanStack Query
export const useCreateDivination = () => {
    const queryClient = useQueryClient();

    return useMutation<DivinationEntry, Error, DivinationRequest>({
        // mutationKey: ['create-divination'],
        mutationFn: (data) => apiClient.createDivination(data),
        onSuccess: (data) => {
            // Optionally invalidate queries that should refetch after this mutation
            queryClient.invalidateQueries({ queryKey: ['my-divinations'] });
        }
    });
};

export const useDeepseekDao = (options?: {
    latestBlock?: bigint,
    onSuccess?: (data: Interpretation) => void,
    onError?: (error: Error) => void
}) => {
    const queryClient = useQueryClient();

    return useMutation<
        Interpretation, // Success response type
        Error, // Error type
        { entry: DivinationEntry; daoTx: string; daoTxAmount: number }, // Variables type
        unknown // Context type
    >({
        mutationFn: async (data) => {
            const response = await apiClient.interpretDivination(
                data.entry,
                data.daoTx,
                data.daoTxAmount,
                Number(options?.latestBlock || 14944494n)
            );
            console.log(response, "response");
            return response; // Make sure this matches the Interpretation type
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['my-divinations'] });
            options?.onSuccess?.(data);
        },
        onError: (error) => {
            options?.onError?.(error);
        },
    });
};

// Fetch my divinations with infinite query
export const useMyDivinations = (limit: number = 6) => {
    return useInfiniteQuery<DivinationResponse>({
        queryKey: ['my-divinations'],
        initialPageParam: null,
        getNextPageParam: (lastPage) => lastPage.cursor,
        queryFn: apiClient.fetchMyDivinations,
        staleTime: 60000,
        refetchOnWindowFocus: false,
    });
};

export const useFeaturedDaoDivinations = () => {
    return useInfiniteQuery<DivinationResponse>({
        queryKey: ['featured-divinations'],
        initialPageParam: null,
        getNextPageParam: (lastPage) => lastPage.cursor,
        queryFn: apiClient.fetchFeaturedDivinations,
        staleTime: 60000,
        refetchOnWindowFocus: false,
    });
};

// Fetch latest public divinations
export const useLatestDaoInActionDivinations = () => {
    return useQuery<DivinationEntry[]>({
        queryKey: ['latest-dao-in-action-divinations'],
        queryFn: apiClient.fetchLatestPublicDivinations,
        staleTime: 60000,
        refetchOnWindowFocus: false,
    });
};

// Custom hook with address parameter
export const useUserData = (addr: Address) => {
    return useQuery<
        CommonResponse<UserData>,
        Error,
        UserData,
        [string, Address]
    >({
        queryKey: ['me', addr],
        queryFn: ({ queryKey: [_] }) => {
            return apiClient.me();
        },
        enabled: addr !== '0x',
        select: (data) => {
            return data.data;
        }
    });
};

// Hook for updating divination verification status
export const useUpdateDivinationStatus = (options?: {
    onSuccess?: () => void
}) => {
    const queryClient = useQueryClient();

    return useMutation<
        boolean, // Success response type
        Error, // Error type
        { uuid: string; known_status: number; known_tx: string, known_note: string }, // Variables type
        unknown // Context type
    >({
        mutationFn: async (data) => {
            const updateSuccess = await apiClient.updateDivinationKnownStatus(
                data.uuid,
                data.known_status,
                data.known_tx,
                data.known_note
            );
            return updateSuccess;
        },
        onSuccess: (data) => {
            // Invalidate relevant queries to trigger refetch
            queryClient.invalidateQueries({ queryKey: ['my-divinations'] });
            queryClient.invalidateQueries({ queryKey: ['featured-divinations'] });
            // Call the optional onSuccess callback
            options?.onSuccess?.();
        },
    });
};

// Fetch latest DAO events
export const useLatestDaoEvents = (latestBlock: bigint | undefined) => {
    const latestBlockNumber = Number(latestBlock);
    return useQuery<CommonResponse<DaoEvent[]>, Error, DaoEvent[]>({
        queryKey: ['latest-dao-events', latestBlockNumber],
        queryFn: () => apiClient.fetchLatestDaoEvents(latestBlockNumber),
        staleTime: 6000,
        refetchOnWindowFocus: false,
        select: (data) => data.data,
        enabled: !!latestBlockNumber
    });
};

// Fetch all investors
export const useDaoInvestors = (latestBlock: bigint | undefined) => {
    const latestBlockNumber = Number(latestBlock);
    return useQuery<CommonResponse<DaoEvent[]>, Error, DaoEvent[]>({
        queryKey: ['dao-investors', latestBlockNumber],
        queryFn: () => apiClient.fetchDaoInvestors(latestBlockNumber),
        staleTime: 3000,
        refetchOnWindowFocus: false,
        select: (data) => data.data,
        enabled: !!latestBlockNumber
    });
};

// Fetch my divinations with infinite query
export const useMyDaoEvents = (latestBlock: bigint | undefined) => {
    const latestBlockNumber = Number(latestBlock);
    return useInfiniteQuery<
        CommonResponse<DaoEvent[]>,  // TQueryFnData - what fetchMyDaoEvents returns
        Error,                       // TError
        InfiniteData<CommonResponse<DaoEvent[]>>,  // TData - includes pages property
        [string, number],            // TQueryKey
        number | null                // TPageParam
    >({
        queryKey: ['my-dao-events', latestBlockNumber] as [string, number],
        initialPageParam: null,
        getNextPageParam: (lastPage) => lastPage.cursor,
        queryFn: ({ pageParam }) => apiClient.fetchMyDaoEvents(latestBlockNumber, pageParam as number | null),
        staleTime: 60000,
        refetchOnWindowFocus: false,
        enabled: !!latestBlockNumber
    });
};