Package allows for complex object matching: checking if you package matches template


Following code tests if provided user (1st parameter) matches template (2nd parameter).
Tests for user having `account-manager` role and is from Czech Republic or Slovak Republic.
```JavaScript
objectMatch(
  {
    id: 5,
    roles: ['customer-care', 'account-manager'],
    address: {
      country: 'cz',
    },
  },
  {
    roles: { $contains: 'account-manager' },
    address: {
      country: { $in: ['cz', 'sk'] },
    },
  },
) === true;
```
