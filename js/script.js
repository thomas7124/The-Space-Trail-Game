var gameStartSong = new Audio('audio/music.wav');
var gameWinSong = new Audio('audio/win.wav');
gameStartSong.play();

var game = {
  totalDays: 0,
  daysLeft: 50,
  imgArray: ["url(img/trail.jpg)", "url(img/trail2.jpg)", "url(img/trail3.jpg)"],
  imgArrayIndex: 0
};

var spaceship = {
  party: [],
  food: 200,
  medicine: 5
}

var checkpoints = ["The ISS", "Saturn", "Mars", "Neptune"];

function Character(name) {
  this.name = name;
  this.health = 100;
  this.diseases = 0;
}

Character.prototype.healthGain = function() {
  var amount = rollNumber(5, 26);
  this.health += amount;
  if (this.health > 125) {
    this.health = 125;
  }
}

Character.prototype.healthLoss = function() { //daily health loss
  var starvingModifier = 1;
  var diseasedModifier = this.diseases * 2;
  if (spaceship.food <= 0) {
    starvingModifier = 3;
  }

  this.health -= (3 + diseasedModifier) * starvingModifier;
}

Character.prototype.deathCheck = function(i) {
  if(this.health<=0) {
    return true;
  }
}

function foodLoss() {
  spaceship.food -= 2 * spaceship.party.length;
  if (spaceship.food <= 0) {
    spaceship.food = 0;
    console.log("Out of food!");
  }
}

function checkDeath() {

  var deathString = "";

  for(var i = 0; i < spaceship.party.length; i++) {
    if(spaceship.party[i].deathCheck(i)) {
      deathString += spaceship.party[i].name + " has died. ";
      spaceship.party.splice(i, 1);
      $(".rest").hide();
      $(".mourn").show();
      $(".mourn").css("display", "inline-block");
      if (spaceship.party.length <= 0) {
        $("#randomEventMessage, #checkPoint").empty();
        $("#gameScreen").hide();
        gameWinSong.play();
        $("#event").html("Everyone in your party has died. The game is over.");
        $(".imgHeader").css("background-image", "url(img/endGameLoser.jpg)");
        $(".restartGame").show();

        return;
      }
      i--;
    }
  }

  if (deathString) {
    deathString += "Bummer.";
    $("#event").html(deathString);
    $(".imgHeader").css("background-image", "url(img/deathScreenHeader.jpg)");
  }
}

function fates(roll, rivOrTrail) {
  var charIndex = rollNumber(0,spaceship.party.length);
  var more = "";
  $("#event").html("Though the journey may be rough, you have continued on your trip in space.");

  if (rivOrTrail === "trail") {
    if (roll <= 10) {
      if (spaceship.party[charIndex].diseases > 0) {
        more = "nother";
      }
      var diseaseNames = ["Covid20", "Depression", "SpaceAids", "SpaceCancer", "SpaceRadiation", "Covid21"];
      var diseaseIndex = rollNumber(0, diseaseNames.length);
      $("#randomEventMessage").text(spaceship.party[charIndex].name+" contracted " + diseaseNames[diseaseIndex] + "!");
      spaceship.party[charIndex].diseases += 1;
    } else if (roll<=14) {
      $("#randomEventMessage").text(spaceship.party[charIndex].name + " Your rocket's engine broke down while running from aliens.");
      spaceship.party[charIndex].health -= 50;
    } else if (roll<=18 && spaceship.food > 0){
      $("#randomEventMessage").text("Everyone shunned " + spaceship.party[charIndex].name+" after dropping a plate of food!");
      spaceship.food -= 50;
    } else if (roll<=21){
      $("#randomEventMessage").text("There was an alien " +  spaceship.party[charIndex].name + "'s suit. " + spaceship.party[charIndex].name + " contracted a disease.");
      spaceship.party[charIndex].diseases += 1;
    } else if (roll >= 98) {
      spaceship.food += 50;
      $("#randomEventMessage").text("Your spaceship came across a space McDonalds.");
    } else if (roll >= 95) {
      spaceship.medicine += 1;
      $("#randomEventMessage").text("A generous, traveling alien has gifted you 1 medicine.");
    } else if (roll >= 92) {
      spaceship.party.forEach(function (element) {
        element.healthGain();
      });
      $("#randomEventMessage").text("You found a comfy planet resort. Your party feels more rested.");
    } else {
      $("#event").html("You have traveled a day and are one  step closer to Pluto.");
    }
  } else if (rivOrTrail === "river") {
    if (roll <= 10) {
      spaceship.party[charIndex].health = 0;
      $("#randomEventMessage").text(spaceship.party[charIndex].name + " has died.");
    } else if (roll <= 17) {
      var amount = rollNumber(10, 31);
      spaceship.food -= amount;
      $("#randomEventMessage").text("The astriod field was rough and " + spaceship.party[charIndex].name + " dropped " + amount + " food in the astroid field.");
    } else if (roll <= 25) {
      spaceship.party[charIndex].diseases += 1;
      $("#randomEventMessage").text(spaceship.party[charIndex].name + "  contracted a spooky disease from space.");
    } else if (roll <= 36 && spaceship.party.medicine > 0) {
      var amount = rollNumber(1, (spaceship.party.medicine + 1));
      spaceship.party.medicine -= amount;
      $("#randomEventMessage").text(spaceship.party[charIndex].name + " dropped " + amount + " medicines. Everyone seems pretty upset.")
    } else if (roll <= 50) {
      var amount = rollNumber(5, 16);
      spaceship.party.forEach(function(element) {
        element.health -= amount;
      });
      $("#randomEventMessage").text("We hit an astriod! Everyone loses " + amount + " health.");
    } else {
      $("#event").text("Your party successfully crossed the astriod belt. Onward to Pluto.")
      return;
    }
  } else {
    console.log("ERRORRR");
    return;
  }
}

