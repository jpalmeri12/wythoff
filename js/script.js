var strat = {};

var menuPiles = 2;
var menuLimit = 10;

var MIN_PILES = 2;
var MAX_PILES = 4;
var MIN_LIMIT = 10;
var MAX_LIMIT = 30;

var gameState = {
    "piles": 0,
    "limit": 0,
    "position": [],
    "startPosition": [],
    "moveNum": 0,
    "canMove": false,
    "canSubmit": false
}

var colors = [{
    "name": "blue",
    "code": "#3d50a2"
}, {
    "name": "green",
    "code": "#3faa59"
}, {
    "name": "red",
    "code": "#f94343"
}, {
    "name": "orange",
    "code": "#ed9914"
}];

$(function () {
    initMenuButtons();
    initGameButtons();
    showScreen("menuScreen");
});

function initMenuButtons() {
    $("#selectPilesBox>.selectMinus").click(function () {
        if (menuPiles > MIN_PILES) {
            menuPiles--;
            updateMenuButtons();
        }
    });
    $("#selectPilesBox>.selectPlus").click(function () {
        if (menuPiles < MAX_PILES) {
            menuPiles++;
            updateMenuButtons();
        }
    });
    $("#selectLimitBox>.selectMinus").click(function () {
        if (menuLimit > MIN_LIMIT) {
            menuLimit -= 5;
            updateMenuButtons();
        }
    });
    $("#selectLimitBox>.selectPlus").click(function () {
        if (menuLimit < MAX_LIMIT) {
            menuLimit += 5;
            updateMenuButtons();
        }
    });
    $("#startButton").click(function () {
        loadGame();
    });
    updateMenuButtons();
}

function updateMenuButtons() {
    $("#selectPilesBox>.selectNumber").text(menuPiles);
    if (menuPiles > MIN_PILES) {
        $("#selectPilesBox>.selectMinus").css("opacity", 1);
    } else {
        $("#selectPilesBox>.selectMinus").css("opacity", .25);
    }
    if (menuPiles < MAX_PILES) {
        $("#selectPilesBox>.selectPlus").css("opacity", 1);
    } else {
        $("#selectPilesBox>.selectPlus").css("opacity", .25);
    }
    if (menuLimit > MIN_LIMIT) {
        $("#selectLimitBox>.selectMinus").css("opacity", 1);
    } else {
        $("#selectLimitBox>.selectMinus").css("opacity", .25);
    }
    if (menuLimit < MAX_LIMIT) {
        $("#selectLimitBox>.selectPlus").css("opacity", 1);
    } else {
        $("#selectLimitBox>.selectPlus").css("opacity", .25);
    }
    $("#selectLimitBox>.selectNumber").text(menuLimit);
}

function initGameButtons() {
    $("#moveBox>.selectMinus").click(function () {
        if (gameState.canMove) {
            gameState.moveNum--;
            updateMoveBox();
        }

    });
    $("#moveBox>.selectPlus").click(function () {
        if (gameState.canMove) {
            gameState.moveNum++;
            updateMoveBox();
        }
    });
    $("#resetMoveButton").click(function () {
        if (gameState.canMove) {
            resetMove();
        }
    });
    $("#submitMoveButton").click(function () {
        if (gameState.canMove && gameState.canSubmit) {
            submitMove();
        }
    });
    $("#orderButton1").click(function () {
        pickOrder(1);
    });
    $("#orderButton2").click(function () {
        pickOrder(2);
    });
    $("#endButton").click(function () {
        showScreen("menuScreen");
    });
}

