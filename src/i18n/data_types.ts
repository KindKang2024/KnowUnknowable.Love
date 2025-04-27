// To parse this data:
//
//   import { Convert, DataTypes } from "./file";
//
//   const dataTypes = Convert.toDataTypes(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface DataTypes {
    iChing: { [key: string]: IChing };
    ui:     UI;
}

export interface IChing {
    gua_ci:   string;
    name:     string;
    symbol?:  string;
    yao_ci:   string[];
    yong_ci?: string;
}

export interface UI {
    commonData:          CommonData;
    daoPageData:         DAOPageData;
    diviPageData:        DiviPageData;
    gua:                 string;
    iChingPageData:      IChingPageData;
    mutation:            string;
    mutationCountSuffix: string;
    willPageData:        WillPageData;
}

export interface CommonData {
    action:                  string;
    actionVerify:            string;
    slogan:                  string;
    actionViewDetail:        string;
    address:                 string;
    amountSelectLabel:       string;
    authenticating:          string;
    authStatus:              string;
    balance:                 string;
    bridgeActionLabel:       string;
    buttons:                 Buttons;
    chainBridgeLabel:        string;
    changingLines:           string;
    close:                   string;
    connecting:              string;
    connectWallet:           string;
    daoActionSlogan:         string;
    daoContractLabel:        string;
    usdcTotalAmount:         string;
    diviParticipationLabel:  string;
    diviParticipationInfo:   string;
    daoSlogan:               string;
    disconnect:              string;
    diviFields:              DiviFields;
    DivinationTabs:          DivinationTabs;
    epistemicEnums:          string[];
    errorManifesting:        string;
    gua:                     string;
    highlightPrefix:         boolean;
    information:             string;
    knowUnknowablePrefix:    string;
    knowUnknowableSuffix:    string;
    loading:                 string;
    loadMore:                string;
    manifesting:             string;
    modals:                  Modals;
    mutation:                string;
    mutationCountSuffix:     string;
    navLabels:               string[];
    noDivinationsFound:      string;
    private:                 string;
    privateDescription:      string;
    public:                  string;
    publicDescription:       string;
    showMore:                string;
    statusAuthenticated:     string;
    statusNotAuthenticated:  string;
    textLoveBeTheWayToKnow:  string;
    textPrimaryHexagram:     string;
    textRelatingHexagram:    string;
    unsupportedChain:        string;
    viewOnChain:             string;
    voyager:                 Voyager;
    walletInformation:       string;
    walletNetwork:           string;
    walletProfileTitle:      string;
    walletTotalUSDCLabel:    string;
    connectDaoToParticipate: string;
}

export interface DivinationTabs {
    dao:    string;
    iChing: string;
    will:   string;
}

export interface Buttons {
    cancel:             string;
    details:            string;
    startDivine:        string;
    submit:             string;
    submitVerification: string;
    verify:             string;
    view:               string;
    refresh:            string;
}

export interface DiviFields {
    action:            string;
    daoTx:             string;
    daoTxAmount:       string;
    diviGua:           string;
    diviGuaMutations:  string;
    diviGuaProof:      string;
    diviGuaSummary:    string;
    diviManifestation: string;
    diviner:           string;
    diviSignature:     string;
    diviTime:          string;
    diviWill:          string;
    knowDaoStatus:     string;
    knowTime:          string;
}

export interface Modals {
    amountSelectPlaceholder:            string;
    connectDaoDescription:              string;
    connectDaoTitle:                    string;
    connectWalletToPay:                 string;
    deepseekDao:                        string;
    deepseekExplanation:                string;
    deepseeking:                        string;
    deepseekResult:                     string;
    divinationResult:                   string;
    emptyInterpretationPlaceholder:     string;
    enlightenmentText:                  string;
    finishDivinationFirst:              string;
    finishConsentFirst:                 string;
    insufficientBalance:                string;
    joinDaoToDeepseek:                  string;
    processing:                         string;
    retryPayment:                       string;
    connectingDao:                      string;
    deepseekDaoError:                   string;
    deepseekDaoErrorDescription:        string;
    approveAllowanceFailed:             string;
    daoConnected:                       string;
    daoConnectedDescription:            string;
    invalidAmount:                      string;
    invalidAmountDescription:           string;
    paymentSuccessful:                  string;
    retryDaoRequest:                    string;
    transactionCancelled:               string;
    transactionCancelledDescription:    string;
    saveImage:                          string;
    share:                              string;
    updateKnownStatus:                  string;
    updateKnownStatusDeprecated:        string;
    updateKnownStatusDescription:       string;
    updateKnownStatusNote:              string;
    updateKnownStatusNotePlaceholder:   string;
    updateKnownStatusVerifiedCorrect:   string;
    updateKnownStatusVerifiedIncorrect: string;
    verificationStatus:                 string;
    viewDaoTx:                          string;
    willManifestationQuestion:          string;
    consentPoints:                      string[];
    agreementSignatureLabel:            string;
    awaitingSignatureLabel:             string;
    signingLabel:                       string;
    signAgreementButton:                string;
    errorSigningLabel:                  string;
    divineAgreement:                    string;
    insufficientBalanceError:           string;
    approvalFailed:                     string;
    successfullyBecomeAnInvestor:       string;
    becomeAnInvestor:                   string;
    joinAsInvestorToSupport:            string;
    investmentAmountLabel:              string;
    whyBecomeAnInvestor:                string;
    investorBenefits:                   string[];
}

