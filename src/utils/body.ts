import {error} from "./utils";

const OPTIONAL_PREFIX = "$";

export function validate(schema: any, body: any) {

    try {
        const result = instanceOf(schema, body, {path: "body"});
        if (result === true) return true;
        throw result;
    } catch (e) {
        console.log(e);
        return error(400, (e || "Body validation error").toString());

    }
}

export function missing(arr1: Array<any>, arr2: Array<any>): Array<any> {
    return arr1.filter((x: any) => !arr2.includes(x));
}


export class Tuple {
    public types: any[];

    constructor(...types: any[]) {
        this.types = types;
    }
}


//TODO NOT FINISHED
export function instanceOf(type: any, value: any, {
    path = "",
    optional = false
}: { path?: string, optional?: boolean } = {}): Boolean {
    //console.log(optional)
    if (typeof value === "undefined") {
        if (optional) return true;
        throw `The property ${path} is required`;
    }
    switch (type) {
        case String:
            if (typeof value === "string") return true;
            throw `The property ${path} must be a string`;
        case Number:
            value = Number(value);
            if (typeof value === "number" && !isNaN(value)) return true;
            throw `The property ${path} must be a number`;
        case BigInt:
            try {
                value = BigInt(value);
                if (typeof value === "bigint") return true;
            } catch (error) {
            }
            throw `The property ${path} must be a bigint`;
        case Boolean:
            if (value == "true") value = true;
            if (value == "false") value = false;
            if (typeof value === "boolean") return true;
            throw `The property ${path} must be a boolean`;
        case Object:
            if (typeof value === "object" && value !== null) return true;
            throw `The property ${path} must be a object`;
        case Date:
            if (new Date(value).toString() === "Invalid Date") throw `The property ${path} must be an instance of date`;
            return true
    }
    if (typeof type === "object") {
        if (Array.isArray(type)) {
            if (!Array.isArray(value)) throw `The property ${path} must be an array`;
            if (!type.length) return true; // type array didn't specify any type
            return value.every((val, i) => instanceOf(type[0], val, {path: `${path}[${i}]`, optional}));
        }
        if (type?.constructor?.name != "Object") {
            if (type instanceof Tuple) {
                if (
                    (<Tuple>type).types.some((x) => {
                        try {
                            return instanceOf(x, value, {path, optional});
                        } catch (error) {
                            return false;
                        }
                    })
                ) {
                    return true;
                }
                throw `The property ${path} must be one of ${type.types}`;
            }
            if (value instanceof type) return true;
            throw `The property ${path} must be an instance of ${type}`;
        }
        if (typeof value !== "object") throw `The property ${path} must be a object`;

        const diff = missing(Object.keys(value), Object.keys(type).map((x) => (x.startsWith(OPTIONAL_PREFIX) ? x.slice(OPTIONAL_PREFIX.length) : x)));

        if (diff.length) {
            throw `Unknown property ${path}.${diff[0]}`;
        }

        return Object.keys(type).every((key) => {
            let newKey = key;

            const OPTIONAL = key.startsWith(OPTIONAL_PREFIX);
            if (OPTIONAL) newKey = newKey.slice(OPTIONAL_PREFIX.length);

            return instanceOf(type[key], value[newKey], {
                path: `${path}.${newKey}`,
                optional: OPTIONAL,
            });
        });
    } else if (typeof type === "number" || typeof type === "string" || typeof type === "boolean") {
        if (value === type) return true;
        throw `The property ${path} must be ${value}`;
    } else if (typeof type === "bigint") {
        if (BigInt(value) === type) return true;
        throw `The property ${path} must be ${value}`;
    }


    return type == value;
}