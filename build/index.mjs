/**
 * @todo $eq for object = there must be the same keys.... not jut regular pattern matching
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
        default: throw new Error(`Unsuported type ${targetType}`);
    }
    return result;
}
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
            default: throw new Error(`Unsuported type ${templateType}`);
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
        result = objectTemplateIntersection(value, template);
    }
    // debugger;
    return result;
    // throw new Error(`Unsuported type ${templateType}`);
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
        throw new Error(`$in expects array, ${template} given`);
    }
    const found = template.find((_, index) => valueIntersection(value, template[index]));
    return found !== undefined ? template : undefined;
}
// number of keys in object, number of items in array
function $size(value, template) {
    // if (!isNumber(template)) {
    // 	throw new Error('$size parameter must be number');
    // }
    // if (Array.isArray(value)) {
    // 	if (value.length === template) {
    // 		return template;
    // 	}
    // } else if (isJSONObject(value)) {
    // 	if (Object.keys(value).length === template) {
    // 		return template;
    // 	}
    // } else {
    // 	throw new Error('$size is applicable only for array and objects');
    // }
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
        throw new Error(`$contains expects array, ${value} given`);
    }
    const found = value.find((_, index) => valueIntersection(value[index], template));
    return found !== undefined ? template : undefined;
}
// arrays intersection
function $intersection(value, template) {
    if (!Array.isArray(template) || !Array.isArray(value)) {
        throw new Error(`$in expects array, ${template} , ${value} given`);
    }
    const found = value.find((_, indexV) => template.find((__, index) => valueIntersection(value[indexV], template[index])));
    return found !== undefined ? template : undefined;
}
// length arrays intersection - exact matching, no pattern matching
// function $intersectionSize(value: JSONData, template: JSONData): Optional<JSONData> {
// 	if (!Array.isArray(template) || !Array.isArray(value)) {
// 		throw new Error(`$in expects array, ${template} , ${value} given`);
// 	}
// 	const found = value.map((_, indexV) => template.map((__, index) => compareValues(value[indexV], template[index])));
// 	console.log(found);
// 	return found !== undefined ? template : undefined;
// }
// value is subset on template
function $subsetOf(value, template) {
    if (!Array.isArray(template) || !Array.isArray(value)) {
        throw new Error(`$in expects array, ${template} , ${value} given`);
    }
    const found = value.every((_, indexV) => template.find((__, index) => valueIntersection(value[indexV], template[index])));
    return found ? template : undefined;
}
// template is subset on value
function $supersetOf(value, template) {
    if (!Array.isArray(template) || !Array.isArray(value)) {
        throw new Error(`$in expects array, ${template} , ${value} given`);
    }
    const found = template.every((_, indexV) => value.find((__, index) => valueIntersection(value[index], template[indexV])));
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
        throw new Error(`$and template must be array, ${template} given`);
    }
    const result = template.every((_, index) => valueIntersection(value, template[index]));
    return result ? template : undefined;
}
// at least one items in template applies to value
function $or(value, template) {
    if (!Array.isArray(template)) {
        throw new Error(`$and template must be array, ${template} given`);
    }
    const result = template.find((_, index) => valueIntersection(value, template[index]));
    return result ? template : undefined;
}
// not any items in template applies to value
function $none(value, template) {
    if (!Array.isArray(template)) {
        throw new Error(`$and template must be array, ${template} given`);
    }
    const result = template.find((_, index) => valueIntersection(value, template[index]));
    return result ? undefined : template;
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
function patternIntersection(key, value, template) {
    let result;
    if (key === '$exists') { // placeholder for $exists
        result = (value === undefined) && (template === true);
    }
    else if (value === undefined) {
        throw new Error(`Value cannot be undefined here for key: ${key}`); // this should never happen
    }
    else if (Object.hasOwn(patternFunctions, key)) {
        result = patternFunctions[key].call(null, value, template);
    }
    else {
        throw new Error(`Unsupported matching pattern ${key}`);
    }
    /* * /
    if (key === '$eq') key = '$is';
    else if (key === '$neq') key = '$not';

    switch (key) {
        case '$in': result = $in(value, template); break;
        case '$is': result = $eq(value, template); break;
        case '$not': result = $not(value, template); break;
        default: throw new Error(`Unsupported matching pattern ${key}`);
    }
    /* */
    return result;
}
function objectTemplateIntersection(source, template) {
    if ((typeof template !== 'object') ||
        (template === null) ||
        (Array.isArray(template)) ||
        false) {
        throw new Error('Source and template must be non-null, non-array objects');
    }
    let result = {};
    const templateKeys = Object.keys(template);
    // source && template are objects
    if (isJSONObject(source)) {
        templateKeys.forEach((key) => {
            if (!supportedType(template[key])) {
                throw new Error(`Unsupported value (type) in template ${template[key]}`);
            }
            if (Object.hasOwn(source, key)) {
                if (!supportedType(source[key])) {
                    throw new Error(`Unsupported value (type) in source ${source[key]}`);
                }
                const match = valueIntersection(source[key], template[key]);
                if (match !== undefined) {
                    result[key] = match;
                }
            }
            else if (key.startsWith('$')) {
                let match;
                // ugly $size hack?? we must match object size agains whole object
                if (key === '$size') {
                    match = patternIntersection(key, source, template[key]);
                }
                else {
                    match = patternIntersection(key, source[key], template[key]);
                }
                if (match !== undefined) {
                    result[key] = match;
                }
            }
        });
    }
    else { // source is scalar && template is object - all template keys must be patterns and all must match
        const areMatching = templateKeys.every((key) => {
            const match = patternIntersection(key, source, template[key]);
            if (match !== undefined) {
                result[key] = template[key];
                return true;
            }
            return false;
        });
        if (!areMatching) {
            result = {};
        }
    }
    return Object.keys(result).length > 0 ? result : undefined;
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
        throw new Error('Source and template must be non-null, non-array objects');
    }
    const result = objectTemplateIntersection(source, template);
    return result === undefined ? null : result;
}
function objectMatch(source, template) {
    return objectIntersection(source, template) !== null;
}
export { objectIntersection, objectMatch, objectCompare, patternFunctions, };
//# sourceMappingURL=index.mjs.map