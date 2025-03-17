import {Address} from "viem";
import {Abi} from "abitype";

export type GenericContractsDeclaration = {
    [chainId: number]: {
        [contractName: string]: GenericContract;
    };
};


export type GenericContract = {
    address: Address;
    abi: Abi;
    inheritedFunctions?: InheritedFunctions;
    external?: true;
    deploymentFile?: string;
    deploymentScript?: string;
};

export type InheritedFunctions = { readonly [key: string]: string };
