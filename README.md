Package allows for complex object matching: checking if you package matches template


Following code tests if provided user (1st parameter) matches template (2nd parameter).
Test for user having `account-manager` role and is from Czech Republic or Slovak Republic.
```TypeScript
import { objectMatch } from '@webnt-dev/object-match';
// function objectMatch(source: JSONObject, template: JSONObject): boolean
objectMatch(
  {
    id: 5,
    name: "Bronislav",
    roles: ['customer-care', 'account-manager'],
    address: {
      country: 'cz',
    },
  },
  {
    id: 5,
    roles: { $contains: 'account-manager' },
    address: {
      country: { $in: ['cz', 'sk'] },
    },
  },
) === true;
```

Function `objectMatch` traverses the object and matches it against the template property by property. If all template conditions match, function returns true.

Function supports direct matching (`id` in example above) or pattern matching using function - properties starting with `$` in template (`roles` in example above).

# Included template matching functions

## Comparison functions

List of predefined comparison functions with simple examples.

Comparison functions can be nested, see complex example at the end.

### `$is` (alias `$eq`)
function does generic matching (this function can be omitted / not used)

### `$not` (alias `$neq`)
negation of template (see logical functions)

### `$gt`
source is greater than template (numbers, strings)

```TypeScript
objectMatch(
  {
    a: 5,
  },
  {
    a: { $gt: 4 },
  },
) === true;
```

### `$gte`
source is greater or equal than value (numbers, strings)
```TypeScript
objectMatch(
  {
    a: 5,
  },
  {
    a: { $gte: 4 },
  },
) === true;
```

### `$lt`
source is less than value (numbers, strings)
```TypeScript
objectMatch(
  {
    a: 5,
  },
  {
    a: { $lt: 6 },
  },
) === true;
```

### `$lte`
source is less or equal than value (numbers, strings)
```TypeScript
objectMatch(
  {
    a: 5,
  },
  {
    a: { $lte: 6 },
  },
) === true;
```

## Array functions
### `$in`
source (of any type) is in template array
```TypeScript
objectMatch(
  {
    a: 1,
  },
  {
    a: { $in: [0, 1, 2] },
  },
) === true;
```

### `$contains`
source array contains template value (of any type)
```TypeScript
objectMatch(
  {
    a: [0, { o1: 1 }, 2],
  },
  {
    a: { $contains: { o1: 1 } },
  },
) === true;
```

### `$subsetOf`
source array is subset of template array
```TypeScript
objectMatch(
  {
    a: [0, 1, 2],
  },
  {
    a: { $subsetOf: [1, 0, 2, 3, 'a'] }
  },
) === true;
```

### `$supersetOf`
template array is subset of source array
```TypeScript
objectMatch(
  {
    a: [1, 0, 2, 3, 'a'],
  },
  {
    a: { $supersetOf: [0, 1, 2] }
  },
) === true;
```

### `$size`
source array length (number)
```TypeScript
objectMatch(
  {
    a: [1, 0, 2, 3, 'a'],
  },
  {
    a: { $size: 5 }
  },
) === true;
```

### `$intersection`
there is non-empty intersection of source array and template array
```TypeScript
objectMatch(
  {
    a: [0, 1, 2, 3, 'a'],
  },
  {
    a: { $intersection: [-1, 0] },
  },
) === true;
```

## Object functions
### `$size`
source object key number
```TypeScript
objectMatch(
  {
    a: { x1: 1, x2: 2 },
  },
  {
    a: { $size: 2 },
  },
) === true;
```

### `$hasKey`
source object has key
```TypeScript
objectMatch(
  {
    a: { x1: 1, x2: 2 },
  },
  {
    a: { $hasKey: 'x1' },
  },
) === true;
```

## Logical functions
### `$not`
negation of template
```TypeScript
objectMatch(
  {
    a: { x1: 1, x2: 2 },
  },
  {
    a: { $not: { $size: 3 } },
  },
) === true;
```

### `$and`
all template array items must match against source
```TypeScript
objectMatch(
  {
    a: 4,
  },
  {
    a: { $and: [{ $gt: 3 }, { $lt: 5 }] },
  },
) === true;
```

### `$or`
at least one template item must match against source
```TypeScript
objectMatch(
  {
    a: 4,
  },
  {
    a: { $or: [{ $gt: 3 }, { $lt: 4 }] },
  },
) === true;
```

### `$none`
no template item must match against source
```TypeScript
objectMatch(
  {
    a: 4,
  },
  {
    a: { $none: [{ $gt: 4 }, { $lt: 4 }] },
  },
) === true;
```