function updateMoveBox() {
    var max = 99;
    var anySelected = false;
    for (var i = 0; i < gameState.position.length; i++) {
        if (gameState.selected[i]) {
            anySelected = true;
            max = Math.min(max, gameState.position[i]);
        }
    }
    gameState.moveNum = Math.max(0, Math.min(max, gameState.moveNum));
    $("#moveNumber").text(gameState.moveNum);
    if (gameState.moveNum > 0) {
        $("#moveBox>.selectMinus").css("opacity", 1);
    } else {
        $("#moveBox>.selectMinus").css("opacity", .25);
    }
    if (gameState.moveNum < max) {
        $("#moveBox>.selectPlus").css("opacity", 1);
    } else {
        $("#moveBox>.selectPlus").css("opacity", .25);
    }
    if (anySelected && gameState.moveNum > 0) {
        $("#submitMoveButton").css("opacity", 1);
        gameState.canSubmit = true;
    } else {
        $("#submitMoveButton").css("opacity", .25);
        gameState.canSubmit = false;
    }
    if (anySelected || gameState.moveNum > 0) {
        $("#resetMoveButton").css("opacity", 1);
    } else {
        $("#resetMoveButton").css("opacity", .25);
    }
    updatePiles();
}

function showScreen(scr) {
    $(".screenBox.anim_fadeIn").removeClass("anim_fadeIn").addClass("anim_fadeOut");
    setTimeout(function () {
        $("#" + scr).removeClass("anim_fadeOut").addClass("anim_fadeIn");
    }, 250);
}

function pickOrder(order) {
    if (order == 1) {
        // You go first
        $("#moveText").text("You decided to go first.");
        gameState.canMove = true;
    } else if (order == 2) {
        // You go second
        $("#moveText").text("You decided to go second.");
        setTimeout(function () {
            makeAIMove();
        }, 1000);
    }
    $("#turnOrderControls").removeClass("anim_fadeIn").addClass("anim_fadeOut");
    setTimeout(function () {
        $("#moveControls").removeClass("anim_fadeOut").addClass("anim_fadeIn");
    }, 250);
}

function resetMove() {
    gameState.moveNum = 0;
    gameState.selected = [];
    for (var i = 0; i < gameState.piles; i++) {
        gameState.selected.push(false);
    }
    updateMoveBox();
}

function submitMove() {
    gameState.canMove = false;
    $("#moveControls").removeClass("anim_fadeIn").addClass("anim_fadeOut");
    var numSelected = 0;
    var colorsTaken = "";
    for (var i = 0; i < gameState.selected.length; i++) {
        if (gameState.selected[i]) {
            gameState.position[i] -= gameState.moveNum;
            numSelected++;
            colorsTaken += (colorsTaken == "" ? "" : "/") + colors[i].name;
        }
    }
    var moveText = "You took " + gameState.moveNum + " " + colorsTaken + " counter" + (gameState.moveNum == 1 ? "" : "s") + ".";
    $("#moveText").text(moveText);
    resetMove();
    updateMoveBox();
    var win = checkWin();
    if (win) {
        setTimeout(function () {
            endGame(true);
        }, 1000);
    } else {
        setTimeout(function () {
            makeAIMove();
        }, 1000);
    }
}

function checkWin() {
    for (var i = 0; i < gameState.position.length; i++) {
        if (gameState.position[i] != 0) {
            return false;
        }
    }
    return true;
}

