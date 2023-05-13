/**
 * @todo $eq for object = there must be the same keys.... not jut regular pattern matching
 */
type JSONScalar = string | number | boolean | null;
type JSONObject = {
    [property: string]: JSONData;
};
type JSONData = JSONScalar | JSONArray | JSONObject;
type JSONArray = JSONData[];
type Optional<T> = T | undefined;
type PatternMatchingFunction = (value: JSONData, template: JSONData) => Optional<JSONData>;
declare const patternFunctions: Record<string, PatternMatchingFunction>;
declare function objectCompare(source: JSONObject | null, target: JSONObject | null): boolean;
declare function objectIntersection(source: JSONData, template: JSONData): JSONObject | null;
declare function objectMatch(source: JSONObject, template: JSONObject): boolean;
export { JSONScalar, JSONObject, JSONData, JSONArray, objectIntersection, objectMatch, objectCompare, patternFunctions, };
//# sourceMappingURL=index.d.mts.map