### Full complex example
```TypeScript
objectMatch(
  {
    a: 5, // Properties compare
    b: 'X',
    c: false,
    d: ['1', { e1: 'test' }],

    e: { e1: 4 }, // $eq/$is compare
    f: 5,

    g: { g1: 4 }, // $neq/$not compare
    h: 5,

    i: { i1: 4 }, // $gt/$gte/$lt/$lte compare
    j: 5,
    k: 5,
    l: 5,

    m: 1, // $in compare
    n: [1],
    o: { o1: 1 },
    p: 1,

    q: [0, 1, 2], // $contains compare
    r: [0, { o1: 1 }, 2],

    s: [0, 1, 2], // $subsetOf compare

    t: [0, 1, 2, 3, 'a'], // $supersetOf compare

    u: [0, 1, 2, 3, 'a'], // $size compare (array)
    v: [0, 1, 2, 3, 'a'],

    w: [0, 1, 2, 3, 'a'], // $intersection compare

    x: { x1: 1, x2: 2 }, // $size compare (object)

    y: 4, // $and compare

    z: 4, // $or compare

    A: 4, // $none compare

    B: ['1', '2', 3, 7], // $hasKey compare
    C: {
      C1: 'f',
    },

  },
  {
    a: 5, // Properties compare

    e: { $eq: { e1: 4 } }, // $eq/$is compare
    f: { $is: 5 },

    g: { $neq: { g1: 5 } }, // $neq/$not compare
    h: { $not: 4 },

    i: { i1: { $gt: 3 } }, // $gt/$gte/$lt/$lte compare
    j: { $gte: 5 },
    k: { $lt: 6 },
    l: { $not: { $lte: 4 } },

    m: { $in: [0, 1, 2] }, // $in compare
    n: { $in: [0, [1], 2] },
    o: { $in: [0, { o1: 1 }, 2] },
    p: { $not: { $in: [{ $lt: 0 }] } },

    q: { $not: { $contains: 5 } }, // $contains compare
    r: { $contains: 2 },

    s: { $subsetOf: [1, { $lt: 1 }, 2, 3, 'a'] }, // $subsetOf compare

    t: { $supersetOf: [1, { $lt: 1 }, 2] }, // $supersetOf compare

    u: { $size: 5 }, // $size compare (array)
    v: { $size: { $not: { $gt: 6 } } },

    w: { $intersection: [-1, { $lte: 0 }] }, // $intersection compare

    x: { $size: 2, x1: 1 }, // $size compare (object)

    y: { $and: [{ $gt: 3 }, { $lt: 5 }] }, // $and compare

    z: { $or: [{ $gt: 3 }, { $lt: 4 }] }, // $or compare

    A: { $none: [{ $gt: 4 }, { $lt: 4 }] }, // $none compare

    $hasKey: 'B', // $hasKey compare
    $not: { $hasKey: 'D' },
    C: {
      $hasKey: 'C1',
      $not: { $hasKey: 'C2' },
    },

  },
) === true
```


# Support for additional template matching functions

Package exports `patternFunctions` object with definitions of all template matching functions so those can be override or new one can be created

```TypeScript
import {
  objectMatch,
  patternFunctions,
  JSONData,
  Optional
} from from '@webnt-dev/object-match';

/**
 * Function validates, if number is odd
 *
 * Function must accept 2 generic JSON types, any type validation must be done within function.
 * Function must return `undefined` if matching does not apply or `template` input variable
 * if it does.
 *
 * For example below:
 * `value` = 4
 * `template` = false
 *
 * @param {JSONData} value - value to test
 * @param {JSONData} template - template value to test `value` against
 *
 * @returns {undefined|JSONData} `undefined` if matching does not apply or `template` input variable if it does
 *
 */
patternFunctions.$odd = (value: JSONData, template: JSONData): Optional<JSONData> => {
  if (typeof template !== 'boolean') {
    throw Error('$odd template must be boolean');
  }
  if (typeof value !== 'number') {
    return undefined;
  }

  return (value % 2 === 1) === template ? template : undefined;
};

objectMatch(
  {
    a: 4,
  },
  {
    a: { $odd: false },
  },
) === true;
```

Package exports `valueIntersection` function that can be used run recursive matching of 2 values of any types
if additional template matching functions needs to traverse complex structures.

# Changelog

Any missing version means mostly documentation fixes.

## version 1.0.6
2023-05-14
```
@ additions to documentation
```

## version 1.0.4
2023-05-13
```
+ initial version
```
