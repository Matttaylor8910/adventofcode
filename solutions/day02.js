// --- Day 2: Inventory Management System ---
// You stop falling through time, catch your breath, and check the screen on the device. "Destination reached. Current Year: 1518. Current Location: North Pole Utility Closet 83N10." You made it! Now, to find those anomalies.

// Outside the utility closet, you hear footsteps and a voice. "...I'm not sure either. But now that so many people have chimneys, maybe he could sneak in that way?" Another voice responds, "Actually, we've been working on a new kind of suit that would let him fit through tight spaces like that. But, I heard that a few days ago, they lost the prototype fabric, the design plans, everything! Nobody on the team can even seem to remember important details of the project!"

// "Wouldn't they have had enough fabric to fill several boxes in the warehouse? They'd be stored together, so the box IDs should be similar. Too bad it would take forever to search the warehouse for two similar box IDs..." They walk too far away to hear any more.

// Late at night, you sneak to the warehouse - who knows what kinds of paradoxes you could cause if you were discovered - and use your fancy wrist device to quickly scan every box and produce a list of the likely candidates (your puzzle input).

// To make sure you didn't miss any, you scan the likely candidate boxes again, counting the number that have an ID containing exactly two of any letter and then separately counting those with exactly three of any letter. You can multiply those two counts together to get a rudimentary checksum and compare it to what your device predicts.

// For example, if you see the following box IDs:

// abcdef contains no letters that appear exactly two or three times.
// bababc contains two a and three b, so it counts for both.
// abbcde contains two b, but no letter appears exactly three times.
// abcccd contains three c, but no letter appears exactly two times.
// aabcdd contains two a and two d, but it only counts once.
// abcdee contains two e.
// ababab contains three a and three b, but it only counts once.
// Of these box IDs, four of them contain a letter which appears exactly twice, and three of them contain a letter which appears exactly three times. Multiplying these together produces a checksum of 4 * 3 = 12.

// What is the checksum for your list of box IDs?

// --- Part Two ---
// You notice that the device repeats the same frequency change list over and over. To calibrate the device, you need to find the first frequency it reaches twice.

// For example, using the same list of changes above, the device would loop as follows:

// Current frequency  0, change of +1; resulting frequency  1.
// Current frequency  1, change of -2; resulting frequency -1.
// Current frequency -1, change of +3; resulting frequency  2.
// Current frequency  2, change of +1; resulting frequency  3.
// (At this point, the device continues from the start of the list.)
// Current frequency  3, change of +1; resulting frequency  4.
// Current frequency  4, change of -2; resulting frequency  2, which has already been seen.
// In this example, the first frequency reached twice is 2. Note that your device might need to repeat its list of frequency changes many times before a duplicate frequency is found, and that duplicates might be found while in the middle of processing the list.

// Here are other examples:

// +1, -1 first reaches 0 twice.
// +3, +3, +4, -2, -4 first reaches 10 twice.
// -6, +3, +8, +5, -6 first reaches 5 twice.
// +7, +7, -2, -7, -4 first reaches 14 twice.
// What is the first frequency your device reaches twice?

var fs = require('fs');
var _ = require('lodash');

/**
 * Iterate through the ids converting them into a hash that looks like the following:
 * { '1': 20, '2': 3 }
 * Where the key is the times the letter was repeated and the value is the number of 
 * letters in the id that were repeated for that key
 * In this example, we could increment twos just once, and not touch threes
 * The answer is multiplying these two values
 */
function part1(ids) {
    let twos = 0, threes = 0;
    _.each(ids, id => {
        var hash = _(id.split('')).groupBy().countBy('length').value();
        twos += hash['2'] ? 1 : 0;
        threes += hash['3'] ? 1 : 0;
    });
    return twos * threes;
}

/**
 * Compare each id to one another and then compare the characters within the strings
 * If there is only one difference, return that id omiting the difference
 */
function part2(ids) {
    for (let i = 0; i < ids.length; i++) {
        for (let j = 0; j < ids.length; j++) {
            let differences = 0;
            let idx = null;
            for (let n = 0; n < ids[i].length; n++) {
                differences += ids[i][n] === ids[j][n] ? 0 : 1;
                idx = differences === 1 && idx === null ? n : idx;
            }
            if (differences === 1) {
                return _.without(ids[i].split(''), ids[i][idx]).join('');
            }
        }
    }
}

function parseInput() {
    return fs.readFileSync('input/day02.txt', 'utf8').split('\n');
}

let input = parseInput();
console.log(part1(input));
console.log(part2(input));