function rollNumber(min, max) {
  min = Math.ceil(min);  //inclusive
  max = Math.floor(max); //exclusive
  return Math.floor(Math.random() * (max - min)) + min;
}

function talk() {
  var talkRoll = rollNumber(0, 4);
  if(talkRoll === 0) {
    $("#event").text("Yuhhh wussgood. My name is X AE A-XII Musk, I'm the Space Engineer. It's a pleasure making your aquaintance.");
  }else if(talkRoll === 1) {
    $("#event").text("Hi! My name is Elon Musk, I'm the space emperor in these here parts. It's a pleasure making your aquaintance.");
  }else if(talkRoll === 2) {
    $("#event").text("GIMME YO LOOT.");
  }else if(talkRoll === 3) {
    $("#event").text("Pardon me, do y'all have any spare change?");
  }else {
    console.log("talk function error");
  }
}

function gameChecker() {
  if (game.daysLeft === 0) {  // GAME OVER WIN
    $("#randomEventMessage, #checkPoint, #event").empty();
    var left = spaceship.party.length;
    $("#checkPoint").html("WINNER! WINNER! CHICKEN DINNER! YOU MADE IT TO PLUTO! Only " + left + " of your party has survived.");
    $(".imgHeader").css("background-image", "url(img/endGameWin.jpg)");
    $(".restartGame").show();
    $(".continueOnTrail, .rest, .mourn, .hunt, .talk, .heal").hide();
    gameWinSong.play();
  } else if (game.daysLeft === 40) { // 40 days from end (and multiples of 20)...fort
    $("#randomEventMessage, #checkPoint").empty();
    $("#checkPoint").html("Welcome. You've reached " + checkpoints[0] + "!");
    $(".imgHeader").css("background-image", "url(img/fortlaramie.png)");
    checkpoints.shift();
    $(".hunt").hide();
    $(".talk").show();
    $(".talk").css("display", "inline-block");
  } else if (game.daysLeft === 30) { // 30 days from end (and multiples of 20)...river
    $("#randomEventMessage, #checkPoint").empty();
    $("#checkPoint").html("You've reached " + checkpoints[0] + "! Proceed with caution.");
    $(".imgHeader").css("background-image", "url(img/blueriver.png)");
    checkpoints.shift();
    $(".hunt").hide();
    $(".continueOnTrail").hide();
    $(".crossRiver").show();
    $(".crossRiver").css("display", "inline-block");
    $(".talk").show();
    $(".talk").css("display", "inline-block");
  } else if (game.daysLeft === 20) { // 20 days from end (and multiples of 20)...river
    $("#randomEventMessage, #checkPoint").empty();
    $("#checkPoint").html("Welcome. You've reached " + checkpoints[0] + "!");
    $(".imgHeader").css("background-image", "url(img/fortbridger.png)");
    checkpoints.shift();
    $(".hunt").hide();
    $(".talk").show();
    $(".talk").css("display", "inline-block");
  } else if (game.daysLeft === 10) { // 10 days from end (and multiples of 20)...river
    $("#randomEventMessage, #checkPoint").empty();
    $("#checkPoint").html("You've reached " + checkpoints[0] + "! Proceed with caution.");
    $(".imgHeader").css("background-image", "url(img/snakeriver.png)");
    checkpoints.shift();
    $(".hunt").hide();
    $(".continueOnTrail").hide();
    $(".crossRiver").show();
    $(".crossRiver").css("display", "inline-block");
    $(".talk").show();
    $(".talk").css("display", "inline-block");
  } else {
    console.log("go ahead and travel");
  }
}

function medicine() {
  $("#randomEventMessage, #checkPoint").empty();
  if (spaceship.medicine <= 0) {
    $("#event").html("You don't have any medicine.");
  } else {
    var index;
    var lowestHealth = 1000;
    spaceship.party.forEach(function(element, i) {
      if (element.diseases > 0) {
        if (element.health < lowestHealth) {
          lowestHealth = element.health;
          index = i;
        } else {
          return;
        }
      } else {
        return;
      }
    });
    if (lowestHealth === 1000) {
      $("#event").html("No one is siiiick.");
    } else {
      spaceship.party[index].diseases -= 1;
      spaceship.medicine -= 1;
      $("#event").html(spaceship.party[index].name + " has been healed 1 disease.");
    }
  }
  return;
}