function makeAIMove() {
    // 2 piles
    var newPos = [];
    if (gameState.piles == 2) {
        // Try subtracting from both
        var diff = Math.abs(gameState.position[0] - gameState.position[1]);
        var sortPos = gameState.position.slice(0).sort(function (a, b) {
            return a - b;
        });
        var canReduceBoth = false;
        var testPos = [];
        var isLosing = false;
        var hasDiff = false;
        // Check if in a losing position, or if it has a difference already in the set of losing positions.
        for (var i = 0; i < strat.pos.length; i++) {
            if (strat.pos[i][0] == sortPos[0] && strat.pos[i][1] == sortPos[1]) {
                isLosing = true;
            } else if (Math.abs(strat.pos[i][0] - strat.pos[i][1]) == diff) {
                hasDiff = true;
            }
        }
        if (isLosing) {
            // In a losing position. Do something random.
            if (Math.random() < .5 && gameState.position[0] > 0) {
                newPos[0] = gameState.position[0] - 1;
                newPos[1] = gameState.position[1];
            } else {
                newPos[0] = gameState.position[0];
                newPos[1] = gameState.position[1] - 1;
            }
        } else if (hasDiff) {
            var testPos = strat.pos[diff];
            if (sortPos[0] > testPos[0] && sortPos[1] > testPos[1]) {
                canReduceBoth = true;
            }
        }
        if (!isLosing && canReduceBoth) {
            // Can reduce to a losing position. Do that.
            var toReduce = sortPos[0] - testPos[0];
            newPos[0] = gameState.position[0] - toReduce;
            newPos[1] = gameState.position[1] - toReduce;
        } else if (!isLosing) {
            // Can't subtract from both piles but is in a winning position. Subtract from one pile.
            var flip = false;
            if (gameState.position[0] > gameState.position[1]) {
                flip = true;
            }
            var min = Math.min(gameState.position[0], gameState.position[1]);
            var losingPos = [];
            var minFirst = true;
            for (var i = 0; i < strat.pos.length; i++) {
                if (strat.pos[i][0] == min) {
                    losingPos = strat.pos[i].slice(0);
                    minFirst = true;
                }
                if (strat.pos[i][1] == min) {
                    losingPos = strat.pos[i].slice(0);
                    minFirst = false;
                }
            }
            if (flip == minFirst) {
                newPos[0] = losingPos[1];
                newPos[1] = losingPos[0];
            } else {
                newPos[0] = losingPos[0];
                newPos[1] = losingPos[1];
            }
        }
    } else if (gameState.piles >= 3) {
        // Sort position
        var thisPos = [];
        for (var i = 0; i < gameState.position.length; i++) {
            thisPos.push({
                i: i,
                p: gameState.position[i]
            });
        }
        thisPos.sort(function (a, b) {
            return a.p - b.p;
        });
        var sortedPos = [];
        for (var i = 0; i < thisPos.length; i++) {
            sortedPos.push(thisPos[i].p);
        }
        // Compute characteristic of the sorted position
        var char = getCharacteristic(sortedPos);
        var validMoves = [];
        // Iterate over characteristic to check for valid moves
        for (var i = 0; i < char.length; i++) {
            // Checking table i
            for (var j = 0; j < char[i].length; j++) {
                // Checking item j in table i
                var ch = char[i][j];
                // Find the position associated with this item
                var losingIndex = strat.table[i][ch];
                // If the index is not -1, then a losing position exists
                if (losingIndex != -1) {
                    var losingPos = strat.pos[losingIndex];
                    // Compare that position with the current position to see if it reduces or is equal to it
                    var canReduce = true;
                    var isEqual = true;
                    for (var k = 0; k < sortedPos.length; k++) {
                        if (sortedPos[k] < losingPos[k]) {
                            canReduce = false;
                        }
                        if (sortedPos[k] != losingPos[k]) {
                            isEqual = false;
                        }
                    }
                    if (canReduce && !isEqual) {
                        validMoves.push(losingPos);
                    }
                }
            }
        }
        // If there is at least one valid move, we are in a winning position. Pick a random move
        if (validMoves.length > 0) {
            var move = validMoves[Math.floor(Math.random() * validMoves.length)];
            // Find the correct permutation of the losing position that the current position reduces to
            var toReduceTo = getReductionPermutation(gameState.position, move);
            newPos = toReduceTo;
        }
        // If there are no valid moves, we are in a losing position. Do whatever
        else {
            newPos = takeFromRandom(gameState.position);
        }
    }
    var numSelected = 0;
    var numTaken = 0;
    var colorsTaken = "";
    for (var i = 0; i < gameState.position.length; i++) {
        if (newPos[i] != gameState.position[i]) {
            numSelected++;
            colorsTaken += (colorsTaken == "" ? "" : "/") + colors[i].name;
            numTaken = gameState.position[i] - newPos[i];
        }
    }
    var moveText = "I took " + numTaken + " " + colorsTaken + " counter" + (numTaken == 1 ? "" : "s") + ".";
    $("#moveText").text(moveText);
    gameState.position = newPos;
    var win = checkWin();
    if (win) {
        setTimeout(function () {
            endGame(false);
        }, 1000);
    } else {
        gameState.canMove = true;
        $("#moveControls").removeClass("anim_fadeOut").addClass("anim_fadeIn");
    }
    updateMoveBox();
}

