// --- Day 3: No Matter How You Slice It ---
// The Elves managed to locate the chimney-squeeze prototype fabric for Santa's suit (thanks to someone who helpfully wrote its box IDs on the wall of the warehouse in the middle of the night). Unfortunately, anomalies are still affecting them - nobody can even agree on how to cut the fabric.

// The whole piece of fabric they're working on is a very large square - at least 1000 inches on each side.

// Each Elf has made a claim about which area of fabric would be ideal for Santa's suit. All claims have an ID and consist of a single rectangle with edges parallel to the edges of the fabric. Each claim's rectangle is defined as follows:

// The number of inches between the left edge of the fabric and the left edge of the rectangle.
// The number of inches between the top edge of the fabric and the top edge of the rectangle.
// The width of the rectangle in inches.
// The height of the rectangle in inches.
// A claim like #123 @ 3,2: 5x4 means that claim ID 123 specifies a rectangle 3 inches from the left edge, 2 inches from the top edge, 5 inches wide, and 4 inches tall. Visually, it claims the square inches of fabric represented by # (and ignores the square inches of fabric represented by .) in the diagram below:

// ...........
// ...........
// ...#####...
// ...#####...
// ...#####...
// ...#####...
// ...........
// ...........
// ...........
// The problem is that many of the claims overlap, causing two or more claims to cover part of the same areas. For example, consider the following claims:

// #1 @ 1,3: 4x4
// #2 @ 3,1: 4x4
// #3 @ 5,5: 2x2
// Visually, these claim the following areas:

// ........
// ...2222.
// ...2222.
// .11XX22.
// .11XX22.
// .111133.
// .111133.
// ........
// The four square inches marked with X are claimed by both 1 and 2. (Claim 3, while adjacent to the others, does not overlap either of them.)

// If the Elves all proceed with their own plans, none of them will have enough fabric. How many square inches of fabric are within two or more claims?

// --- Part Two ---
// Amidst the chaos, you notice that exactly one claim doesn't overlap by even a single square inch of fabric with any other claim. If you can somehow draw attention to it, maybe the Elves will be able to make Santa's suit after all!

// For example, in the claims above, only claim 3 is intact after all claims are made.

// What is the ID of the only claim that doesn't overlap?

var fs = require('fs');
var _ = require('lodash');

/**
 * Iterate through each of the claims coordinates and add them to a set
 * If the coordinate you're planning to add already exists, instead add
 * it to an overlaps array
 * Return the length of unique items in the overlap array
 */
function part1(claims) {
    let coordinates = new Set();
    let overlap = [];
    _.each(claims, claim => {
        for (let x = claim.x; x < claim.x + claim.w; x++) {
            for (let y = claim.y; y < claim.y + claim.h; y++) {
                let coordinate = [x,y].join(',');
                if (coordinates.has(coordinate)) {
                    overlap.push(coordinate);
                } else {
                    coordinates.add(coordinate);
                }
            }
        }
    });
    return _.uniq(overlap).length;
}

/**
 * Compare each of the claims to one another and if any of them do not 
 * overlap any other claim, return the id of that claim
 */
function part2(claims) {
    for (let i = 0; i < claims.length; i++) {
        let overlap = false;
        for (let j = 0; j < claims.length; j++) {
            if (i === j) continue;

            if (hasOverlap(claims[i], claims[j])) {
                overlap = true;
                break;
            }
        }
        if (!overlap) {
            return 'No overlap: ' + claims[i].id;
        }
    }

    return 'Everything overlaps';
}

/**
 * Determine if two claims will overlap
 */
function hasOverlap(a, b) {
    return (a.x <= b.r &&
        b.x <= a.r &&
        a.y <= b.b &&
        b.y <= a.b)
}

/**
 * Convert each line in the file into a claim POJO
 */
function parseInput() {
    return _.map(fs.readFileSync('input/day03.txt', 'utf8').split('\n'), claim => {
        let c = {
            id: parseInt(claim.split('#')[1].split(' ')[0]),
            x: parseInt(claim.split('@ ')[1].split(',')[0]),
            y: parseInt(claim.split(',')[1].split(':')[0]),
            w: parseInt(claim.split(': ')[1].split('x')[0]),
            h: parseInt(claim.split('x')[1])
        };

        return _.extend(c, {
            r: c.x + c.w,
            b: c.y + c.h
        });
    });
}

let input = parseInput();
// console.log(part1(input));
console.log(part2(input));