function restMourn() {
  $("#randomEventMessage, #checkPoint").empty();
  foodLoss();
  spaceship.party.forEach(function (element) {
    element.healthGain();
  });
  $("#event").html("Your party mourns the loss of a fallen party member. Ain't no way you let him die...");
  game.totalDays++;
  $(".mourn").hide();
  $(".rest").show();
}

function rest() {
  $("#randomEventMessage, #checkPoint").empty();
  foodLoss();
  spaceship.party.forEach(function (element) {
    element.healthGain();
  });
  $("#event").html("Your party decides to rest for the day ahead.");
  game.totalDays++;
}

function hunt() {
  $("#randomEventMessage, #checkPoint").empty();
  var meatGained = rollNumber(4, 16);
  spaceship.food += meatGained * spaceship.party.length;
  $("#event").html("Everyone in your party gathered "+meatGained+" food!");
  foodLoss();
  spaceship.party.forEach(function (element) {
    element.healthLoss();
  });
  checkDeath();
  game.totalDays++;

}

function travel(rivOrTrail) {
  var roll = rollNumber(1,101);
  console.log(roll);
  fates(roll, rivOrTrail);
  foodLoss();
  spaceship.party.forEach(function (element) {
    element.healthLoss();
  });
  checkDeath();
  game.totalDays++;
  game.daysLeft--;
  $(".talk").hide();
  $(".hunt").show();
}

function updateStats() {
  $(".totalDays").text(game.totalDays);

  var nameString = "";
  spaceship.party.forEach(function(member) {
    if (member.diseases < 1) {
      nameString += "<li>" + member.name + " | Health: " + member.health + "</li>";
    } else {
      var plural = "";
      if (member.diseases > 1) {
        plural = "s";
      }
      nameString += "<li><span id='memberSick'>" + member.name + " | Health: " + member.health + " | " + member.diseases + " Disease" + plural + "</span></li>";
    }
  });

  $(".wagonMembers").html(nameString);

  var foodString = "";
  if (spaceship.food <= 0) {
    foodString = "<span id='foodZero'>Food: 0</span>";
  } else {
    foodString = "Food: " + spaceship.food;
  }
  $(".food").html(foodString);

  var medString = "";
  if (spaceship.medicine <= 0) {
    medString = "<span id='foodZero'>Medicine: 0</span>";
  } else {
    medString = "Medicine: " + spaceship.medicine;
  }
  $(".medicine").html(medString);
}

$(function() {
  $("form#createParty").submit(function(event) {
    event.preventDefault();

    var wagonLeader = $("#addLeader").val();
    var member1 = $("#addMember1").val();
    var member2 = $("#addMember2").val();
    var member3 = $("#addMember3").val();
    var member4 = $("#addMember4").val();

    var char1 = new Character(wagonLeader);
    var char2 = new Character(member1);
    var char3 = new Character(member2);
    var char4 = new Character(member3);
    var char5 = new Character(member4);
    spaceship.party.push(char1, char2, char3, char4, char5);

    var autoNames = ["Ryan", "Gloria", "Riley", "Megan", "Chris", "Colin", "Blake", "Grace", "Ben", "Mark", "Liam", "Shane", "Christian", "Chance", "Oliver", "Evan", "Perry", "Dallas", "Alex", "Xi Xia", "Jahan", "Kaya", "Josh", "Nathaniel", "Janek", "Clifford", "Cameron", "Keith", "Pizza", "Stormi"];
    spaceship.party.forEach(function(member) {
      if (!member.name) {
        var index = rollNumber(0, autoNames.length);
        member.name = autoNames[index];
        autoNames.splice(index, 1);
      }
    });

    updateStats();
    $("#homeScreen").hide();
    $("#gameScreen").show();
  });

  $(".continueOnTrail").click(function() {
    $("#randomEventMessage, #checkPoint").empty();

    $(".imgHeader").css("background-image", game.imgArray[game.imgArrayIndex]);
    if(game.imgArrayIndex < 2) {
      game.imgArrayIndex++;
    } else {
      game.imgArrayIndex = 0;
    }

    travel("trail");
    gameChecker();
    console.log(game.daysLeft);
    updateStats();
  });

  $(".crossRiver").click(function() {
    $("#randomEventMessage, #checkPoint").empty();

    travel("river");
    gameChecker();
    console.log(game.daysLeft);
    updateStats();
    $(".crossRiver").hide();
    $(".continueOnTrail").show();
  });

  $(".rest").click(function() {
    $(".imgHeader").css("background-image", "url(img/rest.png)");
    rest();
    updateStats();
  });

  $(".hunt").click(function() {
    $(".imgHeader").css("background-image", "url(img/hunt.png)");
    hunt();
    updateStats();
  });

  $(".heal").click(function() {
    $(".imgHeader").css("background-image", "url(img/dinosaurtrail.jpg)");
    medicine();
    updateStats();
  });

  $(".mourn").click(function() {
    $(".imgHeader").css("background-image", "url(img/mourn.jpg)");
    console.log("part1");
    restMourn();
    updateStats();
  });

  $(".talk").click(function() {
    talk();
  })

})
