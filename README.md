Package allows for complex object matching: checking if you package matches template


Following code tests if provided user (1st parameter) matches template (2nd parameter).
Tests for user having `account-manager` role and is from Czech Republic or Slovak Republic.
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

Function `objectMatch` traverse object and matches it against template propery by property. If all template conditions match, function returns true.

Function supports direct matching (`id` in example above) or pattern matching using function - properties strating with `$` in template (`roles` in example above).

# Included template matching functions

## Comparison functions
* `$is` (alias `$eq`): function does generic matching (this function can be omited / not used)
* `$not` (alias `$neq`): negation of template
* `$gt`: source is greater than template (numbers, strings)
* `$gte`: source is greater or equal than value (numbers, strings)
* `$lt`: source is less than value (numbers, strings)
* `$lte`: source is less or equal than value (numbers, strings)

## Array functions
* `$in`: source is in template array
* `$contains`: source array contains template value
* `$subsetOf`: source array is subset of template array
* `$supersetOf`: template array is subset of source array
* `$size`: source array length
* `$intersection`: there is non-empty intersection of source and template

## Object functions
* `$size`: source object key number 

## Logincal functions
* `$not`: negation of template
* `$and`: all template items must match against source
* `$or`: at least one template item must match against source
* `$none`: no template item must match against source


# Support for additional template matching functions

Package exports `patternFunctions` object with definitions of all template matching functions so those can be override or new one can be created 

```TypeScript
import {
  objectMatch,
  patternFunctions,
  JSONData,
  Optional
} from from '@webnt-dev/object-match';

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

# Changelog