function loadGame() {
    showScreen("loadingScreen");
    gameState.piles = menuPiles;
    gameState.limit = menuLimit;
    gameState.position = [];
    gameState.selected = [];
    gameState.moveNum = 0;
    gameState.canMove = false;
    for (var i = 0; i < gameState.piles; i++) {
        var x = i / gameState.piles * .5;
        gameState.position.push(Math.floor(1 + x * (menuLimit - 1) + (1 - x) * (menuLimit - 1) * Math.random()));
        gameState.selected.push(false);
    }
    gameState.startPosition = gameState.position.slice(0);
    $("#moveText").text("The game begins.");
    initPiles();
    updateMoveBox();
    setTimeout(function () {
        strat = getLosingPos(gameState.piles, gameState.limit);
        showScreen("gameScreen");
        setTimeout(function () {
            $("#turnOrderControls").removeClass("anim_fadeOut").addClass("anim_fadeIn");
        }, 500);
    }, 1000);
}

function initPiles() {
    var ax = [[0, 55], [0, 55, 27.5], [0, 55, 0, 55]];
    var ay = [[27.5, 27.5], [0, 0, 55], [0, 0, 55, 55]];
    $("#piles").empty();
    for (var i = 0; i < gameState.position.length; i++) {
        $("#piles").append('<div id="pile' + i + '" class="pile"><div class="pileSelected"></div><div class="pileBG"></div><div class="pileCounters"></div><div class="pileNum"></div></div>');
        $("#pile" + i).css({
            "left": ax[gameState.position.length - 2][i] + "%",
            "top": ay[gameState.position.length - 2][i] + "%"
        });
        // Make counters
        for (var j = 0; j < gameState.position[i]; j++) {
            $("#pile" + i + ">.pileCounters").append('<div class="counter counter' + j + '"></div>');
            var x = 10 + 50 * Math.random();
            var y = 10 + 50 * Math.random();
            $("#pile" + i + ">.pileCounters>.counter" + j).css({
                "left": x + "%",
                "top": y + "%"
            });
        }
        $("#pile" + i + ">.pileCounters>.counter").css("background-color", colors[i].code);
        initPileClick(i);
    }
}

function initPileClick(i) {
    $("#pile" + i).click(function () {
        pileClicked(i);
    });
}

function pileClicked(n) {
    if (gameState.position[n] > 0 && gameState.canMove) {
        gameState.selected[n] = !gameState.selected[n];
        updateMoveBox();
    }
}

function updatePiles() {
    for (var i = 0; i < gameState.position.length; i++) {
        $("#pile" + i + ">.pileNum").text(gameState.position[i]);
        if (gameState.selected[i]) {
            $("#pile" + i + ">.pileSelected").css("opacity", 1);
        } else {
            $("#pile" + i + ">.pileSelected").css("opacity", 0);
        }
        if (menuLimit > MIN_LIMIT) {
            $("#selectLimitBox>.selectMinus").css("opacity", 1);
        } else {
            $("#selectLimitBox>.selectMinus").css("opacity", .25);
        }
        if (menuLimit < MAX_LIMIT) {
            $("#selectLimitBox>.selectPlus").css("opacity", 1);
        } else {
            $("#selectLimitBox>.selectPlus").css("opacity", .25);
        }
        for (var j = gameState.position[i]; j < gameState.startPosition[i]; j++) {
            $("#pile" + i + ">.pileCounters>.counter" + j).addClass("anim_counterOut");
        }
    }
}

