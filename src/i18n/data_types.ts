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
    rings:  any[];
}

export interface IChing {
    name:     string;
    symbol?:  string;
    gua_ci:   string;
    yao_ci:   string[];
    yong_ci?: string;
}

export interface UI {
    gua:                 string;
    mutation:            string;
    mutationCountSuffix: string;
    willPageData:        WillPageData;
    daoPageData:         DAOPageData;
    diviPageData:        DiviPageData;
    iChingPageData:      IChingPageData;
    commonData:          CommonData;
}

export interface CommonData {
    public:               string;
    private:              string;
    publicDescription:    string;
    privateDescription:   string;
    navLabels:            string[];
    knowUnknowablePrefix: string;
    knowUnknowableSuffix: string;
    highlightPrefix:      boolean;
    DivinationTabs:       DivinationTabs;
    connectWallet:        string;
    epistemicEnums:       string[];
    actionViewDetail:     string;
    actionVerify:         string;
    loading:              string;
    manifesting:          string;
    errorManifesting:     string;
    noDivinationsFound:   string;
    showMore:             string;
    diviFields:           DiviFields;
    buttons:              Buttons;
    action:               string;
}

export interface DivinationTabs {
    will:   string;
    iChing: string;
    dao:    string;
}

export interface Buttons {
    view:    string;
    verify:  string;
    details: string;
}

export interface DiviFields {
    diviWill:          string;
    diviTime:          string;
    diviGua:           string;
    diviGuaProof:      string;
    diviGuaSummary:    string;
    diviManifestation: string;
    diviSignature:     string;
    diviGuaMutations:  string;
    daoTx:             string;
    daoTxAmount:       string;
    knowDaoStatus:     string;
    action:            string;
}

export interface DAOPageData {
    sections:                Section[];
    claimRequirements:       string;
    philosophy:              string;
    dropUnits:               string;
    dropDollars:             string;
    totalParticipants:       string;
    almWorldSlogons:         AlmWorldSlogon[];
    daoTerm:                 string;
    daoTermDefinitionPrefix: string;
    daoTermDefinitionMiddle: string;
    dukiDefinition:          string;
    daoTermDefinitionSuffix: string;
    evolutionStatus:         string;
    currentBlock:            string;
    fairDrop:                string;
    usdcAvailable:           string;
    treasury:                string;
    usdcBalance:             string;
    lottery:                 string;
    claim:                   string;
}

export interface AlmWorldSlogon {
    slogon: string;
    desc:   string;
}

export interface Section {
    title:        string;
    description:  string;
    target:       string;
    requirements: Requirements;
}

export interface Requirements {
    p1:   string;
    p2:   string;
    btn?: Btn;
    p1_?: string;
    p2_?: string;
}

export interface Btn {
    text:  string;
    modal: string;
}

export interface DiviPageData {
    y: string;
}

export interface IChingPageData {
    z: string;
}

export interface WillPageData {
    samples:                   Samples;
    diviAlgo:                  string;
    diviAlgoDescription:       string;
    diviAlgoStepsTitle:        string;
    diviAlgoSteps:             DiviAlgoStep[];
    diviAlgoSlogan:            string;
    diviAlgoSloganDescription: string;
    willDiviTemplate:          string;
    myDivinations:             string;
    daoLatestDivinations:      string;
    daoFeaturedDivinations:    string;
    connectToViewTips:         string;
    connectWallet:             string;
}

export interface DiviAlgoStep {
    title:       string;
    description: string;
}

