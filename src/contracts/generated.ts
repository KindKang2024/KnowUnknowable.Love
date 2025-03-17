import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BaguaDukiDaoContract
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const baguaDukiDaoContractAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  { type: 'receive', stateMutability: 'payable' },
  {
    type: 'function',
    inputs: [],
    name: 'UPGRADE_INTERFACE_VERSION',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'automationRegistry',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'baguaDaoBpsArr',
    outputs: [{ name: '', internalType: 'uint256[8]', type: 'uint256[8]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'baguaDaoFairDropArr',
    outputs: [
      {
        name: '',
        internalType: 'struct ISharedStructs.DaoFairDrop[8]',
        type: 'tuple[8]',
        components: [
          { name: 'unitAmount', internalType: 'uint256', type: 'uint256' },
          { name: 'unitNumber', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'baguaDaoUnitCountArr',
    outputs: [{ name: '', internalType: 'uint256[8]', type: 'uint256[8]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'buaguaDaoAgg4Me',
    outputs: [
      {
        name: '',
        internalType: 'struct ISharedStructs.BaguaDaoAgg',
        type: 'tuple',
        components: [
          { name: 'evolveNum', internalType: 'uint256', type: 'uint256' },
          { name: 'bornSeconds', internalType: 'uint256', type: 'uint256' },
          {
            name: 'totalClaimedAmount',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'stableCoinBalance',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'bpsArr', internalType: 'uint256[8]', type: 'uint256[8]' },
          { name: 'bpsNumArr', internalType: 'uint256[8]', type: 'uint256[8]' },
          {
            name: 'fairDrops',
            internalType: 'struct ISharedStructs.DaoFairDrop[8]',
            type: 'tuple[8]',
            components: [
              { name: 'unitAmount', internalType: 'uint256', type: 'uint256' },
              { name: 'unitNumber', internalType: 'uint256', type: 'uint256' },
            ],
          },
          {
            name: 'communityLuckyNumber',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'claimQualificationArr',
            internalType: 'bool[8]',
            type: 'bool[8]',
          },
          {
            name: 'participation',
            internalType: 'struct ISharedStructs.CommunityParticipation',
            type: 'tuple',
            components: [
              {
                name: 'participantNo',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'participantAmount',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'luckyClaimedRound',
                internalType: 'uint256',
                type: 'uint256',
              },
            ],
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'claim0Love_FounderFairDrop',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'claim1Love_MaintainerFairDrop',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'claim2Love_InvestorFairDrop',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'claim3Love_ContributorFairDrop',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'claim4Love_BuilderFairDrop',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'claim5Love_CommunityLotteryFairDrop',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'claim6Love_NationDukiInActionFairDrop',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'claim7Love_WorldDukiInActionFairDrop',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'connectDaoToInvest',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'diviUuid', internalType: 'bytes16', type: 'bytes16' },
      { name: 'diviWillHash', internalType: 'bytes32', type: 'bytes32' },
      { name: 'diviWillAnswer', internalType: 'bytes16', type: 'bytes16' },
      { name: 'willPowerAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'connectDaoToKnow',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'humanZkpRegistry',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'config',
        internalType: 'struct ISharedStructs.NetworkConfig',
        type: 'tuple',
        components: [
          { name: 'stableCoin', internalType: 'address', type: 'address' },
          { name: 'anyrand', internalType: 'address', type: 'address' },
          { name: 'maintainers', internalType: 'address[]', type: 'address[]' },
          { name: 'creators', internalType: 'address[]', type: 'address[]' },
        ],
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'requestId', internalType: 'uint256', type: 'uint256' },
      { name: 'randomNumber', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'receiveRandomness',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'callbackGasLimit', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'requestDaoEvolution',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 's_anyrand',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 's_community_lucky_participant_no',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 's_dao_born_seconds',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 's_dao_evolve_round',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 's_lastRandomnessWillCallbackTimestamp',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 's_lastRandomnessWillId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 's_lastRandomnessWillTimestamp',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 's_minWaitBetweenEvolutions',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 's_randomnessRequestDeadline',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 's_stableCoin',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_automationRegistry', internalType: 'address', type: 'address' },
    ],
    name: 'setAutomationRegistry',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newWaitTime', internalType: 'uint256', type: 'uint256' }],
    name: 'setMinWaitBetweenEvolutions',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newDeadline', internalType: 'uint256', type: 'uint256' }],
    name: 'setRandomnessRequestDeadline',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'tryAbortDaoEvolution',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'diviUuid', internalType: 'bytes16', type: 'bytes16' },
      {
        name: 'knownStatus',
        internalType: 'enum ISharedStructs.KnownStatus',
        type: 'uint8',
      },
    ],
    name: 'vowDaoManifestation',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldBpsArr',
        internalType: 'uint256[8]',
        type: 'uint256[8]',
        indexed: false,
      },
      {
        name: 'newBpsArr',
        internalType: 'uint256[8]',
        type: 'uint256[8]',
        indexed: false,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BaguaDukiDaoBpsChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'changeType',
        internalType: 'enum ISharedStructs.ConfigChangeType',
        type: 'uint8',
        indexed: false,
      },
      {
        name: 'previousFee',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newFee',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ConfigChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'diviner',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'diviId',
        internalType: 'bytes16',
        type: 'bytes16',
        indexed: false,
      },
      {
        name: 'diviWillHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ConnectDaoEvent',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'willId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'randomMutationNumber',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'communityLuckyNumber',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'daoEvolveRound',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'fairDrops',
        internalType: 'struct ISharedStructs.DaoFairDrop[8]',
        type: 'tuple[8]',
        components: [
          { name: 'unitAmount', internalType: 'uint256', type: 'uint256' },
          { name: 'unitNumber', internalType: 'uint256', type: 'uint256' },
        ],
        indexed: false,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'DaoEvolutionRepresentation',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'willId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'DaoEvolutionWilling',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'user',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'interactType',
        internalType: 'enum ISharedStructs.InteractType',
        type: 'uint8',
        indexed: false,
      },
      {
        name: 'daoEvolveRound',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'unitNumber',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'DukiInAction',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'implementation',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'Upgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'diviner',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'diviId',
        internalType: 'bytes16',
        type: 'bytes16',
        indexed: false,
      },
      {
        name: 'knownStatus',
        internalType: 'enum ISharedStructs.KnownStatus',
        type: 'uint8',
        indexed: false,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'VowDaoEvent',
  },
  {
    type: 'error',
    inputs: [{ name: 'target', internalType: 'address', type: 'address' }],
    name: 'AddressEmptyCode',
  },
  { type: 'error', inputs: [], name: 'AlreadyInvested' },
  { type: 'error', inputs: [], name: 'BpsSumError' },
  { type: 'error', inputs: [], name: 'BpsTooLargeViolationError' },
  { type: 'error', inputs: [], name: 'BpsTooSmallViolationError' },
  { type: 'error', inputs: [], name: 'ClaimedCurrentRoundAlreadyError' },
  { type: 'error', inputs: [], name: 'DaoEvolutionInProgress' },
  { type: 'error', inputs: [], name: 'DuplicateFounderError' },
  {
    type: 'error',
    inputs: [
      { name: 'implementation', internalType: 'address', type: 'address' },
    ],
    name: 'ERC1967InvalidImplementation',
  },
  { type: 'error', inputs: [], name: 'ERC1967NonPayable' },
  { type: 'error', inputs: [], name: 'FailedCall' },
  {
    type: 'error',
    inputs: [
      {
        name: 't',
        internalType: 'enum ISharedStructs.InteractType',
        type: 'uint8',
      },
      { name: 'src', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InsufficientAllowance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'required', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'balance', internalType: 'uint256', type: 'uint256' }],
    name: 'InsufficientDistributionAmount',
  },
  {
    type: 'error',
    inputs: [
      { name: 'provided', internalType: 'uint256', type: 'uint256' },
      { name: 'required', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InsufficientPayment',
  },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'InvalidKnownStatus' },
  { type: 'error', inputs: [], name: 'InvalidSignature' },
  { type: 'error', inputs: [], name: 'InvalidTrigramIndexError' },
  { type: 'error', inputs: [], name: 'InvertorsFullExceed369' },
  { type: 'error', inputs: [], name: 'InvestorsFull' },
  {
    type: 'error',
    inputs: [
      { name: 'currentClaimRound', internalType: 'uint256', type: 'uint256' },
      { name: 'lateEntryRound', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'LateForCurrentClaim',
  },
  { type: 'error', inputs: [], name: 'LoveAsMoneyIntoDaoRequired' },
  {
    type: 'error',
    inputs: [
      { name: 'lastEvolution', internalType: 'uint256', type: 'uint256' },
      { name: 'requiredWait', internalType: 'uint256', type: 'uint256' },
      { name: 'currentTime', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'MustWaitBetweenEvolutions',
  },
  { type: 'error', inputs: [], name: 'NoDistributionUnitLeft' },
  { type: 'error', inputs: [], name: 'NoFoundersError' },
  { type: 'error', inputs: [], name: 'NoParticipants' },
  { type: 'error', inputs: [], name: 'NoPendingRandomnessWill' },
  { type: 'error', inputs: [], name: 'NotCommunityLotteryWinner' },
  { type: 'error', inputs: [], name: 'NotHasRole' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  { type: 'error', inputs: [], name: 'NotOwnerError' },
  {
    type: 'error',
    inputs: [
      {
        name: 't',
        internalType: 'enum ISharedStructs.InteractType',
        type: 'uint8',
      },
    ],
    name: 'NotQualifiedForClaim',
  },
  {
    type: 'error',
    inputs: [{ name: 'actionNeeded', internalType: 'string', type: 'string' }],
    name: 'NotSupported',
  },
  { type: 'error', inputs: [], name: 'NotZkProvedHuman' },
  { type: 'error', inputs: [], name: 'OnlyAnyrandCanCall' },
  { type: 'error', inputs: [], name: 'OnlyAutomationCanCall' },
  { type: 'error', inputs: [], name: 'OnlyMaintainerOrAutomationCanCall' },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  { type: 'error', inputs: [], name: 'RefundFailed' },
  {
    type: 'error',
    inputs: [
      {
        name: 't',
        internalType: 'enum IBaguaDukiDao.CoinFlowType',
        type: 'uint8',
      },
      { name: 'other', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'TransferFailed',
  },
  { type: 'error', inputs: [], name: 'UUPSUnauthorizedCallContext' },
  {
    type: 'error',
    inputs: [{ name: 'slot', internalType: 'bytes32', type: 'bytes32' }],
    name: 'UUPSUnsupportedProxiableUUID',
  },
  {
    type: 'error',
    inputs: [
      { name: 'willId', internalType: 'uint256', type: 'uint256' },
      { name: 'expectedWillId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'UnknownWillId',
  },
  { type: 'error', inputs: [], name: 'ZeroAddressError' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// erc20
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc20Abi = [
  {
    type: 'event',
    inputs: [
      { name: 'owner', type: 'address', indexed: true },
      { name: 'spender', type: 'address', indexed: true },
      { name: 'value', type: 'uint256', indexed: false },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'value', type: 'uint256', indexed: false },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', type: 'address' },
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
      { name: 'v', type: 'uint8' },
      { name: 'r', type: 'bytes32' },
      { name: 's', type: 'bytes32' },
    ],
    name: 'permit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'DOMAIN_SEPARATOR',
    outputs: [{ name: '', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'nonces',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__
 */
export const useReadBaguaDukiDaoContract = /*#__PURE__*/ createUseReadContract({
  abi: baguaDukiDaoContractAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"UPGRADE_INTERFACE_VERSION"`
 */
export const useReadBaguaDukiDaoContractUpgradeInterfaceVersion =
  /*#__PURE__*/ createUseReadContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 'UPGRADE_INTERFACE_VERSION',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"automationRegistry"`
 */
export const useReadBaguaDukiDaoContractAutomationRegistry =
  /*#__PURE__*/ createUseReadContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 'automationRegistry',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"baguaDaoBpsArr"`
 */
export const useReadBaguaDukiDaoContractBaguaDaoBpsArr =
  /*#__PURE__*/ createUseReadContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 'baguaDaoBpsArr',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"baguaDaoFairDropArr"`
 */
export const useReadBaguaDukiDaoContractBaguaDaoFairDropArr =
  /*#__PURE__*/ createUseReadContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 'baguaDaoFairDropArr',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"baguaDaoUnitCountArr"`
 */
export const useReadBaguaDukiDaoContractBaguaDaoUnitCountArr =
  /*#__PURE__*/ createUseReadContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 'baguaDaoUnitCountArr',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"buaguaDaoAgg4Me"`
 */
export const useReadBaguaDukiDaoContractBuaguaDaoAgg4Me =
  /*#__PURE__*/ createUseReadContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 'buaguaDaoAgg4Me',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"humanZkpRegistry"`
 */
export const useReadBaguaDukiDaoContractHumanZkpRegistry =
  /*#__PURE__*/ createUseReadContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 'humanZkpRegistry',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"owner"`
 */
export const useReadBaguaDukiDaoContractOwner =
  /*#__PURE__*/ createUseReadContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 'owner',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"proxiableUUID"`
 */
export const useReadBaguaDukiDaoContractProxiableUuid =
  /*#__PURE__*/ createUseReadContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 'proxiableUUID',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"s_anyrand"`
 */
export const useReadBaguaDukiDaoContractSAnyrand =
  /*#__PURE__*/ createUseReadContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 's_anyrand',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"s_community_lucky_participant_no"`
 */
export const useReadBaguaDukiDaoContractSCommunityLuckyParticipantNo =
  /*#__PURE__*/ createUseReadContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 's_community_lucky_participant_no',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"s_dao_born_seconds"`
 */
export const useReadBaguaDukiDaoContractSDaoBornSeconds =
  /*#__PURE__*/ createUseReadContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 's_dao_born_seconds',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"s_dao_evolve_round"`
 */
export const useReadBaguaDukiDaoContractSDaoEvolveRound =
  /*#__PURE__*/ createUseReadContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 's_dao_evolve_round',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"s_lastRandomnessWillCallbackTimestamp"`
 */
export const useReadBaguaDukiDaoContractSLastRandomnessWillCallbackTimestamp =
  /*#__PURE__*/ createUseReadContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 's_lastRandomnessWillCallbackTimestamp',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"s_lastRandomnessWillId"`
 */
export const useReadBaguaDukiDaoContractSLastRandomnessWillId =
  /*#__PURE__*/ createUseReadContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 's_lastRandomnessWillId',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"s_lastRandomnessWillTimestamp"`
 */
export const useReadBaguaDukiDaoContractSLastRandomnessWillTimestamp =
  /*#__PURE__*/ createUseReadContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 's_lastRandomnessWillTimestamp',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"s_minWaitBetweenEvolutions"`
 */
export const useReadBaguaDukiDaoContractSMinWaitBetweenEvolutions =
  /*#__PURE__*/ createUseReadContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 's_minWaitBetweenEvolutions',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"s_randomnessRequestDeadline"`
 */
export const useReadBaguaDukiDaoContractSRandomnessRequestDeadline =
  /*#__PURE__*/ createUseReadContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 's_randomnessRequestDeadline',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"s_stableCoin"`
 */
export const useReadBaguaDukiDaoContractSStableCoin =
  /*#__PURE__*/ createUseReadContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 's_stableCoin',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__
 */
export const useWriteBaguaDukiDaoContract =
  /*#__PURE__*/ createUseWriteContract({ abi: baguaDukiDaoContractAbi })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"claim0Love_FounderFairDrop"`
 */
export const useWriteBaguaDukiDaoContractClaim0LoveFounderFairDrop =
  /*#__PURE__*/ createUseWriteContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 'claim0Love_FounderFairDrop',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"claim1Love_MaintainerFairDrop"`
 */
export const useWriteBaguaDukiDaoContractClaim1LoveMaintainerFairDrop =
  /*#__PURE__*/ createUseWriteContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 'claim1Love_MaintainerFairDrop',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"claim2Love_InvestorFairDrop"`
 */
export const useWriteBaguaDukiDaoContractClaim2LoveInvestorFairDrop =
  /*#__PURE__*/ createUseWriteContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 'claim2Love_InvestorFairDrop',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"claim3Love_ContributorFairDrop"`
 */
export const useWriteBaguaDukiDaoContractClaim3LoveContributorFairDrop =
  /*#__PURE__*/ createUseWriteContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 'claim3Love_ContributorFairDrop',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"claim4Love_BuilderFairDrop"`
 */
export const useWriteBaguaDukiDaoContractClaim4LoveBuilderFairDrop =
  /*#__PURE__*/ createUseWriteContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 'claim4Love_BuilderFairDrop',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"claim5Love_CommunityLotteryFairDrop"`
 */
export const useWriteBaguaDukiDaoContractClaim5LoveCommunityLotteryFairDrop =
  /*#__PURE__*/ createUseWriteContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 'claim5Love_CommunityLotteryFairDrop',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"claim6Love_NationDukiInActionFairDrop"`
 */
export const useWriteBaguaDukiDaoContractClaim6LoveNationDukiInActionFairDrop =
  /*#__PURE__*/ createUseWriteContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 'claim6Love_NationDukiInActionFairDrop',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"claim7Love_WorldDukiInActionFairDrop"`
 */
export const useWriteBaguaDukiDaoContractClaim7LoveWorldDukiInActionFairDrop =
  /*#__PURE__*/ createUseWriteContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 'claim7Love_WorldDukiInActionFairDrop',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"connectDaoToInvest"`
 */
export const useWriteBaguaDukiDaoContractConnectDaoToInvest =
  /*#__PURE__*/ createUseWriteContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 'connectDaoToInvest',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"connectDaoToKnow"`
 */
export const useWriteBaguaDukiDaoContractConnectDaoToKnow =
  /*#__PURE__*/ createUseWriteContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 'connectDaoToKnow',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"initialize"`
 */
export const useWriteBaguaDukiDaoContractInitialize =
  /*#__PURE__*/ createUseWriteContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"receiveRandomness"`
 */
export const useWriteBaguaDukiDaoContractReceiveRandomness =
  /*#__PURE__*/ createUseWriteContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 'receiveRandomness',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteBaguaDukiDaoContractRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"requestDaoEvolution"`
 */
export const useWriteBaguaDukiDaoContractRequestDaoEvolution =
  /*#__PURE__*/ createUseWriteContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 'requestDaoEvolution',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"setAutomationRegistry"`
 */
export const useWriteBaguaDukiDaoContractSetAutomationRegistry =
  /*#__PURE__*/ createUseWriteContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 'setAutomationRegistry',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"setMinWaitBetweenEvolutions"`
 */
export const useWriteBaguaDukiDaoContractSetMinWaitBetweenEvolutions =
  /*#__PURE__*/ createUseWriteContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 'setMinWaitBetweenEvolutions',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"setRandomnessRequestDeadline"`
 */
export const useWriteBaguaDukiDaoContractSetRandomnessRequestDeadline =
  /*#__PURE__*/ createUseWriteContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 'setRandomnessRequestDeadline',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteBaguaDukiDaoContractTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"tryAbortDaoEvolution"`
 */
export const useWriteBaguaDukiDaoContractTryAbortDaoEvolution =
  /*#__PURE__*/ createUseWriteContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 'tryAbortDaoEvolution',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"upgradeToAndCall"`
 */
export const useWriteBaguaDukiDaoContractUpgradeToAndCall =
  /*#__PURE__*/ createUseWriteContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 'upgradeToAndCall',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"vowDaoManifestation"`
 */
export const useWriteBaguaDukiDaoContractVowDaoManifestation =
  /*#__PURE__*/ createUseWriteContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 'vowDaoManifestation',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__
 */
export const useSimulateBaguaDukiDaoContract =
  /*#__PURE__*/ createUseSimulateContract({ abi: baguaDukiDaoContractAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"claim0Love_FounderFairDrop"`
 */
export const useSimulateBaguaDukiDaoContractClaim0LoveFounderFairDrop =
  /*#__PURE__*/ createUseSimulateContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 'claim0Love_FounderFairDrop',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"claim1Love_MaintainerFairDrop"`
 */
export const useSimulateBaguaDukiDaoContractClaim1LoveMaintainerFairDrop =
  /*#__PURE__*/ createUseSimulateContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 'claim1Love_MaintainerFairDrop',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"claim2Love_InvestorFairDrop"`
 */
export const useSimulateBaguaDukiDaoContractClaim2LoveInvestorFairDrop =
  /*#__PURE__*/ createUseSimulateContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 'claim2Love_InvestorFairDrop',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"claim3Love_ContributorFairDrop"`
 */
export const useSimulateBaguaDukiDaoContractClaim3LoveContributorFairDrop =
  /*#__PURE__*/ createUseSimulateContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 'claim3Love_ContributorFairDrop',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"claim4Love_BuilderFairDrop"`
 */
export const useSimulateBaguaDukiDaoContractClaim4LoveBuilderFairDrop =
  /*#__PURE__*/ createUseSimulateContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 'claim4Love_BuilderFairDrop',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"claim5Love_CommunityLotteryFairDrop"`
 */
export const useSimulateBaguaDukiDaoContractClaim5LoveCommunityLotteryFairDrop =
  /*#__PURE__*/ createUseSimulateContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 'claim5Love_CommunityLotteryFairDrop',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"claim6Love_NationDukiInActionFairDrop"`
 */
export const useSimulateBaguaDukiDaoContractClaim6LoveNationDukiInActionFairDrop =
  /*#__PURE__*/ createUseSimulateContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 'claim6Love_NationDukiInActionFairDrop',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"claim7Love_WorldDukiInActionFairDrop"`
 */
export const useSimulateBaguaDukiDaoContractClaim7LoveWorldDukiInActionFairDrop =
  /*#__PURE__*/ createUseSimulateContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 'claim7Love_WorldDukiInActionFairDrop',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"connectDaoToInvest"`
 */
export const useSimulateBaguaDukiDaoContractConnectDaoToInvest =
  /*#__PURE__*/ createUseSimulateContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 'connectDaoToInvest',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"connectDaoToKnow"`
 */
export const useSimulateBaguaDukiDaoContractConnectDaoToKnow =
  /*#__PURE__*/ createUseSimulateContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 'connectDaoToKnow',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulateBaguaDukiDaoContractInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"receiveRandomness"`
 */
export const useSimulateBaguaDukiDaoContractReceiveRandomness =
  /*#__PURE__*/ createUseSimulateContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 'receiveRandomness',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateBaguaDukiDaoContractRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"requestDaoEvolution"`
 */
export const useSimulateBaguaDukiDaoContractRequestDaoEvolution =
  /*#__PURE__*/ createUseSimulateContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 'requestDaoEvolution',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"setAutomationRegistry"`
 */
export const useSimulateBaguaDukiDaoContractSetAutomationRegistry =
  /*#__PURE__*/ createUseSimulateContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 'setAutomationRegistry',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"setMinWaitBetweenEvolutions"`
 */
export const useSimulateBaguaDukiDaoContractSetMinWaitBetweenEvolutions =
  /*#__PURE__*/ createUseSimulateContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 'setMinWaitBetweenEvolutions',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"setRandomnessRequestDeadline"`
 */
export const useSimulateBaguaDukiDaoContractSetRandomnessRequestDeadline =
  /*#__PURE__*/ createUseSimulateContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 'setRandomnessRequestDeadline',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateBaguaDukiDaoContractTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"tryAbortDaoEvolution"`
 */
export const useSimulateBaguaDukiDaoContractTryAbortDaoEvolution =
  /*#__PURE__*/ createUseSimulateContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 'tryAbortDaoEvolution',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"upgradeToAndCall"`
 */
export const useSimulateBaguaDukiDaoContractUpgradeToAndCall =
  /*#__PURE__*/ createUseSimulateContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 'upgradeToAndCall',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `functionName` set to `"vowDaoManifestation"`
 */
export const useSimulateBaguaDukiDaoContractVowDaoManifestation =
  /*#__PURE__*/ createUseSimulateContract({
    abi: baguaDukiDaoContractAbi,
    functionName: 'vowDaoManifestation',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__
 */
export const useWatchBaguaDukiDaoContractEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: baguaDukiDaoContractAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `eventName` set to `"BaguaDukiDaoBpsChanged"`
 */
export const useWatchBaguaDukiDaoContractBaguaDukiDaoBpsChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: baguaDukiDaoContractAbi,
    eventName: 'BaguaDukiDaoBpsChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `eventName` set to `"ConfigChanged"`
 */
export const useWatchBaguaDukiDaoContractConfigChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: baguaDukiDaoContractAbi,
    eventName: 'ConfigChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `eventName` set to `"ConnectDaoEvent"`
 */
export const useWatchBaguaDukiDaoContractConnectDaoEventEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: baguaDukiDaoContractAbi,
    eventName: 'ConnectDaoEvent',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `eventName` set to `"DaoEvolutionRepresentation"`
 */
export const useWatchBaguaDukiDaoContractDaoEvolutionRepresentationEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: baguaDukiDaoContractAbi,
    eventName: 'DaoEvolutionRepresentation',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `eventName` set to `"DaoEvolutionWilling"`
 */
export const useWatchBaguaDukiDaoContractDaoEvolutionWillingEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: baguaDukiDaoContractAbi,
    eventName: 'DaoEvolutionWilling',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `eventName` set to `"DukiInAction"`
 */
export const useWatchBaguaDukiDaoContractDukiInActionEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: baguaDukiDaoContractAbi,
    eventName: 'DukiInAction',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchBaguaDukiDaoContractInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: baguaDukiDaoContractAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchBaguaDukiDaoContractOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: baguaDukiDaoContractAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `eventName` set to `"Upgraded"`
 */
export const useWatchBaguaDukiDaoContractUpgradedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: baguaDukiDaoContractAbi,
    eventName: 'Upgraded',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link baguaDukiDaoContractAbi}__ and `eventName` set to `"VowDaoEvent"`
 */
export const useWatchBaguaDukiDaoContractVowDaoEventEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: baguaDukiDaoContractAbi,
    eventName: 'VowDaoEvent',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__
 */
export const useReadErc20 = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"allowance"`
 */
export const useReadErc20Allowance = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'allowance',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadErc20BalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"decimals"`
 */
export const useReadErc20Decimals = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'decimals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"name"`
 */
export const useReadErc20Name = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"symbol"`
 */
export const useReadErc20Symbol = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadErc20TotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"DOMAIN_SEPARATOR"`
 */
export const useReadErc20DomainSeparator = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'DOMAIN_SEPARATOR',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"nonces"`
 */
export const useReadErc20Nonces = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'nonces',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20Abi}__
 */
export const useWriteErc20 = /*#__PURE__*/ createUseWriteContract({
  abi: erc20Abi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"approve"`
 */
export const useWriteErc20Approve = /*#__PURE__*/ createUseWriteContract({
  abi: erc20Abi,
  functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transfer"`
 */
export const useWriteErc20Transfer = /*#__PURE__*/ createUseWriteContract({
  abi: erc20Abi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteErc20TransferFrom = /*#__PURE__*/ createUseWriteContract({
  abi: erc20Abi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"permit"`
 */
export const useWriteErc20Permit = /*#__PURE__*/ createUseWriteContract({
  abi: erc20Abi,
  functionName: 'permit',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20Abi}__
 */
export const useSimulateErc20 = /*#__PURE__*/ createUseSimulateContract({
  abi: erc20Abi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"approve"`
 */
export const useSimulateErc20Approve = /*#__PURE__*/ createUseSimulateContract({
  abi: erc20Abi,
  functionName: 'approve',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transfer"`
 */
export const useSimulateErc20Transfer = /*#__PURE__*/ createUseSimulateContract(
  { abi: erc20Abi, functionName: 'transfer' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateErc20TransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc20Abi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"permit"`
 */
export const useSimulateErc20Permit = /*#__PURE__*/ createUseSimulateContract({
  abi: erc20Abi,
  functionName: 'permit',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc20Abi}__
 */
export const useWatchErc20Event = /*#__PURE__*/ createUseWatchContractEvent({
  abi: erc20Abi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc20Abi}__ and `eventName` set to `"Approval"`
 */
export const useWatchErc20ApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc20Abi,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc20Abi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchErc20TransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc20Abi,
    eventName: 'Transfer',
  })
