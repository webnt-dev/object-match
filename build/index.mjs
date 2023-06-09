/**
 * @todo add $exists
 * @todo rewrite objectTemplateIntersection - too complex
 */
/**
 * Dictionary of all templete matching functions
 */
const patternFunctions = {};
function supportedType(value) {
    const valueType = typeof value;
    const result = ['object', 'boolean', 'number', 'string'].includes(valueType);
    return result;
}
function isScalar(value) {
    const result = value === null || ['boolean', 'number', 'string'].includes(typeof value);
    return result;
}
function isJSONObject(value) {
    const result = (typeof value === 'object') &&
        (value !== null) &&
        (!Array.isArray(value));
    return result;
}
function isNumber(value) {
    const result = (typeof value === 'number');
    return result;
}
function isString(value) {
    const result = (typeof value === 'string');
    return result;
}
/** *************
* Exact comparison functions
** ************ */
function numberCompare(source, target) {
    const result = (source === target) && (typeof target === 'number');
    return result;
}
function stringCompare(source, target) {
    const result = (source === target) && (typeof target === 'string');
    return result;
}
function booleanCompare(source, target) {
    const result = (source === target) && (typeof target === 'boolean');
    return result;
}
function nullCompare(source, target) {
    const result = (source === target) && (target === null);
    return result;
}
function arrayCompare(source, target) {
    const result = Array.isArray(source) &&
        Array.isArray(target) &&
        (source.length === target.length) &&
        target.every((_, index) => compareValues(source[index], target[index]));
    return result;
}
function compareValues(source, target) {
    const targetType = typeof target;
    let result;
    if (target === null) {
        result = nullCompare(source, target);
    }
    switch (targetType) {
        case 'boolean':
            result = booleanCompare(source, target);
            break;
        case 'number':
            result = numberCompare(source, target);
            break;
        case 'object':
            result = Array.isArray(target) ? arrayCompare(source, target) : objectCompare(source, target);
            break;
        case 'string':
            result = stringCompare(source, target);
            break;
        default: throw new Error(`compareValues: Unsuported type ${targetType}`);
    }
    return result;
}
/**
 * Function matches two objects, if those are the same.
 * Function does not do pattern matching, but exact comparison
 *
 * @param {JSONObject|null} source - object to test
 * @param {JSONObject|null} target - object to test agains
 * @returns { boolean } true if value is the same as target
 */
function objectCompare(source, target) {
    let result = false;
    if (target === null) {
        result = nullCompare(source, target);
    }
    else if (source === null) {
        result = nullCompare(source, target);
    }
    else {
        const keys = Object.keys(target);
        if (Object.keys(source).length === keys.length) {
            result = keys.every((key) => compareValues(source[key], target[key]));
        }
    }
    return result;
}
/** *************
* types functions
** ************ */
function numberIntersection(value, template) {
    const result = numberCompare(value, template) ? template : undefined;
    return result;
}
function stringIntersection(value, template) {
    const result = stringCompare(value, template) ? template : undefined;
    return result;
}
function nullIntersection(value, template) {
    const result = nullCompare(value, template) ? template : undefined;
    return result;
}
function booleanIntersection(value, template) {
    const result = booleanCompare(value, template) ? template : undefined;
    return result;
}
function scalarIntersection(value, template) {
    let result;
    if (template === null) {
        result = nullIntersection(value, template);
    }
    else {
        const templateType = typeof template;
        switch (typeof template) {
            case 'number':
                result = numberIntersection(value, template);
                break;
            case 'string':
                result = stringIntersection(value, template);
                break;
            case 'boolean':
                result = booleanIntersection(value, template);
                break;
            default: throw new Error(`scalarIntersection: Unsuported type ${templateType}`);
        }
    }
    return result;
}
function arrayIntersection(value, template) {
    // const result = arrayCompare(value, template) ? template : undefined;
    const result = Array.isArray(value) &&
        Array.isArray(template) &&
        (value.length === template.length) &&
        template.every((_, index) => valueIntersection(value[index], template[index]));
    return result ? template : undefined;
}
/**
 * Function provides recursive pattern matching.
 * If template is scalar, function just compares values
 * If template is array, function traverse the array and tries to apply all items as patterns to value
 * If template is object, function traverse the object and tries to apply all properties as patterns to value
 *
 * @param {JSONObject} source - object to test
 * @param {JSONObject} template - pattern to test agains
 * @returns { boolean } true if value matches template
 */