export interface Voyager {
    copyright_notice:       string;
    copyright_notice_title: string;
    images:                 Image[];
    title:                  string;
    tracks:                 Track[];
}

export interface Image {
    low_copyright_risk?: boolean;
    name:                string;
}

export interface Track {
    artist:              null | string;
    country_code:        string;
    low_copyright_risk?: boolean;
    title:               string;
    track_number:        number;
}

export interface DAOPageData {
    allTransactions:         string;
    almWorldSlogons:         AlmWorldSlogon[];
    claim:                   string;
    claimed:                 string;
    claimRequirements:       string;
    alreadyAnInvestor:       string;
    maxInvestorCountReached: string;
    currentBlock:            string;
    currentEvolutionDrop:    string;
    daoEvolutionDesc:        string;
    daoEvolutionDescPrefix:  string;
    daoTerm:                 string;
    daoTermDefinitionMiddle: string;
    daoTermDefinitionPrefix: string;
    daoTermDefinitionSuffix: string;
    dropDollars:             string;
    dropUnits:               string;
    dukiDefinition:          string;
    dukiInAction:            string;
    evolutionStatus:         string;
    fairDrop:                string;
    historyTotalDrop:        string;
    lottery:                 string;
    lotteryPrizeRule:        string;
    manifestation:           Manifestation;
    maxPrize:                string;
    myTransactions:          string;
    daoInvestmentNews:       string;
    noTransactionsFound:     string;
    noInvestorPromotion:     string;
    philosophy:              string;
    sections:                Section[];
    totalParticipants:       string;
    trackLatestTransactions: string;
    treasury:                string;
    usdcAvailable:           string;
    usdcBalance:             string;
}

export interface AlmWorldSlogon {
    desc:   string;
    slogon: string;
}

export interface Manifestation {
    age:           string;
    amount:        string;
    creator:       string;
    interaction:   string;
    interactTypes: string[];
    txHash:        string;
}

export interface Section {
    description:  string;
    requirements: Requirements;
    target:       string;
    title:        string;
}

export interface Requirements {
    p1:   string;
    p2:   string;
    btn?: Btn;
    p1_?: string;
    p2_?: string;
}

export interface Btn {
    modal: string;
    text:  string;
}

export interface DiviPageData {
    diviPanelData: DiviPanelData;
    loadingPhrase: string;
}

export interface DiviPanelData {
    beforeDividePhaseText: string;
    createDivinationError: string;
    dividePhasesTextArray: string[];
    inspectMutationTip:    string;
    mutationsCountPrefix:  string;
    mutationsCountSuffix:  string;
    startDivideTip:        string;
    step1:                 Step1;
    step2:                 Step2;
    step3:                 Step3;
    textRetrySave:         string;
    textSaveSuccess:       string;
    textSaving:            string;
    title:                 string;
    toasts:                Toasts;
}

export interface Step1 {
    description:            string;
    divinationConsentLabel: string;
    divinationConsentProof: string;
    title:                  string;
}

export interface Step2 {
    description:           string;
    diviSpeed:             string;
    diviSpeedOptions:      DiviSpeedOptions;
    textChangesInProgress: string;
    textLineChangeable:    string;
    textLineNotChangeable: string;
    textProgress:          string;
    title:                 string;
}

export interface DiviSpeedOptions {
    fast:   string;
    normal: string;
    slow:   string;
}

export interface Step3 {
    description:              string;
    textConnectWalletToPay:   string;
    textDeepseekDao:          string;
    textDeepseekExplanation:  string;
    textDeepseekResult:       string;
    textDivinationCompleted:  string;
    textJoinDaoToDeepseek:    string;
    textLoveBeTheWayToKnow:   string;
    textNoDaoConnectionProof: string;
    textPaymentCompleted:     string;
    textProcessing:           string;
    textViewDaoTx:            string;
    title:                    string;
}

export interface Toasts {
    divinationComplete: DivinationComplete;
}

export interface DivinationComplete {
    description: string;
    title:       string;
}

