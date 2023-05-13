import {
	// objectIntersection,
	// objectCompare,
	patternFunctions,
	objectMatch,
	JSONData,
	Optional,
} from '../build/index.mjs';


patternFunctions.$odd = (value: JSONData, template: JSONData): Optional<JSONData> => {
	if (typeof template !== 'boolean') {
		throw Error('$odd template must be boolean');
	}
	if (typeof value !== 'number') {
		return undefined;
	}

	return (value % 2 === 1) === template ? template : undefined;
};

const tests = [

	{
		caption: 'Properties compare',
		result: objectMatch(
			{
				a: 5,
				b: 'X',
				c: false,
				d: ['1', { e1: 'test' }],
			},
			{
				a: 5,
			},
		),
	},
	{
		caption: '$eq/$is compare',
		result: objectMatch(
			{
				e: { e1: 4 },
				f: 5,
			},
			{
				e: { $eq: { e1: 4 } },
				f: { $is: 5 },
			},
		),
	},
	{
		caption: '$neq/$not compare',
		result: objectMatch(
			{
				g: { g1: 4 },
				h: 5,
			},
			{
				g: { $neq: { g1: 5 } },
				h: { $not: 4 },
			},
		),
	},
	{
		caption: '$gt/$gte/$lt/$lte compare',
		result: objectMatch(
			{
				i: { i1: 4 },
				j: 5,
				k: 5,
				l: 5,
			},
			{
				i: { i1: { $gt: 3 } },
				j: { $gte: 5 },
				k: { $lt: 6 },
				l: { $not: { $lte: 4 } },
			},
		),
	},

	{
		caption: '$in compare',
		result: objectMatch(
			{
				m: 1,
				n: [1],
				o: { o1: 1 },
				p: 1,
			},
			{
				m: { $in: [0, 1, 2] },
				n: { $in: [0, [1], 2] },
				o: { $in: [0, { o1: 1 }, 2] },
				p: { $not: { $in: [{ $lt: 0 }] } },
			},
		),
	},

	{
		caption: '$contains compare',
		result: objectMatch(
			{
				q: [0, 1, 2],
				r: [0, { o1: 1 }, 2],
			},
			{
				q: { $not: { $contains: 5 } },
				r: { $contains: { o1: 1 } },
			},
		),
	},

	{
		caption: '$subsetOf compare',
		result: objectMatch(
			{
				s: [0, 1, 2],
			},
			{
				s: { $subsetOf: [1, { $lt: 1 }, 2, 3, 'a'] },
			},
		),
	},

	{
		caption: '$supersetOf compare',
		result: objectMatch(
			{
				t: [0, 1, 2, 3, 'a'],
			},
			{
				t: { $supersetOf: [1, { $lt: 1 }, 2] },
			},
		),
	},

	{
		caption: '$size compare (array)',
		result: objectMatch(
			{
				u: [0, 1, 2, 3, 'a'],
				v: [0, 1, 2, 3, 'a'],
			},
			{
				u: { $size: 5 },
				v: { $size: { $not: { $gt: 6 } } },
			},
		),
	},

	{
		caption: '$intersection compare',
		result: objectMatch(
			{
				w: [0, 1, 2, 3, 'a'],
			},
			{
				w: { $intersection: [-1, { $lte: 0 }] },
			},
		),
	},

	{
		caption: '$size compare (object)',
		result: objectMatch(
			{
				x: { x1: 1, x2: 2 },
			},
			{
				x: { $size: 2, x1: 1 },
			},
		),
	},

	{
		caption: '$and compare',
		result: objectMatch(
			{
				y: 4,
			},
			{
				y: { $and: [{ $gt: 3 }, { $lt: 5 }] },
			},
		),
	},

	{
		caption: '$or compare',
		result: objectMatch(
			{
				z: 4,
			},
			{
				z: { $or: [{ $gt: 3 }, { $lt: 4 }] },
			},
		),
	},
	{
		caption: '$none compare',
		result: objectMatch(
			{
				A: 4,
			},
			{
				A: { $none: [{ $gt: 4 }, { $lt: 4 }] },
			},
		),
	},

	{
		caption: '$hasKey',
		result: objectMatch(
			{
				B: ['1', '2', 3, 7],
				C: {
					C1: 'f',
				},
			},
			{
				// a: { $exists: true },
				$hasKey: 'B',
				$not: { $hasKey: 'D' },
				C: {
					$hasKey: 'C1',
					$not: { $hasKey: 'C2' },
				},
			},
		),
	},

	{
		caption: '$odd',
		result: objectMatch(
			{
				Z: ['1', '2', 3, 7],
			},
			{
				Z: { $contains: { $odd: true } },
			},
		),
	},

	{
		caption: 'Complex compare',
		result: objectMatch(
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
		),
	},

] as any[];

/*
		caption: '$hasKey',
		result: objectMatch(
			{
				B: ['1', '2', 3, 7],
				C: {
					C1: 'f',
				},
			},
			{
				// a: { $exists: true },
				$hasKey: 'B',
				$not: { $hasKey: 'D' },
				C: {
					$hasKey: 'C1',
					$not: { $hasKey: 'C2' },
				},
			},
		),
	},
*/

const ok: any[] = [];
const nok: any[] = [];
tests.forEach((test) => {
	if (test.result) {
		ok.push(test);
	} else {
		nok.push(test);
	}
});

console.log(`Total tests: ${tests.length}`);
console.log(`Correct tests: ${ok.length}`);
console.log(`Incorrect test: ${nok.length}`);
nok.forEach((test) => {
	console.error(`\t ${test.caption}`);
});