export interface Samples {
    typings:     Typings;
    suggestions: Suggestion[];
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
        { json: "rings", js: "rings", typ: a("any") },
    ], false),
    "IChing": o([
        { json: "name", js: "name", typ: "" },
        { json: "symbol", js: "symbol", typ: u(undefined, "") },
        { json: "gua_ci", js: "gua_ci", typ: "" },
        { json: "yao_ci", js: "yao_ci", typ: a("") },
        { json: "yong_ci", js: "yong_ci", typ: u(undefined, "") },
    ], false),
    "UI": o([
        { json: "gua", js: "gua", typ: "" },
        { json: "mutation", js: "mutation", typ: "" },
        { json: "mutationCountSuffix", js: "mutationCountSuffix", typ: "" },
        { json: "willPageData", js: "willPageData", typ: r("WillPageData") },
        { json: "daoPageData", js: "daoPageData", typ: r("DAOPageData") },
        { json: "diviPageData", js: "diviPageData", typ: r("DiviPageData") },
        { json: "iChingPageData", js: "iChingPageData", typ: r("IChingPageData") },
        { json: "commonData", js: "commonData", typ: r("CommonData") },
    ], false),
    "CommonData": o([
        { json: "public", js: "public", typ: "" },
        { json: "private", js: "private", typ: "" },
        { json: "publicDescription", js: "publicDescription", typ: "" },
        { json: "privateDescription", js: "privateDescription", typ: "" },
        { json: "navLabels", js: "navLabels", typ: a("") },
        { json: "knowUnknowablePrefix", js: "knowUnknowablePrefix", typ: "" },
        { json: "knowUnknowableSuffix", js: "knowUnknowableSuffix", typ: "" },
        { json: "highlightPrefix", js: "highlightPrefix", typ: true },
        { json: "DivinationTabs", js: "DivinationTabs", typ: r("DivinationTabs") },
        { json: "connectWallet", js: "connectWallet", typ: "" },
        { json: "epistemicEnums", js: "epistemicEnums", typ: a("") },
        { json: "actionViewDetail", js: "actionViewDetail", typ: "" },
        { json: "actionVerify", js: "actionVerify", typ: "" },
        { json: "loading", js: "loading", typ: "" },
        { json: "manifesting", js: "manifesting", typ: "" },
        { json: "errorManifesting", js: "errorManifesting", typ: "" },
        { json: "noDivinationsFound", js: "noDivinationsFound", typ: "" },
        { json: "showMore", js: "showMore", typ: "" },
        { json: "diviFields", js: "diviFields", typ: r("DiviFields") },
        { json: "buttons", js: "buttons", typ: r("Buttons") },
        { json: "action", js: "action", typ: "" },
    ], false),
    "DivinationTabs": o([
        { json: "will", js: "will", typ: "" },
        { json: "iChing", js: "iChing", typ: "" },
        { json: "dao", js: "dao", typ: "" },
    ], false),
    "Buttons": o([
        { json: "view", js: "view", typ: "" },
        { json: "verify", js: "verify", typ: "" },
        { json: "details", js: "details", typ: "" },
    ], false),
    "DiviFields": o([
        { json: "diviWill", js: "diviWill", typ: "" },
        { json: "diviTime", js: "diviTime", typ: "" },
        { json: "diviGua", js: "diviGua", typ: "" },
        { json: "diviGuaProof", js: "diviGuaProof", typ: "" },
        { json: "diviGuaSummary", js: "diviGuaSummary", typ: "" },
        { json: "diviManifestation", js: "diviManifestation", typ: "" },
        { json: "diviSignature", js: "diviSignature", typ: "" },
        { json: "diviGuaMutations", js: "diviGuaMutations", typ: "" },
        { json: "daoTx", js: "daoTx", typ: "" },
        { json: "daoTxAmount", js: "daoTxAmount", typ: "" },
        { json: "knowDaoStatus", js: "knowDaoStatus", typ: "" },
        { json: "action", js: "action", typ: "" },
    ], false),
    "DAOPageData": o([
        { json: "sections", js: "sections", typ: a(r("Section")) },
        { json: "claimRequirements", js: "claimRequirements", typ: "" },
        { json: "philosophy", js: "philosophy", typ: "" },
        { json: "dropUnits", js: "dropUnits", typ: "" },
        { json: "dropDollars", js: "dropDollars", typ: "" },
        { json: "totalParticipants", js: "totalParticipants", typ: "" },
        { json: "almWorldSlogons", js: "almWorldSlogons", typ: a(r("AlmWorldSlogon")) },
        { json: "daoTerm", js: "daoTerm", typ: "" },
        { json: "daoTermDefinitionPrefix", js: "daoTermDefinitionPrefix", typ: "" },
        { json: "daoTermDefinitionMiddle", js: "daoTermDefinitionMiddle", typ: "" },
        { json: "dukiDefinition", js: "dukiDefinition", typ: "" },
        { json: "daoTermDefinitionSuffix", js: "daoTermDefinitionSuffix", typ: "" },
        { json: "evolutionStatus", js: "evolutionStatus", typ: "" },
        { json: "currentBlock", js: "currentBlock", typ: "" },
        { json: "fairDrop", js: "fairDrop", typ: "" },
        { json: "usdcAvailable", js: "usdcAvailable", typ: "" },
        { json: "treasury", js: "treasury", typ: "" },
        { json: "usdcBalance", js: "usdcBalance", typ: "" },
        { json: "lottery", js: "lottery", typ: "" },
        { json: "claim", js: "claim", typ: "" },
    ], false),
    "AlmWorldSlogon": o([
        { json: "slogon", js: "slogon", typ: "" },
        { json: "desc", js: "desc", typ: "" },
    ], false),
    "Section": o([
        { json: "title", js: "title", typ: "" },
        { json: "description", js: "description", typ: "" },
        { json: "target", js: "target", typ: "" },
        { json: "requirements", js: "requirements", typ: r("Requirements") },
    ], false),
    "Requirements": o([
        { json: "p1", js: "p1", typ: "" },
        { json: "p2", js: "p2", typ: "" },
        { json: "btn", js: "btn", typ: u(undefined, r("Btn")) },
        { json: "p1_", js: "p1_", typ: u(undefined, "") },
        { json: "p2_", js: "p2_", typ: u(undefined, "") },
    ], false),
    "Btn": o([
        { json: "text", js: "text", typ: "" },
        { json: "modal", js: "modal", typ: "" },
    ], false),
    "DiviPageData": o([
        { json: "y", js: "y", typ: "" },
    ], false),
    "IChingPageData": o([
        { json: "z", js: "z", typ: "" },
    ], false),
    "WillPageData": o([
        { json: "samples", js: "samples", typ: r("Samples") },
        { json: "diviAlgo", js: "diviAlgo", typ: "" },
        { json: "diviAlgoDescription", js: "diviAlgoDescription", typ: "" },
        { json: "diviAlgoStepsTitle", js: "diviAlgoStepsTitle", typ: "" },
        { json: "diviAlgoSteps", js: "diviAlgoSteps", typ: a(r("DiviAlgoStep")) },
        { json: "diviAlgoSlogan", js: "diviAlgoSlogan", typ: "" },
        { json: "diviAlgoSloganDescription", js: "diviAlgoSloganDescription", typ: "" },
        { json: "willDiviTemplate", js: "willDiviTemplate", typ: "" },
        { json: "myDivinations", js: "myDivinations", typ: "" },
        { json: "daoLatestDivinations", js: "daoLatestDivinations", typ: "" },
        { json: "daoFeaturedDivinations", js: "daoFeaturedDivinations", typ: "" },
        { json: "connectToViewTips", js: "connectToViewTips", typ: "" },
        { json: "connectWallet", js: "connectWallet", typ: "" },
    ], false),
    "DiviAlgoStep": o([
        { json: "title", js: "title", typ: "" },
        { json: "description", js: "description", typ: "" },
    ], false),
    "Samples": o([
        { json: "typings", js: "typings", typ: r("Typings") },
        { json: "suggestions", js: "suggestions", typ: a(r("Suggestion")) },
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