function endGame(isWin) {
    $("#endText").text(isWin ? "VICTORY" : "DEFEAT");
    $("#endSubtext").text(gameState.piles + " piles, " + gameState.limit + "-counter limit");
    showScreen("endScreen");
}

// Gets the losing positions for the given number of piles, up to a certain size for each pile.
function getLosingPos(piles, limit) {
    if (piles == 2) {
        return getLosingPos2(limit);
    } else {
        return getLosingPos3(piles, limit);
    }
}

// Uses fast algorithm to get the losing positions for the 2-pile game.
function getLosingPos2(limit) {
    var limitReached = false;
    var pos = [];
    pos.push([0, 0]);
    var used = [];
    var minUnused = 1;
    var row = 1;
    for (var i = 1; i <= limit; i++) {
        used[i] = false;
    }
    while (!limitReached) {
        // Check if position is within bounds
        if (minUnused + row <= limit) {
            // Add new position
            var newPos = [];
            newPos.push(minUnused);
            newPos.push(minUnused + row);
            pos.push(newPos);
            // Mark used numbers
            used[minUnused] = true;
            used[minUnused + row] = true;
            // Increment row
            row++;
            // Find new minimum
            while (used[minUnused]) {
                minUnused++;
            }
        } else {
            // Finished
            limitReached = true;
        }
    }
    return {
        "pos": pos
    };
}

// Gets the losing positions for 3 or more piles, up to the limit given.
function getLosingPos3(piles, limit) {
    var pos = [];
    // Generate W_n up to the limit.
    var toCheck = getWn(piles, limit);
    // Make check tables. There should be a total of n tables for n piles.
    var tables = [];
    for (var i = 0; i < piles; i++) {
        var table = [];
        var tuples = getWn(piles - 1 - i, limit);
        var diff = getNn(i, limit);
        var product;
        if (tuples.length == 0) {
            product = diff;
        } else if (diff.length == 0) {
            product = tuples;
        } else {
            product = cartesian(tuples, diff);
        }
        for (var j = 0; j < product.length; j++) {
            table[product[j]] = -1;
        }
        tables.push(table);
    }
    // For each position, check if it is a losing position or not.
    for (var i = 0; i < toCheck.length; i++) {
        // Get the characteristics of the position (i.e. the table keys for that position)
        var char = getCharacteristic(toCheck[i]);
        // Check each of the tables to see if any elements of the characteristic have already been taken.
        var isLosing = true;
        for (var j = 0; j < char.length; j++) {
            for (var k = 0; k < char[j].length; k++) {
                if (tables[j][char[j][k]] != -1) {
                    isLosing = false;
                }
            }
        }
        if (isLosing) {
            var numLosing = pos.length;
            // If the position is losing, then mark it
            for (var j = 0; j < char.length; j++) {
                for (var k = 0; k < char[j].length; k++) {
                    tables[j][char[j][k]] = numLosing;
                }
            }
            // Add position to list of losing positions
            pos.push(toCheck[i]);
        }
    }
    return {
        "pos": pos,
        "table": tables
    };
}

// Gets W_n up to a certain number.
function getWn(piles, limit) {
    if (piles == 0) {
        return [];
    }
    var pos = [];
    // Base case: 1 pile
    if (piles == 1) {
        for (var i = 0; i <= limit; i++) {
            pos.push([i]);
        }
    }
    // Otherwise: combine with W_n-1.
    else {
        for (var i = 0; i <= limit; i++) {
            var sub = getWn(piles - 1, i);
            for (var j = 0; j < sub.length; j++) {
                var newPos = sub[j].slice(0);
                newPos.push(i);
                pos.push(newPos);
            }
        }
    }
    return pos;
}

