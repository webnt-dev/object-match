import {
	objectIntersection,
	objectCompare,
} from '../build/index.mjs';

/*
console.log(objectIntersection(
	{ a: 5 },
	{ a: 5 },
));
*/
// console.log(compareObjects(objectIntersection(
// 	{ a: 5 },
// 	{ a: 5 },
// ), { a: 5 }));

// "test": "tsc --project ./tsconfig.json && ts-node-esm ./test/index.mts"

const tests = [
	/* * /
	{
		caption: 'One property compare',
		result: objectCompare(
			objectIntersection(
				{
					a: 5,
					b: 'X',
					c: null,
					d: false,
				},
				{
					a: 5,
				},
			), {
				a: 5,
			},
		) === true,
	},
	/* */

	/* * /
	{
		caption: 'multiple properties compare',
		result: objectCompare(
			objectIntersection(
				{
					a: 5,
					b: 'X',
					c: null,
					d: false,
				},
				{
					a: 5,
					b: 'X',
					c: null,
					d: false,
				},
			), {
				a: 5,
				b: 'X',
				c: null,
				d: false,
			},
		) === true,
	},
	/* */

	/* * /
	{
		caption: 'ignored property in source compare',
		result: objectCompare(
			objectIntersection(
				{
					a: 5,
					b: 'X',
					c: null,
					d: false,
				},
				{
					a: 5,
					b: 'X',
					d: false,
				},
			), {
				a: 5,
				b: 'X',
				d: false,
			},
		) === true,
	},
	/* */

	/* * /
	{
		caption: 'complex matching types 1',
		result: objectCompare(
			objectIntersection(
				{
					a: 5,
					b: ['a', 2, [1, 2], { xx: 5, yy: 'c' }],
					c: null,
					d: {
						x: { y: 8 },
					},
				},
				{
					a: 5,
					b: ['a', 2, [1, 2], { xx: 5, yy: 'c' }],
					d: {
						x: { y: 8 },
					},
				},
			), {
				a: 5,
				b: ['a', 2, [1, 2], { xx: 5, yy: 'c' }],
				d: {
					x: { y: 8 },
				},
			},
		) === true,
	},
	/* */

	/* * /
	{
		caption: 'complex matching types 2',
		result:	objectCompare(
			objectIntersection(
				{
					a: 5,
					b: ['a', 2, [1, 2], { xx: 5, yy: 'c' }],
					c: null,
					d: {
						x: { y: 8 },
					},
				},
				{
					a: 5,
					b: ['a', 2, [1, 2], { xx: 5, yy: 'd' }],
					d: {
						x: { y: 8 },
					},
				},
			), {
				a: 5,
				b: ['a', 2, [1, 2], { xx: 5, yy: 'd' }],
				d: {
					x: { y: 8 },
				},
			},
		) === false,
	},
	/* */

	/* * /
	{
		caption: '$eq true',
		result: objectCompare(
			objectIntersection(
				{
					a: 5,
				},
				{
					a: { $eq: 5 },
				},
			), {
				a: { $eq: 5 },
			},
		) === true,
	},
	/* */

	/* * /
	{
		caption: '$eq $eq true',
		result: objectCompare(
			objectIntersection(
				{
					a: 5,
				},
				{
					a: { $eq: { $eq: 5 } },
				},
			), {
				a: { $eq: { $eq: 5 } },
			},
		) === true,
	},

	/* * /
	{
		caption: '$eq false',
		result: objectCompare(
			objectIntersection(
				{
					a: 5,
				},
				{
					a: { $eq: 5 },
				},
			), {
				a: { $eq: 6 },
			},
		) === false,
	},
	/* */

	/* * /
	{
		caption: '$not true',
		result: objectCompare(
			objectIntersection(
				{
					a: 5,
				},
				{
					a: { $not: '5' },
				},
			), {
				a: { $not: '5' },
			},
		) === true,
	},
	/* */

	/* * /
	{
		caption: '$not $eq true',
		result: objectCompare(
			objectIntersection(
				{
					a: 5,
				},
				{
					a: { $not: { $eq: '5' } },
				},
			), {
				a: { $not: { $eq: '5' } },
			},
		) === true,
	},
	/* */

	/* * /
	{
		caption: '$not false',
		result: objectCompare(
			objectIntersection(
				{
					a: 5,
				},
				{
					a: { $not: 5 },
				},
			), {
				a: { $not: 5 },
			},
		) === false,
	},
	/* */

	/* * /
	{
		caption: '$gt 1',
		result: objectCompare(
			objectIntersection(
				{
					a: 5,
				},
				{
					a: { $gt: 4 },
				},
			), {
				a: { $gt: 4 },
			},
		) === true,
	},
	/* */

	/* * /
	{
		caption: '$gt 2',
		result: objectCompare(
			objectIntersection(
				{
					a: 'Klučka',
				},
				{
					a: { $gt: 'Broňa' },
				},
			), {
				a: { $gt: 'Broňa' },
			},
		) === true,
	},
	/* */

	/* * /
	{
		caption: '$gt 3',
		result: objectCompare(
			objectIntersection(
				{
					a: 5,
				},
				{
					a: { $not: { $gt: 5 } },
				},
			), {
				a: { $not: { $gt: 5 } },
			},
		) === true,
	},
	/* */

	/* * /
	{
		caption: '$gte 1',
		result: objectCompare(
			objectIntersection(
				{
					a: 5,
				},
				{
					a: { $gte: 5 },
				},
			), {
				a: { $gte: 5 },
			},
		) === true,
	},
	/* */

	/* * /
	{
		caption: '$gte 2',
		result: objectCompare(
			objectIntersection(
				{
					a: 'Klučka',
				},
				{
					a: { $gte: 'Klučka' },
				},
			), {
				a: { $gte: 'Klučka' },
			},
		) === true,
	},
	/* */

	/* * /
	{
		caption: '$lt 1',
		result: objectCompare(
			objectIntersection(
				{
					a: 5,
					b: 5,
				},
				{
					a: { $lt: 6 },
					b: { $not: { $lt: 4 } },
				},
			), {
				a: { $lt: 6 },
				b: { $not: { $lt: 4 } },
			},
		) === true,
	},
	/* * /

	/* * /
	{
		caption: '$lte 1',
		result: objectCompare(
			objectIntersection(
				{
					a: 5,
					b: 5,
				},
				{
					a: { $lte: 5 },
					b: { $not: { $lte: 4 } },
				},
			), {
				a: { $lte: 5 },
				b: { $not: { $lte: 4 } },
			},
		) === true,
	},
	/* */

	/* * /
	{
		caption: '$in true 1',
		result: objectCompare(
			objectIntersection(
				{
					a: 5,
				},
				{
					a: { $in: [1, { $not: 7 }, '6'] },
				},
			), {
				a: { $in: [1, { $not: 7 }, '6'] },
			},
		) === true,
	},
	/* */

	/* * /
	{
		caption: '$in false 1',
		result: objectCompare(
			objectIntersection(
				{
					a: 5,
				},
				{
					a: { $in: [1, '5', '6'] },
				},
			), {
				a: { $in: [1, '5', '6'] },
			},
		) === false,
	},
	/* */

	/* * /
	{
		caption: '$size array 1',
		result: objectCompare(
			objectIntersection(
				{
					a: ['1', '2'],
				},
				{
					a: { $size: 2 },
				},
			), {
				a: { $size: 2 },
			},
		) === true,
	},
	/* */

	/* * /
	{
		caption: '$size array 2',
		result: objectCompare(
			objectIntersection(
				{
					a: ['1', '2'],
				},
				{
					a: { $size: 3 },
				},
			), {
				a: { $size: 3 },
			},
		) === false,
	},
	/* */

	/* * /
	{
		caption: '$size object 1',
		result: objectCompare(
			objectIntersection(
				{
					a: { c: 1, d: 2, e: 2 },
				},
				{
					a: { $size: 3 },
				},
			), {
				a: { $size: 3 },
			},
		) === true,
	},
	/* */

	/* * /
	{
		caption: '$size object 3',
		result: objectCompare(
			objectIntersection(
				{
					a: { b: { c: 1, d: 2, e: 2 } },
				},
				{
					a: { b: { $size: 3 } },
				},
			), {
				a: { b: { $size: 3 } },
			},
		) === true,
	},
	/* */

	/* * /
	{
		caption: '$size object 2',
		result: objectCompare(
			objectIntersection(
				{
					a: { b: { c: 1, d: 2, e: 2 } },
				},
				{
					a: { b: { $size: 2 } },
				},
			), {
				a: { b: { $size: 2 } },
			},
		) === false,
	},
	/* */

	/* * /
	{
		caption: '$size object 3',
		result: objectCompare(
			objectIntersection(
				{
					a: { b: { c: 1, d: 2, e: 2 } },
				},
				{
					a: { b: { $size: { $gte: 2 } } },
				},
			), {
				a: { b: { $size: { $gte: 2 } } },
			},
		) === true,
	},
	/* */

	/* * /
	{
		caption: '$size object 4',
		result: objectCompare(
			objectIntersection(
				{
					a: { },
				},
				{
					a: { $size: 0 },
				},
			), {
				a: { $size: 0 },
			},
		) === true,
	},
	/* */

	/* * /
	{
		caption: '$intersection array 1',
		result: objectCompare(
			objectIntersection(
				{
					a: ['1', '2', 3, 4],
				},
				{
					a: { $intersection: ['1', 3, 8] },
				},
			), {
				a: { $intersection: ['1', 3, 8] },
			},
		) === true,
	},
	/* */

	/* * /
	{
		caption: '$intersection array 2',
		result: objectCompare(
			objectIntersection(
				{
					a: ['1', '2', 3, 4],
				},
				{
					a: { $intersection: [{ $gt: 0 }, '3'] },
				},
			), {
				a: { $intersection: [{ $gt: 0 }, '3'] },
			},
		) === false,
	},
	/* */

	/* * /
	{
		caption: '$subsetOf 1',
		result: objectCompare(
			objectIntersection(
				{
					a: ['1', 3],
				},
				{
					a: { $subsetOf: ['1', { $gt: 2 }, 8] },
				},
			), {
				a: { $subsetOf: ['1', { $gt: 2 }, 8] },
			},
		) === true,
	},
	/* */

	/* * /
	{
		caption: '$subsetOf 1',
		result: objectCompare(
			objectIntersection(
				{
					a: ['1', '2', 3, 4],
				},
				{
					a: { $subsetOf: ['1', 3, 8] },
				},
			), {
				a: { $subsetOf: ['1', 3, 8] },
			},
		) === false,
	},
	/* */

	/* * /
	{
		caption: '$supersetOf 1',
		result: objectCompare(
			objectIntersection(
				{
					a: ['1', '2', 3, 8],
				},
				{
					a: { $supersetOf: ['1', 3, 8] },
				},
			), {
				a: { $supersetOf: ['1', 3, 8] },
			},
		) === true,
	},
	/* */

	/* * /
	{
		caption: '$and 1',
		result: objectCompare(
			objectIntersection(
				{
					a: ['1', '2', 3, 8],
				},
				{
					a: { $and: [{ $supersetOf: ['1', 3, 8] }, { $size: 4 }] },
				},
			), {
				a: { $and: [{ $supersetOf: ['1', 3, 8] }, { $size: 4 }] },
			},
		) === true,
	},
	/* */

	/* * /
	{
		caption: '$and 2',
		result: objectCompare(
			objectIntersection(
				{
					a: ['1', '2', 3, 8],
				},
				{
					a: { $and: [{ $supersetOf: ['1', 3, 8] }, { $size: 3 }] },
				},
			), {
				a: { $and: [{ $supersetOf: ['1', 3, 8] }, { $size: 3 }] },
			},
		) === false,
	},
	/* */

	/* * /
	{
		caption: '$or 1',
		result: objectCompare(
			objectIntersection(
				{
					a: ['1', '2', 3, 8],
				},
				{
					a: { $or: [{ $supersetOf: ['1', 3, 8] }, { $size: 3 }] },
				},
			), {
				a: { $or: [{ $supersetOf: ['1', 3, 8] }, { $size: 3 }] },
			},
		) === true,
	},
	/* */

	/* * /
	{
		caption: '$or 2',
		result: objectCompare(
			objectIntersection(
				{
					a: ['1', '2', 3, 8],
				},
				{
					a: { $or: [{ $supersetOf: ['1', 4, 8] }, { $size: 3 }] },
				},
			), {
				a: { $or: [{ $supersetOf: ['1', 4, 8] }, { $size: 3 }] },
			},
		) === false,
	},
	/* */

	/* * /
	{
		caption: '$or 3',
		result: objectCompare(
			objectIntersection(
				{
					a: ['1', '2', 3, 8],
				},
				{
					a: { $not: { $or: [{ $supersetOf: ['1', 4, 8] }, { $size: 3 }] } },
				},
			), {
				a: { $not: { $or: [{ $supersetOf: ['1', 4, 8] }, { $size: 3 }] } },
			},
		) === true,
	},
	/* */

	/* * /
	{
		caption: '$none 1',
		result: objectCompare(
			objectIntersection(
				{
					a: ['1', '2', 3, 8],
				},
				{
					a: { $none: [{ $supersetOf: ['1', 4, 8] }, { $size: 3 }] },
				},
			), {
				a: { $none: [{ $supersetOf: ['1', 4, 8] }, { $size: 3 }] },
			},
		) === true,
	},
	/* */

	/* * /
	{
		caption: '$none 2',
		result: objectCompare(
			objectIntersection(
				{
					a: ['1', '2', 3, 8],
				},
				{
					a: { $none: [{ $supersetOf: ['1', 4, 8] }, { $size: 4 }] },
				},
			), {
				a: { $none: [{ $supersetOf: ['1', 4, 8] }, { $size: 4 }] },
			},
		) === false,
	},
	/* */
	{
		caption: 'test 1',
		result: objectCompare(
			objectIntersection(
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
			), {
				roles: { $contains: 'account-manager' },
				address: {
					country: { $in: ['cz', 'sk'] },
				},
			},
		) === true,
	},


	/* */
	{
		caption: 'complex true',
		result: objectCompare(
			objectIntersection(
				{
					a: 5,
					b: ['a', 2, [1, 2], { xx: 5, yy: 'c' }],
					c: 6,
					d: ['r', 't'],
					e: { f: ['r', 't'] },
					g: {},

					h: ['a', 2, [1, 2], { xx: 5, yy: 'c' }],
					i: 6,
					j: ['r', 5],
					k: { f: ['r', 't', 'x'] },
					l: [1, 2, 3],
					m: { m1: '1', m2: '2', m3: '3' },


					y: null,
					z: false,
				},
				{
					a: { $eq: 5 },
					b: ['a', 2, [1, 2], { xx: 5, yy: 'c' }],
					c: { $not: false },
					d: { $in: ['a', ['r', 't'], 6] },
					e: { f: { $size: 2 } },
					g: { $size: 0 },

					h: ['a', 2, [1, 2], { $size: 2 }],
					i: { $not: { $gte: 7 } },
					j: { $subsetOf: [1, 5, { $lt: 'z' }] },
					k: { f: { $supersetOf: ['t', { $eq: 'r' }] } },
					l: { $size: 3, $subsetOf: [0, 1, 2, 3, 4] },
					m: { m1: '1', $size: { $gte: 3 } },

				},
			), {
				a: { $eq: 5 },
				b: ['a', 2, [1, 2], { xx: 5, yy: 'c' }],
				c: { $not: false },
				d: { $in: ['a', ['r', 't'], 6] },
				e: { f: { $size: 2 } },
				g: { $size: 0 },

				h: ['a', 2, [1, 2], { $size: 2 }],
				i: { $not: { $gte: 7 } },
				j: { $subsetOf: [1, 5, { $lt: 'z' }] },
				k: { f: { $supersetOf: ['t', { $eq: 'r' }] } },
				l: { $size: 3, $subsetOf: [0, 1, 2, 3, 4] },
				m: { m1: '1', $size: { $gte: 3 } },


			},
		) === true,
	},
	/* */


] as any[];