export interface IChingPageData {
    howIChingWorks:                    string;
    iChingAndWillAndLoveAndDNA:        string;
    iChingAndWillAndLoveAndDNADetails: string[];
    iChingAndZkProofAndRandomness:     string;
    modernZeroKnowledgeProof:          string;
    perspectiveExplanation:            string;
    prerequisite:                      string;
    prerequisiteDescription:           string;
    quotes:                            Quote[];
    references:                        Reference[];
    zkDemo:                            ZkDemo;
}

export interface Quote {
    author: string;
    quote:  string;
}

export interface Reference {
    author?:     string;
    description: string;
    link:        string;
    title:       string;
    authors?:    string;
}

export interface ZkDemo {
    clickAnyEdge:     string;
    comparisons:      Comparison[];
    comparisonsTitle: string;
    description:      string;
    originalAddress:  string;
    resetText:        string;
    revealText:       string;
    title:            string;
    turboText:        string;
    confidence:       string;
    useRevealButton:  string;
}

export interface Comparison {
    aspect: string;
    iChing: string;
    zkDemo: string;
}

export interface WillPageData {
    connectToViewTips:         string;
    connectWallet:             string;
    daoFeaturedDivinations:    string;
    daoLatestDivinations:      string;
    diviAlgo:                  string;
    diviAlgoDescription:       string;
    diviAlgoSlogan:            string;
    diviAlgoSloganDescription: string;
    diviAlgoSteps:             DiviAlgoStep[];
    diviAlgoStepsTitle:        string;
    iChingToKnow:              string;
    iChingToKnowDescription:   string;
    iChingToKnowTarget:        string;
    loveWillRepresentation:    string;
    myDivinations:             string;
    samples:                   Samples;
    willDiviTemplate:          string;
}

export interface DiviAlgoStep {
    long_description:  string;
    short_description: string;
    title:             string;
}

export interface Samples {
    suggestions: Suggestion[];
    typings:     Typings;
}

export interface Suggestion {
    key:   string;
    value: string;
}

export interface Typings {
    prefix:         string;
    suffix_options: string[];
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toDataTypes(json: string): DataTypes {
        return cast(JSON.parse(json), r("DataTypes"));
    }

