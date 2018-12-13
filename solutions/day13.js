// --- Day 13: Mine Cart Madness ---
// A crop of this size requires significant logistics to transport produce, soil, fertilizer, and so on. The Elves are very busy pushing things around in carts on some kind of rudimentary system of tracks they've come up with.

// Seeing as how cart-and-track systems don't appear in recorded history for another 1000 years, the Elves seem to be making this up as they go along. They haven't even figured out how to avoid collisions yet.

// You map out the tracks (your puzzle input) and see where you can help.

// Tracks consist of straight paths (| and -), curves (/ and \), and intersections (+). Curves connect exactly two perpendicular pieces of track; for example, this is a closed loop:

// /----\
// |    |
// |    |
// \----/
// Intersections occur when two perpendicular paths cross. At an intersection, a cart is capable of turning left, turning right, or continuing straight. Here are two loops connected by two intersections:

// /-----\
// |     |
// |  /--+--\
// |  |  |  |
// \--+--/  |
//    |     |
//    \-----/
// Several carts are also on the tracks. Carts always face either up (^), down (v), left (<), or right (>). (On your initial map, the track under each cart is a straight path matching the direction the cart is facing.)

// Each time a cart has the option to turn (by arriving at any intersection), it turns left the first time, goes straight the second time, turns right the third time, and then repeats those directions starting again with left the fourth time, straight the fifth time, and so on. This process is independent of the particular intersection at which the cart has arrived - that is, the cart has no per-intersection memory.

// Carts all move at the same speed; they take turns moving a single step at a time. They do this based on their current location: carts on the top row move first (acting from left to right), then carts on the second row move (again from left to right), then carts on the third row, and so on. Once each cart has moved one step, the process repeats; each of these loops is called a tick.

// For example, suppose there are two carts on a straight track:

// |  |  |  |  |
// v  |  |  |  |
// |  v  v  |  |
// |  |  |  v  X
// |  |  ^  ^  |
// ^  ^  |  |  |
// |  |  |  |  |
// First, the top cart moves. It is facing down (v), so it moves down one square. Second, the bottom cart moves. It is facing up (^), so it moves up one square. Because all carts have moved, the first tick ends. Then, the process repeats, starting with the first cart. The first cart moves down, then the second cart moves up - right into the first cart, colliding with it! (The location of the crash is marked with an X.) This ends the second and last tick.

// Here is a longer example:

// /->-\        
// |   |  /----\
// | /-+--+-\  |
// | | |  | v  |
// \-+-/  \-+--/
//   \------/   

// /-->\        
// |   |  /----\
// | /-+--+-\  |
// | | |  | |  |
// \-+-/  \->--/
//   \------/   

// /---v        
// |   |  /----\
// | /-+--+-\  |
// | | |  | |  |
// \-+-/  \-+>-/
//   \------/   

// /---\        
// |   v  /----\
// | /-+--+-\  |
// | | |  | |  |
// \-+-/  \-+->/
//   \------/   

// /---\        
// |   |  /----\
// | /->--+-\  |
// | | |  | |  |
// \-+-/  \-+--^
//   \------/   

// /---\        
// |   |  /----\
// | /-+>-+-\  |
// | | |  | |  ^
// \-+-/  \-+--/
//   \------/   

// /---\        
// |   |  /----\
// | /-+->+-\  ^
// | | |  | |  |
// \-+-/  \-+--/
//   \------/   

// /---\        
// |   |  /----<
// | /-+-->-\  |
// | | |  | |  |
// \-+-/  \-+--/
//   \------/   

// /---\        
// |   |  /---<\
// | /-+--+>\  |
// | | |  | |  |
// \-+-/  \-+--/
//   \------/   

// /---\        
// |   |  /--<-\
// | /-+--+-v  |
// | | |  | |  |
// \-+-/  \-+--/
//   \------/   

// /---\        
// |   |  /-<--\
// | /-+--+-\  |
// | | |  | v  |
// \-+-/  \-+--/
//   \------/   

// /---\        
// |   |  /<---\
// | /-+--+-\  |
// | | |  | |  |
// \-+-/  \-<--/
//   \------/   

// /---\        
// |   |  v----\
// | /-+--+-\  |
// | | |  | |  |
// \-+-/  \<+--/
//   \------/   

// /---\        
// |   |  /----\
// | /-+--v-\  |
// | | |  | |  |
// \-+-/  ^-+--/
//   \------/   

// /---\        
// |   |  /----\
// | /-+--+-\  |
// | | |  X |  |
// \-+-/  \-+--/
//   \------/   
// After following their respective paths for a while, the carts eventually crash. To help prevent crashes, you'd like to know the location of the first crash. Locations are given in X,Y coordinates, where the furthest left column is X=0 and the furthest top row is Y=0:

