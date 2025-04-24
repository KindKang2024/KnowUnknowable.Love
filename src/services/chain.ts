import {Gua} from "@/stores/Gua";
import {useInfiniteQuery, useMutation, useQuery, useQueryClient,} from "@tanstack/react-query";
import {Address} from "viem";


export const DEFAULT_PAGE_SIZE = process.env.NODE_ENV === 'development' ? 2 : 10;
// Types for API responses
// export const URL_API = 'http://localhost:8787';
export const URL_API = process.env.NODE_ENV === 'development' ? 'http://localhost:8080': "https://knowunknowable.love";
// const URL_API = 'https://api_unstoppable.beswarm.workers.dev';
export const URL_API_NONCE = URL_API + '/open/nonce';
export const URL_API_LOGIN = URL_API + '/open/login';
export const URL_API_LOGOUT = URL_API + '/open/logout';
export const URL_API_ME = URL_API + '/api/me';
export const API_BASE = URL_API + '/api';

export type CommonResponse<T> = {
    success: boolean;
    message: string;
    data: T;
};



export type Interpretation = {
    interpretation: string;
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
    uuid: string | number;
    diviner: string;
    will: string;
    visibility: number;
    will_signature: string;
    manifestation: string;
    interpretation: string;
    dao_tx: string;
    dao_tx_amount: number;
    // 0: Unknown, 1: Verified Pass, 2: Verified Reject, 3: Deprecated
    known_status: number;
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
    interpretDivination: async (id: string): Promise<Interpretation> => {
        const response = await fetch(`${API_BASE}/interpret`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ divination_id: id }),
        });
        if (!response.ok) {
            throw new Error('Failed to update zone');
        }
        return response.json();
    },
    changeVisibility: async (id: string, visibility: boolean): Promise<CommonResponse<void>> => {
        const response = await fetch(`${API_BASE}/zone/${id}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, visibility }),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete zone');
        }
        return response.json();
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
        const response = await fetch(`${URL_API}/api/latest_public_divinations`, {
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
    // API function for fetching my divinations
    fetchFeaturedDivinations: async ({ pageParam }): Promise<DivinationResponse> => {
        console.log(pageParam, "pageParam is cursor");
        const response = await fetch(`${URL_API}/api/featured_divinations`, {
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

// Fetch my divinations with infinite query
export const useMyDivinations = (limit: number = 6) => {
    return useInfiniteQuery<DivinationResponse>({
        queryKey: ['my-divinations-initial'],
        initialPageParam: null,
        getNextPageParam: (lastPage) => lastPage.cursor,
        queryFn: apiClient.fetchMyDivinations,
        staleTime: 60000, // 1 minute
    });
};

export const useFeaturedDaoDivinations = () => {
    return useInfiniteQuery<DivinationResponse>({
        queryKey: ['featured-divinations'],
        initialPageParam: null,
        getNextPageParam: (lastPage) => lastPage.cursor,
        queryFn: apiClient.fetchFeaturedDivinations,
        staleTime: 60000, // 1 minute
        refetchOnWindowFocus: false,
    });
};

// Fetch latest public divinations
export const useLatestDaoInActionDivinations = () => {
    return useQuery<DivinationEntry[]>({
        queryKey: ['latest-dao-in-action-divinations'],
        queryFn: apiClient.fetchLatestPublicDivinations,
        staleTime: 60000, // 1 minute
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