function valueIntersection(value, template) {
    let result;
    // scalar template
    if (isScalar(template)) {
        result = scalarIntersection(value, template);
    }
    else if (Array.isArray(template)) { // array template
        result = arrayIntersection(value, template);
    }
    else { // object template
        result = objectTemplate2any(value, template);
    }
    // debugger;
    return result;
}
/** *************
* pattern functions
** ************ */
// equality - could be missing
function $eq(value, template) {
    const result = valueIntersection(value, template);
    // debugger;
    return result;
}
// negation
function $not(value, template) {
    // debugger;
    const result = valueIntersection(value, template) === undefined ? template : undefined;
    return result;
}
// value in template
function $in(value, template) {
    if (!Array.isArray(template)) {
        throw new Error(`$in: expects array, ${template} given`);
    }
    const found = template.find((_, index) => valueIntersection(value, template[index]));
    return found !== undefined ? template : undefined;
}
// number of keys in object, number of items in array
function $size(value, template) {
    let size;
    if (Array.isArray(value)) {
        size = value.length;
    }
    else if (isJSONObject(value)) {
        size = Object.keys(value).length;
    }
    if (size !== undefined) {
        const result = valueIntersection(size, template);
        return result;
    }
    return undefined;
}
// template in value
function $contains(value, template) {
    if (!Array.isArray(value)) {
        throw new Error(`$contains: expects array, ${value} given`);
    }
    const found = value.find((_, index) => valueIntersection(value[index], template));
    return found !== undefined ? template : undefined;
}
// arrays intersection
function $intersection(value, template) {
    if (!Array.isArray(template) || !Array.isArray(value)) {
        throw new Error(`$intersection: expects array, ${template} , ${value} given`);
    }
    const found = value.find((_, indexV) => template.find((__, index) => valueIntersection(value[indexV], template[index])));
    return found !== undefined ? template : undefined;
}
// value is subset on template
function $subsetOf(value, template) {
    if (!Array.isArray(template) || !Array.isArray(value)) {
        throw new Error(`$subsetOf: expects array, ${template} , ${value} given`);
    }
    const found = value.every((_, indexV) => template.find((__, index) => valueIntersection(value[indexV], template[index])));
    return found ? template : undefined;
}
// template is subset on value
function $supersetOf(value, template) {
    if (!Array.isArray(template) || !Array.isArray(value)) {
        throw new Error(`$supersetOf: expects array, ${template} , ${value} given`);
    }
    const found = template.every((_, indexV) => {
        const resultT = value.find((__, index) => {
            const resultV = valueIntersection(value[index], template[indexV]);
            return resultV !== undefined;
        });
        return resultT !== undefined;
    });
    return found ? template : undefined;
}
function canCompare(value, template) {
    let result;
    if (!isNumber(value) && !isString(value)) {
        result = false;
    }
    else if (!isNumber(template) && !isString(template)) {
        result = false;
    }
    else if (typeof value !== typeof template) {
        result = false;
    }
    else {
        result = true;
    }
    return result;
}
// value is grater than template
function $gt(value, template) {
    let result;
    if (canCompare(value, template)) {
        // @ts-ignore
        result = value > template;
    }
    return result ? template : undefined;
}
// value is grater or equal than template
function $gte(value, template) {
    let result;
    if (canCompare(value, template)) {
        // @ts-ignore
        result = value >= template;
    }
    return result ? template : undefined;
}
// value is lower than template
function $lt(value, template) {
    let result;
    if (canCompare(value, template)) {
        // @ts-ignore
        result = value < template;
    }
    return result ? template : undefined;
}
// value is lower or equal than template
function $lte(value, template) {
    let result;
    if (canCompare(value, template)) {
        // @ts-ignore
        result = value <= template;
    }
    return result ? template : undefined;
}
// all items in template applies to value
function $and(value, template) {
    if (!Array.isArray(template)) {
        throw new Error(`$and: template must be array, ${template} given`);
    }
    const result = template.every((_, index) => valueIntersection(value, template[index]));
    return result ? template : undefined;
}
// at least one items in template applies to value
function $or(value, template) {
    if (!Array.isArray(template)) {
        throw new Error(`$or: template must be array, ${template} given`);
    }
    const result = template.find((_, index) => valueIntersection(value, template[index]));
    return result ? template : undefined;
}
// not any items in template applies to value
function $none(value, template) {
    if (!Array.isArray(template)) {
        throw new Error(`$none: template must be array, ${template} given`);
    }
    const result = template.find((_, index) => valueIntersection(value, template[index]));
    return result ? undefined : template;
}
function $hasKey(value, template) {
    if (typeof template !== 'string') {
        throw new Error('$hasKey: template must be string');
    }
    if (isJSONObject(value)) {
        return Object.hasOwn(value, template) ? template : undefined;
    }
    return undefined;
}
patternFunctions.$eq = $eq; // any, any
patternFunctions.$neq = $not; // any, any
patternFunctions.$not = $not; // any, any
patternFunctions.$in = $in; // any, array
patternFunctions.$is = $eq; // any, any
patternFunctions.$size = $size; // array | object, number
patternFunctions.$contains = $contains; // array , any
patternFunctions.$intersection = $intersection; // array , array
// patternFunctions.$intersectionSize = $intersectionSize; // array , array
patternFunctions.$subsetOf = $subsetOf; // array , array
patternFunctions.$supersetOf = $supersetOf; // array , array
patternFunctions.$gt = $gt; // string | number , string | number
patternFunctions.$gte = $gte; // string | number , string | number
patternFunctions.$lt = $lt; // string | number , string | number
patternFunctions.$lte = $lte; // string | number , string | number
patternFunctions.$and = $and; // any , array
patternFunctions.$or = $or; // any , array
patternFunctions.$none = $none; // any , array
patternFunctions.$hasKey = $hasKey; // object , string
function patternIntersection(key, value, template) {
    let result;
    if (value === undefined) {
        throw new Error(`patternIntersection: Value cannot be undefined here for key: ${key}`); // this should never happen
    }
    else if (Object.hasOwn(patternFunctions, key)) {
        result = patternFunctions[key].call(null, value, template);
    }
    else {
        throw new Error(`patternIntersection: Unsupported matching pattern ${key}`);
    }
    return result;
}
function objectTemplate2Scalar(source, template) {
    // all template keys must be functions and they must all match against source
    if (!isJSONObject(template)) {
        throw new Error('objectTemplate2Scalar: template must be object');
    }
    const templateKeys = Object.keys(template);
    const areMatching = templateKeys.every((key) => {
        if (!supportedType(template[key])) {
            throw new Error(`objectTemplate2Scalar: unsupported value (type) in template ${template[key]}`);
        }
        if (key.startsWith('$')) {
            const match = patternIntersection(key, source, template[key]);
            return match !== undefined;
        }
        return false;
    });
    return areMatching ? template : undefined;
}
function objectTemplate2Object(source, template) {
    if (!isJSONObject(template)) {
        throw new Error('objectTemplate2Object: template must be object');
    }
    const templateKeys = Object.keys(template);
    const areMatching = templateKeys.every((key) => {
        if (!supportedType(template[key])) {
            throw new Error(`objectTemplate2Object: unsupported value (type) in template ${template[key]}`);
        }
        if (Object.hasOwn(source, key)) {
            const match = valueIntersection(source[key], template[key]);
            return match !== undefined;
        }
        if (key.startsWith('$')) {
            const match = patternIntersection(key, source, template[key]);
            return match !== undefined;
        }
        return false;
    });
    return areMatching ? template : undefined;
}
function objectTemplate2Array(source, template) {
    if (!isJSONObject(template)) {
        throw new Error('objectTemplate2Array: template must be object');
    }
    const templateKeys = Object.keys(template);
    const areMatching = templateKeys.every((key) => {
        if (!supportedType(template[key])) {
            throw new Error(`objectTemplate2Array: unsupported value (type) in template ${template[key]}`);
        }
        if (key.startsWith('$')) {
            const match = patternIntersection(key, source, template[key]);
            return match !== undefined;
        }
        return false;
    });
    return areMatching ? template : undefined;
}
function objectTemplate2any(source, template) {
    // debugger;
    if ((typeof template !== 'object') ||
        (template === null) ||
        (Array.isArray(template)) ||
        false) {
        throw new Error('objectTemplate2any: template must be non-null, non-array objects');
    }
    let result;
    if (isScalar(source)) {
        result = objectTemplate2Scalar(source, template);
    }
    else if (isJSONObject(source)) {
        result = objectTemplate2Object(source, template);
    }
    else if (Array.isArray(source)) {
        result = objectTemplate2Array(source, template);
    }
    return result;
}
function objectIntersection(source, template) {
    // debugger;
    if ((typeof source !== 'object') ||
        (typeof template !== 'object') ||
        (source === null) ||
        (template === null) ||
        (Array.isArray(source)) ||
        (Array.isArray(template)) ||
        false) {
        throw new Error('objectIntersection: source and template must be non-null, non-array objects');
    }
    const result = objectTemplate2any(source, template);
    return result === undefined ? null : result;
}
/**
 * Main function for object matching
 *
 * @param {JSONObject} source - object to test
 * @param {JSONObject} template - pattern to test agains
 * @returns { boolean } true if value matches template
 */
function objectMatch(source, template) {
    // debugger;
    return objectIntersection(source, template) !== null;
}
export { objectIntersection, objectMatch, valueIntersection, objectCompare, patternFunctions, };
//# sourceMappingURL=index.mjs.map