    public static dataTypesToJson(value: DataTypes): string {
        return JSON.stringify(uncast(value, r("DataTypes")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "DataTypes": o([
        { json: "iChing", js: "iChing", typ: m(r("IChing")) },
        { json: "ui", js: "ui", typ: r("UI") },
    ], false),
    "IChing": o([
        { json: "gua_ci", js: "gua_ci", typ: "" },
        { json: "name", js: "name", typ: "" },
        { json: "symbol", js: "symbol", typ: u(undefined, "") },
        { json: "yao_ci", js: "yao_ci", typ: a("") },
        { json: "yong_ci", js: "yong_ci", typ: u(undefined, "") },
    ], false),
    "UI": o([
        { json: "commonData", js: "commonData", typ: r("CommonData") },
        { json: "daoPageData", js: "daoPageData", typ: r("DAOPageData") },
        { json: "diviPageData", js: "diviPageData", typ: r("DiviPageData") },
        { json: "gua", js: "gua", typ: "" },
        { json: "iChingPageData", js: "iChingPageData", typ: r("IChingPageData") },
        { json: "mutation", js: "mutation", typ: "" },
        { json: "mutationCountSuffix", js: "mutationCountSuffix", typ: "" },
        { json: "willPageData", js: "willPageData", typ: r("WillPageData") },
    ], false),
    "CommonData": o([
        { json: "action", js: "action", typ: "" },
        { json: "actionVerify", js: "actionVerify", typ: "" },
        { json: "slogan", js: "slogan", typ: "" },
        { json: "actionViewDetail", js: "actionViewDetail", typ: "" },
        { json: "address", js: "address", typ: "" },
        { json: "amountSelectLabel", js: "amountSelectLabel", typ: "" },
        { json: "authenticating", js: "authenticating", typ: "" },
        { json: "authStatus", js: "authStatus", typ: "" },
        { json: "balance", js: "balance", typ: "" },
        { json: "bridgeActionLabel", js: "bridgeActionLabel", typ: "" },
        { json: "buttons", js: "buttons", typ: r("Buttons") },
        { json: "chainBridgeLabel", js: "chainBridgeLabel", typ: "" },
        { json: "changingLines", js: "changingLines", typ: "" },
        { json: "close", js: "close", typ: "" },
        { json: "connecting", js: "connecting", typ: "" },
        { json: "connectWallet", js: "connectWallet", typ: "" },
        { json: "daoActionSlogan", js: "daoActionSlogan", typ: "" },
        { json: "daoContractLabel", js: "daoContractLabel", typ: "" },
        { json: "usdcTotalAmount", js: "usdcTotalAmount", typ: "" },
        { json: "diviParticipationLabel", js: "diviParticipationLabel", typ: "" },
        { json: "diviParticipationInfo", js: "diviParticipationInfo", typ: "" },
        { json: "daoSlogan", js: "daoSlogan", typ: "" },
        { json: "disconnect", js: "disconnect", typ: "" },
        { json: "diviFields", js: "diviFields", typ: r("DiviFields") },
        { json: "DivinationTabs", js: "DivinationTabs", typ: r("DivinationTabs") },
        { json: "epistemicEnums", js: "epistemicEnums", typ: a("") },
        { json: "errorManifesting", js: "errorManifesting", typ: "" },
        { json: "gua", js: "gua", typ: "" },
        { json: "highlightPrefix", js: "highlightPrefix", typ: true },
        { json: "information", js: "information", typ: "" },
        { json: "knowUnknowablePrefix", js: "knowUnknowablePrefix", typ: "" },
        { json: "knowUnknowableSuffix", js: "knowUnknowableSuffix", typ: "" },
        { json: "loading", js: "loading", typ: "" },
        { json: "loadMore", js: "loadMore", typ: "" },
        { json: "manifesting", js: "manifesting", typ: "" },
        { json: "modals", js: "modals", typ: r("Modals") },
        { json: "mutation", js: "mutation", typ: "" },
        { json: "mutationCountSuffix", js: "mutationCountSuffix", typ: "" },
        { json: "navLabels", js: "navLabels", typ: a("") },
        { json: "noDivinationsFound", js: "noDivinationsFound", typ: "" },
        { json: "private", js: "private", typ: "" },
        { json: "privateDescription", js: "privateDescription", typ: "" },
        { json: "public", js: "public", typ: "" },
        { json: "publicDescription", js: "publicDescription", typ: "" },
        { json: "showMore", js: "showMore", typ: "" },
        { json: "statusAuthenticated", js: "statusAuthenticated", typ: "" },
        { json: "statusNotAuthenticated", js: "statusNotAuthenticated", typ: "" },
        { json: "textLoveBeTheWayToKnow", js: "textLoveBeTheWayToKnow", typ: "" },
        { json: "textPrimaryHexagram", js: "textPrimaryHexagram", typ: "" },
        { json: "textRelatingHexagram", js: "textRelatingHexagram", typ: "" },
        { json: "unsupportedChain", js: "unsupportedChain", typ: "" },
        { json: "viewOnChain", js: "viewOnChain", typ: "" },
        { json: "voyager", js: "voyager", typ: r("Voyager") },
        { json: "walletInformation", js: "walletInformation", typ: "" },
        { json: "walletNetwork", js: "walletNetwork", typ: "" },
        { json: "walletProfileTitle", js: "walletProfileTitle", typ: "" },
        { json: "walletTotalUSDCLabel", js: "walletTotalUSDCLabel", typ: "" },
        { json: "connectDaoToParticipate", js: "connectDaoToParticipate", typ: "" },
    ], false),
    "DivinationTabs": o([
        { json: "dao", js: "dao", typ: "" },
        { json: "iChing", js: "iChing", typ: "" },
        { json: "will", js: "will", typ: "" },
    ], false),
    "Buttons": o([
        { json: "cancel", js: "cancel", typ: "" },
        { json: "details", js: "details", typ: "" },
        { json: "startDivine", js: "startDivine", typ: "" },
        { json: "submit", js: "submit", typ: "" },
        { json: "submitVerification", js: "submitVerification", typ: "" },
        { json: "verify", js: "verify", typ: "" },
        { json: "view", js: "view", typ: "" },
        { json: "refresh", js: "refresh", typ: "" },
    ], false),
    "DiviFields": o([
        { json: "action", js: "action", typ: "" },
        { json: "daoTx", js: "daoTx", typ: "" },
        { json: "daoTxAmount", js: "daoTxAmount", typ: "" },
        { json: "diviGua", js: "diviGua", typ: "" },
        { json: "diviGuaMutations", js: "diviGuaMutations", typ: "" },
        { json: "diviGuaProof", js: "diviGuaProof", typ: "" },
        { json: "diviGuaSummary", js: "diviGuaSummary", typ: "" },
        { json: "diviManifestation", js: "diviManifestation", typ: "" },
        { json: "diviner", js: "diviner", typ: "" },
        { json: "diviSignature", js: "diviSignature", typ: "" },
        { json: "diviTime", js: "diviTime", typ: "" },
        { json: "diviWill", js: "diviWill", typ: "" },
        { json: "knowDaoStatus", js: "knowDaoStatus", typ: "" },
        { json: "knowTime", js: "knowTime", typ: "" },
    ], false),
    "Modals": o([
        { json: "amountSelectPlaceholder", js: "amountSelectPlaceholder", typ: "" },
        { json: "connectDaoDescription", js: "connectDaoDescription", typ: "" },
        { json: "connectDaoTitle", js: "connectDaoTitle", typ: "" },
        { json: "connectWalletToPay", js: "connectWalletToPay", typ: "" },
        { json: "deepseekDao", js: "deepseekDao", typ: "" },
        { json: "deepseekExplanation", js: "deepseekExplanation", typ: "" },
        { json: "deepseeking", js: "deepseeking", typ: "" },
        { json: "deepseekResult", js: "deepseekResult", typ: "" },
        { json: "divinationResult", js: "divinationResult", typ: "" },
        { json: "emptyInterpretationPlaceholder", js: "emptyInterpretationPlaceholder", typ: "" },
        { json: "enlightenmentText", js: "enlightenmentText", typ: "" },
        { json: "finishDivinationFirst", js: "finishDivinationFirst", typ: "" },
        { json: "finishConsentFirst", js: "finishConsentFirst", typ: "" },
        { json: "insufficientBalance", js: "insufficientBalance", typ: "" },
        { json: "joinDaoToDeepseek", js: "joinDaoToDeepseek", typ: "" },
        { json: "processing", js: "processing", typ: "" },
        { json: "retryPayment", js: "retryPayment", typ: "" },
        { json: "connectingDao", js: "connectingDao", typ: "" },
        { json: "deepseekDaoError", js: "deepseekDaoError", typ: "" },
        { json: "deepseekDaoErrorDescription", js: "deepseekDaoErrorDescription", typ: "" },
        { json: "approveAllowanceFailed", js: "approveAllowanceFailed", typ: "" },
        { json: "daoConnected", js: "daoConnected", typ: "" },
        { json: "daoConnectedDescription", js: "daoConnectedDescription", typ: "" },
        { json: "invalidAmount", js: "invalidAmount", typ: "" },
        { json: "invalidAmountDescription", js: "invalidAmountDescription", typ: "" },
        { json: "paymentSuccessful", js: "paymentSuccessful", typ: "" },
        { json: "retryDaoRequest", js: "retryDaoRequest", typ: "" },
        { json: "transactionCancelled", js: "transactionCancelled", typ: "" },
        { json: "transactionCancelledDescription", js: "transactionCancelledDescription", typ: "" },
        { json: "saveImage", js: "saveImage", typ: "" },
        { json: "share", js: "share", typ: "" },
        { json: "updateKnownStatus", js: "updateKnownStatus", typ: "" },
        { json: "updateKnownStatusDeprecated", js: "updateKnownStatusDeprecated", typ: "" },
        { json: "updateKnownStatusDescription", js: "updateKnownStatusDescription", typ: "" },
        { json: "updateKnownStatusNote", js: "updateKnownStatusNote", typ: "" },
        { json: "updateKnownStatusNotePlaceholder", js: "updateKnownStatusNotePlaceholder", typ: "" },
        { json: "updateKnownStatusVerifiedCorrect", js: "updateKnownStatusVerifiedCorrect", typ: "" },
        { json: "updateKnownStatusVerifiedIncorrect", js: "updateKnownStatusVerifiedIncorrect", typ: "" },
        { json: "verificationStatus", js: "verificationStatus", typ: "" },
        { json: "viewDaoTx", js: "viewDaoTx", typ: "" },
        { json: "willManifestationQuestion", js: "willManifestationQuestion", typ: "" },
        { json: "consentPoints", js: "consentPoints", typ: a("") },
        { json: "agreementSignatureLabel", js: "agreementSignatureLabel", typ: "" },
        { json: "awaitingSignatureLabel", js: "awaitingSignatureLabel", typ: "" },
        { json: "signingLabel", js: "signingLabel", typ: "" },
        { json: "signAgreementButton", js: "signAgreementButton", typ: "" },
        { json: "errorSigningLabel", js: "errorSigningLabel", typ: "" },
        { json: "divineAgreement", js: "divineAgreement", typ: "" },
        { json: "insufficientBalanceError", js: "insufficientBalanceError", typ: "" },
        { json: "approvalFailed", js: "approvalFailed", typ: "" },
        { json: "successfullyBecomeAnInvestor", js: "successfullyBecomeAnInvestor", typ: "" },
        { json: "becomeAnInvestor", js: "becomeAnInvestor", typ: "" },
        { json: "joinAsInvestorToSupport", js: "joinAsInvestorToSupport", typ: "" },
        { json: "investmentAmountLabel", js: "investmentAmountLabel", typ: "" },
        { json: "whyBecomeAnInvestor", js: "whyBecomeAnInvestor", typ: "" },
        { json: "investorBenefits", js: "investorBenefits", typ: a("") },
    ], false),
    "Voyager": o([
        { json: "copyright_notice", js: "copyright_notice", typ: "" },
        { json: "copyright_notice_title", js: "copyright_notice_title", typ: "" },
        { json: "images", js: "images", typ: a(r("Image")) },
        { json: "title", js: "title", typ: "" },
        { json: "tracks", js: "tracks", typ: a(r("Track")) },
    ], false),
    "Image": o([
        { json: "low_copyright_risk", js: "low_copyright_risk", typ: u(undefined, true) },
        { json: "name", js: "name", typ: "" },
    ], false),
    "Track": o([
        { json: "artist", js: "artist", typ: u(null, "") },
        { json: "country_code", js: "country_code", typ: "" },
        { json: "low_copyright_risk", js: "low_copyright_risk", typ: u(undefined, true) },
        { json: "title", js: "title", typ: "" },
        { json: "track_number", js: "track_number", typ: 0 },
    ], false),
    "DAOPageData": o([
        { json: "allTransactions", js: "allTransactions", typ: "" },
        { json: "almWorldSlogons", js: "almWorldSlogons", typ: a(r("AlmWorldSlogon")) },
        { json: "claim", js: "claim", typ: "" },
        { json: "claimed", js: "claimed", typ: "" },
        { json: "claimRequirements", js: "claimRequirements", typ: "" },
        { json: "alreadyAnInvestor", js: "alreadyAnInvestor", typ: "" },
        { json: "maxInvestorCountReached", js: "maxInvestorCountReached", typ: "" },
        { json: "currentBlock", js: "currentBlock", typ: "" },
        { json: "currentEvolutionDrop", js: "currentEvolutionDrop", typ: "" },
        { json: "daoEvolutionDesc", js: "daoEvolutionDesc", typ: "" },
        { json: "daoEvolutionDescPrefix", js: "daoEvolutionDescPrefix", typ: "" },
        { json: "daoTerm", js: "daoTerm", typ: "" },
        { json: "daoTermDefinitionMiddle", js: "daoTermDefinitionMiddle", typ: "" },
        { json: "daoTermDefinitionPrefix", js: "daoTermDefinitionPrefix", typ: "" },
        { json: "daoTermDefinitionSuffix", js: "daoTermDefinitionSuffix", typ: "" },
        { json: "dropDollars", js: "dropDollars", typ: "" },
        { json: "dropUnits", js: "dropUnits", typ: "" },
        { json: "dukiDefinition", js: "dukiDefinition", typ: "" },
        { json: "dukiInAction", js: "dukiInAction", typ: "" },
        { json: "evolutionStatus", js: "evolutionStatus", typ: "" },
        { json: "fairDrop", js: "fairDrop", typ: "" },
        { json: "historyTotalDrop", js: "historyTotalDrop", typ: "" },
        { json: "lottery", js: "lottery", typ: "" },
        { json: "lotteryPrizeRule", js: "lotteryPrizeRule", typ: "" },
        { json: "manifestation", js: "manifestation", typ: r("Manifestation") },
        { json: "maxPrize", js: "maxPrize", typ: "" },
        { json: "myTransactions", js: "myTransactions", typ: "" },
        { json: "daoInvestmentNews", js: "daoInvestmentNews", typ: "" },
        { json: "noTransactionsFound", js: "noTransactionsFound", typ: "" },
        { json: "noInvestorPromotion", js: "noInvestorPromotion", typ: "" },
        { json: "philosophy", js: "philosophy", typ: "" },
        { json: "sections", js: "sections", typ: a(r("Section")) },
        { json: "totalParticipants", js: "totalParticipants", typ: "" },
        { json: "trackLatestTransactions", js: "trackLatestTransactions", typ: "" },
        { json: "treasury", js: "treasury", typ: "" },
        { json: "usdcAvailable", js: "usdcAvailable", typ: "" },
        { json: "usdcBalance", js: "usdcBalance", typ: "" },
    ], false),
    "AlmWorldSlogon": o([
        { json: "desc", js: "desc", typ: "" },
        { json: "slogon", js: "slogon", typ: "" },
    ], false),
    "Manifestation": o([
        { json: "age", js: "age", typ: "" },
        { json: "amount", js: "amount", typ: "" },
        { json: "creator", js: "creator", typ: "" },
        { json: "interaction", js: "interaction", typ: "" },
        { json: "interactTypes", js: "interactTypes", typ: a("") },
        { json: "txHash", js: "txHash", typ: "" },
    ], false),
    "Section": o([
        { json: "description", js: "description", typ: "" },
        { json: "requirements", js: "requirements", typ: r("Requirements") },
        { json: "target", js: "target", typ: "" },
        { json: "title", js: "title", typ: "" },
    ], false),
    "Requirements": o([
        { json: "p1", js: "p1", typ: "" },
        { json: "p2", js: "p2", typ: "" },
        { json: "btn", js: "btn", typ: u(undefined, r("Btn")) },
        { json: "p1_", js: "p1_", typ: u(undefined, "") },
        { json: "p2_", js: "p2_", typ: u(undefined, "") },
    ], false),
    "Btn": o([
        { json: "modal", js: "modal", typ: "" },
        { json: "text", js: "text", typ: "" },
    ], false),
    "DiviPageData": o([
        { json: "diviPanelData", js: "diviPanelData", typ: r("DiviPanelData") },
        { json: "loadingPhrase", js: "loadingPhrase", typ: "" },
    ], false),
    "DiviPanelData": o([
        { json: "beforeDividePhaseText", js: "beforeDividePhaseText", typ: "" },
        { json: "createDivinationError", js: "createDivinationError", typ: "" },
        { json: "dividePhasesTextArray", js: "dividePhasesTextArray", typ: a("") },
        { json: "inspectMutationTip", js: "inspectMutationTip", typ: "" },
        { json: "mutationsCountPrefix", js: "mutationsCountPrefix", typ: "" },
        { json: "mutationsCountSuffix", js: "mutationsCountSuffix", typ: "" },
        { json: "startDivideTip", js: "startDivideTip", typ: "" },
        { json: "step1", js: "step1", typ: r("Step1") },
        { json: "step2", js: "step2", typ: r("Step2") },
        { json: "step3", js: "step3", typ: r("Step3") },
        { json: "textRetrySave", js: "textRetrySave", typ: "" },
        { json: "textSaveSuccess", js: "textSaveSuccess", typ: "" },
        { json: "textSaving", js: "textSaving", typ: "" },
        { json: "title", js: "title", typ: "" },
        { json: "toasts", js: "toasts", typ: r("Toasts") },
    ], false),
    "Step1": o([
        { json: "description", js: "description", typ: "" },
        { json: "divinationConsentLabel", js: "divinationConsentLabel", typ: "" },
        { json: "divinationConsentProof", js: "divinationConsentProof", typ: "" },
        { json: "title", js: "title", typ: "" },
    ], false),
    "Step2": o([
        { json: "description", js: "description", typ: "" },
        { json: "diviSpeed", js: "diviSpeed", typ: "" },
        { json: "diviSpeedOptions", js: "diviSpeedOptions", typ: r("DiviSpeedOptions") },
        { json: "textChangesInProgress", js: "textChangesInProgress", typ: "" },
        { json: "textLineChangeable", js: "textLineChangeable", typ: "" },
        { json: "textLineNotChangeable", js: "textLineNotChangeable", typ: "" },
        { json: "textProgress", js: "textProgress", typ: "" },
        { json: "title", js: "title", typ: "" },
    ], false),
    "DiviSpeedOptions": o([
        { json: "fast", js: "fast", typ: "" },
        { json: "normal", js: "normal", typ: "" },
        { json: "slow", js: "slow", typ: "" },
    ], false),
    "Step3": o([
        { json: "description", js: "description", typ: "" },
        { json: "textConnectWalletToPay", js: "textConnectWalletToPay", typ: "" },
        { json: "textDeepseekDao", js: "textDeepseekDao", typ: "" },
        { json: "textDeepseekExplanation", js: "textDeepseekExplanation", typ: "" },
        { json: "textDeepseekResult", js: "textDeepseekResult", typ: "" },
        { json: "textDivinationCompleted", js: "textDivinationCompleted", typ: "" },
        { json: "textJoinDaoToDeepseek", js: "textJoinDaoToDeepseek", typ: "" },
        { json: "textLoveBeTheWayToKnow", js: "textLoveBeTheWayToKnow", typ: "" },
        { json: "textNoDaoConnectionProof", js: "textNoDaoConnectionProof", typ: "" },
        { json: "textPaymentCompleted", js: "textPaymentCompleted", typ: "" },
        { json: "textProcessing", js: "textProcessing", typ: "" },
        { json: "textViewDaoTx", js: "textViewDaoTx", typ: "" },
        { json: "title", js: "title", typ: "" },
    ], false),
    "Toasts": o([
        { json: "divinationComplete", js: "divinationComplete", typ: r("DivinationComplete") },
    ], false),
    "DivinationComplete": o([
        { json: "description", js: "description", typ: "" },
        { json: "title", js: "title", typ: "" },
    ], false),
    "IChingPageData": o([
        { json: "howIChingWorks", js: "howIChingWorks", typ: "" },
        { json: "iChingAndWillAndLoveAndDNA", js: "iChingAndWillAndLoveAndDNA", typ: "" },
        { json: "iChingAndWillAndLoveAndDNADetails", js: "iChingAndWillAndLoveAndDNADetails", typ: a("") },
        { json: "iChingAndZkProofAndRandomness", js: "iChingAndZkProofAndRandomness", typ: "" },
        { json: "modernZeroKnowledgeProof", js: "modernZeroKnowledgeProof", typ: "" },
        { json: "perspectiveExplanation", js: "perspectiveExplanation", typ: "" },
        { json: "prerequisite", js: "prerequisite", typ: "" },
        { json: "prerequisiteDescription", js: "prerequisiteDescription", typ: "" },
        { json: "quotes", js: "quotes", typ: a(r("Quote")) },
        { json: "references", js: "references", typ: a(r("Reference")) },
        { json: "zkDemo", js: "zkDemo", typ: r("ZkDemo") },
    ], false),
    "Quote": o([
        { json: "author", js: "author", typ: "" },
        { json: "quote", js: "quote", typ: "" },
    ], false),
    "Reference": o([
        { json: "author", js: "author", typ: u(undefined, "") },
        { json: "description", js: "description", typ: "" },
        { json: "link", js: "link", typ: "" },
        { json: "title", js: "title", typ: "" },
        { json: "authors", js: "authors", typ: u(undefined, "") },
    ], false),
    "ZkDemo": o([
        { json: "clickAnyEdge", js: "clickAnyEdge", typ: "" },
        { json: "comparisons", js: "comparisons", typ: a(r("Comparison")) },
        { json: "comparisonsTitle", js: "comparisonsTitle", typ: "" },
        { json: "description", js: "description", typ: "" },
        { json: "originalAddress", js: "originalAddress", typ: "" },
        { json: "resetText", js: "resetText", typ: "" },
        { json: "revealText", js: "revealText", typ: "" },
        { json: "title", js: "title", typ: "" },
        { json: "turboText", js: "turboText", typ: "" },
        { json: "confidence", js: "confidence", typ: "" },
        { json: "useRevealButton", js: "useRevealButton", typ: "" },
    ], false),
    "Comparison": o([
        { json: "aspect", js: "aspect", typ: "" },
        { json: "iChing", js: "iChing", typ: "" },
        { json: "zkDemo", js: "zkDemo", typ: "" },
    ], false),
    "WillPageData": o([
        { json: "connectToViewTips", js: "connectToViewTips", typ: "" },
        { json: "connectWallet", js: "connectWallet", typ: "" },
        { json: "daoFeaturedDivinations", js: "daoFeaturedDivinations", typ: "" },
        { json: "daoLatestDivinations", js: "daoLatestDivinations", typ: "" },
        { json: "diviAlgo", js: "diviAlgo", typ: "" },
        { json: "diviAlgoDescription", js: "diviAlgoDescription", typ: "" },
        { json: "diviAlgoSlogan", js: "diviAlgoSlogan", typ: "" },
        { json: "diviAlgoSloganDescription", js: "diviAlgoSloganDescription", typ: "" },
        { json: "diviAlgoSteps", js: "diviAlgoSteps", typ: a(r("DiviAlgoStep")) },
        { json: "diviAlgoStepsTitle", js: "diviAlgoStepsTitle", typ: "" },
        { json: "iChingToKnow", js: "iChingToKnow", typ: "" },
        { json: "iChingToKnowDescription", js: "iChingToKnowDescription", typ: "" },
        { json: "iChingToKnowTarget", js: "iChingToKnowTarget", typ: "" },
        { json: "loveWillRepresentation", js: "loveWillRepresentation", typ: "" },
        { json: "myDivinations", js: "myDivinations", typ: "" },
        { json: "samples", js: "samples", typ: r("Samples") },
        { json: "willDiviTemplate", js: "willDiviTemplate", typ: "" },
    ], false),
    "DiviAlgoStep": o([
        { json: "long_description", js: "long_description", typ: "" },
        { json: "short_description", js: "short_description", typ: "" },
        { json: "title", js: "title", typ: "" },
    ], false),
    "Samples": o([
        { json: "suggestions", js: "suggestions", typ: a(r("Suggestion")) },
        { json: "typings", js: "typings", typ: r("Typings") },
    ], false),
    "Suggestion": o([
        { json: "key", js: "key", typ: "" },
        { json: "value", js: "value", typ: "" },
    ], false),
    "Typings": o([
        { json: "prefix", js: "prefix", typ: "" },
        { json: "suffix_options", js: "suffix_options", typ: a("") },
    ], false),
};