/*


// debugger;
console.log(
	objectCompare(
		objectIntersection(
			{
				a: 5,
				b: ['a', 2, [1, 2], { xx: 5, yy: 'c' }],
				c: 6,
				y: null,
				z: false,
			},
			{
				a: { $eq: 5 },
				b: ['a', 2, [1, 2], { xx: 5, yy: 'c' }],
				c: { $not: false },
			},
		), {
			a: { $eq: 5 },
			b: ['a', 2, [1, 2], { xx: 5, yy: 'c' }],
			c: { $not: false },
		},
	) === true,
);

*/
const ok: any[] = [];
const nok: any[] = [];
tests.forEach((test) => {
	if (test.result) {
		ok.push(test);
	} else {
		nok.push(test);
	}
	// console.log(`${test.result}: ${test.caption}`);
});

console.log(`Total tests: ${tests.length}`);
console.log(`Correct tests: ${ok.length}`);
console.log(`Incorrect test: ${nok.length}`);
nok.forEach((test) => {
	console.log(`\t ${test.caption}`);
});
/*
const test2 = [
	{
		caption: 'One property compare',
		testObject: {
			a: 5,
			b: 'X',
			c: null,
			d: false,
		},
		pattern: {
			a: 5,
		},
	},
] as any [];

test2.forEach((test) => {
	const result = objectIntersection(test.testObject, test.pattern);
	const cmp = objectCompare(result, test.pattern);
	console.log(`${cmp} ${test.caption} ${test.pattern}, ${result}`);
});
*/
