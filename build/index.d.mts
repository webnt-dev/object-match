/**
 * @todo add $exists
 * @todo rewrite objectTemplateIntersection - too complex
 */
/**
 * Type represents JSON valid scalar variable
 */
type JSONScalar = string | number | boolean | null;
/**
 * Type represents JSON valid object
 */
type JSONObject = {
    [property: string]: JSONData;
};
/**
 * Type represents any JSON valid value
 */
type JSONData = JSONScalar | JSONArray | JSONObject;
/**
 * Type represents JSON valid array
 */
type JSONArray = JSONData[];
/**
 * Type represents JSON valid value or undefined, generic type
 */
type Optional<T> = T | undefined;
/**
 * Type represents template matching function type
 */
type PatternMatchingFunction = (value: JSONData, template: JSONData) => Optional<JSONData>;
/**
 * Dictionary of all templete matching functions
 */
declare const patternFunctions: Record<string, PatternMatchingFunction>;
/**
 * Function matches two objects, if those are the same.
 * Function does not do pattern matching, but exact comparison
 *
 * @param {JSONObject|null} source - object to test
 * @param {JSONObject|null} target - object to test agains
 * @returns { boolean } true if value is the same as target
 */
declare function objectCompare(source: JSONObject | null, target: JSONObject | null): boolean;
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
declare function valueIntersection(value: JSONData, template: JSONData): Optional<JSONData>;
declare function objectIntersection(source: JSONData, template: JSONData): JSONObject | null;
/**
 * Main function for object matching
 *
 * @param {JSONObject} source - object to test
 * @param {JSONObject} template - pattern to test agains
 * @returns { boolean } true if value matches template
 */
declare function objectMatch(source: JSONObject, template: JSONObject): boolean;
export { JSONScalar, JSONObject, JSONData, JSONArray, Optional, PatternMatchingFunction, objectIntersection, objectMatch, valueIntersection, objectCompare, patternFunctions, };
//# sourceMappingURL=index.d.mts.map