//            111
//  0123456789012
// 0/---\        
// 1|   |  /----\
// 2| /-+--+-\  |
// 3| | |  X |  |
// 4\-+-/  \-+--/
// 5  \------/   
// In this example, the location of the first crash is 7,3.

var fs = require('fs');
var _ = require('lodash');

/**
 * Given the parsed paths and list of carts, move them one space at a time from 
 * top left to bottom right and return the position of a crash when one happens
 */
function part1(paths, carts) {
    while (true) {
        // sort the carts by row & col so we move them in the right order
        carts = _.sortBy(carts, ['row', 'col']);
        
        for (let i = 0; i < carts.length; i++) {
            moveCart(carts[i], paths);
            if (anyCollision(carts)) {
                return formatPosition(carts[i]);
            }
        }
    }
}

function part2(paths, carts) {
    // TODO
}

/**
 * Move a given cart one space in the direction it needs to go
 */
function moveCart(cart, paths) {
    let current = _.clone(cart);
    let track = paths[current.row][current.col];

    // update the cart's position, direction, and intersection if need be
    cart.direction = getNewDirection(current, track);
    cart.intersections += track === '+' ? 1 : 0;
    cart.row = current.row + (cart.direction === '^' ? -1 : cart.direction === 'v' ? 1 : 0);
    cart.col = current.col + (cart.direction === '<' ? -1 : cart.direction === '>' ? 1 : 0);
}

/**
 * Determine the new direction for the cart given the cart and the next track piece (n)
 */
function getNewDirection(current, n) {
    switch (current.direction) {
        case '<':
            return n === '-' ? '<' : n === '/' ? 'v' : n === '\\' ? '^' : getIntersectionDirection(current);
        case '^':
            return n === '|' ? '^' : n === '/' ? '>' : n === '\\' ? '<' : getIntersectionDirection(current);
        case '>':
            return n === '-' ? '>' : n === '/' ? '^' : n === '\\' ? 'v' : getIntersectionDirection(current);
        case 'v':
            return n === '|' ? 'v' : n === '/' ? '<' : n === '\\' ? '>' : getIntersectionDirection(current);
    }
}

/**
 * It turns left the first time, goes straight the second time, turns right the third time
 */
function getIntersectionDirection(current) {
    let i = current.intersections % 3;
    switch (current.direction) {
        case '<':
            return i === 0 ? 'v' : i === 1 ? '<' : '^';
        case '^':
            return i === 0 ? '<' : i === 1 ? '^' : '>';
        case '>':
            return i === 0 ? '^' : i === 1 ? '>' : 'v';
        case 'v':
            return i === 0 ? '>' : i === 1 ? 'v' : '<';
        default:
            throw 'ERROR!!';
    }
}

/**
 * Determine if any of the carts share a position (collided)
 */
function anyCollision(carts) {
    return _(carts)
        .map(c => c.row + ',' + c.col)
        .uniq()
        .value()
        .length < carts.length;
}

/**
 * Return the cart's position as an x,y coordinate (col,row)
 */
function formatPosition(cart) {
    return cart.col + ',' + cart.row;
}

/**
 * Parse the input file into a map of the path/characters
 */
function parseInput(file) {
    let lines = fs.readFileSync(file, 'utf8')
        .split('\n');

    let paths = [];

    _.each(lines, (line, row) => {
        paths[row] = [];
        for (let col = 0; col < line.length; col++) {
            // add each character to the paths
            paths[row][col] = line[col];
        }
    });

    return paths;
}

/**
 * Get the list of carts given the original path map
 */
function getCarts(paths) {
    let carts = [];
    for (let row = 0; row < paths.length; row++) {
        for (let col = 0; col < paths[row].length; col++) {
            let char = paths[row][col];
            if (charIsCart(char)) {
                paths[row][col] = getReplacement(char);
                carts.push(newCart(char, row, col, carts.length));
            }
        }
    }
    return carts;
}

/**
 * Determine if a given character is a cart
 */
function charIsCart(char) {
    return ['<', '^', '>', 'v'].includes(char);
}

/**
 * Get the straight character ('-' or '|') that will replace a 
 * cart character within the paths map
 */
function getReplacement(char) {
    switch (char) {
        case '<':
        case '>':
            return '-';
        case '^':
        case 'v':
            return '|';
        default:
            throw 'ERROR! Unknown cart character: ' + char;
    }
}

/**
 * Return a new cart with it's direction, position, and id
 */
function newCart(char, row, col, id) {
    return {
        direction: char,
        intersections: 0,
        row: parseInt(row),
        col: parseInt(col),
        id: id
    };
}

// parse input and output answers
var paths = parseInput('input/day13.txt'); // 0.18s day13_jace, 0.185 day13
var carts = getCarts(paths);
console.log(part1(paths, carts));
console.log(part2(paths, carts));