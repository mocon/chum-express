var express = require('express'),
    router = express.Router(),
    request = require('request'),
    cronJob = require('cron').CronJob,
    people = [
      {
        "name": "Gabe Roletti",
        "phone": "3109401008",
        "email": "captainroletti@gmail.com",
        "weight": 10
      },
      {
        "name": "Ed Cabrera",
        "phone": "9735173350",
        "email": "ecabreravideo@gmail.com",
        "weight": 7
      },
      {
        "name": "Steve Turrise",
        "phone": "9085103162",
        "email": "steve.turrise@gmail.com",
        "weight": 7
      },
      {
        "name": "Brian Bishop",
        "phone": "2672407841",
        "email": "bbishop@tcnj.edu",
        "weight": 5
      },
      {
        "name": "Tom Nawrot",
        "phone": "8482487538",
        "email": "nawrot.thomas@gmail.com",
        "weight": 5
      }
    ],
    lastChoice,
    weightedList = [];

function generateWeightedList() {
  for (var i = 0; i < people.length; i++) {
    var multiples = people[i].weight;
    for (var j = 0; j < multiples; j++) {
      weightedList.push(people[i]);
    }
  }
  return weightedList;
}

function generateRandomNumber() {
  generateWeightedList();
  var randomNumber = parseInt(Math.random() * weightedList.length);
  return randomNumber;
}

function returnRandomPerson() {
  var randomNumber = generateRandomNumber();
  return weightedList[randomNumber];
}

function chooseRandomPerson() {
  var person = returnRandomPerson();
  if (person !== lastChoice) {
    /* console.log(person.name); */
    lastChoice = person;
    return person;
  } else {
    chooseRandomPerson();
  }
}

/*
  Node CRON job
  '00 30 08 * * 1-5' = Monday through Friday at 8:30 am
  '* * * * * *' = every second
  
  '{"text": "How about dropping ' + person.name + ' a quick\n<sms:' + person.phone + '|text>, <tel:' + person.phone + '|call>, or <mailto:' + person.email + '|email>?"}'
  
*/
new cronJob('0,10,20,30,40,50 * * * * *', function() {
  var person = chooseRandomPerson();
  if (person){
    request({
      url: 'https://hooks.slack.com/services/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',
      method: 'POST',
      headers: {'Content-Type': 'text/plain'},
      body: '{"text": ">>>How about dropping ' + person.name + ' a quick\n<sms:' + person.phone + '|text>, <tel:' + person.phone + '|call>, or <mailto:' + person.email + '|email>?"}'
    }, function(error, response, body){
      if(error) {
        console.log(error);
      } else {
        console.log(response.statusCode, body);
      }
    });
  }
}, null, true, 'America/Los_Angeles');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
