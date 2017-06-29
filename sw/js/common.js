$(document).ready(function(){
var machine = new Object();
machine.name = "The machine";

// Creating a Person constructor - with this constuctor we can made a friend or an enemy:
function Person(name, age, race, hp, str, resist, force, friendship, credits, aClass,balance){
/*default*/this.alive = true;
/*1*/      this.name = name;
/*2*/      this.age = age;
/*3*/      this.race = race;
/*4*/      this.hp = hp;
/*5*/      this.str = str;
/*6*/      this.resist = resist;
/**/     //this.socSkl = socSkl; - instead of "socSkl", added attribute "force".
/*7*/      this.force = force;
/*8*/      this.friendship = friendship;
/*9*/      this.credits = credits;
/*10*/     this.aClass = "Jedi";
/*11*/     this.balance = balance;


};

var anonymous = new Object();
anonymous.name = "An anonymous";
// Creating objects from a Person class:
var tony = new Person ("<span style ='color:#f5f5f5;'> Tony, The Creator</span>", 26, "Human",0,0,0,0,50,-1000,"Developer",0);
var phantomorph = new Person("Phantomorph",26,"Cyborg",5,2,6,3,5,0, "Jedi",0);
var disogr = new Person("Disogr",30,"dark Elf",5,1,6,6,5,0, "Jedi",5);
var luke = new Person("Master Jedi, Luke",89,"human",50,250,500,50,7,9000,"Master Jedi",50);
var dendimon = new Person("Dendimon", 28, "unknow",15,2,4,6,4,5,"Sith",-2);
dendimon.secretKey = "May the force be with you";

// This is the user's variable that shows which main character was choosed by user(user value will be defined via selectChar() function):
var user = anonymous;
var fellow;
var userName = function(){
anonymous.name = prompt("Please, enter your personal name", "");
if (anonymous.name === ""){
    anonymous.name = "An anonymous";
}
};


// This is a showText function, it will show needed text on the story board. It takes in two parameters first is a person object and second is a text.
var showText = function(who, str){
  if(str !== ""){
    $("#storyBoard").append("<p><span style='color:#323232;'>" +who.name + ": " + "</span>" + str+"</p>");





/*When a total amount of text inside story board will be more then the size of a story board window, this script will automaticly scroll down
    every time when appending additional text. */
         var element = document.getElementById("storyBoard");
            element.scrollTop = element.scrollHeight;
        }
    };
//The same as showText() function but uses another color on "who.name" value.
var showMyText = function(who, str){
  if(str !== ""){
    $("#storyBoard").append("<p><span style='color:white;'>" +who.name + ": " + "</span>" + str+"</p><hr>");
        var element = document.getElementById("storyBoard");
            element.scrollTop = element.scrollHeight;
        }
    };



/* Input controller - a button click function, that takes the value from the input line, passes it to a showMyText function
and also to the interact function after "lower casing" effect.
Also it doing very IMPORTANT thing - if the input command is equals to function's name, it calls prompt calls the function and  to */
$("#btn").click(function(){
        var pass = $("input[name=myInput]").val();
        showMyText(user,pass);
        if (pass === "stats"){
            statsOf = prompt("Whose stats do you want to check(first name)?", "").toLowerCase();
            if(statsOf === "disogr"){
                stats(disogr);
            }if(statsOf === "phantomorph"){
                stats(phantomorph);
            }if(statsOf === "luke"){
                stats(luke);
            }if(statsOf === "dendimon"){
                stats(dendimon);
            }if(statsOf === "thecreator"){
                stats(theCreator);
            }if(statsOf !== "phantomorph" && statsOf !== "disogr" && statsOf !=="luke" && statsOf !== "dendimon" && statsOf !== "thecreator"){
                showText(machine, "You have no information about " + statsOf + "'s stats.");
            };
        };
            if (pass === "manipulate" || pass === "manipulation"){
                whom = prompt("whose mind you want to manipulate with(first name)?", "").toLowerCase();
                 if(whom === "disogr"){
                    manipulate(user, disogr);
                }if(whom === "phantomorph"){
                    manipulate(user, phantomorph)
                }if(whom === "luke"){
                    manipulate(user, luke);
                }if(whom === "dendimon"){
                    manipulate(user, dendimon);
                }if(whom !== "disogr" && whom !== "phantomorph" && whom !== "luke" && whom !== "dendimon"){
                    showText(machine, "You can not manipulate with" + whom+".");
                };
            };
            if(pass === "help"){
                help();
            };
            if(pass === "specifications"){
                specifications();
            };
            if(pass === "fight2vs1"){
            fightWith = prompt("Name of the person you want to attack together?", "").toLowerCase();
             if(fightWith === "luke"){
                fight2vs1(user, fellow, luke);
             }if(fightWith === "dendimon"){
                fight2vs1(user, fellow, dendimon);
             }if(fightWith !== "luke" && fightWith !== "dendimon"){
                showText(machine, "You cant attack " + fightWith+".");
            };


        }

            if(pass === "fight"){
                fightWith = prompt("What is the first name of the person you want to fight with?", "").toLowerCase();
             if(fightWith === "disogr"){
                fight(user,disogr);
            }if(fightWith === "phantomorph"){
                fight(user,phantomorph);
            }if(fightWith === "luke"){
                fight(user, luke);
            }if(fightWith === "dendimon"){
                fight(user, dendimon);
            }if(fightWith !== "phantomorph" && fightWith !== "disogr" && fightWith !== "luke" && fightWith !== "dendimon"){
                showText(machine, "You can not fight against "+ fightWith +".");
            }/* This is example. if(fightWith === ""){
                showText(machine, "");

            };*/
    };



        $("input[name=myInput]").val("")
        if (pass !== "stats" && pass !== "help" && pass !== "fight" && pass !== "manipulate" && pass !== "manipulation"
         && pass !== "fight2vs1" && pass !== "specifications"){
        var low = pass.toLowerCase();
        interact(low);

        return false;
    };
        var element = document.getElementById("storyBoard");
element.scrollTop = element.scrollHeight;
        });
// It is an additional function for button click function, that allows user to press enter button on a keyboard to call the click button function.
 $("#myInput").keyup(function(event){
    if(event.keyCode == 13){
        $("#btn").click();
    }
});



// An AUTOMATIC fight 1vs1 function, that takes two parameters:
var fight = function(char, enemy){
    if (char === enemy && char.alive === true){
        if(char === user){
        showText(machine,"You just committed suicide");
        char.alive = false;
        char.hp -=char.hp;
        user = anonymous;
                showText(machine, anonymous.name + ", your journey is ended because -<span style='color:red;'> your avatar is dead.</span><br><br><hr><br><br><br><br><br>");
            }else{
                char.alive = false;
                showText(machine, char.name + "<span style='color:#232323;'> just committed suicide.</span>");
                showText(machine, "<span style='color:#232323;'> Probably it was to hard for him to live without a friend.</span><hr>");
            }
    }else if (!enemy.alive){
    showText(machine, enemy.name + " is already dead! Why are you trying to hurt him more?!");
    }else{
    while(char.alive && enemy.alive){
        x = char.str;
        z = (enemy.hp + enemy.str)/10;
        y = (char.hp + char.str)/5;

    var charStrike = Math.floor(Math.random() * 3 * char.str);
       showText(machine, char.name +"<span style='color:#43ab64'> strikes " + enemy.name + " for " + charStrike + " dmg.</span>");
            if(charStrike < enemy.hp){
                enemy.hp -= charStrike;
                showText(machine, enemy.name+"'s Hp now is: " + enemy.hp);
     var enemyStrike = Math.floor(Math.random() * 3 * enemy.str);
        showText(machine, enemy.name + "<span style='color:#f46666'> strikes " + char.name + " for " + enemyStrike + " dmg.</span>");
           } else if (charStrike >= enemy.hp) {
                enemy.hp -= charStrike;
                enemy.alive = false;
                 showText(machine, enemy.name  + "<span style='color:green;'> dies during a hard fight.</span>");
                 char.str += z;
                 showText(machine, char.name + "'s <span style ='color:orange;'>remaining hp is: " + char.hp +"</span>");
                 showText(machine, "<span style='color:green;'>" + char.name + "'s strength grows by " + z + ", now he has "+char.str+" strength points.</span><hr><br>");
                 break;
           };

            if(enemyStrike < char.hp){
                char.hp -= enemyStrike;
                showText(machine, char.name+"'s Hp now is: " + char.hp);

            }else if (enemyStrike >= char.hp) {
                char.hp -=enemyStrike;
                char.alive = false;
                showText(machine, char.name + "<span style='color:red;'> dies during a hard fight.<hr></span>");
                enemy.str += y;
                showText(machine, "<span style='color:#232323;'>" + enemy.name + "'s strength grows by " + y + ", now he has "+enemy.str+" strength points.</span><hr><br>");
                if(char === user){

                showText(machine, anonymous.name + ", your journey is ended because -<span style='color:red;'> your avatar is dead.</span><br><br><hr><br>");

                }

            }
    }
    }
};

var fight2vs1 = function(char, fellow, enemy){
    x = char.str;
    y = fellow.str;
    z = (enemy.hp + enemy.str)/20;
if (char === enemy && char.alive === true){ //suicide.
            showText(machine,"You just committed suicide");
            char.alive = false;
            char.hp -=char.hp;
            user = anonymous;
            showText(machine, char.name + ", You journey is ended because -<span style='color:red;'> You are dead.</span><br><br><hr><br><br><br>");
        }else if (!enemy.alive){ //enemy already dead.
            showText(machine, enemy.name + " is already dead! Why are you trying to hurt him more?!");
            }while(char.alive && fellow.alive && enemy.alive){ //while hero and the enemy are alive, the fight will continue.
                charStrike = Math.floor(Math.random() * 3 * char.str);
                enemy.hp -= charStrike;
                showText(machine, char.name +"<span style='color:#43ab64'> strikes " + enemy.name + " for " + charStrike + " dmg.</span>");
                fellowStrike = Math.floor(Math.random() * 3 * fellow.str);
                enemy.hp -= fellowStrike;
                showText(machine, fellow.name +"<span style='color:#439eab'> strikes " + enemy.name + " for " + fellowStrike + " dmg.</span>");
                totalDmg = charStrike+fellowStrike;
                    if(enemy.hp < 1){
                        enemy.alive = false;
                        showText(machine, enemy.name  + "<span style='color:red;'> dies during a hard fight.</span>");
                        char.str += z;
                        fellow.str += z;
                        char.friendship +=1;
                        fellow.friendship +=1;
                        showText(machine, char.name+" and "+fellow.name+" won in the battle.<span style='color:green;'> Their friendship gets stronger by 1 point for each one.</span>");
                        showText(machine, "Also <span style='color:green;'>" + char.name + "'s strength grows by " + z + ",</span> now he has "+char.str+" strength points and "+char.hp+" hp.");
                        showText(machine, "And <span style='color:green;'>" + fellow.name + "'s strength grows by " + z + ",</span> now he has "+fellow.str+" strength points and "+fellow.hp+" hp.");
                        showText(machine, char.name + "'s<span style='color:orange;'> ramaining hp now is: </span>"+char.hp+"<span style='color:white;'> || </span>"+fellow.name + "'s<span style='color:orange;'> ramaining hp now is: </span>" + fellow.hp +"<hr><br>");
                        break;
                    }//ending of if 'enemy dies'.
                            else{//if enemy survives:
                              showText(machine, enemy.name+"'s Hp now is: " + enemy.hp);//showing enemy's hp after attack of both heroes.
                                var whoIsTarget = Math.floor(Math.random() * 2); //Enemy chosing who he will attack this time 0/1.
                                var enemyStrike = Math.floor(Math.random() * 3 * enemy.str);
                                if(whoIsTarget > 0){ //decides to attack the hero:
                                    char.hp -= enemyStrike;
                                        if(char.hp > 0){ //if hero survives:
                                            showText(machine, enemy.name + "<span style='color:#f46666'> strikes " + char.name + " for " + enemyStrike + " dmg.</span>");
                                            showText(machine, char.name+"'s Hp now is: " + char.hp);
                                        }else{ //if hero dies:
                                            char.alive = false;
                                            showText(machine, enemy.name + "<span style='color:#f46666'> strikes " + char.name + " for " + enemyStrike + " dmg.</span>");
                                            showText(machine, "<span style='color:red;'>" +  char.name + " dies during a hard fight.</span>")
                                            showText(machine, anonymous.name + ", your journey is ended because -<span style='color:red;'> your avatar is dead.</span><br><br><hr><br><br><br>");
                                            fight(fellow,fellow);
                                            break;
                                        }; //end of hero dies 'else'.
                                }else{ //decides to attack a fellow:
                                    fellow.hp -= enemyStrike;
                                        if(fellow.hp > 0){ //if fellow survives:
                                            showText(machine, enemy.name + "<span style='color:#f46666'> strikes " + fellow.name + " for " + enemyStrike + " dmg.</span>");
                                            showText(machine, fellow.name+"'s Hp now is: " + fellow.hp);
                                        }else{ //if fellow dies:
                                            fellow.alive = false;
                                            showText(machine, enemy.name + "<span style='color:#f46666'> strikes " + fellow.name + " for " + enemyStrike + " dmg.</span>");
                                            showText(machine,"<span style='color:red;'>" + fellow.name + " dies during a hard fight.</span>")
                                            fight(char, enemy);
                                        }; // end of fellow dies 'else'.
                                };
                            }//ending of enemy survives.
            };//while ending.
};//the function closing bracket.
var enemyAttack = function(enemy, char){//enemy attacks the hero. Hero's hello will help to defeat the enemy.
           if (enemy === user && char === user && user.alive === true){
            showText(machine,"You just committed suicide");
            char.alive = false;
            char.hp -=char.hp;
            user = anonymous;
            showText(machine, char.name + ", You journey is ended because -<span style='color:red;'> You are dead.</span><br><br><hr><br><br><br>");
           }
            x = char.str;
            y = fellow.str;
            z = (enemy.hp + enemy.str)/15;
                while(char.alive === true && enemy.alive === true){
                    var enemyStrike = Math.floor(Math.random() * 3 * enemy.str);
                    char.hp -= enemyStrike;
                    showText(machine, enemy.name + "<span style='color:#f46666'> strikes " + char.name + " for " + enemyStrike + " dmg.</span>");
                        if(char.hp < 1){ //if char dies:
                            char.alive = false;
                            showText(machine, "<span style='color:red;'>" +  char.name + " dies during a hard fight.</span>")
                            showText(machine, anonymous.name + ", your journey is ended because -<span style='color:red;'> your avatar is dead.</span><hr><br><br>\
                                <span style='color:#232323;'>"+fellow.name+ " keeps fighting against " + enemy.name + " hoping avenge you.</span>");
                            fight(fellow,enemy);
                            //showText(machine, "<hr><span style='color:#232323;'>Game over. </span>")
                            break;
                        }else{//if char survives:
                            showText(machine, char.name +"'s hp now is: "+ char.hp+".");
                            charStrike = Math.floor(Math.random() * 3 * char.str);
                            enemy.hp -= charStrike;
                            showText(machine, char.name +"<span style='color:#43ab64'> strikes " + enemy.name + " for " + charStrike + " dmg.</span>");
                            fellowStrike = Math.floor(Math.random() * 3 * fellow.str);
                            enemy.hp -= fellowStrike;
                            showText(machine, fellow.name +"<span style='color:#439eab'> strikes " + enemy.name + " for " + fellowStrike + " dmg.</span>");
                            totalDmg = charStrike+fellowStrike;

                                if(enemy.hp < 1){
                                    enemy.alive = false;
                                    showText(machine, enemy.name  + "<span style='color:green;'> dies during a hard fight.</span>");
                                    char.str += z;
                                    fellow.str += z;
                                    char.friendship +=1;
                                    fellow.friendship +=1;
                                    showText(machine, char.name+" and "+fellow.name+" won in the battle.<span style='color:green;'> Their friendship gets stronger by 1 point for each one.</span>");
                                    showText(machine, "Your remaining hp is: <span style='color:orange;'>" + char.hp+"</span>");
                                    showText(machine, "Also <span style='color:green;'> " + char.name + "'s strength grows by  " + z + ",</span> now he has "+char.str+" strength points and "+char.str+" strength.");
                                    showText(machine, "And <span style='color:green;'>" + fellow.name + "'s strength grows by " + z + ",</span> now he has "+fellow.str+" strength points and "+fellow.str+" strength. <hr><br><br>");
                                    break;
                                }//ending of if 'enemy dies'.
                                else {//if enemy survives:
                                     showText(machine, enemy.name + "'s hp now is: " + enemy.hp+".")
                                 };

                        }//ending of char survives.
                };//while's ends.
            };//enemyAttack's ends.

//have to finish this one, remains to add a "manipulation" success statement.
var manipulate = function(char, enemy){
    if (enemy.alive){
if(enemy === user){
showText(machine, "<span style='color:#232323;'>You are trying to manipulat yourself, this may significantly increse the power of your force.</span><br>\
 <span style='color:#a15e31;'>But this is the straight road that leads you to the dark side of the force.</span><br>\
 <span style='color:#f46666;'>Also it may kill you.</span>");
char.balance -=1;
} if (char.force >= enemy.resist/2){
    var manipulation = Math.floor(Math.random() * 3 * char.force);
    var manipulationResist = Math.floor(Math.random()*2*enemy.resist);
    x = char.force;
    y = enemy.resist

       showText(machine, char.name + " tries manipulation on " + enemy.name);
       showText(machine, char.name + " mental strikes " + enemy.name + " for " +manipulation);
       //showText(machine, enemy.name + "resists with" + manipulationResist);

            if(manipulation <= manipulationResist){
                enemy.resist += x/10;
                showText(machine, enemy.name + " resists this mental strike and his force resistance value grows up for "+ (x/10)+" points. Now he has: " + enemy.resist + " points of resistance. <hr>");

                    var reaction = Math.floor(Math.random() * 2)
                    if(reaction < 1){
                        showText(machine, enemy.name + " caught "+ char.name + " on trying to manipulate his mind and he decides to attack you!")
                        if(char === user || char === fellow){
                        enemyAttack(enemy, char);
                        }else{
                            fight(enemy, char);
                        }
                    }else{
                        showText(machine, enemy.name + " caught " + char.name+ " on trying to manipulate his mind and he just laughing of your mental abillities.<hr>");
                    };
}else{
    char.force += y/10;
    showText(machine, char.name +" successfully manipulatad "+ enemy.name +"'s mind.");
    showText(machine, char.name +"'s force incresed by " +(y/10) + ". Now he has " + char.force + " force point.<hr>");
    showText(enemy, "Here is what you need: '" + enemy.secretKey +"'.");


};
}else{
    showText(machine, char.name + "'s force value("+char.force+") is not enough to mental strike " + enemy.name + ". To execute the mental strike on " + enemy.name + ", should have at least " + enemy.resist/2 + "force value.<hr>");

};
}else{
    showText(machine, "It is impossible to manipulate the dead mind.")
}
};



var stats = function(char){
if (char.alive){
    showText(machine, "<br>\
        Name: " + char.name +
        "<br> Race: " + char.race +
        "<br> Class: " + char.aClass +
        "<br> Force balance: " + char.balance +
        "<br> Age: " + char.age +
        "<br> HP: " + char.hp +
        "<br> Strength: " + char.str +
        "<br> Resistance to force: " + char.resist +
        "<br> force: " + char.force +
        "<br> Credits: " + char.credits +
        "<br> Friendship: " + char.friendship);
    }else{
    showText(machine, "<span style='color:#232323;'>" + char.name + " is dead.</span>");
    showText(machine, "<br>\
        Name: " + char.name +
        "<br> Race: " + char.race +
        "<br> Class: " + char.aClass +
        "<br> Force balance: " + char.balance +
        "<br> Age: " + char.age +
        "<br> HP: " + char.hp +
        "<br> Strength: " + char.str +
        "<br> Resistance to force: " + char.resist +
        "<br> force: " + char.force +
        "<br> Credits: " + char.credits +
        "<br> Friendship: " + char.friendship);

}
};



var info = function(){
showText(machine,"<strong>The basic information & rules you have to know before you get started, are:</strong>")
    showText(machine,"The <strong>first</strong> thing you have to know is that your powers is too great to let you just use them all. \
It may break the system and collapse the whole our universe, so our headship had created a special program to help you\
 to controll your force and they gave this program a name: 'The machine'.<br>");
    showText(luke,"- As you maybe already guessed, you are using the machine now to interact with the pseudo-reality that needs your help to persist.")
    showText(machine, "The <strong>second</strong> thing you have to know before you get started is, that soon you will start to recieve \
        a very important missions. To success in those missions you only have to:<br/>\
    1)<strong><em> Complete mission's objectivs</strong></em><br>\
    2)<strong><em> Stay alive</strong></em><br>\
    3)<strong><em> Keep your fellow stay alive</strong></em><br>\
    4)<strong><em> Keep your's and fellow's 'friendship' value as high as it is possible</strong> <span style='color:#232323;'>(otherwise you will lose it\
     and the journey may end for one of you or even for both)</span></em><br>\
    5)<strong><em> Make the best choices to complete the mission");
    showText(machine, "If you will fail at least in one of those conditions, it will lead to serious consequences and your journey probably will end.")

};


var help = function(){
showText(machine, "<h3>The rules:</h3> To successfully pass through this journey you only have to:<br/>\
    1)<strong><em> Complete mission's objectivs</strong></em><br>\
    2)<strong><em> Stay alive</strong></em><br>\
    3)<strong><em> Keep your fellow stay alive</strong></em><br>\
    4)<strong><em> Keep your's and fellow's 'friendship' value as high as it is possible</strong> <span style='color:#232323;'>(otherwise you will lose it\
     and the journey may end for one of you or even for both)</span></em><br>\
    5)<strong><em> Make the best choices to complete the mission <br>\
    If you will fail at least in one of those conditions, it will lead to serious consequences and your journey probably will end.<br>\
 <h3>Here is the list of all commands that available for your usage:</h3> \
    <h4><span style='color:#232323;'>To execute some of the following commands you will need to input the first name of the person you would like to use a command on him.</span></h4>  \
1) 'stats' - This command will show the full characteristics of chosen person. <em><span style='color:#232323;'>(You can see stats of anyone including yourself)</em></span> <br>\
2) 'fight' - If you can't patch up the dispute peacefully, you may start a fight against the chosen person 1vs1. The result depends of your's and the enemy's strength, your's and his hp and the great power of randomness. Winner's strength grows depends of enemy's power.  \
<em><span style='color:#232323;'>(Be carfull, DO NOT forget that the enemy will fight back, so check your's and your's enemy stats before you choose to fight him - you only have one life)</span></em> <br>\
3) 'fight2vs1' - If you met a dengerous enemy, you can use this command to ask your fellow to share the fight with you. That's why you need a fellow. <em><span style='color:#232323;'>(also if you will win this battle, <span style ='color:#7a0606;'>your both strength and friendship values will grow up</span>)</span></em> <br> \
4) 'manipulate' - Almost the same as fight, but instead of using hp and strength, it uses jedi force to manipulate the enemy and the result depends of enemy's resistance to force.<em><span style='color:#232323;'> (Nobody can die from this action, but if your manipulation will fail, there is a big chance that enemy would fight you so also be carefull with that.</em></span> <br>\
5) 'pay' - In some cases, instead of fighting and manipulation you can offer bribes but it is not always guarantee a favorable result. <em><span style='color:#232323;'>('credits talks')</em></span>  <br>\
6) 'run' - If somebody want to attack you, and you think that this fight will have too unexpected result for you, you may just run. It will move you to the next step of the mission. <em><span style='color:#232323;'>(But if you will decide to run, remember that your ally will take the fight by himself. If he will die the journey will stop. If he will survive, his friendship value will decrease depending of the fight's difficulty, and it also may lead to the end of the journey. So it's a 'lose-lose' situation.)</em></span> <br>\
7) 'buy' - On the first 'step' of any mission you may use this command to buy some useful stuff like different buffs, healings and more.)<em><span style='color:#232323;'>(You will get the full list of goods and prices. So try to keep your credits, it's very nice when you and your fellow starting a new mission with full hp and some buffes.)</em></span> <br>\ "
);

};

var specifications = function(){
    showText(machine, "<h3> THE SPECIFICATIONS </h3>\
<h4><span style='color:green'>1) A fighting system:</span></h4>\
The 'fight' function uses two parameters 'hero' and 'enemy'.\
After the input of enemy's name, starts a fight. \
First, hero strikes the enemy then enemy stikes back. \
It will continue untill death of one of the fighters. \
The strike formula if: <br>\
Random number from 0 to 2 * 3 * attacker's strength value (charStrike = Math.floor(Math.random() * 3 * char.str);) <br>\
Then the result's value subtracts from the enemy's hp value. \
(when enemy attacks - uses the same formula). <br><br>\
\
If hero dies, game is over. <br>\
If enemy dies = hero wins. Hero gets 'boost' for strength value. The value of this boost depending of the enemy's power. Uses the next formula: <br>\
(Enemy's hp + enemy's strength)/10. This value sums to the hero's strength. <br><br>\
\
The 'fight2vs1' is almost the same as a regular fight function exept a little differences: <br>\
First, hero strikes, then the fellow strikes. <br> \
If enemy survives both strikes, he strikes back one of the heroes(random50%50). \
If hero dies, game is over. <br>\
If fellow dies, the hero will continue the fight, but no metter if he will destroy the enemy or not, the game is also over.(Look at the game's win conditions). \
If the enemy dies(and the horoes are still alive), both heroes will get the strength boost depending of the result of the next formula: <br>\
(Enemy's hp + enemy's strength)/20. This value sums to the hero's and fellow's strength. <br><br>\
\
When enemy is attacking first:<br>\
If enemy attacks the hero, his fellow will help to destroy the enemy. \
The enemy will strike first, and he will always strike only his main target until one of them will die. (the same strike's formula as always) \
If atacked hero will survives the enemy's strike:<br>\
Hero strikes back, and then the fellow strikes the enemy.\
If enemy survives, the fight will continue, otherwise(enemy dies):<br>\
Both heroes will get the strength boost depending of the result of the next formula: (Enemy's hp + enemy's strength)/15. This value sums to the hero's and fellow's strength.<hr>\
<h4><span style='color:green'>2) A 'manipulation' system:</span></h4><hr>\
Almost the same as fight, but instead of using hp and strength, it uses jedi force to manipulate the enemy and the result depends of enemy's resistance to force.<em><span style='color:#232323;'> (Nobody can die from this action,\
 but if your manipulation will fail, there is a big chance that enemy would fight you so also be carefull with that.");

};



var where = "intro";

var interact = function(to_do) {

    switch(where) {

        case "intro":


            if (to_do === "yes" || to_do === "ok" || to_do === "yep" || to_do === "yeap") {
                userName();
                showText(machine, "Welcome aboard!");
                showText(machine, "Choose who you are, you have to choose one of two heroes: Phantomorph or Disogr.<br> \
               they both are novice jedies but Phantomorph is a cyborg and Disogr is a dark Elf. \
    Please, do not try to get how dark Elf and cyborg had became a jedies... it's so secret information that even they know nothing about it.<br> \
                You have to make the RIGHT choice of who you are, or who you would like to be in this reality. Pick a hero, by typing his name in the console and then press enter.");
                where = "selectHero";

            }

            else if (to_do === "no" || to_do === "not" || to_do === "nope") {
                showText(machine,"Don't waste the time! We need you. In this 'pseudo-reality' you will became a Jedi!"+"<br>\
                    "+ "- CHANGE YOUR MIND");
                showText(luke, "<span style='color:#232323;'><em> The machine secretly using a Jedi force\
                 on you to make you say 'yes', - but machines have no jedi force, so it is not really do any effect on you. <em>)</span>")
                showText(machine,"So, are you ready to start your jedi journey now?");

            }else {
                showText(machine,"Sorry i cant take this command. Which language is it?");
                        where = "whichLang";
                }



            break;

        case "whichLang":
             if (to_do === "english"){
                    showText(machine,"English hah?!");
                    showText(machine,"Sorry, i'm not really can use a sarcasm. Becouse you know... i'm a machine.");
                    showText(machine,"Alright, let's try again. Are you ready to start your journey?");
                    where = "intro";
                } else  {
                    showText(machine,"I heard something about "+ to_do +"... But truly I prefer a binary code. Also I have to inform you about my appreciation to you\
                     for trying to come to an understanding with me.");
                    showText(machine,"Anyway, please use english next becouse i'm a learning machine and i want to learn it.");
                    showText(machine,"So.. now we know each other much better. Now, are you ready to start your journey?");
                     where = "intro";
                }
                break;


        case "selectHero":
                if (to_do === "phantomorph"){
                    showText(machine,"You choosed Phantomorph.");
                        user = phantomorph; fellow = disogr;
                        info();
                        showText(luke, "You got it?");
                        where = "tutorial1";

                }
                else if (to_do === "disogr"){
                    showText(machine,"You choosed Disogr.");
                        user = disogr; fellow = phantomorph;
                        info();
                        showText(luke, "You got it?");
                        where = "tutorial1";
                }else{
                    showText(machine, "Please, just pick your hero.<br> Phantomorph or Disogr?");
                }
            break;

        case "tutorial1":
         if(to_do === "yes"){
            showText(luke, "Next will start a training to make you understand the mechanics of using the machine.");
            showText(machine, "You can 'skip' the training, but I strongly recommend to <strong>skip it only if you already completed it in the past</strong>.\
                <span style='color:#232323;'> <br><strong>Else just ENTER, or type 'next' to move on</strong>. </span>");
            where = "tutorial1.1";
         }else{
            showText(luke, "Dont worry young padavan, you will got it soon.");
            showText(luke, "Next will start a training to make you understand the mechanics of using the machine.");
            showText(machine, "You can 'skip' the training, but I strongly recommend to <strong>skip it only if you already completed it in the past</strong>.\
                <span style='color:#232323;'> <br><strong>Else just ENTER, or type 'next' to move on</strong>. </span>");
            where = "tutorial1.1";

         }
            break;
        case "tutorial1.1":
            if(to_do==="skip"){
                showText(machine, "You choosed to skip the training, we hope you know what are you doing.");
                showText(machine, "" + user.name + " teleportated to the first mission's start point. May the force be with you my friend.");
                where = "mission1";
            } else {
                showText(luke, " - So, hello " + user.name +", and welcome to the training. From this moment you are a Jedi!");
                showText(luke, "Take my congratulations!");
            where = "tutorial2";
        };
            break;


        case "tutorial2":
                if (to_do === "thanks" || to_do === "thank you" || to_do === "wow"){
                    showText(luke,"");
                        where = "tutorial3";
                        showText(luke, "You are wellcome.");
                        showText(luke, "But it is only the starting point of your journey. For now " + user.name + ", i have to get you know\
                        how to use the machine to interact with the word, objects and the information.");
                        showText(luke, "For you, the machine maybe looks like a simple 'story board' with the input line.\
                         But actually it is much more then it looks like.<br>\
                          You already know that Into the input line of the machine, you can type a text to interact with pseudo-reality's objects,<br>\
                            with me for example or with some one, or something else. But also you can put into the input line some special commands like 'fight' or 'manipulate' and so forth.<br>\
                             For instance you can input a command - 'help' into the console(without a quotes of course)\
                             and you will get an access to the basic information and most importantly, to the list of all available commands.");
                        showText(luke, "Try to use a 'help' command right now. You will get the basic rules and the list of available commands. Pay attention to the specifications of those commands.<br>\
                            And then enter the 'next' command to the console, when you will be ready to move on.<hr><br>");
                }else{
                    showText(machine,"Dont you want to thank master Luke for this? <span style='color:#232323;'>(type: 'Thank you' or just 'thanks' to move on.)</span>");

                }
            break;

        case "tutorial3":
                if (to_do === "next" || to_do === ""){
                    showText(machine, "<span style='color:#0092ff;'>" + fellow.name + " enters the area.</span>");
                    showText(luke," Meet your new fellow, his name is " + fellow.name + ". Very soon you will become invaluable each for other, but for now <br>\
                    comes the time for a little training fight. <span style='color:red;'>No metter how this fight will end, after the final result, press ENTER to move on.</span>");
                    showText(machine,"<span style='color:#232323;'> Use a 'fight' command to start the fight against "+fellow.name+".</span>");
                    where = "tutorial4"
                }else{
                    showText(machine, "<span style='color:#232323;'>You have to enter a 'next' command to move to the next step.</span><hr>");

                }
            break;

        case "tutorial4":
                if (!fellow.alive || !user.alive) {
                    phantomorph.hp = 5;
                    phantomorph.alive = true;
                    disogr.hp = 5;
                    disogr.alive = true;
                    showText(luke, "It was a deadly fight, but dont worry! It is just a simulation mode. Nobody yet died for real.");
                    showText(machine, "<span style='color:#232323;'>Both your hp had back to default.</span>");
                    showText(machine, "If you will closely look at the log of the fight, you may understand the mechanics of 1vs1 fight in outline.");
                    showText(machine, "As you may also see in the log, winner's strength increased by some value. If you curious about the formulas of pseudo-reality's mechanics, you may use the secret command: 'specifications'.");
                    showText(machine, "<span style='color:#232323;'>As always, enter the 'next' command when you are ready to move to the next step.</span><hr>");
                    where = "tutorial5";
                }else{
                    showText(machine,"<span style='color:#232323;'>Wrong input.</span>")
                }
            break;

        case "tutorial5":
                if(to_do === "next" || to_do === ""){
                    showText(luke, "Soon you will start another training fight, against my another disciple. His name is Dendimon and for now he is much stronger then you.");
                    showText(machine, "<span style='color:#0092ff;'>" + dendimon.name + " enters the area.</span>");
                    showText(machine, "Use the 'stats' command to check the full Dendimon's characteristics, after that use the same command to check your own characteristics and try to compare them.")
                    showText(machine, "<span style='color:#232323;'>As always, enter the 'next' command when you are ready to move to the next step.</span><br>\
                        <span style='color:#ab4343;'>p.s It was the last time when you got this hint. Next time, if you dont know how to move on, try to use the 'next' command.</span><hr>");
                    where = "tutorial6";
                }else{
                    showText(machine,"<span style='color:#232323;'>Wrong input.</span>");
                };
                break;

        case "tutorial6":
            if(to_do === "next" || to_do === ""){
            showText(luke, "As you saw, Dendimon has much more hp then you, so if you will fight him 1vs1, almost for sure he will easily defeat you.");
            showText(luke, "To increase the chances, you only have one right choice...")
            showText(machine, "<em>if your only option is a battle, but you enemy is to strong you can always use a </em><strong>'fight2vs1'</strong><em> command, to ask your fellow for help.<br>\
             Try it right now.</em>");
            where = "tutorial7";
            }else{showText(machine,"<span style='color:#232323;'>Wrong input.</span>");
            };
            break;

        case "tutorial7":
            if(!fellow.alive || !user.alive) {
                    phantomorph.hp = 5;
                    phantomorph.alive = true;
                    disogr.hp = 5;
                    disogr.alive = true;
                    dendimon.hp = 15;
                    dendimon.alive = true;
                    showText(machine, "<span style='color:#232323;'>It was just a simulation, every body are steel alive. Your HP had back to default.</span>");
                    showText(luke, "Dendimon is in a very good shape. Dont worry, will come the time when you will be much stronger.");
                    showText(luke, "In the next part of the training, you will learn how to use the force to manipulate other's minds.<hr>");
                    where = "tutorial8";
                }else if(!dendimon.alive){
                    phantomorph.hp = 5;
                    phantomorph.alive = true;
                    disogr.hp = 5;
                    disogr.alive = true;
                    dendimon.hp = 15;
                    dendimon.alive = true;
                    showText(machine, "<span style='color:#232323;'>Becouse of the simulation mode, HP of all of you had back to the default.</span>");
                    showText(luke, "What a great training battle! Dendimon is in a very good shape, but together with " +fellow.name+ ", you were able to defeat the 'enemy' and that's why both of you got boost to the strength.\
                     also your friendship strengthened, becouse of that you won in the hard battle and did it shoulder to shoulder.");
                    showText(machine, "<span style='color:#232323;'>That's how the friendship mechanics works in pseudo-reality.</span><br>")
                    showText(luke, "In the next part of the training, you will learn how to use the force, to 'manipulate' other's minds.<hr>");
                    where = "tutorial8";
                }else{showText(machine,"<span style='color:#232323;'>Wrong input.</span>");
            };
            break;

        case "tutorial8":
            if(to_do === "next" || to_do === ""){
                showText(luke, "A 'manipulation' uses almost the same mechanics as fighting, but instead of using hp and strength, it uses a manipulator's force for mental strike and his opponent's force resistance to resist the manipulation.");
                showText(luke, "In some cases using the 'manipulation' is a much better way to patch up conflicts or to get a needed information, but 'manipulation' may fail,\
                and if it occurs, the person you tried to 'manipulate', will get bonus to his resistance, may became an enemy and even may start a 'fight' against you.");
                showText(luke, "So be carefull when using the force. First check the stats of your opponent, to see how much force resistance he has. And don't forget to check the value of yours force.");
                showText(machine, "<span style='color:#232323;'>If your force value is exceeds the opponent's resistance value, you have a good chances to successfully manipulate him. As mach as his resistance value is hight then your's force, your chances decreases.</span><br>");
                showText(luke, "Try to get the secret key from Dendimon using a 'manipulation'(or just a 'manipulate') command. <br>\
                    When you get the key, use it, to move to the last step of the training.");
                showText(machine, "<span style='color:#232323;'>If the manipulation doesn't success in the first time, you may try to use it again. But there is a little chance that after many unsuccesfull manipulations\
                 on the same person, his resistance to force will grow to much and you will not be able to manipulate him anymore. If so, your only remeining action is to fight him.</span>");
                where = "tutorial9";
                }else{
                showText(machine,"<span style='color:#232323;'>Wrong input.</span>");

            };
                break;

        case "tutorial8.1":
            if(to_do === "try"){
                user.hp = 5;
                user.alive = true;
                fellow.hp = 5;
                fellow.alive = true;
                dendimon.hp = 15;
                dendimon.alive = true;
                dendimon.resist = 4;
                dendimon.str = 2;
                showText(luke, "Great, you saw the hiden command that lets you to try to use the 'manipulation' again.");
                showText(machine, "<span style='color:#232323;'>Every body are alive, every body's hp set to default, Dendimon's resistance also set to default and now, you can try again, to get the secret key from him.</span>");
                where = "tutorial9";
                }else{
                showText(machine,"<span style='color:#232323;'>Wrong input.</span>");

                };
                break;

            case "tutorial9":
                if(to_do === "may the force be with you"){
                    showText(luke, "Congratulations, young padavan! You successfully finished the training!");
                    showText(luke, "This expirience not only gives you the needed knowledge, but also increases your powers.");
                    user.hp += 1;
                    showText(machine,"<span style='color:#232323;'>"+ user.name + ", your hp value increased by 1</span>");
                    showText(luke, "And also, please, take this credits, it will help you at the start of your journey.");
                    user.credits +=5;
                    luke.credits -=5;
                    showText(machine,"<span style='color:#232323;'>Master Jedi Luke, gave you 5 credits.</span>");
                    showText(luke, "So from now, you will continue your journey without my help. But every hero needs a companion,\
                     so "+fellow.name+" is yours new comrade. I choosed him specialy for you, among dozens of worthy men. He will follow you on your journey to make your adventure more secure.<br>\
                       To stand off all the hard missions you will execute, you both really have to make a strong friendship and care of each other all the way. <br>\
                        May the force be with you my friends...<hr>");
                    where = "mission1";
                }else if(!user.alive){
                    showText(luke, "The walking dead doesn't need a key. Fortunately it's just a simulation so you can <span style='color:#e7d739;'>'try'</span> again.");
                    where = "tutorial8.1";
                }else if(!dendimon.alive){
                    showText(luke, "The dead can not speak...Fortunately it's just a simulation so you can <span style='color:#e7d739;'>'try'</span> again.");
                    where = "tutorial8.1";
                }else{
                    showText(machine,"<span style='color:#232323;'>Wrong input.</span>");
                };
                break;

                case "mission1":
                    if (to_do === "" || to_do === "next"){
                        showText(machine, "To be continued...");
                        showText(tony, "To create this program and make it work i had improve my english, to write 811 lines of javaScript code that includes 50,639 characters. It took something like two weeks of a hard work.");
                        showText(tony, "<span style='color:#fff382;'>If you do like the concept and you got my </span><span style='color:#e7d739;'>'point'</span><span style='color:#fff382;'>, plese contact me.</span>");
                        showText(tony, "And for now, may the power be with you my friend.")
                        where = "point";
                    };
                        break;
                case "point":
                    if(to_do === "point"){
                        showText(tony, "Oh wow, i didn't really expect that it is possible to find the way to the 'point'.");
                        showText(tony, "As you understand, it is not just a star wars game...<br>\
                         <h3><span style='color:#0cae17;'>It is my way to heal the breach.</span></h3> And actually, that's the real 'point' of making this concept as it is.");
                        break;
                    };
    }//'where' switch's ending.
};//interact functions's ending.
});//document ready ending.

 /*       case " ":
                if (to_do === "" || to_do === "" || to_do === ""){
                    showText(WHO,"");
                    where = "";
                }else if (to_do === "" || to_do === "" || to_do === ""){
                    showText(WHO," <span style='color:#232323;'> </span>");

                }else{
                    showText(WHO,"");
                }
            break;

            */