function getNn(piles, limit) {
    if (piles == 0) {
        return [];
    }
    var pos = [];
    // Base case: 1 pile
    if (piles == 1) {
        for (var i = 0; i <= limit; i++) {
            pos.push([i]);
        }
    }
    // Otherwise: combine with N_n-1.
    else {
        for (var i = 0; i <= limit; i++) {
            var sub = getNn(piles - 1, limit);
            for (var j = 0; j < sub.length; j++) {
                var newPos = sub[j].slice(0);
                newPos.push(i);
                pos.push(newPos);
            }
        }
    }
    return pos;
}

// Returns the cartesian product of two sets of arrays.
function cartesian(t1, t2) {
    var out = [];
    for (var i = 0; i < t1.length; i++) {
        for (var j = 0; j < t2.length; j++) {
            var el = t1[i].concat(t2[j]);
            out.push(el);
        }
    }
    return out;
}

// Returns the characteristic of a position.
function getCharacteristic(position) {
    var char = [];
    var piles = position.length;
    // Initialize empty arrays equal to piles in position, since piles in position = number of tables.
    for (var i = 0; i < piles; i++) {
        char.push([]);
    }
    // Iterate over all 2^n - 1 ways to reduce the position.
    for (var i = 1; i < Math.pow(2, piles); i++) {
        var choice = leftpad(i.toString(2), piles, "0");
        // Each 0 means "keep the pile as-is", and each 1 means "reduce the pile."
        var keep = [];
        var reduce = [];
        for (var j = 0; j < choice.length; j++) {
            if (choice.charAt(j) == "0") {
                keep.push(position[j]);
            } else {
                reduce.push(position[j]);
            }
        }
        // Compute consecutive differences between positions in reduce
        var consec = [];
        for (var j = 0; j < reduce.length - 1; j++) {
            consec.push(reduce[j + 1] - reduce[j]);
        }
        // Add to the correct char element the concatenation of keep and consec
        char[consec.length].push(keep.concat(consec));
    }
    return char;
}

// Gets the permutation of "to" that "from" can reduce to.
function getReductionPermutation(from, to) {
    // Get permutations of to
    var perms = permutator(to);
    // Iterate over all permutations; see if they can reduce
    for (var i = 0; i < perms.length; i++) {
        var perm = perms[i];
        if (canDirectlyReduce(from, perm)) {
            return perm;
        }
    }
    return null;
}

// Returns true if you can take the same number from some piles in "from" to get "to", retaining order. False otherwise.
function canDirectlyReduce(from, to) {
    var amount = -1;
    for (var i = 0; i < from.length; i++) {
        var a = from[i] - to[i];
        if (a < 0) return false;
        if (a > 0) {
            if (amount == -1) {
                amount = a;
            } else if (a != amount) {
                return false;
            }
        }
    }
    return true;
}

function takeFromRandom(pos) {
    var indices = [];
    var newPos = pos.slice(0);
    for (var i = 0; i < pos.length; i++) {
        indices.push(i);
    }
    indices = shuffle(indices);
    for (var i=0; i<indices.length; i++) {
        if (newPos[indices[i]] > 0) {
            newPos[indices[i]]--;
            return newPos;
        }
    }
    return null;
}

// Returns the permutations of an array.
function permutator(inputArr) {
    var results = [];

    function permute(arr, memo) {
        var cur, memo = memo || [];
        for (var i = 0; i < arr.length; i++) {
            cur = arr.splice(i, 1);
            if (arr.length === 0) {
                results.push(memo.concat(cur));
            }
            permute(arr.slice(), memo.concat(cur));
            arr.splice(i, 0, cur[0]);
        }
        return results;
    }
    return permute(inputArr);
}

// Prints an array's elements to the console.
function printArray(arr) {
    for (var i = 0; i < arr.length; i++) {
        console.log(arr[i]);
    }
}

// Leftpads a string with a character.
function leftpad(str, len, ch) {
    str = String(str);
    var i = -1;
    if (!ch && ch !== 0) ch = ' ';
    len = len - str.length;
    while (++i < len) {
        str = ch + str;
    }
    return str;
}

// Shuffles an array.
function shuffle(array) {
    var m = array.length,
        t, i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
}